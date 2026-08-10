import express from "express";
import {
  getAdminStats,
  getAllUsers,
  deleteUser,
  updateUserCredit,
  getAllIssues,
} from "./adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require admin role
router.use(protect, requireRole("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/credit", updateUserCredit);
router.get("/issues", getAllIssues);

export default router;
