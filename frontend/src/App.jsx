import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import StudentLogin from "./pages/login/StudentLogin.jsx";
import LibrarianLogin from "./pages/login/librarianlogin.jsx";

import StudentDashboard from "./pages/Dashboard/studentdashboard.jsx";
import LibrarianDashboard from "./pages/Dashboard/libratianDashboard.jsx";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/librarian-login" element={<LibrarianLogin />} />

          <Route path="/student-dashboard" element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/librarian-dashboard" element={
            <ProtectedRoute allowedRoles={["librarian"]}>
              <LibrarianDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>📚 Library Management System</h1>
      <p><a href="/student-login">Student Login</a> | <a href="/librarian-login">Librarian Login</a></p>
    </div>
  );
}

export default App;