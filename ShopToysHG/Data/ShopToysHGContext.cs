using Microsoft.EntityFrameworkCore;
using Shop_ToysHG.Models;

namespace Shop_ToysHG.Data
{
    public class ShopToysHGContext : DbContext
    {
        public ShopToysHGContext(DbContextOptions<ShopToysHGContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Products table
            modelBuilder.Entity<Product>().HasKey(p => p.Id);
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}
