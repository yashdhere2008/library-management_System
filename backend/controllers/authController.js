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

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const findUserByEmail = async (email) => {
  if (!email) return null;
  const escapedEmail = escapeRegExp(email);
  return User.findOne({
    email: { $regex: `^${escapedEmail}$`, $options: "i" },
  });
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user = null;
    const normalizedEmail = email?.toLowerCase()?.trim();
    const normalizedRole = role?.toLowerCase()?.trim();
    const normalizedPassword = password?.trim();

    if (mongoose.connection.readyState === 1) {
      user = await findUserByEmail(normalizedEmail);
      if (!user && fallbackUsers[normalizedEmail]) {
        user = fallbackUsers[normalizedEmail];
      }
    } else {
      user = fallbackUsers[normalizedEmail];
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Force role check if role is specified
    const userRole = user.role || "student";
    if (normalizedRole && normalizedRole !== userRole.toLowerCase()) {
      return res.status(400).json({ message: `Access denied. Account is registered as ${userRole}.` });
    }

    // Check password
    const isMatch = user.password?.startsWith("$2")
      ? await bcrypt.compare(normalizedPassword, user.password)
      : normalizedPassword === user.password;

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
        rollNo: user.rollNo || undefined,
        credit: user.credit ?? 5,
        maxBooks: user.maxBooks ?? 5,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password, role, rollNo } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required for registration" });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRole = (role || "student").toLowerCase().trim();

    if (!["student", "admin", "librarian"].includes(normalizedRole)) {
      return res.status(400).json({ message: "Unsupported role" });
    }

    if (normalizedRole === "student" && !rollNo) {
      return res.status(400).json({ message: "Roll number is required for students" });
    }

    if (mongoose.connection.readyState !== 1) {
      if (fallbackUsers[normalizedEmail]) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const tempId = `fallback-${Math.random().toString(36).slice(2, 10)}`;
      const tempUser = {
        _id: tempId,
        name,
        email: normalizedEmail,
        password,
        role: normalizedRole,
        rollNo: normalizedRole === "student" ? rollNo.trim() : undefined,
        credit: 5,
        maxBooks: 5,
      };
      fallbackUsers[normalizedEmail] = tempUser;

      const token = jwt.sign(
        { id: tempId, role: normalizedRole },
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
          role: normalizedRole,
          rollNo: tempUser.rollNo,
          credit: 5,
          maxBooks: 5,
        },
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
      rollNo: normalizedRole === "student" ? rollNo.trim() : undefined,
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
        rollNo: newUser.rollNo,
        credit: newUser.credit,
        maxBooks: newUser.maxBooks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Old and new password are required" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = user.password?.startsWith("$2")
      ? await bcrypt.compare(oldPassword.trim(), user.password)
      : oldPassword.trim() === user.password;

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword.trim(), 10);
    await user.save();

    return res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};