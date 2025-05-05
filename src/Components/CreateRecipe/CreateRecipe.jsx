import React, { useState } from "react";
import axios from "axios";
import "./CreateRecipe.css";
import { Navigate } from "react-router-dom";

const CreateRecipe = () => {
  const [title, setTitle] = useState("");
  const [foodType, setFoodType] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [foodimage, setFoodimage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("FoodType", foodType);
    formData.append("Ingredients", ingredients);
    formData.append("Instructions", instructions);
    if (foodimage) {
      formData.append("Foodimage", foodimage);
    }

    try {
      await axios.post("http://localhost:5214/api/Recipe/Create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setTitle("");
      setFoodType("");
      setIngredients("");
      setInstructions("");
      setFoodimage(null);
    } catch (error) {
      console.error("Recipe creation failed:", error);
      alert("Failed to create recipe. Please try again.");
    }
  };

  return (
    <div className="create-recipe-container">
      <h2>Create New Recipe</h2>
      <form className="recipe-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
  value={foodType}
  onChange={(e) => setFoodType(e.target.value)}
  required
>
  <option value="">Select Food Type</option>
  <option value="Veg">Veg</option>
  <option value="Non Veg">Non Veg</option>
  <option value="Vegan">Vegan</option>
</select>

        <textarea
          placeholder="Ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFoodimage(e.target.files[0])}
        />

        <button type="submit" className="save-btn">Save</button>
      </form>

      {success && (
        <div className="success-popup">
          <p>✅ Recipe created successfully!</p>
          <Navigate to="/MyRecipe" />
          <button onClick={() => setSuccess(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CreateRecipe;
