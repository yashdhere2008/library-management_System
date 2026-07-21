import { useState } from 'react'

function NotificationForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('success')
  const [failureScenario, setFailureScenario] = useState('none')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) return

    onAdd({ title, message, type, failureScenario })
    setTitle('')
    setMessage('')
    setType('success')
    setFailureScenario('none')
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        borderRadius: '24px',
        padding: '24px',
        background: '#ffffff',
        border: '1px solid #dbeafe',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.05)',
        display: 'grid',
        gap: '16px',
      }}
    >
      <div>
        <div style={{ marginBottom: '8px', fontWeight: 700 }}>Add Notification</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={{ width: '100%', padding: '16px 18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}
        />
      </div>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          style={{ width: '100%', minHeight: '120px', padding: '16px 18px', borderRadius: '16px', border: '1px solid #e2e8f0', resize: 'vertical' }}
        />
      </div>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ width: '100%', padding: '16px 18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}
      >
        <option value="success">Success</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
        <option value="info">Info</option>
      </select>
      <select
        value={failureScenario}
        onChange={(e) => setFailureScenario(e.target.value)}
        style={{ width: '100%', padding: '16px 18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}
      >
        <option value="none">Normal action</option>
        <option value="method">Method failed</option>
        <option value="payment">Payment failed</option>
      </select>
      <button
        type="submit"
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '18px',
          padding: '16px 20px',
          cursor: 'pointer',
          fontWeight: 700,
          boxShadow: '0 16px 32px rgba(37, 99, 235, 0.22)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 20px 36px rgba(37, 99, 235, 0.28)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 16px 32px rgba(37, 99, 235, 0.22)'
        }}
      >
        Add Notification
      </button>
    </form>
  )
}

export default NotificationForm
