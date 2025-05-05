using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace RecipeWithAuth.Models
{
    public class RatingResponse
    {
        public double AverageRating { get; set; }
        public List<RatingDto> Ratings { get; set; }
    }
   
}
