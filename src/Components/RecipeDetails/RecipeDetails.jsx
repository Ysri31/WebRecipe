import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "./RecipeDetails.css";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`http://localhost:5214/api/Recipe/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleRatingSubmit = async () => {
    setIsSubmitting(true);
    setRatingMessage("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5214/api/Rating/${id}`,
        { value: ratingValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRatingMessage("Rating submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      setRatingMessage("Failed to submit rating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {!recipe ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="recipe-details-container">
          <h1 className="recipe-title">{recipe.title}</h1>
          <img
            src={recipe.foodimage}
            alt={recipe.title}
            className="recipe-image"
          />
          <p className="recipe-detail">
            <strong>Food Type:</strong> {recipe.foodType}
          </p>
          <p className="recipe-detail">
            <strong>Ingredients:</strong> {recipe.ingredients}
          </p>
          <p className="recipe-instructions">
            <strong>Instructions:</strong> {recipe.instructions}
          </p>

          {/* Star Rating Section */}
          <div className="rating-section">
            <label><strong>Rate this recipe:</strong></label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((val) => (
                <FaStar
                  key={val}
                  size={30}
                  color={(hoverValue || ratingValue) >= val ? "#ffc107" : "#e4e5e9"}
                  onMouseEnter={() => setHoverValue(val)}
                  onMouseLeave={() => setHoverValue(0)}
                  onClick={() => setRatingValue(val)}
                  style={{ cursor: "pointer", transition: "color 0.2s" }}
                />
              ))}
            </div>
            <button onClick={handleRatingSubmit} disabled={isSubmitting || ratingValue === 0}>
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </button>
            {ratingMessage && <p className="rating-message">{ratingMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
