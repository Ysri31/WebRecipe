using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace RecipeWithAuth.Models
{
    public class LoginResponse
    {
        public string Token { get; set; }
    }
}
