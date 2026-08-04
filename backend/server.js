import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import authRoutes from "./Controller/authroutes.js";
import bookRoutes from "./Controller/bookRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(express.json());

// ✅ Allow multiple frontend origins during development
const allowedOrigins = [
  "http://localhost:3000",   // CRA default
  "http://localhost:5173",   // Vite default
  "http://localhost:5174",   // Vite fallback port (if 5173 is busy)
  "http://127.0.0.1:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("Library Management API Running");
});

const startServer = async () => {
  try {
    const dbReady = await connectDB();

    const PORT = process.env.PORT || 5005;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      if (!dbReady) {
        console.warn("⚠️ MongoDB is not connected, but the server is running in fallback mode.");
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();