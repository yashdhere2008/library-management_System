function UserTypePage({ onSelect }) {
  const styles = {
    root: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5',
      padding: '1rem',
    },
    container: {
      display: 'flex',
      gap: '40px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      width: '250px',
      minHeight: '300px',
      background: '#fff',
      borderRadius: '20px',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'transform .3s ease, background .3s ease, color .3s ease',
      cursor: 'pointer',
      border: '1px solid rgba(0, 0, 0, 0.08)',
    },
    cardHover: {
      transform: 'translateY(-10px)',
      background: '#007bff',
      color: '#fff',
    },
    icon: {
      width: '80px',
      marginBottom: '1rem',
    },
    title: {
      margin: 0,
      fontSize: '1.4rem',
    },
  }

  const cardData = [
    {
      label: 'Student',
      icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135755.png',
      value: 'student',
    },
    {
      label: 'Admin',
      icon: 'https://cdn-icons-png.flaticon.com/512/2206/2206368.png',
      value: 'admin',
    },
    {
      label: 'Librarian',
      icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png',
      value: 'librarian',
    },
  ]

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        {cardData.map((card) => (
          <button
            key={card.value}
            type="button"
            onClick={() => onSelect(card.value)}
            style={{
              ...styles.card,
              ...(false ? styles.cardHover : {}),
            }}
          >
            <img src={card.icon} alt={card.label} style={styles.icon} />
            <h2 style={styles.title}>{card.label}</h2>
          </button>
        ))}
      </div>
    </div>
  )
}

export default UserTypePage;
