import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function LibrarianLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();   // ← Get login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/api/auth/login", {
        email,
        password,
        role: "librarian"
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        login(response.data.user);
        alert("Librarian Login Successful!");
        navigate("/librarian-dashboard");
      }
      
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center", fontFamily: "Arial" }}>
      <h2>👩‍💼 Librarian Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", margin: "10px auto", padding: "10px", width: "80%" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", margin: "10px auto", padding: "10px", width: "80%" }}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: "10px 20px", marginTop: "10px" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LibrarianLogin;