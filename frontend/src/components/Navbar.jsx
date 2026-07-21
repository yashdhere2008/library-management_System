function Navbar({ unreadCount }) {
  return (
    <nav
      style={{
        borderRadius: '24px',
        background: '#ffffff',
        border: '1px solid #dbeafe',
        padding: '22px 26px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '18px',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, #2563eb 0%, #93c5fd 100%)',
            color: 'white',
            fontWeight: 800,
          }}
        >
          N
        </div>
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>Notification Center</div>
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Manage all notifications here</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ color: '#475569', fontWeight: 600 }}>Home</div>
        <div style={{ color: '#475569', fontWeight: 600 }}>Dashboard</div>
        <div
          style={{
            padding: '10px 16px',
            borderRadius: '999px',
            background: '#eff6ff',
            color: '#1d4ed8',
            fontWeight: 700,
          }}
        >
          🔔 Notifications ({unreadCount})
        </div>
        <div style={{ color: '#475569', fontWeight: 600 }}>Profile</div>
      </div>
    </nav>
  )
}

export default Navbar
