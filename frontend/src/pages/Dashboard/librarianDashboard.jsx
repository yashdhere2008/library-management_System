import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';

const LibrarianDashboard = () => {
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
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>👩‍🏫 Librarian</h2>
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
            <h1>Librarian Dashboard</h1>
            <div className="cards">
              <div className="card"><h3>Total Books</h3><h1>7</h1></div>
              <div className="card"><h3>Students</h3><h1>6</h1></div>
              <div className="card"><h3>Issued</h3><h1>17</h1></div>
              <div className="card"><h3>Pending</h3><h1>2</h1></div>
            </div>
            
            <h2>Pending Requests</h2>
            <table>
              <thead>
                <tr><th>Student</th><th>Book</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Praniti Shinde</td><td>Java Programming</td>
                  <td><button>Approve</button> <button className="reject">Reject</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'books' && (
          <div>
            <h1>Manage Books</h1>
            <table>
              <thead>
                <tr><th>Book</th><th>Author</th><th>Quantity</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Java Programming</td><td>James Gosling</td><td>10</td>
                  <td><button>Edit</button> <button className="reject">Delete</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'addbook' && (
          <div>
            <h1>Add Book</h1>
            <form style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="form-group"><label>Book Title</label><input type="text" /></div>
              <div className="form-group"><label>Author</label><input type="text" /></div>
              <button>Save Book</button>
            </form>
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <h1>Requests</h1>
            <table>
              <thead>
                <tr><th>Student</th><th>Book</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Neha Patil</td><td>Web Development</td><td>Pending</td>
                  <td><button>Approve</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarianDashboard;