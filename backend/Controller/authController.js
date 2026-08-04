import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const fallbackUsers = {
  "student@example.com": {
    _id: "student-demo",
    name: "Student User",
    email: "student@example.com",
    password: "student123",
    role: "student",
  },
  "librarian@example.com": {
    _id: "librarian-demo",
    name: "Librarian User",
    email: "librarian@example.com",
    password: "librarian123",
    role: "librarian",
  },
  "admin@example.com": {
    _id: "admin-demo",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user = null;
    const normalizedEmail = email?.toLowerCase();

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: normalizedEmail, role });
      if (!user && fallbackUsers[normalizedEmail]) {
        user = fallbackUsers[normalizedEmail];
      }
    } else {
      user = fallbackUsers[normalizedEmail];
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = user.password?.startsWith("$2")
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "dev-secret",
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
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required for registration" });
  }

  try {
    const normalizedEmail = email.toLowerCase();

    if (mongoose.connection.readyState !== 1) {
      if (fallbackUsers[normalizedEmail]) {
        return res.status(400).json({ message: "User already exists with this email and role" });
      }

      const tempId = `fallback-${Math.random().toString(36).slice(2, 10)}`;
      fallbackUsers[normalizedEmail] = {
        _id: tempId,
        name,
        email: normalizedEmail,
        password,
        role,
      };

      const token = jwt.sign(
        { id: tempId, role },
        process.env.JWT_SECRET || "dev-secret",
        { expiresIn: "1d" }
      );

      return res.status(201).json({
        success: true,
        message: "Registration successful (fallback mode)",
        token,
        user: {
          id: tempId,
          name,
          email: normalizedEmail,
          role,
        },
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail, role });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email and role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};