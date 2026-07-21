import { useEffect, useState } from 'react'

const PROFILE_KEY = 'my-notification-profile'
const defaultProfile = {
  name: 'Your Name',
  email: 'you@example.com',
  role: 'Student',
  bio: 'Write a short bio about yourself.',
}

function ProfilePanel() {
  const [profile, setProfile] = useState(defaultProfile)
  const [form, setForm] = useState(defaultProfile)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setProfile(parsed)
        setForm(parsed)
      } catch (error) {
        setProfile(defaultProfile)
      }
    }
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = (event) => {
    event.preventDefault()
    setProfile(form)
    localStorage.setItem(PROFILE_KEY, JSON.stringify(form))
    setEditing(false)
  }

  const handleCancel = () => {
    setForm(profile)
    setEditing(false)
  }

  return (
    <section
      style={{
        borderRadius: '24px',
        background: '#ffffff',
        border: '1px solid #dbeafe',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.06)',
        padding: '24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>My Profile</h2>
          <p style={{ margin: '8px 0 0', color: '#64748b' }}>Edit your profile information and save it to local storage.</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          style={{
            borderRadius: '16px',
            border: '1px solid #2563eb',
            background: '#2563eb',
            color: 'white',
            padding: '12px 16px',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Edit Profile
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '14px', marginTop: '22px' }}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Name"
            style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Email"
            style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}
            required
          />
          <input
            type="text"
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}
            placeholder="Role"
            style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}
          />
          <textarea
            value={form.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="Bio"
            style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', minHeight: '100px' }}
          />
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              style={{
                borderRadius: '16px',
                border: 'none',
                background: '#2563eb',
                color: 'white',
                padding: '14px 18px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                borderRadius: '16px',
                border: '1px solid #cbd5e1',
                background: 'white',
                color: '#475569',
                padding: '14px 18px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div style={{ display: 'grid', gap: '12px', marginTop: '22px' }}>
          <div style={{ display: 'grid', gap: '4px' }}>
            <span style={{ color: '#64748b', fontSize: '0.92rem' }}>Name</span>
            <strong>{profile.name}</strong>
          </div>
          <div style={{ display: 'grid', gap: '4px' }}>
            <span style={{ color: '#64748b', fontSize: '0.92rem' }}>Email</span>
            <strong>{profile.email}</strong>
          </div>
          <div style={{ display: 'grid', gap: '4px' }}>
            <span style={{ color: '#64748b', fontSize: '0.92rem' }}>Role</span>
            <strong>{profile.role}</strong>
          </div>
          <div style={{ display: 'grid', gap: '4px' }}>
            <span style={{ color: '#64748b', fontSize: '0.92rem' }}>Bio</span>
            <span style={{ color: '#475569' }}>{profile.bio}</span>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProfilePanel
