using Microsoft.EntityFrameworkCore;
using Shop_ToysHG.Data;
using Shop_ToysHG.Models;

namespace Shop_ToysHG.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly ShopToysHGContext _context;
        private readonly ILogger<CustomerRepository> _logger;

        public CustomerRepository(ShopToysHGContext context, ILogger<CustomerRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Customer?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Customers
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting customer by ID {id}");
                throw;
            }
        }

        public async Task<Customer?> GetByUserIdAsync(int userId)
        {
            try
            {
                return await _context.Customers
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.UserId == userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting customer by user ID {userId}");
                throw;
            }
        }

        public async Task<List<Customer>> GetAllAsync()
        {
            try
            {
                return await _context.Customers
                    .Include(c => c.User)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all customers");
                throw;
            }
        }

        public async Task<Customer> CreateAsync(Customer customer)
        {
            try
            {
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                return customer;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating customer");
                throw;
            }
        }

        public async Task<Customer> UpdateAsync(int id, Customer customer)
        {
            try
            {
                var existingCustomer = await _context.Customers.FindAsync(id);
                if (existingCustomer == null)
                    throw new KeyNotFoundException($"Customer with ID {id} not found");

                existingCustomer.FullName = customer.FullName ?? existingCustomer.FullName;
                existingCustomer.Phone = customer.Phone ?? existingCustomer.Phone;
                existingCustomer.Address = customer.Address ?? existingCustomer.Address;
                existingCustomer.Gender = customer.Gender;
                existingCustomer.BirthDate = customer.BirthDate ?? existingCustomer.BirthDate;
                existingCustomer.UpdatedAt = DateTime.Now;

                _context.Customers.Update(existingCustomer);
                await _context.SaveChangesAsync();
                return existingCustomer;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating customer {id}");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);
                if (customer == null)
                    return false;

                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting customer {id}");
                throw;
            }
        }
    }
}
