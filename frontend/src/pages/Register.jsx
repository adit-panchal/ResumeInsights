import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        username: username,
        email: email,
        password: password,
        birth_date: birthDate,
      });
      if (response.data.success) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h2>Register</h2>
        {error && (
          <div style={{ color: "red", textAlign: "center" }}>{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="birth_date">Birth Date</label>
            <input
              type="date"
              id="birth_date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                background: "#333",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "5px",
              }}
              required
            />
          </div>
          <div className="action-links">
            <Link to="/login" className="action-link">
              Already have an account? Login
            </Link>
          </div>
          <button type="submit" className="login-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
