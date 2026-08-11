import User from "../models/user.js";
import Book from "../models/book.js";
import Issue from "../models/issue.js";

// GET /api/admin/stats — overall system stats
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalBooks,
      totalStudents,
      totalLibrarians,
      activeIssues,
      totalFineResult,
    ] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "librarian" }),
      Issue.countDocuments({ status: { $in: ["Active", "Overdue"] } }),
      Issue.aggregate([{ $group: { _id: null, total: { $sum: "$fine" } } }]),
    ]);

    const totalFine = totalFineResult[0]?.total || 0;

    const totalCopiesResult = await Book.aggregate([
      { $group: { _id: null, total: { $sum: "$totalCopies" }, available: { $sum: "$availableCopies" } } },
    ]);

    return res.json({
      totalBooks,
      totalStudents,
      totalLibrarians,
      activeIssues,
      totalFine,
      totalCopies: totalCopiesResult[0]?.total || 0,
      availableCopies: totalCopiesResult[0]?.available || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/admin/users — list all users
export const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ role: 1, name: 1 });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/admin/users/:id — delete a user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (String(userId) === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Clean up any open issue records for deleted student
    if (user.role === "student") {
      await Issue.updateMany(
        { student: userId, status: { $ne: "Returned" } },
        { $set: { status: "Returned", returnDate: new Date() } }
      );
    }

    return res.json({ message: `User "${user.name}" deleted successfully` });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PATCH /api/admin/users/:id/credit — update student credit
export const updateUserCredit = async (req, res) => {
  try {
    const userId = req.params.id;
    const { credit, maxBooks } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "student") return res.status(400).json({ message: "Credit only applies to students" });

    if (credit !== undefined) user.credit = Number(credit);
    if (maxBooks !== undefined) user.maxBooks = Number(maxBooks);

    await user.save();
    return res.json({ message: "Credit updated", user: { id: user._id, name: user.name, credit: user.credit, maxBooks: user.maxBooks } });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/admin/issues — all issues with student and book details
export const getAllIssues = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const issues = await Issue.find(filter)
      .populate({ path: "student", select: "name email rollNo" })
      .populate({ path: "book", select: "title author isbn semester category" })
      .sort({ issueDate: -1 });

    return res.json(issues);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
