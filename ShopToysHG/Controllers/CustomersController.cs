using Microsoft.AspNetCore.Mvc;
using Shop_ToysHG.Models;
using Shop_ToysHG.DTOs;
using Shop_ToysHG.Repositories;

namespace Shop_ToysHG.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ILogger<CustomersController> _logger;

        public CustomersController(
            ICustomerRepository customerRepository,
            ILogger<CustomersController> logger)
        {
            _customerRepository = customerRepository;
            _logger = logger;
        }

        /// <summary>
        /// L?y thông tin customer theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDto>> GetById(int id)
        {
            try
            {
                var customer = await _customerRepository.GetByIdAsync(id);

                if (customer == null)
                    return NotFound(new { message = $"Customer with ID {id} not found" });

                return Ok(MapToDto(customer));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting customer {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// L?y customer theo UserID
        /// </summary>
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<CustomerDto>> GetByUserId(int userId)
        {
            try
            {
                var customer = await _customerRepository.GetByUserIdAsync(userId);

                if (customer == null)
                    return NotFound(new { message = $"Customer with UserId {userId} not found" });

                return Ok(MapToDto(customer));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting customer by user ID {userId}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// L?y danh sách t?t c? customers
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<CustomerDto>>> GetAll()
        {
            try
            {
                var customers = await _customerRepository.GetAllAsync();
                var customerDtos = customers.Select(c => MapToDto(c)).ToList();
                return Ok(customerDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all customers");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// C?p nh?t thông tin customer
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<CustomerDto>> Update(int id, [FromBody] UpdateCustomerDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var customer = new Customer
                {
                    FullName = updateDto.FullName ?? "",
                    Phone = updateDto.Phone,
                    Address = updateDto.Address,
                    Gender = updateDto.Gender ?? 0,
                    BirthDate = updateDto.BirthDate
                };

                var updatedCustomer = await _customerRepository.UpdateAsync(id, customer);
                return Ok(new
                {
                    message = "C?p nh?t thông tin thành công",
                    customer = MapToDto(updatedCustomer)
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating customer {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Xóa customer
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _customerRepository.DeleteAsync(id);

                if (!result)
                    return NotFound(new { message = $"Customer with ID {id} not found" });

                return Ok(new { message = "Customer deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting customer {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Map Customer to CustomerDto
        /// </summary>
        private CustomerDto MapToDto(Customer customer)
        {
            return new CustomerDto
            {
                Id = customer.Id,
                UserId = customer.UserId,
                FullName = customer.FullName,
                Phone = customer.Phone,
                Address = customer.Address,
                Gender = customer.Gender,
                BirthDate = customer.BirthDate
            };
        }
    }
}
