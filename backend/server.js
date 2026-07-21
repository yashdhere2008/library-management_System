import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import authRoutes from "./Controller/authroutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Library Management API Running");
});

// ✅ Changed to 5001 to avoid conflict
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});