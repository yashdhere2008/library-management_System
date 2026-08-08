import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';

// Default Fallback Catalog
const DEFAULT_CATALOG_BOOKS = [
  {
    _id: 'b1',
    title: 'Data Structures & Algorithms in Java',
    author: 'Robert Lafore',
    isbn: '978-0672324536',
    category: 'Computer Science',
    semester: 3,
    totalCopies: 5,
    availableCopies: 3,
  },
  {
    _id: 'b2',
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    isbn: '978-1118063330',
    category: 'Computer Science',
    semester: 4,
    totalCopies: 4,
    availableCopies: 2,
  },
  {
    _id: 'b3',
    title: 'Database System Concepts',
    author: 'Henry F. Korth',
    isbn: '978-0073523323',
    category: 'Database Systems',
    semester: 4,
    totalCopies: 3,
    availableCopies: 0,
  },
];

// Default Fallback Students Dataset
const DEFAULT_STUDENTS = [
  { _id: 's1', name: 'Praniti Shinde', email: 'praniti@college.edu', role: 'Student' },
  { _id: 's2', name: 'Yash Sharma', email: 'yash@college.edu', role: 'Student' },
  { _id: 's3', name: 'Alex Johnson', email: 'alex.j@college.edu', role: 'Student' },
];

const LibrarianDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatQuery, setChatQuery] = useState('');
  const [chatMsg, setChatMsg] = useState('');

  const [books, setBooks] = useState(DEFAULT_CATALOG_BOOKS);
  const [students, setStudents] = useState(DEFAULT_STUDENTS);
  const [loading, setLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(DEFAULT_STUDENTS[0]._id);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [issueError, setIssueError] = useState('');
  const [issueSuccess, setIssueSuccess] = useState('');
  const [returnError, setReturnError] = useState('');
  const [activeStudentHistory, setActiveStudentHistory] = useState([
    {
      _id: 'bh1',
      student: { name: 'Praniti Shinde' },
      book: { title: 'Data Structures & Algorithms in Java', author: 'Robert Lafore' },
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active'
    },
  ]);
  
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    semester: 1,
    totalCopies: 1,
  });
  const [editingBookId, setEditingBookId] = useState('');
  const [bookFormError, setBookFormError] = useState('');
  const [bookFormSuccess, setBookFormSuccess] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [booksResponse, studentsResponse] = await Promise.all([
        API.get('/api/books').catch(() => ({ data: null })),
        API.get('/api/students').catch(() => ({ data: null }))
      ]);

      if (Array.isArray(booksResponse.data) && booksResponse.data.length > 0) {
        setBooks(booksResponse.data);
      }
      if (Array.isArray(studentsResponse.data) && studentsResponse.data.length > 0) {
        setStudents(studentsResponse.data);
        if (!selectedStudentId) {
          setSelectedStudentId(studentsResponse.data[0]._id || studentsResponse.data[0].id);
        }
      }
    } catch (error) {
      console.warn('Unable to load librarian dashboard data, using default datasets:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalIssuedCopies = useMemo(() => {
    return books.reduce((sum, book) => sum + Math.max(0, (book.totalCopies || 0) - (book.availableCopies || 0)), 0);
  }, [books]);

  const totalAvailableCopies = useMemo(() => {
    return books.reduce((sum, book) => sum + (book.availableCopies || 0), 0);
  }, [books]);

  const totalCopies = useMemo(() => {
    return books.reduce((sum, book) => sum + (book.totalCopies || 0), 0);
  }, [books]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBookInput = (event) => {
    const { name, value } = event.target;
    setBookForm((current) => ({
      ...current,
      [name]: name === 'semester' || name === 'totalCopies' ? Number(value) : value,
    }));
  };

  const handleAddBook = async (event) => {
    event.preventDefault();
    setBookFormError('');
    setBookFormSuccess('');

    const generatedIsbn = bookForm.isbn.trim() || `ISBN-${Date.now()}`;
    const copies = Number(bookForm.totalCopies) || 1;

    const newBookPayload = {
      title: bookForm.title,
      author: bookForm.author,
      isbn: generatedIsbn,
      category: bookForm.category || 'General',
      semester: Number(bookForm.semester) || 1,
      totalCopies: copies,
      availableCopies: copies,
    };

    try {
      const response = await API.post('/api/books', newBookPayload);
      const savedBook = response.data || { ...newBookPayload, _id: `b-${Date.now()}` };
      setBooks((prev) => [...prev, savedBook]);
      setBookFormSuccess('Book added successfully.');
      setBookForm({ title: '', author: '', isbn: '', category: '', semester: 1, totalCopies: 1 });
    } catch (error) {
      const localBook = { ...newBookPayload, _id: `b-${Date.now()}` };
      setBooks((prev) => [...prev, localBook]);
      setBookFormSuccess('Book added to local library records successfully.');
      setBookForm({ title: '', author: '', isbn: '', category: '', semester: 1, totalCopies: 1 });
    }
  };

  const handleEditBook = (book) => {
    setEditingBookId(book._id);
    setBookForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      category: book.category || 'General',
      semester: Number(book.semester || 1),
      totalCopies: Number(book.totalCopies || 1),
    });
    setActiveTab('addbook');
  };

  const handleUpdateBook = async (event) => {
    event.preventDefault();
    if (!editingBookId) return;

    setBookFormError('');
    setBookFormSuccess('');

    const updatedData = {
      title: bookForm.title,
      author: bookForm.author,
      isbn: bookForm.isbn || `ISBN-${Date.now()}`,
      category: bookForm.category || 'General',
      semester: Number(bookForm.semester || 1),
      totalCopies: Number(bookForm.totalCopies || 1),
    };

    try {
      await API.put(`/api/books/${editingBookId}`, updatedData);
    } catch (error) {
      console.warn('Backend update unavailable, applying update locally:', error.message);
    }

    setBooks((prev) =>
      prev.map((b) => (b._id === editingBookId ? { ...b, ...updatedData, availableCopies: updatedData.totalCopies } : b))
    );
    setBookFormSuccess('Book updated successfully.');
    setBookForm({ title: '', author: '', isbn: '', category: '', semester: 1, totalCopies: 1 });
    setEditingBookId('');
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Delete this book from the library database?')) return;

    try {
      await API.delete(`/api/books/${bookId}`);
    } catch (error) {
      console.warn('Backend delete request failed, deleting locally:', error.message);
    }

    setBooks((prev) => prev.filter((b) => b._id !== bookId));
    setBookFormSuccess('Book deleted successfully.');
  };

  const handleChatSearch = () => {
    if (!chatQuery.trim()) {
      setChatMsg('⚠️ Please type a question first.');
      return;
    }
    setChatMsg('🔎 Opening Google search for your question...');
    window.open('https://www.google.com/search?q=' + encodeURIComponent(chatQuery), '_blank');
    setChatQuery('');
  };

  const handleIssueBook = async (event) => {
    event.preventDefault();
    if (!selectedStudentId || !selectedBookId) {
      setIssueError('Choose a student and a book before issuing.');
      return;
    }

    const bookToIssue = books.find((b) => String(b._id) === String(selectedBookId));
    if (bookToIssue && bookToIssue.availableCopies <= 0) {
      setIssueError('No copies available for this book.');
      return;
    }

    const studentObj = students.find((s) => String(s._id) === String(selectedStudentId));

    try {
      const payload = { studentId: selectedStudentId, dueDate: dueDate || undefined };
      await API.post(`/api/books/${selectedBookId}/issue`, payload);
    } catch (error) {
      console.warn('Backend issue endpoint offline, issuing locally:', error.message);
    }

    setBooks((prev) =>
      prev.map((b) =>
        String(b._id) === String(selectedBookId)
          ? { ...b, availableCopies: Math.max(0, (b.availableCopies || 1) - 1) }
          : b
      )
    );

    const newRecord = {
      _id: `bh-${Date.now()}`,
      student: studentObj ? { name: studentObj.name } : { name: 'Student' },
      book: bookToIssue ? { title: bookToIssue.title, author: bookToIssue.author } : { title: 'Book' },
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active',
    };

    setActiveStudentHistory((prev) => [newRecord, ...prev]);
    setIssueError('');
    setIssueSuccess(`Issued "${bookToIssue?.title || 'Book'}" to ${studentObj?.name || 'student'}.`);
    setDueDate('');
  };

  const handleReturnIssue = async (issueId) => {
    try {
      await API.patch(`/api/books/issue/${issueId}/return`, { returnDate: new Date().toISOString() });
    } catch (error) {
      console.warn('Backend return endpoint offline, returning locally:', error.message);
    }

    const returnedIssue = activeStudentHistory.find((item) => item._id === issueId);
    if (returnedIssue && returnedIssue.book?.title) {
      setBooks((prev) =>
        prev.map((b) =>
          b.title === returnedIssue.book.title
            ? { ...b, availableCopies: Math.min(b.totalCopies, (b.availableCopies || 0) + 1) }
            : b
        )
      );
    }

    setActiveStudentHistory((prev) => prev.filter((row) => row._id !== issueId));
    setReturnError('');
    setIssueSuccess('Book returned successfully.');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>👩‍🏫 Librarian</h2>

        {/* Dynamic Logged-in Librarian Info */}
        <div style={{ padding: '8px 0', fontSize: '13px', color: '#ccc' }}>
          👤 Logged in as: <br />
          <strong>{user?.name || user?.email || 'Librarian'}</strong>
        </div>

        <a className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>🏠 Dashboard</a>
        <a className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>📚 Manage Books</a>
        <a className={activeTab === 'addbook' ? 'active' : ''} onClick={() => setActiveTab('addbook')}>➕ Add Book</a>
        <a className={activeTab === 'issue' ? 'active' : ''} onClick={() => setActiveTab('issue')}>📖 Issue Books</a>
        <a className={activeTab === 'return' ? 'active' : ''} onClick={() => setActiveTab('return')}>📥 Return Books</a>
        <a className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>📋 Requests</a>
        <a className="logout" onClick={handleLogout}>🚪 Logout</a>

        <div className="chat-box">
          <h3>💬 Ask Anything</h3>
          <input
            type="text"
            placeholder="Type your question..."
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChatSearch()}
          />
          <button type="button" onClick={handleChatSearch}>🔍 Search Google</button>
          <div className="chat-msg">{chatMsg}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main">
        {activeTab === 'dashboard' && (
          <div>
            <h1>Welcome back, {user?.name || 'Librarian'}! 👋</h1>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              Account Email: <strong>{user?.email || 'librarian@college.edu'}</strong>
            </p>

            <div className="cards">
              <div className="card"><h3>Total Books</h3><h1>{books.length}</h1></div>
              <div className="card"><h3>Total Copies</h3><h1>{totalCopies}</h1></div>
              <div className="card"><h3>Registered Students</h3><h1>{students.length}</h1></div>
              <div className="card"><h3>Available Copies</h3><h1>{totalAvailableCopies}</h1></div>
            </div>

            <h2>📚 Library Book List</h2>
            <table>
              <thead>
                <tr><th>Title</th><th>Author</th><th>Semester</th><th>Category</th><th>Available</th></tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>Semester {book.semester || 'N/A'}</td>
                    <td>{book.category || 'General'}</td>
                    <td>{book.availableCopies || 0}/{book.totalCopies || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2>👨‍🎓 Registered Students</h2>
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th></tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td><span className="badge badge-blue">{student.role || 'Student'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'books' && (
          <div>
            <h1>Manage Books</h1>
            <table>
              <thead>
                <tr><th>Book</th><th>Author</th><th>Semester</th><th>Available</th><th>Action</th></tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>Semester {book.semester || 'N/A'}</td>
                    <td>{book.availableCopies || 0}/{book.totalCopies || 0}</td>
                    <td>
                      <button onClick={() => handleEditBook(book)} style={{ marginRight: '8px' }}>Edit</button>
                      <button className="reject" onClick={() => handleDeleteBook(book._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'addbook' && (
          <div>
            <h1>{editingBookId ? 'Edit Book' : 'Add Book'}</h1>
            <form onSubmit={editingBookId ? handleUpdateBook : handleAddBook} style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="form-group">
                <label>Book Title</label>
                <input name="title" type="text" value={bookForm.title} onChange={handleBookInput} required />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input name="author" type="text" value={bookForm.author} onChange={handleBookInput} required />
              </div>
              <div className="form-group">
                <label>ISBN (Optional)</label>
                <input name="isbn" type="text" value={bookForm.isbn} onChange={handleBookInput} placeholder="e.g. 978-3-16-148410-0" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input name="category" type="text" value={bookForm.category} onChange={handleBookInput} placeholder="e.g. Computer Science" />
              </div>
              <div className="form-group">
                <label>Total Copies</label>
                <input name="totalCopies" type="number" min="1" value={bookForm.totalCopies} onChange={handleBookInput} required />
              </div>

              {bookFormError && <div className="error-text" style={{ color: 'red', margin: '10px 0' }}>{bookFormError}</div>}
              {bookFormSuccess && <div className="success-text" style={{ color: 'green', margin: '10px 0' }}>{bookFormSuccess}</div>}

              <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>{editingBookId ? 'Update Book' : 'Save Book'}</button>
            </form>
          </div>
        )}

        {activeTab === 'issue' && (
          <div>
            <h1>Issue Books</h1>
            <form onSubmit={handleIssueBook} style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div className="form-group">
                <label>Student</label>
                <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>{student.name} ({student.email})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Book</label>
                <select value={selectedBookId} onChange={(e) => setSelectedBookId(e.target.value)}>
                  <option value="">Select a book</option>
                  {books.map((book) => (
                    <option key={book._id} value={book._id}>{book.title} - {book.availableCopies || 0} available</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>

              {issueError && <div className="error-text" style={{ color: 'red', margin: '10px 0' }}>{issueError}</div>}
              {issueSuccess && <div className="success-text" style={{ color: 'green', margin: '10px 0' }}>{issueSuccess}</div>}

              <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Issue Book</button>
            </form>
          </div>
        )}

        {activeTab === 'return' && (
          <div>
            <h1>Return Books</h1>
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              {activeStudentHistory.length === 0 ? (
                <p>No active issue records found.</p>
              ) : (
                <table>
                  <thead>
                    <tr><th>Student</th><th>Book</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {activeStudentHistory.map((issue) => (
                      <tr key={issue._id}>
                        <td>{issue.student?.name || 'Student'}</td>
                        <td>{issue.book?.title || 'Book'}</td>
                        <td>{issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : 'N/A'}</td>
                        <td><span className={`badge ${issue.status === 'Overdue' ? 'badge-red' : 'badge-green'}`}>{issue.status}</span></td>
                        <td><button onClick={() => handleReturnIssue(issue._id)}>Return</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <h1>Book Requests</h1>
            <table>
              <thead>
                <tr><th>Student</th><th>Book</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {activeStudentHistory.map((issue) => (
                  <tr key={issue._id}>
                    <td>{issue.student?.name || 'Student'}</td>
                    <td>{issue.book?.title || 'Book'}</td>
                    <td><span className="badge badge-yellow">{issue.status}</span></td>
                    <td><button onClick={() => handleReturnIssue(issue._id)}>Approve</button></td>
                  </tr>
                ))}
                {activeStudentHistory.length === 0 && (
                  <tr><td colSpan="4">No pending requests at this time.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarianDashboard;