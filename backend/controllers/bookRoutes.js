import express from "express";
import {
  getAllBooks, addBook, updateBook, deleteBook, issueBook, returnBook,
} from "./bookController.js";
import {
  issueBookToStudent,
  returnBookToStudent,
  getIssueHistoryForStudent,
  borrowBookByStudent,
  getAllActiveIssues,
  renewIssue,
} from "./issueController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public catalog (authenticated)
router.get("/", protect, getAllBooks);
router.get("/semester/:semester", protect, async (req, res) => {
  try {
    const BookModel = (await import("../models/book.js")).default;
    const semester = Number(req.params.semester);
    const books = await BookModel.find(semester ? { semester } : {}).sort({ semester: 1, title: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Librarian/Admin CRUD
router.post("/", protect, requireRole("librarian", "admin"), addBook);
router.put("/:id", protect, requireRole("librarian", "admin"), updateBook);
router.delete("/:id", protect, requireRole("librarian", "admin"), deleteBook);

// Librarian: view all active issues
router.get("/active-issues", protect, requireRole("librarian", "admin"), getAllActiveIssues);

// Librarian: issue and return
router.post("/:id/issue", protect, requireRole("librarian", "admin"), issueBookToStudent);
router.patch("/issue/:issueId/return", protect, requireRole("librarian", "admin"), returnBookToStudent);

// Librarian/Student: renew an issue
router.patch("/issue/:issueId/renew", protect, renewIssue);

// Student: self-borrow
router.post("/:id/borrow", protect, borrowBookByStudent);

// History
router.get("/student/:studentId/history", protect, getIssueHistoryForStudent);
router.get("/my-history", protect, getIssueHistoryForStudent);

// Legacy routes (kept for backwards compatibility)
router.patch("/:id/issue", protect, requireRole("librarian", "admin"), issueBook);
router.patch("/:id/return", protect, requireRole("librarian", "admin"), returnBook);

export default router;