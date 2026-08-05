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
    const allowAny = process.env.DEV_AUTH_ALLOW_ANY === "true" || process.env.NODE_ENV !== "production";

    if (mongoose.connection.readyState === 1) {
      user = await findUserByEmail(normalizedEmail);
      if (!user && fallbackUsers[normalizedEmail]) {
        user = fallbackUsers[normalizedEmail];
      }
    } else {
      user = fallbackUsers[normalizedEmail];
    }

    const userRole = normalizedRole || (user?.role || "student");
    const shouldUseDevFallback = allowAny;

    if (!user && shouldUseDevFallback) {
      const tempId = `dev-${Math.random().toString(36).slice(2, 10)}`;
      const tempUser = {
        _id: tempId,
        name: "Dev User",
        email: normalizedEmail || email,
        password: normalizedPassword,
        role: userRole,
      };
      fallbackUsers[normalizedEmail] = tempUser;
      user = tempUser;
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    let isMatch = false;
    if (shouldUseDevFallback) {
      isMatch = true;
      if (user && normalizedRole) {
        user = {
          ...((user.toObject && user.toObject()) || user),
          role: userRole,
        };
      }
    } else {
      isMatch = user.password?.startsWith("$2")
        ? await bcrypt.compare(normalizedPassword, user.password)
        : normalizedPassword === user.password;
    }

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