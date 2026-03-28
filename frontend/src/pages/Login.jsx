import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/login", {
        email,
        password
      });

      login(res.data);

      // Role-based redirect
      if (res.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/game");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
  <div className="login-container">
    <h2 className="login-title">Login</h2>

    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />

      <input
        type="password"
        required
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
      />

      <button type="submit" className="login-button">
        Login
      </button>
    </form>

    <p className="login-footer">
      Don’t have an account? <Link to="/register">Register</Link>
    </p>
  </div>
);
};

export default Login;