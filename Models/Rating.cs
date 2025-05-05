using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RecipeWithAuth.Models
{
    public class RatingDto
    {
        [Required][Range(1, 5)] public int Value { get; set; }
        public string? UserId { get; set; }
    }
    
    public class Rating
    {
        public int Id { get; set; }

        [Required][Range(1, 5)] public int Value { get; set; }

        [Required] public int RecipeId { get; set; }

        [ForeignKey("RecipeId")] public Recipe Recipe { get; set; }

        [Required] public string UserId { get; set; }

        [ForeignKey("UserId")] public User User { get; set; }

    }
}
