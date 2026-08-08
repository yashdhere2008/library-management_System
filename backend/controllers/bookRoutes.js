import express from "express";
import {
  getAllBooks, addBook, updateBook, deleteBook, issueBook, returnBook,
} from "./bookController.js";
import { issueBookToStudent, returnBookToStudent, getIssueHistoryForStudent } from "./issueController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

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

router.post("/", protect, requireRole("librarian", "admin"), addBook);
router.put("/:id", protect, requireRole("librarian", "admin"), updateBook);
router.delete("/:id", protect, requireRole("librarian", "admin"), deleteBook);
router.patch("/:id/issue", protect, requireRole("librarian", "admin"), issueBook);
router.patch("/:id/return", protect, requireRole("librarian", "admin"), returnBook);

router.post("/:id/issue", protect, requireRole("librarian", "admin"), issueBookToStudent);
router.patch("/issue/:issueId/return", protect, requireRole("librarian", "admin"), returnBookToStudent);
router.get("/student/:studentId/history", protect, getIssueHistoryForStudent);
router.get("/my-history", protect, getIssueHistoryForStudent);

export default router;