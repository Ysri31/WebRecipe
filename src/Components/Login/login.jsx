import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // For navigation
import "./login.css";  // Optional: If you have custom styles

const Login = () => {
  const navigate = useNavigate();  // For redirecting to Register page

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5214/api/Auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      alert("Login successful!");

      localStorage.setItem("token", token);  // Store token in local storage
      localStorage.setItem("email", email);
      // Redirect to home/dashboard or wherever needed
      navigate("/UserDetails"); // Example
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Button to navigate to Register page */}
      <button onClick={() => navigate("/register")} style={{ marginTop: "10px" }}>
        Not registered? Register
      </button>
    </div>
  );
};

export default Login;
