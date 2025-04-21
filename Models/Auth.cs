
using System.ComponentModel.DataAnnotations;

namespace RecipeWithAuth.Models
    {
        public class RegisterModel
        {
        [Required] public string Email { get; set; }
        [Required] public string UserName { get; set; }
        public string PhoneNumber { get; set; }
        [Required] public string Password { get; set; }
        }

        public class LoginModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class UserUpdate
        {
            public string PhoneNumber { get; set; }
            public string UserName { get; set; }
        }
    }


