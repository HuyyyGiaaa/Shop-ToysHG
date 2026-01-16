using Microsoft.EntityFrameworkCore;
using Shop_ToysHG.Data;
using Shop_ToysHG.Models;

namespace Shop_ToysHG.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly ShopToysHGContext _context;
        private readonly ILogger<CartRepository> _logger;

        public CartRepository(ShopToysHGContext context, ILogger<CartRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Cart?> GetByCustomerIdAsync(int customerId)
        {
            try
            {
                return await _context.Carts
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                    .FirstOrDefaultAsync(c => c.CustomerId == customerId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting cart for customer {customerId}");
                throw;
            }
        }

        public async Task<Cart?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Carts
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                    .FirstOrDefaultAsync(c => c.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting cart {id}");
                throw;
            }
        }

        public async Task<CartItem?> GetCartItemAsync(int cartId, int productId)
        {
            try
            {
                return await _context.CartItems
                    .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == productId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting cart item for cart {cartId}, product {productId}");
                throw;
            }
        }

        public async Task<Cart> CreateCartAsync(int customerId)
        {
            try
            {
                var cart = new Cart { CustomerId = customerId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
                return cart;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating cart for customer {customerId}");
                throw;
            }
        }

        public async Task<CartItem> AddToCartAsync(int cartId, int productId, int quantity)
        {
            try
            {
                // Ki?m tra s?n ph?m có t?n t?i không
                var product = await _context.Products.FindAsync(productId);
                if (product == null)
                    throw new KeyNotFoundException($"Product with ID {productId} not found");

                // Ki?m tra s?n ph?m ?ã có trong gi? ch?a
                var existingItem = await GetCartItemAsync(cartId, productId);

                if (existingItem != null)
                {
                    // N?u có r?i thì t?ng s? l??ng
                    existingItem.Quantity += quantity;
                    existingItem.UpdatedAt = DateTime.Now;
                    _context.CartItems.Update(existingItem);
                }
                else
                {
                    // N?u ch?a có thì thêm m?i
                    var cartItem = new CartItem
                    {
                        CartId = cartId,
                        ProductId = productId,
                        Quantity = quantity
                    };
                    _context.CartItems.Add(cartItem);
                    existingItem = cartItem;
                }

                await _context.SaveChangesAsync();
                return existingItem;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding product {productId} to cart {cartId}");
                throw;
            }
        }

        public async Task<CartItem> UpdateCartItemAsync(int cartItemId, int quantity)
        {
            try
            {
                var cartItem = await _context.CartItems.FindAsync(cartItemId);
                if (cartItem == null)
                    throw new KeyNotFoundException($"Cart item with ID {cartItemId} not found");

                if (quantity <= 0)
                    throw new ArgumentException("Quantity must be greater than 0");

                cartItem.Quantity = quantity;
                cartItem.UpdatedAt = DateTime.Now;

                _context.CartItems.Update(cartItem);
                await _context.SaveChangesAsync();
                return cartItem;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating cart item {cartItemId}");
                throw;
            }
        }

        public async Task<bool> RemoveFromCartAsync(int cartItemId)
        {
            try
            {
                var cartItem = await _context.CartItems.FindAsync(cartItemId);
                if (cartItem == null)
                    return false;

                _context.CartItems.Remove(cartItem);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error removing cart item {cartItemId}");
                throw;
            }
        }

        public async Task<bool> ClearCartAsync(int cartId)
        {
            try
            {
                var cartItems = await _context.CartItems
                    .Where(ci => ci.CartId == cartId)
                    .ToListAsync();

                _context.CartItems.RemoveRange(cartItems);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error clearing cart {cartId}");
                throw;
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
