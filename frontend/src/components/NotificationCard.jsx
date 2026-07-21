function NotificationCard({ notification, onToggleRead, onDelete }) {
  const badgeColors = {
    success: '#dcfce7',
    warning: '#fef3c7',
    error: '#fee2e2',
    info: '#dbeafe',
  }

  const textColors = {
    success: '#166534',
    warning: '#78350f',
    error: '#991b1b',
    info: '#1d4ed8',
  }

  return (
    <article
      style={{
        background: notification.isRead ? '#ffffff' : '#eff6ff',
        borderRadius: '22px',
        padding: '22px',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.06)',
        border: '1px solid #e2e8f0',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div
            style={{
              fontSize: '1rem',
              fontWeight: notification.isRead ? 600 : 800,
              marginBottom: '10px',
            }}
          >
            {notification.title}
          </div>
          <div style={{ color: '#475569', marginBottom: '14px' }}>{notification.message}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '999px',
              background: badgeColors[notification.type],
              color: textColors[notification.type],
              padding: '10px 14px',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
          </span>
          <span
            style={{
              borderRadius: '999px',
              background: notification.isRead ? '#e2e8f0' : '#2563eb',
              color: notification.isRead ? '#475569' : 'white',
              padding: '10px 14px',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            {notification.isRead ? 'Read' : 'Unread'}
          </span>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '16px',
          color: '#64748b',
          fontSize: '0.95rem',
        }}
      >
        <span>{new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        <span>{notification.isRead ? 'Seen' : 'New'}</span>
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '18px' }}>
        <button
          type="button"
          onClick={onToggleRead}
          style={{
            background: notification.isRead ? '#f8fafc' : '#2563eb',
            color: notification.isRead ? '#475569' : 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '12px 18px',
            cursor: 'pointer',
          }}
        >
          {notification.isRead ? 'Mark as Unread' : 'Mark as Read'}
        </button>
        <button
          type="button"
          onClick={onDelete}
          style={{
            background: 'white',
            color: '#dc2626',
            border: '1px solid rgba(220, 38, 38, 0.18)',
            borderRadius: '16px',
            padding: '12px 18px',
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default NotificationCard
