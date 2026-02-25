using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Duja.Models
{

    public class DujaContext :IdentityDbContext<User>
    {
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }

        public DbSet<ProductVariant> Variants { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
       public DbSet<BrandAd> BrandAds { get; set; }

       public DbSet<DeliveryDetails> DeliveryDetails { get; set; }
        public DujaContext(DbContextOptions<DujaContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Additional model configuration can go here
            modelBuilder.Entity<ProductVariant>(entity =>
            {
                entity.HasIndex(p => new { p.ProductId, p.SizeId, p.ColorId }).IsUnique();
            });
         }
    }
}
