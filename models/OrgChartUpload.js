import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const orgChartUploadSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },  // Unique ID for each upload
  message: { type: String, required: true },
  data: { type: Array, required: true },   // Stores valid hierarchy
  errors: { type: Array, required: true }, // Stores validation errors
  createdAt: { type: Date, default: Date.now }
});

export const OrgChartUpload = mongoose.model("OrgChartUpload", orgChartUploadSchema);
