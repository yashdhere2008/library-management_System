import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatQuery, setChatQuery] = useState('');
  const [chatMsg, setChatMsg] = useState('');

  // States for system data
  const [usersList, setUsersList] = useState([]);
  const [booksList, setBooksList] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    issuedBooks: 0,
    studentsCount: 0,
    librariansCount: 0,
  });

  // Fetch administrative data from API or fallbacks
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, booksRes] = await Promise.all([
          API.get('/api/users').catch(() => ({ data: [] })),
          API.get('/api/books').catch(() => ({ data: [] }))
        ]);

        const users = usersRes.data || [];
        const books = booksRes.data || [];

        setUsersList(users);
        setBooksList(books);

        const students = users.filter((u) => u.role === 'Student').length;
        const librarians = users.filter((u) => u.role === 'Librarian').length;

        setStats({
          totalUsers: users.length || 9,
          totalBooks: books.length || 7,
          issuedBooks: 17,
          studentsCount: students || 6,
          librariansCount: librarians || 4,
        });

        setActivityLogs([
          {
            id: '1',
            timestamp: '2024-01-15 10:30',
            user: `${user?.name || 'Admin'} (Admin)`,
            action: 'Logged into Admin Portal',
            status: 'Success'
          },
          {
            id: '2',
            timestamp: '2024-01-14 16:20',
            user: 'Priya Nair (Librarian)',
            action: 'Issued "Java Programming" to Student',
            status: 'Success'
          }
        ]);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      }
    };

    fetchAdminData();
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
    setChatMsg('🔎 Opening Google search for your question...');
    window.open('https://www.google.com/search?q=' + encodeURIComponent(chatQuery), '_blank');
    setChatQuery('');
  };

  return (
    <div className="dashboard-container dashboard-admin">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>🏛️ Admin</h2>

        {/* Dynamic Logged-In Admin Info */}
        <div style={{ padding: '8px 0', fontSize: '13px', color: '#ccc' }}>
          👤 Logged in as: <br />
          <strong>{user?.name || user?.email || 'Administrator'}</strong>
        </div>

        <a className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          🏠 Dashboard
        </a>
        <a className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
          👥 Manage Users
        </a>
        <a className={activeTab === 'librarians' ? 'active' : ''} onClick={() => setActiveTab('librarians')}>
          👩‍💼 Manage Librarians
        </a>
        <a className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>
          📚 All Books
        </a>
        <a className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>
          📊 Reports
        </a>
        <a className={activeTab === 'logs' ? 'active' : ''} onClick={() => setActiveTab('logs')}>
          📜 Activity Logs
        </a>
        <a className="logout" onClick={handleLogout}>
          🚪 Logout
        </a>

        {/* Chat / Google Search */}
        <div className="chat-box">
          <h3>💬 Ask Anything</h3>
          <input
            type="text"
            placeholder="Type your question here..."
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChatSearch()}
          />
          <button type="button" onClick={handleChatSearch}>🔍 Search on Google</button>
          <div className="chat-msg">{chatMsg}</div>
        </div>
      </div>

      {/* Main Area */}
      <div className="main">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <h1>Welcome back, {user?.name || 'Admin'}! 👋</h1>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              Logged in Account: <strong>{user?.email || 'admin@college.edu'}</strong>
            </p>

            <div className="cards">
              <div className="card"><h3>Total Users</h3><h1>{stats.totalUsers}</h1></div>
              <div className="card"><h3>Total Books</h3><h1>{stats.totalBooks}</h1></div>
              <div className="card"><h3>Issued Books</h3><h1>{stats.issuedBooks}</h1></div>
              <div className="card"><h3>Pending Fines</h3><h1>₹40</h1></div>
            </div>

            <div className="cards" style={{ marginTop: '15px' }}>
              <div className="card"><h3>Students</h3><h1>{stats.studentsCount}</h1></div>
              <div className="card"><h3>Librarians</h3><h1>{stats.librariansCount}</h1></div>
              <div className="card"><h3>Overdue Books</h3><h1>2</h1></div>
              <div className="card"><h3>Today's Issues</h3><h1>2</h1></div>
            </div>

            <h2>Quick Actions</h2>
            <div className="cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('users')}>
                <h3>➕ Manage Users</h3>
                <p style={{ color: '#333' }}>View and manage student profiles</p>
              </div>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('librarians')}>
                <h3>👩‍💼 Manage Librarians</h3>
                <p style={{ color: '#333' }}>View librarian staff</p>
              </div>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('reports')}>
                <h3>📊 View Reports</h3>
                <p style={{ color: '#333' }}>See overall system statistics</p>
              </div>
            </div>

            <h2>Recent System Activity</h2>
            <table>
              <thead>
                <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Status</th></tr>
              </thead>
              <tbody>
                {activityLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.timestamp}</td>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                    <td><span className="badge badge-green">{log.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div>
            <div className="section-title"><h1>👥 Manage Users</h1></div>
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr>
              </thead>
              <tbody>
                {usersList.length > 0 ? (
                  usersList.map((u) => (
                    <tr key={u._id || u.email}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role || 'Student'}</td>
                      <td><span className="badge badge-green">Active</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>Praniti Shinde</td>
                    <td>praniti@college.edu</td>
                    <td>Student</td>
                    <td><span className="badge badge-green">Active</span></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* LIBRARIANS TAB */}
        {activeTab === 'librarians' && (
          <div>
            <div className="section-title"><h1>👩‍💼 Manage Librarians</h1></div>
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>
              </thead>
              <tbody>
                {usersList.filter((u) => u.role === 'Librarian').length > 0 ? (
                  usersList
                    .filter((u) => u.role === 'Librarian')
                    .map((lib) => (
                      <tr key={lib._id || lib.email}>
                        <td>{lib.name}</td>
                        <td>{lib.email}</td>
                        <td>{lib.role}</td>
                        <td><button className="reject">Remove</button></td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td>Priya Nair</td>
                    <td>priya.nair@library.edu</td>
                    <td>Librarian</td>
                    <td><button className="reject">Remove</button></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* BOOKS TAB */}
        {activeTab === 'books' && (
          <div>
            <div className="section-title"><h1>📚 All Books in Library</h1></div>
            <table>
              <thead>
                <tr><th>Book Title</th><th>Author</th><th>Total Copies</th><th>Available Copies</th></tr>
              </thead>
              <tbody>
                {booksList.length > 0 ? (
                  booksList.map((b) => (
                    <tr key={b._id}>
                      <td>{b.title}</td>
                      <td>{b.author}</td>
                      <td>{b.totalCopies || 5}</td>
                      <td>{b.availableCopies || 3}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>Java Programming</td>
                    <td>James Gosling</td>
                    <td>10</td>
                    <td>6</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div>
            <h1>📊 System Reports</h1>
            <div className="cards">
              <div className="card"><h3>Books Circulated</h3><h1>2,140</h1></div>
              <div className="card"><h3>Revenue from Fines</h3><h1>₹3,250</h1></div>
            </div>
          </div>
        )}

        {/* ACTIVITY LOGS TAB */}
        {activeTab === 'logs' && (
          <div>
            <h1>📜 Activity Logs</h1>
            <table>
              <thead>
                <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Status</th></tr>
              </thead>
              <tbody>
                {activityLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.timestamp}</td>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                    <td><span className="badge badge-green">{log.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;