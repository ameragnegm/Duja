using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Duja.Models
{

    public class DujaContext : IdentityDbContext<User>
    {
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }

        public DbSet<ProductVariant> Variants { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<BrandAd> BrandAds { get; set; }

        public DbSet<Discount> Discounts { get; set; }

        public DbSet<DiscountProduct> DiscountProducts { get; set; }
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
            modelBuilder.Entity<BrandInfo>().HasData(
               new BrandInfo
               {
                   Id = 1,
                   BrandName = "Duja",
                   Description = "Discover the best products for your lifestyle.",
                   Phone = "+2 010 2348 1375",
                   WhatsApp = "+2 010 9676 8843",
                   Email = "",
                   InstagramUrl = "https://www.instagram.com/duja_brand_/",
                   TikTokUrl = "https://www.tiktok.com/@duja_brand_"
               }

           );

            modelBuilder.Entity<Discount>()
                .HasMany(d => d.DiscountProducts)
                .WithOne(dp => dp.Discount)
                .HasForeignKey(dp => dp.DiscountId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DiscountProduct>()
                .HasOne(dp => dp.Product)
                .WithMany()
                .HasForeignKey(dp => dp.ProductId)
                .OnDelete(DeleteBehavior.Restrict);


        }
    }
}
