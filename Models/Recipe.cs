using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecipeWithAuth.Models
{
    public class CreateRecipeDto
    {
        [Required] public string Title { get; set; }
        [Required] public string FoodType { get; set; }
        [Required] public string Ingredients { get; set; }
        [Required] public string Instructions { get; set; }
         public IFormFile? Foodimage { get; set; }
       
    }

    public class UpdateRecipeDto
    {
        [Required] public string Title { get; set; }
        [Required] public string FoodType { get; set; } = "veg";
        [Required] public string Ingredients { get; set; }
        [Required] public string Instructions { get; set; }

    }

    public class Recipe
    {
        public int Id { get; set; }
        [Required] public string Title { get; set; }
        [Required] public string FoodType { get; set; } = "Veg";
        [Required] public string Ingredients { get; set; }
        [Required] public string Instructions { get; set; }
         public string? Foodimage { get; set; }
        [Required] public string UserId { get; set; }
        [ForeignKey("UserId")] public User User { get; set; }
    }
}
