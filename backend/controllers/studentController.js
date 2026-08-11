import Book from "../models/book.js";
import Issue from "../models/issue.js";
import User from "../models/user.js";

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password").sort({ name: 1 });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStudentDashboard = async (req, res) => {
  try {
    const requestedId = req.params.studentId || req.user?._id;

    if (!requestedId) {
      return res.status(400).json({ message: "Student identifier is required" });
    }

    if (req.user.role !== "student" && req.user.role !== "librarian" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.user.role === "student" && String(req.user._id) !== String(requestedId)) {
      return res.status(403).json({ message: "Students can only view their own library data" });
    }

    const student = await User.findById(requestedId).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const issues = await Issue.find({ student: student._id })
      .populate({ path: "book", select: "title author isbn category semester totalCopies availableCopies" })
      .populate({ path: "student", select: "name email role" })
      .sort({ issueDate: -1 });

    const normalizedIssues = issues.map((issue) => ({
      _id: issue._id,
      student: issue.student,
      book: issue.book,
      issueDate: issue.issueDate,
      dueDate: issue.dueDate,
      returnDate: issue.returnDate,
      status: issue.status,
      fine: issue.fine,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    }));

    const summary = {
      borrowed: normalizedIssues.filter((issue) => issue.status !== "Returned").length,
      returned: normalizedIssues.filter((issue) => issue.status === "Returned").length,
      overdue: normalizedIssues.filter((issue) => issue.status === "Overdue").length,
      fine: normalizedIssues.reduce((acc, issue) => acc + Number(issue.fine || 0), 0),
    };

    return res.json({
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        rollNo: student.rollNo,
        credit: student.credit,
        maxBooks: student.maxBooks,
      },
      summary,
      borrowingHistory: normalizedIssues,
      books: await Book.find().sort({ semester: 1, title: 1 }),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
