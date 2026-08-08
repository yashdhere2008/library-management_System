import Book from "../models/book.js";
import Issue from "../models/issue.js";
import User from "../models/user.js";

export const getAllBooks = async (req, res) => {
  try {
    const semester = Number(req.query.semester);
    const filter = semester ? { semester } : {};
    const books = await Book.find(filter).sort({ semester: 1, title: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, category, semester, totalCopies } = req.body;
    const existing = await Book.findOne({ isbn });
    if (existing) {
      return res.status(400).json({ message: "Book with this ISBN already exists" });
    }
    const normalizedSemester = Number(semester || 1);
    const book = new Book({
      title,
      author,
      isbn,
      category: category || "General",
      semester: normalizedSemester,
      totalCopies: totalCopies || 1,
      availableCopies: totalCopies || 1,
    });
    await book.save();
    res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book updated", book });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    await Issue.deleteMany({ book: req.params.id });
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const issueBook = async (req, res) => {
  try {
    const { studentId, dueDate } = req.body;
    const bookId = req.params.id;

    if (!studentId) {
      return res.status(400).json({ message: "Student id is required" });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found or not a student account" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    const activeIssueExists = await Issue.findOne({ student: student._id, book: book._id, status: { $ne: "Returned" } });
    if (activeIssueExists) {
      return res.status(400).json({ message: "That book is already issued to this student" });
    }

    const issue = await Issue.create({
      student: student._id,
      book: book._id,
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "Active",
      returnDate: null,
      fine: 0,
    });

    book.availableCopies -= 1;
    await book.save();

    const populated = await Issue.findById(issue._id)
      .populate({ path: "student", select: "name email role" })
      .populate({ path: "book", select: "title author isbn semester" });

    return res.status(201).json({ message: "Book issued", issue: populated });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const issueId = req.body.issueId || req.params.issueId;
    const incomingDate = req.body.returnDate ? new Date(req.body.returnDate) : new Date();

    if (!issueId) {
      return res.status(400).json({ message: "Issue id is required to return a book" });
    }

    const issue = await Issue.findById(issueId).populate("book");
    if (!issue) {
      return res.status(404).json({ message: "Issue record not found" });
    }

    if (issue.status === "Returned") {
      return res.status(400).json({ message: "Book already returned" });
    }

    issue.returnDate = incomingDate;
    issue.status = "Returned";
    issue.fine = Number(req.body.fine || 0);
    await issue.save();

    if (issue.book) {
      const book = await Book.findById(issue.book._id);
      if (book) {
        book.availableCopies = Math.min(book.totalCopies, (book.availableCopies || 0) + 1);
        await book.save();
      }
    }

    const populated = await Issue.findById(issue._id)
      .populate({ path: "student", select: "name email role" })
      .populate({ path: "book", select: "title author isbn semester" });

    return res.json({ message: "Book returned", issue: populated });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};