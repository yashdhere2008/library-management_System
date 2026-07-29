import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import authRoutes from "./Controller/authroutes.js";
import bookRoutes from "./Controller/bookRoutes.js";
dotenv.config();

connectDB();

const app = express();

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

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});