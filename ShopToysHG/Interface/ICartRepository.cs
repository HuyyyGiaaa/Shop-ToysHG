using Shop_ToysHG.Models;

namespace Shop_ToysHG.Repositories
{
    public interface ICartRepository
    {
        Task<Cart?> GetByCustomerIdAsync(int customerId);
        Task<Cart?> GetByIdAsync(int id);
        Task<CartItem?> GetCartItemAsync(int cartId, int productId);
        Task<Cart> CreateCartAsync(int customerId);
        Task<CartItem> AddToCartAsync(int cartId, int productId, int quantity);
        Task<CartItem> UpdateCartItemAsync(int cartItemId, int quantity);
        Task<bool> RemoveFromCartAsync(int cartItemId);
        Task<bool> ClearCartAsync(int cartId);
        Task SaveChangesAsync();
    }
}
