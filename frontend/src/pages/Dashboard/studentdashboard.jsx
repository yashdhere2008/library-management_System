import '../Dashboard/dashboard.css';

function StudentDashboard() {
  return (
    <div className="dashboard-shell">
      <div className="dashboard-card" style={{ padding: 24 }}>
        <div className="dashboard-header">
          <div>
            <div className="brand-mark">
              <span>📚</span>
              <span>I Love Library</span>
            </div>
            <h1 style={{ margin: '8px 0 0', fontSize: '1.8rem' }}>Student Dashboard</h1>
          </div>
          <div className="live-pill">
            <span className="dot" />
            Live circulation
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-label">Books Borrowed</div>
            <div className="stat-value">4</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Due Soon</div>
            <div className="stat-value">2</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Fines</div>
            <div className="stat-value">₹0</div>
          </div>
        </div>

        <div className="quick-actions">
          <button className="quick-btn">Search Books</button>
          <button className="quick-btn secondary">My Borrowed Books</button>
          <button className="quick-btn secondary">Fine Details</button>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card section-card">
            <div className="section-title">Current Activity</div>
            <div className="list-item">
              <span>Computer Networks - Issued</span>
              <span className="badge">Due 12 Aug</span>
            </div>
            <div className="list-item">
              <span>Operating Systems - Renewed</span>
              <span className="badge">Due 18 Aug</span>
            </div>
            <div className="list-item">
              <span>Data Structures - Returned</span>
              <span className="badge">Completed</span>
            </div>
          </div>

          <div className="dashboard-card section-card">
            <div className="section-title">Quick Notes</div>
            <p style={{ lineHeight: 1.7, color: '#475569' }}>
              Your library account is active. You can request new books, renew borrowed items, and review your account status anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;