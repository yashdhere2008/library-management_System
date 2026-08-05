import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatQuery, setChatQuery] = useState('');
  const [chatMsg, setChatMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequestSuccess, setShowRequestSuccess] = useState(false);
  const [showRenewSuccess, setShowRenewSuccess] = useState(false);
  const [showFineSuccess, setShowFineSuccess] = useState(false);
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);

  const books = [
    { name: "Java Programming", author: "James Gosling", category: "Programming", available: 8, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80" },
    { name: "DBMS", author: "Korth", category: "Database", available: 4, image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80" },
    { name: "Python Basics", author: "Guido Rossum", category: "Programming", available: 0, image: "https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=600&q=80" },
    { name: "Data Structures", author: "Mark Weiss", category: "Programming", available: 2, image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=600&q=80" }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChatSearch = () => {
    if (!chatQuery.trim()) {
      setChatMsg("⚠️ Please type a question first.");
      return;
    }
    setChatMsg("🔎 Opening Google search for your question...");
    window.open("https://www.google.com/search?q=" + encodeURIComponent(chatQuery), "_blank");
    setChatQuery('');
  };

  const requestBook = () => {
    setShowRequestSuccess(true);
    setTimeout(() => setShowRequestSuccess(false), 2000);
  };

  const renewBook = () => {
    setShowRenewSuccess(true);
    setTimeout(() => setShowRenewSuccess(false), 2000);
  };

  const payFine = () => {
    setShowFineSuccess(true);
    setTimeout(() => setShowFineSuccess(false), 2000);
  };

  const updateProfile = (e) => {
    e.preventDefault();
    setShowProfileSuccess(true);
    setTimeout(() => setShowProfileSuccess(false), 2000);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>🧑‍🎓 Student</h2>
        <a className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>🏠 Dashboard</a>
        <a className={activeTab === 'browse' ? 'active' : ''} onClick={() => setActiveTab('browse')}>🔍 Browse Catalog</a>
        <a className={activeTab === 'mybooks' ? 'active' : ''} onClick={() => setActiveTab('mybooks')}>📗 My Books</a>
        <a className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>📋 My Requests</a>
        <a className={activeTab === 'fines' ? 'active' : ''} onClick={() => setActiveTab('fines')}>💰 Fines</a>
        <a className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>👤 My Profile</a>
        <a className="logout" onClick={handleLogout}>🚪 Logout</a>
        
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
      
      <div className="main">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <h1>Student Dashboard</h1>
            <p style={{ marginTop: '-10px', color: '#000' }}>Welcome back, {user?.name || 'Student'} 👋</p>
            <div className="cards">
              <div className="card"><h3>Books Issued</h3><h1>4</h1></div>
              <div className="card"><h3>Pending Requests</h3><h1>1</h1></div>
              <div className="card"><h3>Due Soon</h3><h1>1</h1></div>
              <div className="card"><h3>Fine Due</h3><h1>₹40</h1></div>
            </div>
            
            <h2>Currently Issued</h2>
            <table>
              <thead>
                <tr><th>Book</th><th>Issued On</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><img className="mini-book-cover" src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80" alt="Java Programming" /><span>Java Programming</span></td>
                  <td>2024-01-10</td><td>2024-01-24</td><td><span className="badge badge-green">On Time</span></td><td><button onClick={() => setActiveTab('mybooks')}>View</button></td>
                </tr>
                <tr>
                  <td><img className="mini-book-cover" src="https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=300&q=80" alt="Data Structures" /><span>Data Structures</span></td>
                  <td>2024-01-05</td><td>2024-01-19</td><td><span className="badge badge-yellow">Due Soon</span></td><td><button onClick={() => setActiveTab('mybooks')}>View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* BROWSE CATALOG */}
        {activeTab === 'browse' && (
          <div>
            <span style={{ color: '#000', fontSize: '16px' }}>({books.length} books)</span>
            <div className="success-msg" style={{ display: showRequestSuccess ? 'block' : 'none' }}>✅ Request sent to the librarian!</div>
            <div className="catalog-search-wrap">
              <input 
                type="text" 
                placeholder="Search by book name or author..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="book-grid">
              {books.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase())).map((b, i) => (
                <div className="book-card" key={i}>
                  <img className="book-cover" src={b.image} alt={b.name} />
                  <h3>{b.name}</h3>
                  <p>by {b.author}</p>
                  <p>{b.category}</p>
                  <p>
                    {b.available > 0 
                      ? <span className="badge badge-green">{b.available} available</span> 
                      : <span className="badge badge-red">Out of stock</span>
                    }
                  </p>
                  <button 
                    style={{ marginTop: '10px', width: '100%' }} 
                    disabled={b.available === 0} 
                    onClick={requestBook}
                  >
                    {b.available === 0 ? "Unavailable" : "Request to Borrow"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MY BOOKS */}
        {activeTab === 'mybooks' && (
          <div>
            <h1>📗 My Issued Books</h1>
            <table>
              <thead>
                <tr><th>Book</th><th>Author</th><th>Issued On</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><img className="mini-book-cover" src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80" alt="Java" /><span>Java Programming</span></td>
                  <td>James Gosling</td><td>2024-01-10</td><td>2024-01-24</td><td><span className="badge badge-green">On Time</span></td><td><button onClick={renewBook}>Renew</button></td>
                </tr>
              </tbody>
            </table>
            <div className="success-msg" style={{ display: showRenewSuccess ? 'block' : 'none', marginTop: '15px' }}>✅ Book renewed for 14 more days!</div>
          </div>
        )}

        {/* MY REQUESTS */}
        {activeTab === 'requests' && (
          <div>
            <h1>📋 My Borrow Requests</h1>
            <table>
              <thead>
                <tr><th>Book</th><th>Request Date</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr><td>DBMS</td><td>2024-01-15</td><td><span className="badge badge-yellow">Pending</span></td><td><button className="reject">Cancel</button></td></tr>
              </tbody>
            </table>
          </div>
        )}

        {/* FINES */}
        {activeTab === 'fines' && (
          <div>
            <h1>💰 Fines & Payments</h1>
            <div className="notice">Fine is charged at ₹5/day for every book returned after its due date.</div>
            <table>
              <thead>
                <tr><th>Book</th><th>Due Date</th><th>Returned On</th><th>Days Late</th><th>Fine</th><th>Status</th></tr>
              </thead>
              <tbody>
                <tr><td>Python Basics</td><td>2023-12-19</td><td>2023-12-27</td><td>8</td><td>₹40</td><td><span className="badge badge-red">Unpaid</span></td></tr>
              </tbody>
            </table>
            <h2>Total Outstanding: ₹40</h2>
            <button onClick={payFine} style={{ padding: '12px 24px', fontSize: '16px' }}>💳 Pay Now</button>
            <div className="success-msg" style={{ display: showFineSuccess ? 'block' : 'none', marginTop: '15px' }}>✅ Fine paid successfully!</div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div>
            <h1>👤 My Profile</h1>
            <div className="profile-card">
              <div className="avatar">PS</div>
              <div>
                <h2 style={{ margin: 0 }}>{user?.name || 'Praniti Shinde'}</h2>
                <p style={{ margin: '4px 0', color: '#000' }}>Roll No: CS101 &nbsp;|&nbsp; Computer Science</p>
                <p style={{ margin: '4px 0', color: '#000' }}>{user?.email || 'praniti@college.edu'}</p>
              </div>
            </div>
            <form onSubmit={updateProfile}>
              <div className="success-msg" style={{ display: showProfileSuccess ? 'block' : 'none' }}>✅ Profile updated successfully!</div>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input type="text" defaultValue={user?.name || "Praniti Shinde"} required /></div>
                <div className="form-group"><label>Email</label><input type="email" defaultValue={user?.email || "praniti@college.edu"} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Phone</label><input type="text" defaultValue="9876543210" /></div>
                <div className="form-group">
                  <label>Department</label>
                  <select defaultValue="Computer Science">
                    <option>Computer Science</option>
                    <option>Electronics</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={{ padding: '12px 24px', fontSize: '16px' }}>💾 Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;