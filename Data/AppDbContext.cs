using Microsoft.EntityFrameworkCore;
using RecipeWithAuth.Models;

namespace RecipeWithAuth.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Recipe> RecipesDetails { get; set; }
        public DbSet<User> UserDetails { get; set; }
        public DbSet<Rating> Ratings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Recipe>()
        .HasOne(r => r.User)
        .WithMany(u => u.Recipes)
        .HasForeignKey(r => r.UserId)
        .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Rating>()
        .HasOne(r => r.Recipe)
        .WithMany()
        .HasForeignKey(r => r.RecipeId)
        .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Rating>()
        .HasOne(r => r.User)
        .WithMany()
        .HasForeignKey(r => r.UserId)
        .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
