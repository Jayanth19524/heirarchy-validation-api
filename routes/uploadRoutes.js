import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { uploadFile } from "../controllers/uploadController.js";
import { OrgChartUpload } from "../models/OrgChartUpload.js"; // Import your model
import { getOrgChartById } from "../controllers/orgChartController.js";
dotenv.config();
const router = express.Router();

// Allowed MIME types (Excel & CSV)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "text/csv", // .csv
    "application/csv"
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only Excel (.xls, .xlsx) and CSV (.csv) files allowed"), false);
  }
  cb(null, true);
};

// Configure Multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }, // 5MB default limit
  fileFilter
});


// Route to get all uploaded files
router.get("/all", async (req, res) => {
  try {
    // Fetch all records from MongoDB
    const uploads = await OrgChartUpload.find();

    if (!uploads || uploads.length === 0) {
      return res.status(404).json({ message: "No uploads found" });
    }

    // Send the response with all the uploaded records
    res.status(200).json(uploads);
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ message: "Failed to retrieve uploads", error: error.message });
  }
});


// Route to get a single org chart by its ID
router.get("/:id", getOrgChartById);


router.post("/", upload.single("file"), uploadFile);

export default router;
