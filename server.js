import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./db.js"; // Import MongoDB connection
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// Security middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:4200",
        "https://heirarchy-cgm7l99oq-jayanths-projects-203df876.vercel.app",
        "https://heirarchy.vercel.app"
      ];
      
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS"), false); // Reject the request
      }
    }
  })
);

app.use(helmet());
app.use(express.json());

// Rate limiting (DDoS protection)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Routes
app.use("/api/upload",uploadRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
