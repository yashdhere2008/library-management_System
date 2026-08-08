import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';

const DEFAULT_BOOKS = [
  // 1st Year
  { _id: 'b1', title: 'Engineering Mathematics', author: 'B.S. Grewal', category: 'Mathematics', availableCopies: 2 },
  { _id: 'b2', title: 'Engineering Physics', author: 'Gaur & Gupta', category: 'Physics', availableCopies: 3 },
  { _id: 'b3', title: 'Engineering Chemistry', author: 'Jain & Jain', category: 'Chemistry', availableCopies: 2 },
  { _id: 'b4', title: 'Engineering Drawing', author: 'N.D. Bhatt', category: 'Engineering', availableCopies: 4 },
  { _id: 'b5', title: 'Engineering Mechanics', author: 'R.S. Khurmi', category: 'Engineering', availableCopies: 3 },
  { _id: 'b6', title: 'Basic Electrical Engineering', author: 'V.K. Mehta', category: 'Electrical', availableCopies: 5 },
  { _id: 'b7', title: 'Basic Electronics', author: 'B.L. Theraja', category: 'Electronics', availableCopies: 3 },
  { _id: 'b8', title: 'Communication Skills', author: 'Sanjay Kumar', category: 'Communication', availableCopies: 4 },
  { _id: 'b9', title: 'Workshop Technology', author: 'R.S. Khurmi', category: 'Workshop', availableCopies: 2 },
  { _id: 'b10', title: 'Computer Fundamentals', author: 'P.K. Sinha', category: 'Computer', availableCopies: 5 },

  // 2nd Year
  { _id: 'b11', title: 'Data Structures', author: 'Reema Thareja', category: 'Programming', availableCopies: 4 },
  { _id: 'b12', title: 'Programming in C', author: 'E. Balagurusamy', category: 'Programming', availableCopies: 5 },
  { _id: 'b13', title: 'Object Oriented Programming', author: 'Robert Lafore', category: 'Programming', availableCopies: 4 },
  { _id: 'b14', title: 'Database Management System', author: 'R. Elmasri & S.B. Navathe', category: 'Database', availableCopies: 2 },
  { _id: 'b15', title: 'Operating System', author: 'Abraham Silberschatz', category: 'Systems', availableCopies: 3 },
  { _id: 'b16', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Networking', availableCopies: 2 },
  { _id: 'b17', title: 'Digital Electronics', author: 'M. Morris Mano', category: 'Digital Electronics', availableCopies: 4 },
  { _id: 'b18', title: 'Computer Organization', author: 'V. Carl Hamacher', category: 'Computer Organization', availableCopies: 3 },
  { _id: 'b19', title: 'Web Technology', author: 'Uttam K. Roy', category: 'Web Technology', availableCopies: 5 },
  { _id: 'b20', title: 'Microprocessor', author: 'Ramesh S. Gaonkar', category: 'Microprocessor', availableCopies: 2 },

  // 3rd Year
  { _id: 'b21', title: 'Software Engineering', author: 'Ian Sommerville', category: 'Software Engineering', availableCopies: 4 },
  { _id: 'b22', title: 'Computer Graphics', author: 'Donald D. Hearn', category: 'Graphics', availableCopies: 3 },
  { _id: 'b23', title: 'Artificial Intelligence', author: 'Stuart Russell & Peter Norvig', category: 'AI', availableCopies: 2 },
  { _id: 'b24', title: 'Cyber Security', author: 'William Stallings', category: 'Cyber Security', availableCopies: 4 },
  { _id: 'b25', title: 'Cloud Computing', author: 'Rajkumar Buyya', category: 'Cloud', availableCopies: 2 },
  { _id: 'b26', title: 'Internet Programming', author: 'Deitel & Deitel', category: 'Internet', availableCopies: 3 },
  { _id: 'b27', title: 'Mobile Computing', author: 'Raj Kamal', category: 'Mobile Computing', availableCopies: 2 },
  { _id: 'b28', title: 'Compiler Design', author: 'A. V. Aho', category: 'Compiler', availableCopies: 3 },
  { _id: 'b29', title: 'System Analysis and Design', author: 'Elias M. Awad', category: 'System Analysis', availableCopies: 2 },
  { _id: 'b30', title: 'Project Management', author: 'P. Chandra', category: 'Project Management', availableCopies: 4 }
];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatQuery, setChatQuery] = useState('');
  const [chatMsg, setChatMsg] = useState('');

  // Search state for Book Catalog filtering
  const [searchTerm, setSearchTerm] = useState('');

  // States for logged-in user data
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch student specific data from the server
  useEffect(() => {
    const fetchStudentPersonalData = async () => {
      if (!user) return;
      setLoading(true);

      try {
        // Load library book catalog
        const booksRes = await API.get('/api/books').catch(() => null);
        
        if (booksRes && Array.isArray(booksRes.data) && booksRes.data.length > 0) {
          setAllBooks(booksRes.data);
        } else {
          setAllBooks(DEFAULT_BOOKS);
        }

        // Fetch data specifically for the logged-in student ID
        const userId = user._id || user.id;
        const personalRes = await API.get(`/api/student/${userId}/dashboard`).catch(() => null);

        if (personalRes && personalRes.data) {
          setIssuedBooks(personalRes.data.issuedBooks || []);
          setHistory(personalRes.data.history || []);
        } else {
          // Fallback initial data when backend endpoint is unavailable
          setIssuedBooks([
            {
              _id: 'ib1',
              title: 'Data Structures',
              author: 'Reema Thareja',
              issueDate: '2024-02-01',
              dueDate: '2024-02-15',
              status: 'Issued'
            }
          ]);
          setHistory([
            {
              _id: 'h1',
              title: 'Operating System',
              author: 'Abraham Silberschatz',
              returnedDate: '2024-01-20',
              status: 'Returned'
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading student dashboard data:', error);
        setAllBooks(DEFAULT_BOOKS);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentPersonalData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChatSearch = () => {
    if (!chatQuery.trim()) {
      setChatMsg('⚠️ Please type a question first.');
      return;
    }
    setChatMsg('🔎 Searching Google...');
    window.open('https://www.google.com/search?q=' + encodeURIComponent(chatQuery), '_blank');
    setChatQuery('');
  };

  // Filter books based on user search input
  const filteredBooks = allBooks.filter((book) => {
    const query = searchTerm.toLowerCase();
    return (
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.category?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <h2>🎓 Student</h2>
        
        {/* Dynamic Logged-in Student Info */}
        <div style={{ padding: '8px 0', fontSize: '13px', color: '#ccc' }}>
          👤 Logged in as: <br />
          <strong>{user?.name || user?.email || 'Student'}</strong>
        </div>

        <a className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          🏠 Dashboard
        </a>
        <a className={activeTab === 'mybooks' ? 'active' : ''} onClick={() => setActiveTab('mybooks')}>
          📖 My Issued Books
        </a>
        <a className={activeTab === 'catalog' ? 'active' : ''} onClick={() => setActiveTab('catalog')}>
          📚 Book Catalog
        </a>
        <a className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
          📜 Borrowing History
        </a>
        <a className="logout" onClick={handleLogout}>
          🚪 Logout
        </a>

        {/* Chat / Google Search Box */}
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

      {/* Main Content Area */}
      <div className="main">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <h1>Welcome back, {user?.name || 'Student'}! 👋</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Account Email: <strong>{user?.email || 'N/A'}</strong>
            </p>

            <div className="cards">
              <div className="card">
                <h3>My Issued Books</h3>
                <h1>{issuedBooks.length}</h1>
              </div>
              <div className="card">
                <h3>My History</h3>
                <h1>{history.length}</h1>
              </div>
              <div className="card">
                <h3>Total Books in Library</h3>
                <h1>{allBooks.length}</h1>
              </div>
            </div>

            <h2>📖 Currently Issued Books for {user?.name || 'You'}</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {issuedBooks.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.issueDate}</td>
                    <td>{book.dueDate}</td>
                    <td><span className="badge badge-green">{book.status || 'Issued'}</span></td>
                  </tr>
                ))}
                {issuedBooks.length === 0 && (
                  <tr>
                    <td colSpan="5">No books currently issued to your account.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MY ISSUED BOOKS TAB */}
        {activeTab === 'mybooks' && (
          <div>
            <h1>📖 Issued Books for {user?.name || 'Student'}</h1>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {issuedBooks.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.issueDate}</td>
                    <td>{book.dueDate}</td>
                  </tr>
                ))}
                {issuedBooks.length === 0 && (
                  <tr>
                    <td colSpan="4">No books found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* BOOK CATALOG TAB */}
        {activeTab === 'catalog' && (
          <div>
            <h1>📚 All Available Library Books</h1>

            {/* Catalog Search Bar */}
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="🔍 Search books by title, author, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cfe0ff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Available Copies</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category || 'General'}</td>
                    <td>{book.availableCopies ?? book.totalCopies ?? 1}</td>
                  </tr>
                ))}
                {filteredBooks.length === 0 && (
                  <tr>
                    <td colSpan="4">No catalog books match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* BORROWING HISTORY TAB */}
        {activeTab === 'history' && (
          <div>
            <h1>📜 My Borrowing History</h1>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Returned Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.author}</td>
                    <td>{item.returnedDate}</td>
                    <td><span className="badge badge-blue">{item.status}</span></td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan="4">No past borrowing history available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;