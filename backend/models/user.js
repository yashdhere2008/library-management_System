import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["student", "admin", "librarian"],
    required: true,
  },

  // ✅ New Field - Student Book Credit
  credit: {
    type: Number,
    default: 5,
  },

  // ✅ Maximum Books a Student Can Borrow
  maxBooks: {
    type: Number,
    default: 5,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);