using Microsoft.EntityFrameworkCore;
using Shop_ToysHG.Data;
using Shop_ToysHG.Repositories;
using Shop_ToysHG.Models;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext with MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var serverVersion = new MySqlServerVersion(new Version(8, 0, 0));

builder.Services.AddDbContext<ShopToysHGContext>(options =>
    options.UseMySql(connectionString, serverVersion)
);

// Add Repositories
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ShopToysHGContext>();
    SeedData(context);
}

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

/// <summary>
/// Seed d? li?u m?c ??nh
/// </summary>
void SeedData(ShopToysHGContext context)
{
    Console.WriteLine("?? Starting SeedData...");
    
    // Seed Roles
    if (!context.Roles.Any())
    {
        Console.WriteLine("?? Seeding Roles...");
        var roles = new List<Role>
        {
            new Role { Id = 1, Name = "ADMIN", Description = "Qu?n tr? viên", CreatedAt = DateTime.Now },
            new Role { Id = 2, Name = "CUSTOMER", Description = "Khách hàng", CreatedAt = DateTime.Now }
        };
        context.Roles.AddRange(roles);
        context.SaveChanges();
        Console.WriteLine("? Roles seeded: ADMIN (1), CUSTOMER (2)");
    }
    else
    {
        Console.WriteLine("??  Roles already exist");
    }

    // Seed Admin User
    if (!context.Users.Any(u => u.Username == "admin"))
    {
        Console.WriteLine("?? Seeding Admin User...");
        var adminRole = context.Roles.First(r => r.Name == "ADMIN");
        var adminUser = new User
        {
            Username = "admin",
            Email = "admin@shoptoyshg.com",
            PasswordHash = HashPassword("admin123"),
            RoleId = adminRole.Id,
            Status = 1,
            CreatedAt = DateTime.Now
        };
        context.Users.Add(adminUser);
        context.SaveChanges();
        Console.WriteLine($"? Admin user created with RoleId: {adminRole.Id}");

        // T?o Admin Customer + Cart
        var adminCustomer = new Customer
        {
            UserId = adminUser.Id,
            FullName = "Administrator",
            Gender = 1,
            CreatedAt = DateTime.Now
        };
        context.Customers.Add(adminCustomer);
        context.SaveChanges();
        Console.WriteLine("? Admin customer created");

        // T?o Cart cho Admin
        var adminCart = new Cart
        {
            CustomerId = adminCustomer.Id,
            CreatedAt = DateTime.Now
        };
        context.Carts.Add(adminCart);
        context.SaveChanges();
        Console.WriteLine("? Admin cart created");
    }
    else
    {
        Console.WriteLine("??  Admin user already exists");
    }
    
    Console.WriteLine("? SeedData completed!");
}

/// <summary>
/// Hash password
/// </summary>
string HashPassword(string password)
{
    using (var sha256 = SHA256.Create())
    {
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}
