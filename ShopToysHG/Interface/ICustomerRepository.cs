using Shop_ToysHG.Models;

namespace Shop_ToysHG.Repositories
{
    public interface ICustomerRepository
    {
        Task<Customer?> GetByIdAsync(int id);
        Task<Customer?> GetByUserIdAsync(int userId);
        Task<List<Customer>> GetAllAsync();
        Task<Customer> CreateAsync(Customer customer);
        Task<Customer> UpdateAsync(int id, Customer customer);
        Task<bool> DeleteAsync(int id);
    }
}
