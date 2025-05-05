import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // For navigation
import "./register.css";  // Optional: If you have custom styles

const Register = () => {
  const navigate = useNavigate();  // For redirecting back to Login page

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");  // Reset any previous errors

    const registerData = {
      email,
      userName: username,
      phoneNumber,
      password,
    };

    try {
      const response = await axios.post("http://localhost:5214/api/Auth/register", registerData);
      alert(response.data.message);

      
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"//
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* Button to navigate to Login page */}
      <button onClick={() => navigate("/login")} style={{ marginTop: "10px" }}>
        Already registered? Login
      </button>
    </div>
  );
};

export default Register;
