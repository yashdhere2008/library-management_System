import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please complete all login fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/api/auth/login", {
        email,
        password,
        role,
      });

      if (response.data.success) {
        const userData = response.data.user;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        login(userData);

        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else if (userData.role === "librarian") {
          navigate("/librarian-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill in all registration fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      if (response.data) {
        setMessage("Account created. Please login with your new details.");
        setMode("login");
        setName("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-hero">
          <div className="auth-brand">
            <div className="auth-brand-icon">📚</div>
            <div>
              <div style={{ fontSize: "0.95rem", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.9 }}>
                I Love Library
              </div>
              <h1 className="auth-hero-title">College library access. Simplified.</h1>
            </div>
          </div>
          <p className="auth-hero-text">
            Access your campus catalog, request books, and manage circulation with a real college library workflow.
            Register once and sign in securely to continue.
          </p>
        </div>

        <div className="auth-form">
          <div className="auth-toggle">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              Login
            </button>
            <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
              Register
            </button>
          </div>

          {message && <div className="auth-alert">{message}</div>}

          <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
            {mode === "register" && (
              <div className="auth-input-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
              </div>
            )}

            <div className="auth-input-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@college.edu" />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {mode === "register" && (
              <div className="auth-input-group">
                <label>Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <div className="auth-input-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="librarian">Librarian</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Processing..." : mode === "login" ? "Log In" : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            {mode === "login" ? (
              <>Need a new account? <button type="button" onClick={() => setMode("register")}>Register here</button></>
            ) : (
              <>Already registered? <button type="button" onClick={() => setMode("login")}>Login here</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;