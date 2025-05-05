import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserDetails.css";

const UserDetails = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); //getting the token from local storage
        const response = await axios.get("http://localhost:5214/api/Auth/UserDetails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        //sending the token in the header to get the user details

        const { userName, email, phoneNumber } = response.data; //destructuring the response data
        setUsername(userName);
        setEmail(email);
        setPhoneNumber(phoneNumber);
        //setting the state with the response data
      } catch (err) {
        console.error("Failed to fetch user", err);
        alert("Unauthorized or failed to fetch user.");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <>
       <nav className="navbar">
       <button className="logout-button" onClick={() => navigate("/logout")}>Logout</button>

        <ul>
          <li onClick={() => navigate("/MyRecipe")}>My Recipes</li>
          <li onClick={() => navigate("/CreateRecipe")}>Create Recipe</li>
          <li onClick={() => navigate("/AllRecipe")}>All Recipes</li>
          <li onClick={() => navigate("/EditAccount")}>Edit Account</li>
          <li onClick={() => navigate("/DeleteAccount")}>Delete Account</li>
        </ul>
      </nav>

      <div className="user-details-container">
        <h2>User Details</h2>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone Number:</strong> {phoneNumber}</p>
      </div>
    </>
  );
};

export default UserDetails;
