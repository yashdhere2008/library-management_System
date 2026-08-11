import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import connectDB from "./db.js";
import User from "./models/user.js";

dotenv.config();

const createUser = async () => {
  await connectDB();

  const email = "yashdhere2008@gmail.com";   // change if needed
  const plainPassword = "123456";             // choose your password
  const role = "librarian";                   // student / admin / librarian
  const name = "Yash";                        // your name

  const existing = await User.findOne({ email, role });
  if (existing) {
    console.log("⚠️ User already exists with this email and role.");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await user.save();
  console.log("✅ User created successfully:", user.email, user.role);
  process.exit();
};

createUser();