using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using RecipeWithAuth.Data;
using RecipeWithAuth.Models;
using Microsoft.EntityFrameworkCore;


namespace RecipeWithAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RatingController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("{recipeId}")]
        [Authorize]
        public async Task<IActionResult> RateRecipe(int recipeId, [FromBody] RatingDto rating)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var exists = await _context.RecipesDetails.AnyAsync(r => r.Id == recipeId);
            if (!exists)
                return NotFound("Recipe not found.");

            var ratingEntity = new Rating
            {
                Value = rating.Value,
                RecipeId = recipeId,
                UserId = userIdClaim
            };

            _context.Ratings.Add(ratingEntity);
            await _context.SaveChangesAsync();

            return Ok("Rating submitted");
        }

        [HttpGet("{recipeId}")]
        public async Task<IActionResult> GetRatings(int recipeId)
        {
            var recipeExists = await _context.RecipesDetails.AnyAsync(r => r.Id == recipeId);
            if (!recipeExists)
                return NotFound("Recipe not found.");

            var ratings = await _context.Ratings
                .Where(r => r.RecipeId == recipeId)
                .Select(r => new
                {
                    r.Value,
                    r.UserId
                })
                .ToListAsync();
            if (!ratings.Any())
            {
                return NotFound();
            }

            var average = ratings.Average(r => r.Value);

            var response = new RatingResponse
            {
                AverageRating = average,
                Ratings = ratings.Select(r => new RatingDto
                {
                    UserId = r.UserId,
                    Value = r.Value
                }).ToList()
            };

            return Ok(response);
        }
    }
}