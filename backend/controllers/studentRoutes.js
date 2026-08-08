import express from "express";
import { getAllStudents, getStudentDashboard } from "./studentController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, requireRole("librarian", "admin"), getAllStudents);
router.get("/me", protect, getStudentDashboard);
router.get("/:studentId", protect, requireRole("librarian", "admin"), getStudentDashboard);

export default router;
