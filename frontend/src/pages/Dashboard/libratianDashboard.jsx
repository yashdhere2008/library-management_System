import '../Dashboard/dashboard.css';

function LibrarianDashboard() {
  return (
    <div className="dashboard-shell">
      <div className="dashboard-card" style={{ padding: 24 }}>
        <div className="dashboard-header">
          <div>
            <div className="brand-mark">
              <span>📚</span>
              <span>I Love Library</span>
            </div>
            <h1 style={{ margin: '8px 0 0', fontSize: '1.8rem' }}>Librarian Dashboard</h1>
          </div>
          <div className="live-pill">
            <span className="dot" />
            Active today
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-label">Books Issued</div>
            <div className="stat-value">18</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Returns Pending</div>
            <div className="stat-value">5</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">New Requests</div>
            <div className="stat-value">3</div>
          </div>
        </div>

        <div className="quick-actions">
          <button className="quick-btn">Add Book</button>
          <button className="quick-btn secondary">Issue Book</button>
          <button className="quick-btn secondary">Return Book</button>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card section-card">
            <div className="section-title">Recent Transactions</div>
            <div className="list-item">
              <span>Rahul Kumar • Issued Database Systems</span>
              <span className="badge">Processing</span>
            </div>
            <div className="list-item">
              <span>Asha Mehta • Returned AI Basics</span>
              <span className="badge">Completed</span>
            </div>
          </div>

          <div className="dashboard-card section-card">
            <div className="section-title">Today’s Priority</div>
            <p style={{ lineHeight: 1.7, color: '#475569' }}>
              Review overdue notices, update inventory records, and approve book requests from students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibrarianDashboard;