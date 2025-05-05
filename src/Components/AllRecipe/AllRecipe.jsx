import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AllRecipe.css";

const AllRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [filters, setFilters] = useState({
    veg: false,
    nonveg: false,
    vegan: false,
  });
  const [ratings, setRatings] = useState({}); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:5214/api/Recipe/AllRecipe");
        setRecipes(response.data);
        setFilteredRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes", error);
      }
    };

    fetchRecipes();
  }, []);

  
  useEffect(() => {
    const fetchRatings = async () => {
      const ratingMap = {};

      await Promise.all(
        recipes.map(async (recipe) => {
          try {
            const response = await axios.get(`http://localhost:5214/api/Rating/${recipe.id}`);
            ratingMap[recipe.id] = response.data.averageRating;
          } catch (error) {
            console.error(`Error fetching rating for recipe ${recipe.id}`, error);
            ratingMap[recipe.id] = 0;
          }
        })
      );

      setRatings(ratingMap);
    };

    if (recipes.length > 0) {
      fetchRatings();
    }
  }, [recipes]);

  const handleClick = (id) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/Recipe/${id}`);
    } else {
      navigate("/login");
    }
  };

  const handleFilterChange = (type) => {
    const updatedFilters = {
      ...filters,
      [type]: !filters[type],
    };
    setFilters(updatedFilters);

    const activeTypes = Object.keys(updatedFilters).filter((key) => updatedFilters[key]);

    if (activeTypes.length === 0) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe) =>
        activeTypes.includes(recipe.foodType.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  return (
    <div>
      <div className="filter-section">
        <label>
          <input
            type="checkbox"
            checked={filters["veg"]}
            onChange={() => handleFilterChange("veg")}
          />
          Veg
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters["non veg"]}
            onChange={() => handleFilterChange("non veg")}
          />
          Non Veg
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters["vegan"]}
            onChange={() => handleFilterChange("vegan")}
          />
          Vegan
        </label>
      </div>

      <div className="recipe-list">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card" onClick={() => handleClick(recipe.id)}>
            <img
              src={recipe.foodimage}
              alt={recipe.title}
              className="recipe-thumb"
            />
            <h2 className="recipe-title-link">{recipe.title}</h2>
            <p className="avg-rating">⭐ {ratings[recipe.id] || 0} / 5</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllRecipe;
