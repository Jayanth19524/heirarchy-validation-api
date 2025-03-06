import fs from "fs";
import xlsx from "xlsx";
import { validateOrgChart } from "../utils/validateOrgChart.js";
import { saveOrgChartUpload } from "../services/orgChartService.js";
import mongoose from "mongoose";

export const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  let data, errors;
  let dbStatus = "Data not saved due to database issues.";
  let savedRecord = null;

  try {
    // Read and parse the uploaded Excel file
    let workbook;
    try {
      workbook = xlsx.readFile(req.file.path);
    } catch (error) {
      await fs.promises.unlink(req.file.path);
      return res.status(400).json({ error: "Invalid Excel file format" });
    }

    const sheetName = workbook.SheetNames[0];
    data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Validate organization chart rules
    errors = await validateOrgChart(data);

    // Attempt to save to MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        savedRecord = await saveOrgChartUpload(data, errors);
        dbStatus = savedRecord?.message || "Data successfully saved to MongoDB.";
      } catch (dbError) {
        console.warn("⚠️ Error saving to MongoDB:", dbError.message);
        dbStatus = "Database error: " + dbError.message;
      }
    } else {
      console.warn("⚠️ MongoDB is not connected.");
    }

    // Ensure file is deleted
    fs.promises.unlink(req.file.path).catch((err) => console.error("Failed to delete file:", err));

    // Send response to user
    res.json({
      message: "File processed successfully",
      dbStatus,
      validatedData: data,
      validationErrors: errors,
      savedRecord: savedRecord || null, // Null if DB save fails
    });

  } catch (error) {
    console.error("Error processing file:", error);

    // Ensure file is deleted even in case of errors
    fs.promises.unlink(req.file.path).catch((err) => console.error("Failed to delete file:", err));

    res.status(500).json({
      error: "Error processing the file",
      dbStatus,
      validatedData: data || [],
      validationErrors: errors || [],
      savedRecord: null,
    });
  }
};

