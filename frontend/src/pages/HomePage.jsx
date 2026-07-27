function HomePage({ onGetStarted }) {
  const styles = {
    root: {
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage:
        'url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#fff',
      textAlign: 'center',
      overflow: 'hidden',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
    },
    content: {
      position: 'relative',
      zIndex: 1,
      padding: '2rem',
      maxWidth: '720px',
    },
    heading: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      marginBottom: '1rem',
    },
    text: {
      fontSize: '1.25rem',
      margin: '1rem 0',
    },
    button: {
      marginTop: '2rem',
      padding: '1rem 2rem',
      fontSize: '1.1rem',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      background: '#007bff',
      color: '#fff',
    },
  }

  return (
    <div style={styles.root}>
      <div style={styles.overlay} />
      <div style={styles.content}>
        <h1 style={styles.heading}>Library Management System</h1>
        <p style={styles.text}>Welcome to Digital Library</p>
        <button type="button" style={styles.button} onClick={onGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  )
}

export default HomePage;
