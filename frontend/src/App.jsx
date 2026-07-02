import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage.jsx'
import UserTypePage from './pages/UserTypePage.jsx'
import StudentLoginPage from './pages/StudentLoginPage.jsx'

function App() {
  const [page, setPage] = useState('home')
  const [selectedUser, setSelectedUser] = useState(null)

  const handleGetStarted = () => setPage('userType')
  const handleSelectUser = (type) => {
    setSelectedUser(type)
    if (type === 'student') {
      setPage('studentLogin')
    } else {
      setPage('userType')
      alert(`The ${type} login page is not implemented yet.`)
    }
  }
  const handleLogin = () => setPage('home')

  return (
    <div className="app-root">
      {page === 'home' && <HomePage onGetStarted={handleGetStarted} />}
      {page === 'userType' && <UserTypePage onSelect={handleSelectUser} />}
      {page === 'studentLogin' && <StudentLoginPage onLogin={handleLogin} />}
      {page === 'home' && selectedUser && (
        <div style={{ position: 'fixed', bottom: 16, left: 16 }}>
          Selected: {selectedUser}
        </div>
      )}
    </div>
  )
}

export default App
