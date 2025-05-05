import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./MyRecipe.css";

const MyRecipe = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5214/api/Recipe/MyRecipes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5214/api/Recipe/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI after deletion
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div className="my-recipes-container">
      <h2 className="my-recipes-heading">My Recipes</h2>
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img
             src={recipe.foodimage}
              alt={recipe.title}
              className="recipe-image"
            />
            <Link to={`/Recipe/${recipe.id}`} className="recipe-title">
              {recipe.title}
            </Link>
            <button
              className="delete-button"
              onClick={() => handleDelete(recipe.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRecipe;


  