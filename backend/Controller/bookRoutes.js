import express from "express";
import {
  getAllBooks, addBook, updateBook, deleteBook, issueBook, returnBook,
} from "./bookController.js";

const router = express.Router();

router.get("/", getAllBooks);
router.post("/", addBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);
router.patch("/:id/issue", issueBook);
router.patch("/:id/return", returnBook);

export default router;