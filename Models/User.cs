
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

    public class UserDetailsDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }

}