// LibraryPortal.jsx
import React, { useState } from 'react';
import './LibraryPortal.css'; // We'll create this CSS file below

const LibraryPortal = () => {
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('email'); // email or password

  const handleLogin = (role) => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    console.log(`Logging in as ${role} with email: ${email}`);
    // Add your actual login logic here
    alert(`Welcome! ${role} Login initiated for ${email}`);
  };

  return (
    <div className="library-portal">
      {/* Background Bookshelf */}
      <div className="bookshelf-bg">
        {/* Overlay Content Container */}
        <div className="content-container">
          {/* Left Side - Text Content */}
          <div className="left-panel">
            <div className="quick-tips">Quick Tips</div>
            <h1 className="main-title">
              Library<br />
              Management<br />
              Portal.
            </h1>
            <p className="description">
              Our dedicated system streamlines book borrowing, requests, and comprehensive 
              digital catalog access, ensuring a smooth user experience. All resources are 
              organized and available in one place.
            </p>
          </div>

          {/* Right Side - Login Card */}
          <div className="login-card">
            {/* Tab Navigation */}
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'email' ? 'active' : ''}`}
                onClick={() => setActiveTab('email')}
              >
                Email
              </button>
              <button 
                className={`tab ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                Password
              </button>
            </div>

            {/* Email Input */}
            <div className="input-group">
              <label>Your Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Login Buttons */}
            <div className="login-buttons">
              <button 
                className="btn btn-student"
                onClick={() => handleLogin('Student')}
              >
                Student Login
              </button>
              <button 
                className="btn btn-librarian"
                onClick={() => handleLogin('Librarian')}
              >
                Librarian Login
              </button>
              <button 
                className="btn btn-admin"
                onClick={() => handleLogin('Admin')}
              >
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