import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DeleteAccount.css";

const DeleteAccount = () => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      // Get email from token or use a stored user email if available
      const email = localStorage.getItem("email"); // Optional if stored previously
      if (!email) {
        alert("Email not found.");
        return;
      }

      await axios.delete(`http://localhost:5214/api/Auth/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Account deleted successfully.");
      localStorage.clear(); 
      navigate("/register"); 
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account.");
    }
  };

  const handleCancel = () => {
    navigate("/UserDetails"); 
  };

  return (
    <div className="delete-account-container">
      <div className="delete-confirmation-box">
        <h2>Are you sure?</h2>
        <p>Do you really want to delete your account? This action cannot be undone.</p>
        <div className="delete-buttons">
          <button className="yes-btn" onClick={handleDelete}>Yes</button>
          <button className="no-btn" onClick={handleCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
