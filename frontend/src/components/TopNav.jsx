function TopNav({ activePage, unreadCount, onNavigate }) {
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'notifications', label: `Notifications (${unreadCount})` },
    { key: 'profile', label: 'Profile' },
    { key: 'more', label: 'More' },
    { key: 'login', label: 'Student Login' },
    { key: 'userType', label: 'Role Select' },
  ]

  return (
    <header
      style={{
        width: '100%',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, #2563eb 0%, #93c5fd 100%)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1rem',
          }}
        >
          L
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>College Library Portal</div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Students, librarians, and admins can work together online.</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        {navItems.map((item) => {
          const isActive = activePage === item.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              style={{
                borderRadius: '14px',
                border: isActive ? '1px solid #2563eb' : '1px solid transparent',
                background: isActive ? '#eff6ff' : 'transparent',
                color: isActive ? '#1d4ed8' : '#475569',
                fontWeight: 600,
                padding: '10px 16px',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}

export default TopNav
