import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './libraryportal.css';

const LibraryPortal = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (!email) {
      alert('Please enter your college email address');
      return;
    }

    const roleKey = role === 'Admin' ? 'admin' : role === 'Librarian' ? 'librarian' : 'student';
    navigate('/login', { state: { role: roleKey, email } });
  };

  return (
    <div className="library-portal">
      <div className="bookshelf-bg">
        <div className="content-container">
          <div className="left-panel">
            <div className="quick-tips">College Library • Digital Access</div>
            <h1 className="main-title">
              I Love Library
            </h1>
            <p className="description">
              A modern campus library platform for students, librarians, and administrators to manage borrowing,
              returns, catalog access, and academic resources in one seamless experience.
            </p>
            <div className="feature-list">
              <div>• Real-time issue and return tracking</div>
              <div>• Smart catalog and search experience</div>
              <div>• Role-based access for college staff and students</div>
            </div>
          </div>

          <div className="login-card">
            <div className="card-badge">Secure College Access</div>
            <h2 className="card-title">Choose your portal</h2>
            <div className="input-group">
              <label>Your College Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-buttons">
              <button className="btn btn-student" onClick={() => handleLogin('Student')}>
                Student Login
              </button>
              <button className="btn btn-librarian" onClick={() => handleLogin('Librarian')}>
                Librarian Login
              </button>
              <button className="btn btn-admin" onClick={() => handleLogin('Admin')}>
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPortal;