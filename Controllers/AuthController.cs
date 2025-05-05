using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RecipeWithAuth.Models;
using RecipeWithAuth.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;


namespace RecipeWithAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }
        private string HashPassword(string Password)
        {
            return BCrypt.Net.BCrypt.HashPassword(Password);
        }

        private bool VerifyPassword(string Password, string PasswordHash)
        {
            return BCrypt.Net.BCrypt.Verify(Password, PasswordHash);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new User
            {
                Email = model.Email,
                UserName = model.UserName,
                PhoneNumber = model.PhoneNumber,
                PasswordHash = HashPassword(model.Password)
            };

            if (await IsExist(user.Email, user.UserName))
            {
                return BadRequest(new { message = "User already Exists " });
            }

            _context.UserDetails.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }
        

        private async Task<bool> IsExist(string email, string username)
        {
            return await _context.UserDetails.AnyAsync(u => u.Email == email || u.UserName == username);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.UserDetails.FirstOrDefaultAsync(u => u.Email == model.Email);
            Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(user));
            if (user == null || !VerifyPassword(model.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            var token = GenerateToken(user);
            Console.WriteLine("Token in login" + token);
            return Ok(new LoginResponse { Token = token });
        }

        private string GenerateToken(User user)
        {
            Console.WriteLine("User" + user.UserName);


            var jwtKey = _configuration.GetValue<string>("JWT:SecretKey");
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new Exception("JWT Key is missing in configuration.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes((jwtKey)));

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            foreach (var claim in claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            }

            var jwt = new JwtSecurityToken(
            issuer: _configuration["JWT:Issuer"],
            audience: _configuration["JWT:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

        [HttpGet("UserDetails")]
        [Authorize]
        public async Task<IActionResult> Details()
        {
            var userIdClaims =HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaims))
                return Unauthorized();

            var user = await _context.UserDetails.FindAsync(userIdClaims);
            if (user == null)
                return NotFound("User not found.");

            var userdetails = new UserDetailsDto
            {
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };

            return Ok(userdetails);
        }

        [HttpPatch("{Email}")]
        [Authorize]

        public async Task<IActionResult> UpdateUser(string Email, [FromBody] JsonPatchDocument<UserUpdate> PatchUser)
        {
            var EmailClaim = User.FindFirst(ClaimTypes.Email)?.Value;

            Console.WriteLine($"Email claim: {EmailClaim}");


            var details = await _context.UserDetails.FirstOrDefaultAsync(u => u.Email == Email);
            if (details == null)
            {
                return NotFound();
            }

            if (details.Email != EmailClaim)
            {
                return Forbid("Denied");
            }
            var usersnapshot = new UserUpdate
            {
                UserName = details.UserName,
                PhoneNumber = details.PhoneNumber,

            };

            PatchUser.ApplyTo(usersnapshot);

            details.UserName = usersnapshot.UserName ?? details.UserName;
            details.PhoneNumber = usersnapshot.PhoneNumber ?? details.PhoneNumber;
            if (await AlreadyExist(usersnapshot.UserName))
            {
                return BadRequest(new { message = "User already Exists " });
            }
            await _context.SaveChangesAsync();
            return Ok("Update successfully");
        }

        private async Task<bool> AlreadyExist(string username)
        {
            return await _context.UserDetails.AnyAsync(u => u.UserName == username);
        }

        [HttpDelete("{Email}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(string Email)
        {
            var EmailClaim = User.FindFirst(ClaimTypes.Email)?.Value;

            //Console.WriteLine($"Email claim: {EmailClaim}");


            var details = await _context.UserDetails.FirstOrDefaultAsync(u => u.Email == Email);
            if (details == null)
            {
                return NotFound();
            }

            if (details.Email != EmailClaim)
            {
                return Forbid("Denied");
            }
            _context.UserDetails.Remove(details);
            await _context.SaveChangesAsync();

            return Ok("User deleted");
        }
        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            return Ok("logged out successfully.");
        }
    }
}