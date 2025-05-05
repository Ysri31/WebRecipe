import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/login';
import Register from './Components/register/register';
import UserDetails from './Components/UserDetails/UserDetails';
import DeleteAccount from './Components/DeleteAccount/DeleteAccount';
import EditAccount from './Components/EditAccount/EditAccount'; 
import CreateRecipe from './Components/CreateRecipe/CreateRecipe';
import MyRecipe from './Components/MyRecipe/MyRecipe';
import RecipeDetails from './Components/RecipeDetails/RecipeDetails';
import AllRecipe from './Components/AllRecipe/AllRecipe';
import Logout from './Components/logout/logout';

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/UserDetails" element={<UserDetails />} />
        <Route path="/DeleteAccount" element={<DeleteAccount />} />
        <Route path="/EditAccount" element={<EditAccount />} /> 
        <Route path="/CreateRecipe" element={<CreateRecipe />} /> 
        <Route path="/MyRecipe" element={<MyRecipe />} />
        <Route path="/Recipe/:id" element={<RecipeDetails />} />
        <Route path="/AllRecipe" element={<AllRecipe />} />
        <Route path="/logout" element={<Logout/>} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
