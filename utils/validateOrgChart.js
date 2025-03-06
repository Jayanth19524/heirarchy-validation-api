export const validateOrgChart = (data) => {
  const errors = [];
  const userMap = new Map();
  const reportsToMap = new Map();
  const rootUsers = [];

  // Valid roles
  const validRoles = new Set(["Root", "Admin", "Manager", "Caller"]);

  // Step 1: Populate userMap and find root users
  data.forEach((row) => {
    const { Email, FullName, Role, ReportsTo } = row;

    // Track unique errors per user
    const errorSet = new Set();

    // Check for valid email format
    if (!Email || !Email.includes("@")) {
      errorSet.add(`${FullName} has an invalid email: ${Email}`);
    }

    // Check for duplicate emails
    if (userMap.has(Email)) {
      errorSet.add(`Duplicate email found: ${Email}`);
    }

    // Check for valid role
    if (!validRoles.has(Role)) {
      errorSet.add(`${FullName} has an invalid role: ${Role}`);
    }

    userMap.set(Email, row);

    if (Role === "Root") {
      rootUsers.push(row);
    }

    if (ReportsTo) {
      const managers = ReportsTo.split(";").map((m) => m.trim());
      reportsToMap.set(Email, managers);
    }

    if (errorSet.size > 0) {
      errors.push({ row, errors: [...errorSet] });
    }
  });

  // Step 2: Validate root users
  if (rootUsers.length !== 1) {
    errors.push({ error: `There must be exactly one Root user, found: ${rootUsers.length}` });
  }

  // Step 3: Validate reporting structure
  data.forEach((row) => {
    const { Email, FullName, Role, ReportsTo } = row;
    const errorSet = new Set();

    if (Role === "Root" && ReportsTo) {
      errorSet.add(`Root user (${FullName}) should not report to anyone.`);
    }

    if (ReportsTo) {
      const managers = ReportsTo.split(";").map((m) => m.trim());

      managers.forEach((manager) => {
        if (!userMap.has(manager)) {
          errorSet.add(`${FullName} reports to a non-existent user: ${manager}`);
        }
      });

      const invalidReports = managers.filter((m) => userMap.has(m) && userMap.get(m).Role);

      // Admin must report to Root
      if (Role === "Admin" && invalidReports.some((m) => userMap.get(m)?.Role !== "Root")) {
        errorSet.add(`${FullName} (Admin) must report to a Root.`);
      }

      // Managers must report to Admins or other Managers
      if (Role === "Manager" && invalidReports.some((m) => !["Admin", "Manager"].includes(userMap.get(m)?.Role))) {
        errorSet.add(`${FullName} (Manager) must report to an Admin or another Manager.`);
      }

      // Callers must report only to Managers
      if (Role === "Caller" && invalidReports.some((m) => userMap.get(m)?.Role !== "Manager")) {
        errorSet.add(`${FullName} (Caller) must report only to a Manager.`);
      }

      // Ensure a user does not have multiple direct parents unless they are a Manager
      if (managers.length > 1 && Role !== "Manager") {
        errorSet.add(`${FullName} should not have multiple parents unless they are a Manager.`);
      }
    }

    if (errorSet.size > 0) {
      errors.push({ row, errors: [...errorSet] });
    }
  });

  return errors;
};
