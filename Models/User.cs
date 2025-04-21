
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using RecipeWithAuth.Models;

namespace RecipeWithAuth.Models
{
    public class User: IdentityUser
    {
        public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    }
}