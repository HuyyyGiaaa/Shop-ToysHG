using Shop_ToysHG.Models;

namespace Shop_ToysHG.Repositories
{
    public interface IOrderRepository
    {
        Task<Order?> GetByIdAsync(int id);
        Task<Order?> GetByOrderCodeAsync(string orderCode);
        Task<List<Order>> GetByCustomerIdAsync(int customerId);
        Task<List<Order>> GetAllAsync();
        Task<Order> CreateAsync(Order order);
        Task<Order> UpdateOrderStatusAsync(int id, string status);
        Task<bool> DeleteAsync(int id);
        Task<decimal> GetTotalRevenueAsync();
        Task<int> GetTotalOrdersAsync();
    }
}
