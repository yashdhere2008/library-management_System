import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPath } from "../../lib/roleRoutes";
import "./login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [retried, setRetried] = useState(false);

  const submitLogin = async () => {
    setMessage("");

    if (!role || !email || !password) {
      setMessage("⚠ Please fill all fields!");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/api/auth/login", {
        email,
        password,
        role: role.toLowerCase(),
      });

      if (response.data.success) {
        setMessage("✅ Login successfully");
        const userData = response.data.user;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        login(userData);

        // Small delay to allow AuthContext to update before ProtectedRoute checks
        setTimeout(() => {
          navigate(getDashboardPath(userData.role));
        }, 50);
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || "Login failed. Please try again.";
      setMessage("⚠ " + serverMsg);

      // If server suggests the expected role, auto-select it and retry once
      const expected = err.response?.data?.expectedRole;
      if (expected && !retried) {
        setRole(expected);
        setRetried(true);
        setTimeout(() => submitLogin(), 200);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setRetried(false);
    submitLogin();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name || !email || !password || !role) {
      setMessage("⚠ Please fill all registration fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/api/auth/register", {
        name,
        email,
        password,
        role: role.toLowerCase(),
      });

      if (response.data) {
        setMessage("✅ Account Created Successfully!");
        setTimeout(() => {
          setMode("login");
          setMessage("");
        }, 1500);
      }
    } catch (err) {
      setMessage("⚠ " + (err.response?.data?.message || "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setMessage("📧 Password Reset Link Sent!");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* LOGIN */}
        <div className={`form ${mode === "login" ? "active" : ""}`}>
          <h2>I ❤️ Library </h2>
          <p className="subtitle">Login to continue...</p>

          <div className="input-box">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
            </select>
          </div>

          <div className="input-box">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <button onClick={handleLogin}>
            {loading ? "Processing..." : "Login"}
          </button>

          <div className="links">
            <a onClick={() => { setMode("register"); setMessage(""); }}>
              Create Account
            </a>{" "}
            |{" "}
            <a onClick={() => { setMode("forgot"); setMessage(""); }}>
              Forgot Password?
            </a>
          </div>

          <div
            className="message"
            style={{ color: message.startsWith("⚠") ? "salmon" : "lightgreen" }}
          >
            {message}
          </div>
        </div>

        {/* REGISTER */}
        <div className={`form ${mode === "register" ? "active" : ""}`}>
          <h2>Create Account</h2>

          <div className="input-box">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
          </div>

          <div className="input-box">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <div className="input-box">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
            </select>
          </div>

          <div className="input-box">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <button onClick={handleRegister}>
            {loading ? "Processing..." : "Register"}
          </button>

          <div className="links">
            <a onClick={() => { setMode("login"); setMessage(""); }}>
              Back to Login
            </a>
          </div>

          <div
            className="message"
            style={{ color: message.startsWith("⚠") ? "salmon" : "lightgreen" }}
          >
            {message}
          </div>
        </div>

        {/* FORGOT PASSWORD */}
        <div className={`form ${mode === "forgot" ? "active" : ""}`}>
          <h2>Forgot Password</h2>

          <div className="input-box">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <button onClick={handleResetPassword}>Reset Password</button>

          <div className="links">
            <a onClick={() => { setMode("login"); setMessage(""); }}>
              Back to Login
            </a>
          </div>

          <div
            className="message"
            style={{ color: message.startsWith("⚠") ? "salmon" : "lightgreen" }}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;