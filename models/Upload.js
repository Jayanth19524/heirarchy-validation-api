import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
    filename: String,         // Name of uploaded file
    fileType: String,         // File extension (CSV, XLSX, etc.)
    fileSize: Number,         // Size in bytes
    uploadDate: { type: Date, default: Date.now }, // Timestamp
    processedData: [          // Array of validated org chart data
        {
            Email: String,
            FullName: String,
            Role: String,
            ReportsTo: String,
        }
    ],
    errors: [                 // Array of validation errors
        {
            row: Object,       // The row that had an error
            errors: [String]   // Error messages
        }
    ]
});

const Upload = mongoose.model("Upload", uploadSchema);
export default Upload;
