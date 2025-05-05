import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditAccount.css"; // Create and style as needed

const EditAccount = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5214/api/Auth/UserDetails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserName(response.data.userName);
        setPhoneNumber(response.data.phoneNumber);
        localStorage.setItem("email", response.data.email); 
      } catch (err) {
        console.error("Failed to fetch user details", err);
        alert("Session expired or unauthorized");
        navigate("/login");
      }
    };

    fetchUserDetails();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      const patchData = [
        { op: "replace", path: "/userName", value: userName },
        { op: "replace", path: "/phoneNumber", value: phoneNumber },
      ];

      await axios.patch(`http://localhost:5214/api/Auth/${email}`, patchData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json-patch+json",
        },
      });

      alert("User details updated successfully!");
      navigate("/UserDetails");
    } catch (err){
      console.error("Failed to update user", err);
      alert(err.response.data.message);
    }
  };

  return (
    <div className="edit-account-container">
      <h2>Edit Account</h2>
      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <button className="save-btn" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default EditAccount;
