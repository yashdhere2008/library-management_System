// authController.js
import User from "../models/user.js";   // Make sure path is correct
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};