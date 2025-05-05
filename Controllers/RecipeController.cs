using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RecipeWithAuth.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using RecipeWithAuth.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.JsonPatch;
using Newtonsoft.Json;



namespace RecipeWithAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RecipeController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("AllRecipe")]
        public async Task<IActionResult> AllRecipe([FromQuery] string? foodType)
        {
            IQueryable<Recipe> query = _context.RecipesDetails;

            if (!string.IsNullOrEmpty(foodType))
            {
                query = query.Where(r => r.FoodType.ToLower() == foodType.ToLower()); 
            }

            var recipes = await query.ToListAsync();
            return Ok(recipes);
        }


        [HttpPost("Create")]
        [Authorize]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateRecipe([FromForm] CreateRecipeDto recipe)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();


            string imagePath = null;
            if (recipe.Foodimage != null && recipe.Foodimage.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(recipe.Foodimage.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await recipe.Foodimage.CopyToAsync(stream);
                }

                imagePath = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";

            }

            var recipes = new Recipe
            {
                Title = recipe.Title,
                FoodType = recipe.FoodType,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                UserId = userIdClaim,
                Foodimage = imagePath
            };
            Console.WriteLine($"Image: {recipe.Foodimage?.FileName}");
            _context.RecipesDetails.Add(recipes);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRecipeById), new { id = recipes.Id }, recipe);
        }
        
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetRecipeById(int id)
        {
            var recipe = await _context.RecipesDetails.FirstOrDefaultAsync(r => r.Id == id);
            if (recipe == null)
                return NotFound();

            return Ok(recipe);
        }

        [HttpGet("MyRecipes")]
        [Authorize]
        public async Task<IActionResult> MyRecipes()
        {

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID not found in token.");

            var userRecipes = await _context.RecipesDetails
                .Where(r => r.UserId == userIdClaim)
                .ToListAsync();

            return Ok(userRecipes);
        }
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var recipe = await _context.RecipesDetails.FirstOrDefaultAsync(r => r.Id == id);
            if (recipe == null)
            {
                return NotFound();
            }

            if (recipe.UserId != userIdClaim)
            {
                return Forbid("Denied");
            }

            if (!string.IsNullOrEmpty(recipe.Foodimage))
            {
                var ImagePath = Path.Combine(Directory.GetCurrentDirectory(), recipe.Foodimage.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                if (System.IO.File.Exists(ImagePath))
                {
                    System.IO.File.Delete(ImagePath);
                }
            }

            _context.RecipesDetails.Remove(recipe);
            await _context.SaveChangesAsync();

            return Ok("Recipe deleted");
        }

        [HttpPut("{id}")]
        [Authorize]

        public async Task<IActionResult> PutRecipe(int id, [FromBody] UpdateRecipeDto Recipe)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var recipe = await _context.RecipesDetails.FirstOrDefaultAsync(r => r.Id == id);
            if (recipe == null)
            {
                return NotFound();
            }

            if (recipe.UserId != userIdClaim)
            {
                return Forbid("Denied");
            }

            recipe.Title = Recipe.Title ?? recipe.Title;
            recipe.FoodType = Recipe.FoodType ?? recipe.FoodType;
            recipe.Ingredients = Recipe.Ingredients ?? recipe.Ingredients;
            recipe.Instructions = Recipe.Instructions ?? recipe.Instructions;

            await _context.SaveChangesAsync();
            return Ok("Update successfully");

        }
        [HttpPatch("{id}")]
        [Authorize]

        public async Task<IActionResult> UpdateRecipe(int id, [FromBody] JsonPatchDocument<UpdateRecipeDto> PatchRecipe)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine(userIdClaim);
            var recipe = await _context.RecipesDetails.FirstOrDefaultAsync(r => r.Id == id);
            if (recipe == null) 
            { 
                return NotFound();
            }

            if (recipe.UserId != userIdClaim)
            {
                return Forbid("Denied");
            }
            var recipesnapshot = new UpdateRecipeDto
            {
                Title = recipe.Title,
                FoodType = recipe.FoodType,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions
            };

            PatchRecipe.ApplyTo(recipesnapshot);

            recipe.Title = recipesnapshot.Title ?? recipe.Title;
            recipe.FoodType = recipesnapshot.FoodType ?? recipe.FoodType;
            recipe.Ingredients = recipesnapshot.Ingredients ?? recipe.Ingredients;
            recipe.Instructions = recipesnapshot.Instructions ?? recipe.Instructions;
            await _context.SaveChangesAsync();
            return Ok("Update successfully");
        }
        
    }
}