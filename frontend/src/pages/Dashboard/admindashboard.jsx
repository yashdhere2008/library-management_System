import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatQuery, setChatQuery] = useState('');
  const [chatMsg, setChatMsg] = useState('');

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

  return (
    <div className="dashboard-container dashboard-admin">
      <div className="sidebar">
        <h2>🏛️ Admin</h2>
        <a className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>🏠 Dashboard</a>
        <a className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>👥 Manage Users</a>
        <a className={activeTab === 'librarians' ? 'active' : ''} onClick={() => setActiveTab('librarians')}>👩‍💼 Manage Librarians</a>
        <a className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>📚 All Books</a>
        <a className={activeTab === 'transactions' ? 'active' : ''} onClick={() => setActiveTab('transactions')}>📋 Transactions</a>
        <a className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>📊 Reports</a>
        <a className={activeTab === 'logs' ? 'active' : ''} onClick={() => setActiveTab('logs')}>📜 Activity Logs</a>
        <a className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>⚙ Settings</a>
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
        {activeTab === 'dashboard' && (
          <div>
            <h1>Admin Dashboard</h1>
            <div className="cards">
              <div className="card"><h3>Total Users</h3><h1>9</h1></div>
              <div className="card"><h3>Total Books</h3><h1>7</h1></div>
              <div className="card"><h3>Issued Books</h3><h1>17</h1></div>
              <div className="card"><h3>Pending Fines</h3><h1>₹40</h1></div>
            </div>
            <div className="cards" style={{ marginTop: '15px' }}>
              <div className="card"><h3>Students</h3><h1>6</h1></div>
              <div className="card"><h3>Librarians</h3><h1>4</h1></div>
              <div className="card"><h3>Overdue Books</h3><h1>2</h1></div>
              <div className="card"><h3>Today's Issues</h3><h1>2</h1></div>
            </div>
            
            <h2>Quick Actions</h2>
            <div className="cards" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('users')}>
                <h3>➕ Add New User</h3>
                <p style={{ color: '#333' }}>Register students or librarians</p>
              </div>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('librarians')}>
                <h3>👩‍💼 Manage Staff</h3>
                <p style={{ color: '#333' }}>Add/remove librarians</p>
              </div>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('reports')}>
                <h3>📊 View Reports</h3>
                <p style={{ color: '#333' }}>See system analytics</p>
              </div>
            </div>
            
            <h2>Recent System Activity</h2>
            <table>
              <thead>
                <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Status</th></tr>
              </thead>
              <tbody>
                <tr><td>2024-01-15 10:30</td><td>Priya Nair (Librarian)</td><td>Issued "Java Programming" to Praniti</td><td><span className="badge badge-green">Success</span></td></tr>
                <tr><td>2024-01-14 16:20</td><td>Sneha Joshi (Student)</td><td>Requested "Python Basics"</td><td><span className="badge badge-yellow">Pending</span></td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="section-title"><h1>👥 Manage Users</h1></div>
            <table id="userTable">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr><td>Praniti Shinde</td><td>praniti@college.edu</td><td>Student</td><td>Computer Science</td><td><span className="badge badge-green">Active</span></td><td><button>Suspend</button></td></tr>
              </tbody>
            </table>
          </div>
        )}

        {/* You can expand the other tabs fully based on your need */}
        {activeTab === 'librarians' && (
          <div>
            <div className="section-title"><h1>👩‍💼 Manage Librarians</h1></div>
            <table id="libTable">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Employee ID</th><th>Shift</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr><td>Priya Nair</td><td>priya.nair@library.edu</td><td>LIB001</td><td>Morning</td><td><button className="reject">Remove</button></td></tr>
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'books' && (
          <div>
            <div className="section-title"><h1>📚 All Books in Library</h1></div>
            <table>
              <thead>
                <tr><th>Book</th><th>Author</th><th>Total Qty</th><th>Available</th></tr>
              </thead>
              <tbody>
                <tr><td>Java Programming</td><td>James Gosling</td><td>10</td><td>6</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h1>📊 System Reports</h1>
            <div className="cards">
              <div className="card"><h3>Books Circulated</h3><h1>2,140</h1></div>
              <div className="card"><h3>Revenue from Fines</h3><h1>₹3,250</h1></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;