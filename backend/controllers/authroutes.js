import express from "express";
import { login, register, changePassword } from "./authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/change-password", protect, changePassword);

export default router;