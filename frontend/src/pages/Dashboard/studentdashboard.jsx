import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatQuery, setChatQuery] = useState('');
  const [chatMsg, setChatMsg] = useState('');

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
        const booksRes = await API.get('/api/books').catch(() => ({ data: [] }));
        setAllBooks(booksRes.data || []);

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
              title: 'Data Structures & Algorithms in Java',
              author: 'Robert Lafore',
              issueDate: '2024-02-01',
              dueDate: '2024-02-15',
              status: 'Issued'
            }
          ]);
          setHistory([
            {
              _id: 'h1',
              title: 'Operating System Concepts',
              author: 'Abraham Silberschatz',
              returnedDate: '2024-01-20',
              status: 'Returned'
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading student dashboard data:', error);
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
                {allBooks.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category || 'General'}</td>
                    <td>{book.availableCopies ?? book.totalCopies ?? 1}</td>
                  </tr>
                ))}
                {allBooks.length === 0 && (
                  <tr>
                    <td colSpan="4">No catalog books available right now.</td>
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