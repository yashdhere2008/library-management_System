import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';

const DEFAULT_BOOKS = [
  // Common / 1st Year Books
  { _id: 'b1', title: 'Higher Engineering Mathematics', author: 'B.S. Grewal', category: '1st Year - Mathematics', availableCopies: 5 },
  { _id: 'b2', title: 'Engineering Mathematics', author: 'H.K. Dass', category: '1st Year - Mathematics', availableCopies: 4 },
  { _id: 'b3', title: 'Engineering Physics', author: 'Gaur & Gupta', category: '1st Year - Physics', availableCopies: 5 },
  { _id: 'b4', title: 'Engineering Chemistry', author: 'Jain & Jain', category: '1st Year - Chemistry', availableCopies: 4 },
  { _id: 'b5', title: 'A Textbook of Engineering Drawing', author: 'R.K. Dhawan', category: '1st Year - Engineering Graphics', availableCopies: 5 },
  { _id: 'b6', title: 'Engineering Mechanics', author: 'R.S. Khurmi', category: '1st Year - Mechanics', availableCopies: 4 },
  { _id: 'b7', title: 'Workshop Practice', author: 'H.S. Bawa', category: '1st Year - Workshop', availableCopies: 3 },
  { _id: 'b8', title: 'Effective Technical Communication', author: 'M. Ashraf Rizvi', category: '1st Year - Communication', availableCopies: 4 },
  { _id: 'b9', title: 'Communication Skills', author: 'Sanjay Kumar & Pushp Lata', category: '1st Year - Communication', availableCopies: 4 },

  // Computer Engineering
  { _id: 'comp1', title: 'Data Structures Using C', author: 'Reema Thareja', category: 'Computer Engineering (2nd Year)', availableCopies: 4 },
  { _id: 'comp2', title: 'Database System Concepts', author: 'Abraham Silberschatz, Henry Korth & S. Sudarshan', category: 'Computer Engineering (2nd Year)', availableCopies: 3 },
  { _id: 'comp3', title: 'Operating System Concepts', author: 'Silberschatz, Galvin & Gagne', category: 'Computer Engineering (2nd Year)', availableCopies: 3 },
  { _id: 'comp4', title: 'Object-Oriented Programming in C++', author: 'Robert Lafore', category: 'Computer Engineering (2nd Year)', availableCopies: 4 },
  { _id: 'comp5', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Computer Engineering (3rd Year)', availableCopies: 3 },
  { _id: 'comp6', title: 'Software Engineering', author: 'Ian Sommerville', category: 'Computer Engineering (3rd Year)', availableCopies: 4 },
  { _id: 'comp7', title: 'Information Security', author: 'Shital M. Mate', category: 'Computer Engineering (3rd Year)', availableCopies: 3 },
  { _id: 'comp8', title: 'Embedded System', author: 'Vijay N. Kukre', category: 'Computer Engineering (3rd Year)', availableCopies: 3 },

  // Mechanical Engineering
  { _id: 'mech1', title: 'Strength of Materials', author: 'R. K. Rajput', category: 'Mechanical Engineering (2nd Year)', availableCopies: 4 },
  { _id: 'mech2', title: 'Engineering Thermodynamics', author: 'P. K. Nag', category: 'Mechanical Engineering (2nd Year)', availableCopies: 3 },
  { _id: 'mech3', title: 'Manufacturing Engineering & Technology', author: 'Serope Kalpakjian', category: 'Mechanical Engineering (2nd Year)', availableCopies: 3 },
  { _id: 'mech4', title: 'Fluid Mechanics', author: 'R. K. Bansal', category: 'Mechanical Engineering (2nd Year)', availableCopies: 4 },
  { _id: 'mech5', title: 'Design of Machine Elements', author: 'V. B. Bhandari', category: 'Mechanical Engineering (3rd Year)', availableCopies: 3 },
  { _id: 'mech6', title: 'Thermal Engineering', author: 'R. S. Khurmi & J. K. Gupta', category: 'Mechanical Engineering (3rd Year)', availableCopies: 4 },
  { _id: 'mech7', title: 'Production Technology', author: 'R. K. Jain', category: 'Mechanical Engineering (3rd Year)', availableCopies: 3 },
  { _id: 'mech8', title: 'CAD/CAM', author: 'Mikell P. Groover', category: 'Mechanical Engineering (3rd Year)', availableCopies: 2 },

  // Civil Engineering
  { _id: 'civ1', title: 'Surveying', author: 'B. C. Punmia', category: 'Civil Engineering (2nd Year)', availableCopies: 4 },
  { _id: 'civ2', title: 'Strength of Materials', author: 'R. K. Rajput', category: 'Civil Engineering (2nd Year)', availableCopies: 4 },
  { _id: 'civ3', title: 'Building Construction', author: 'B. C. Punmia', category: 'Civil Engineering (2nd Year)', availableCopies: 3 },
  { _id: 'civ4', title: 'Concrete Technology', author: 'M. S. Shetty', category: 'Civil Engineering (2nd Year)', availableCopies: 3 },
  { _id: 'civ5', title: 'Reinforced Concrete Design', author: 'S. Unnikrishna Pillai & Devdas Menon', category: 'Civil Engineering (3rd Year)', availableCopies: 3 },
  { _id: 'civ6', title: 'Design of Steel Structures', author: 'N. Subramanian', category: 'Civil Engineering (3rd Year)', availableCopies: 2 },
  { _id: 'civ7', title: 'Estimating and Costing', author: 'B. N. Dutta', category: 'Civil Engineering (3rd Year)', availableCopies: 4 },
  { _id: 'civ8', title: 'Transportation Engineering', author: 'S. P. Chandola', category: 'Civil Engineering (3rd Year)', availableCopies: 3 },
  { _id: 'civ9', title: 'Environmental Engineering', author: 'S. K. Garg', category: 'Civil Engineering (3rd Year)', availableCopies: 3 },

  // Electrical Engineering
  { _id: 'elec1', title: 'Electrical Machinery', author: 'P. S. Bimbhra', category: 'Electrical Engineering (2nd Year)', availableCopies: 4 },
  { _id: 'elec2', title: 'Electrical & Electronic Measurements', author: 'A. K. Sawhney', category: 'Electrical Engineering (2nd Year)', availableCopies: 3 },
  { _id: 'elec3', title: 'Network Analysis', author: 'M. E. Van Valkenburg', category: 'Electrical Engineering (2nd Year)', availableCopies: 3 },
  { _id: 'elec4', title: 'Power System Engineering', author: 'Nagrath & Kothari', category: 'Electrical Engineering (3rd Year)', availableCopies: 3 },
  { _id: 'elec5', title: 'Power Electronics', author: 'P. S. Bimbhra', category: 'Electrical Engineering (3rd Year)', availableCopies: 4 },
  { _id: 'elec6', title: 'Switchgear and Protection', author: 'Sunil S. Rao', category: 'Electrical Engineering (3rd Year)', availableCopies: 2 },
  { _id: 'elec7', title: 'Industrial Electronics', author: 'S. K. Bhattacharya', category: 'Electrical Engineering (3rd Year)', availableCopies: 3 },

  // Electronics / Telecommunication Engineering
  { _id: 'entc1', title: 'Digital Electronics', author: 'R. P. Jain', category: 'Electronics & Telecom (2nd Year)', availableCopies: 4 },
  { _id: 'entc2', title: 'The 8051 Microcontroller and Embedded Systems', author: 'Muhammad Ali Mazidi', category: 'Electronics & Telecom (2nd Year)', availableCopies: 3 },
  { _id: 'entc3', title: 'Electronic Devices and Circuit Theory', author: 'Robert L. Boylestad', category: 'Electronics & Telecom (2nd Year)', availableCopies: 3 },
  { _id: 'entc4', title: 'Electronic Communication Systems', author: 'Kennedy & Davis', category: 'Electronics & Telecom (3rd Year)', availableCopies: 3 },
  { _id: 'entc5', title: 'Embedded System', author: 'Vijay N. Kukre', category: 'Electronics & Telecom (3rd Year)', availableCopies: 2 },
  { _id: 'entc6', title: 'Information Security', author: 'Shital M. Mate', category: 'Electronics & Telecom (3rd Year)', availableCopies: 3 },

  // Automobile Engineering
  { _id: 'auto1', title: 'Automobile Engineering', author: 'Kripal Singh', category: 'Automobile Engineering (2nd Year)', availableCopies: 4 },
  { _id: 'auto2', title: 'Automobile Engineering', author: 'K. M. Gupta', category: 'Automobile Engineering (2nd Year)', availableCopies: 3 },
  { _id: 'auto3', title: 'Motor Vehicle Technology', author: 'Gupta & Mittal', category: 'Automobile Engineering (2nd Year)', availableCopies: 3 },
  { _id: 'auto4', title: 'Automobile Engineering', author: 'Kripal Singh', category: 'Automobile Engineering (3rd Year)', availableCopies: 3 },
  { _id: 'auto5', title: 'Automotive Electrical & Electronic Systems', author: 'Tom Denton', category: 'Automobile Engineering (3rd Year)', availableCopies: 2 },
  { _id: 'auto6', title: 'Automobile Engineering', author: 'Kirpal Singh', category: 'Automobile Engineering (3rd Year)', availableCopies: 3 },

  // Chemical Engineering
  { _id: 'chem1', title: 'Fluid Mechanics', author: 'R. K. Bansal', category: 'Chemical Engineering (2nd Year)', availableCopies: 3 },
  { _id: 'chem2', title: 'Heat Transfer', author: 'J. P. Holman', category: 'Chemical Engineering (2nd Year)', availableCopies: 3 },
  { _id: 'chem3', title: 'Chemical Engineering', author: 'J. M. Coulson & J. F. Richardson', category: 'Chemical Engineering (2nd Year)', availableCopies: 2 },
  { _id: 'chem4', title: 'Mass Transfer Operations', author: 'Robert E. Treybal', category: 'Chemical Engineering (3rd Year)', availableCopies: 3 },
  { _id: 'chem5', title: 'Process Systems Analysis and Control', author: 'Donald R. Coughanowr', category: 'Chemical Engineering (3rd Year)', availableCopies: 2 },
  { _id: 'chem6', title: 'Chemical Engineering Plant Design', author: 'E. E. Ludwig', category: 'Chemical Engineering (3rd Year)', availableCopies: 2 },

  // Instrumentation & Control Engineering
  { _id: 'inst1', title: 'Electrical & Electronic Measurements', author: 'A. K. Sawhney', category: 'Instrumentation & Control (2nd Year)', availableCopies: 3 },
  { _id: 'inst2', title: 'Instrumentation & Measurement', author: 'A. K. Sawhney', category: 'Instrumentation & Control (2nd Year)', availableCopies: 3 },
  { _id: 'inst3', title: 'Control Systems Engineering', author: 'I. J. Nagrath & M. Gopal', category: 'Instrumentation & Control (2nd Year)', availableCopies: 3 },
  { _id: 'inst4', title: 'Industrial Instrumentation', author: 'K. Krishnaswamy', category: 'Instrumentation & Control (3rd Year)', availableCopies: 2 },
  { _id: 'inst5', title: 'Programmable Logic Controllers', author: 'John W. Webb & Ronald Reis', category: 'Instrumentation & Control (3rd Year)', availableCopies: 3 },
  { _id: 'inst6', title: 'Process Control', author: 'Peter Harriott', category: 'Instrumentation & Control (3rd Year)', availableCopies: 2 }
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
              title: 'Data Structures Using C',
              author: 'Reema Thareja',
              issueDate: '2024-02-01',
              dueDate: '2024-02-15',
              status: 'Issued'
            }
          ]);
          setHistory([
            {
              _id: 'h1',
              title: 'Engineering Mathematics',
              author: 'H.K. Dass',
              borrowedDate: '2024-01-20',
              status: 'Borrowed'
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

  // Handle Borrowing a Book (Moves book ONLY to Borrowing History)
  const handleBorrowBook = async (book) => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];

    const userId = user?._id || user?.id;

    try {
      // Optional API call to sync with backend
      await API.post(`/api/books/borrow`, {
        userId,
        bookId: book._id
      }).catch(() => null);

      // 1. Decrement available copies in catalog
      setAllBooks((prevBooks) =>
        prevBooks.map((b) =>
          b._id === book._id
            ? { ...b, availableCopies: Math.max((b.availableCopies ?? 1) - 1, 0) }
            : b
        )
      );

      // 2. Add entry strictly to Borrowing History
      const newHistoryItem = {
        _id: `hist_${Date.now()}`,
        title: book.title,
        author: book.author,
        borrowedDate: formattedToday,
        status: 'Borrowed'
      };
      setHistory((prev) => [newHistoryItem, ...prev]);

      alert(`✅ "${book.title}" has been recorded in your Borrowing History!`);
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('⚠️ Could not complete borrowing. Please try again.');
    }
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
          {user?.rollNo && (
            <div>🆔 Roll No: <strong>{user.rollNo}</strong></div>
          )}
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
              {user?.rollNo && <> | Roll No: <strong>{user.rollNo}</strong></>}
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
                placeholder="🔍 Search books by title, author, department, or year..."
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
                  <th>Department / Year</th>
                  <th>Available Copies</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => {
                  const copies = book.availableCopies ?? book.totalCopies ?? 1;
                  return (
                    <tr key={book._id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category || 'General'}</td>
                      <td>{copies}</td>
                      <td>
                        <button
                          onClick={() => handleBorrowBook(book)}
                          disabled={copies <= 0}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: copies > 0 ? '#28a745' : '#ccc',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: copies > 0 ? 'pointer' : 'not-allowed',
                            fontSize: '13px'
                          }}
                        >
                          {copies > 0 ? '📖 Borrow' : 'Out of Stock'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredBooks.length === 0 && (
                  <tr>
                    <td colSpan="5">No catalog books match your search.</td>
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
                  <th>Date Borrowed</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.author}</td>
                    <td>{item.borrowedDate || item.returnedDate}</td>
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