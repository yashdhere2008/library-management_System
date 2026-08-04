import '../Dashboard/dashboard.css';

function AdminDashboard() {
  return (
    <div className="dashboard-shell">
      <div className="dashboard-card" style={{ padding: 24 }}>
        <div className="dashboard-header">
          <div>
            <div className="brand-mark">
              <span>📚</span>
              <span>I Love Library</span>
            </div>
            <h1 style={{ margin: '8px 0 0', fontSize: '1.8rem' }}>Admin Dashboard</h1>
          </div>
          <div className="live-pill">
            <span className="dot" />
            System online
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-label">Active Users</div>
            <div className="stat-value">342</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Books in Catalog</div>
            <div className="stat-value">1,280</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Overdue Items</div>
            <div className="stat-value">12</div>
          </div>
        </div>

        <div className="quick-actions">
          <button className="quick-btn">Manage Users</button>
          <button className="quick-btn secondary">Manage Librarians</button>
          <button className="quick-btn secondary">Reports</button>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card section-card">
            <div className="section-title">Institution Summary</div>
            <div className="list-item">
              <span>Library membership growth</span>
              <span className="badge">+8.4%</span>
            </div>
            <div className="list-item">
              <span>Most requested subject</span>
              <span className="badge">Computer Science</span>
            </div>
          </div>

          <div className="dashboard-card section-card">
            <div className="section-title">Admin Notes</div>
            <p style={{ lineHeight: 1.7, color: '#475569' }}>
              Maintain policy compliance, monitor circulation trends, and ensure the library remains fully operational for campus users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;