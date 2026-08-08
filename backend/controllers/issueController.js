import Book from "../models/book.js";
import Issue from "../models/issue.js";
import User from "../models/user.js";

export const issueBookToStudent = async (req, res) => {
  try {
    const { studentId, dueDate } = req.body;
    const bookId = req.params.id || req.params.bookId;

    if (!studentId || !bookId) {
      return res.status(400).json({ message: "Student id and book id are required" });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available for this book" });
    }

    const activeIssueExists = await Issue.findOne({
      student: student._id,
      book: book._id,
      status: { $ne: "Returned" },
    });

    if (activeIssueExists) {
      return res.status(400).json({ message: "This book is already issued to the student" });
    }

    const due = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const issue = await Issue.create({
      student: student._id,
      book: book._id,
      dueDate: due,
      status: "Active",
      returnDate: null,
      fine: 0,
    });
// Check Student Credit
if (student.credit <= 0) {
  return res.status(400).json({
    message: "Student has no remaining book credit.",
  });
}

// Reduce Credit
student.credit -= 1;
await student.save();
    
    book.availableCopies -= 1;
    await book.save();

    const populatedIssue = await Issue.findById(issue._id)
      .populate({ path: "student", select: "name email role" })
      .populate({ path: "book", select: "title author isbn semester category" });

    return res.status(201).json({
      message: "Book issued successfully",
      issue: populatedIssue,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const returnBookToStudent = async (req, res) => {
  try {
    const issueId = req.params.issueId || req.params.id;

    const issue = await Issue.findById(issueId).populate("book").populate("student");
    if (!issue) {
      return res.status(404).json({ message: "Issue record not found" });
    }

    if (issue.status === "Returned") {
      return res.status(400).json({ message: "Book has already been returned" });
    }

    const returnedAt = req.body.returnDate ? new Date(req.body.returnDate) : new Date();
    const fine = Number(req.body.fine || 0);

    issue.returnDate = returnedAt;
    issue.status = "Returned";
    issue.fine = fine;
    await issue.save();

    // Increase Student Credit After Return
const student = await User.findById(issue.student._id);

if (student) {
  student.credit += 1;
  await student.save();
}
    const book = await Book.findById(issue.book._id);
    if (book) {
      book.availableCopies = Math.min(book.totalCopies, (book.availableCopies || 0) + 1);
      await book.save();
    }

    const populatedIssue = await Issue.findById(issue._id)
      .populate({ path: "student", select: "name email role" })
      .populate({ path: "book", select: "title author isbn semester category" });

    return res.json({
      message: "Book returned successfully",
      issue: populatedIssue,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getIssueHistoryForStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user?._id;

    if (req.user.role === "student" && String(req.user._id) !== String(studentId)) {
      return res.status(403).json({ message: "Students can only view their own borrowing history" });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const issues = await Issue.find({ student: student._id })
      .populate({ path: "book", select: "title author isbn semester category" })
      .populate({ path: "student", select: "name email role" })
      .sort({ issueDate: -1 });

    return res.json({
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
      },
      history: issues,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
