function StudentLoginPage({ onLogin }) {
  const styles = {
    root: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#0f172a',
      padding: '1rem',
    },
    login: {
      width: '100%',
      maxWidth: '350px',
      background: '#fff',
      padding: '30px',
      borderRadius: '20px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
    },
    heading: {
      margin: 0,
      marginBottom: '1rem',
      textAlign: 'center',
      color: '#111827',
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '15px 0',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '1rem',
      outline: 'none',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '12px',
      background: '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
    },
  }

  return (
    <div style={styles.root}>
      <div style={styles.login}>
        <h2 style={styles.heading}>Student Login</h2>
        <input type="text" placeholder="Roll Number" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />
        <button type="button" style={styles.button} onClick={onLogin}>
          Login
        </button>
      </div>
    </div>
  )
}

export default StudentLoginPage;
