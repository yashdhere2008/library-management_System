import Book from "../models/book.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies } = req.body;
    const existing = await Book.findOne({ isbn });
    if (existing) {
      return res.status(400).json({ message: "Book with this ISBN already exists" });
    }
    const book = new Book({
      title, author, isbn, category,
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
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const issueBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }
    book.availableCopies -= 1;
    await book.save();
    res.json({ message: "Book issued", book });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availableCopies >= book.totalCopies) {
      return res.status(400).json({ message: "All copies already returned" });
    }
    book.availableCopies += 1;
    await book.save();
    res.json({ message: "Book returned", book });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};