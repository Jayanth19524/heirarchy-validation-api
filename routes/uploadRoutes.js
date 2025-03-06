import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { uploadFile } from "../controllers/uploadController.js";

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

router.post("/", upload.single("file"), uploadFile);

export default router;
