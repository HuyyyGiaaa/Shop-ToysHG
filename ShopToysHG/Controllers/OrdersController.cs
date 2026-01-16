using Microsoft.AspNetCore.Mvc;
using Shop_ToysHG.Models;
using Shop_ToysHG.DTOs;
using Shop_ToysHG.Repositories;

namespace Shop_ToysHG.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(
            IOrderRepository orderRepository,
            ICartRepository cartRepository,
            ICustomerRepository customerRepository,
            ILogger<OrdersController> logger)
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _customerRepository = customerRepository;
            _logger = logger;
        }

        /// <summary>
        /// L?y ??n hàng theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetById(int id)
        {
            try
            {
                var order = await _orderRepository.GetByIdAsync(id);

                if (order == null)
                    return NotFound(new { message = $"Order with ID {id} not found" });

                return Ok(MapToDto(order));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting order {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// L?y ??n hàng theo order code
        /// </summary>
        [HttpGet("code/{orderCode}")]
        public async Task<ActionResult<OrderDto>> GetByOrderCode(string orderCode)
        {
            try
            {
                var order = await _orderRepository.GetByOrderCodeAsync(orderCode);

                if (order == null)
                    return NotFound(new { message = $"Order with code {orderCode} not found" });

                return Ok(MapToDto(order));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting order by code {orderCode}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// L?y t?t c? ??n hàng c?a customer
        /// </summary>
        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<List<OrderDto>>> GetByCustomerId(int customerId)
        {
            try
            {
                var orders = await _orderRepository.GetByCustomerIdAsync(customerId);
                var orderDtos = orders.Select(o => MapToDto(o)).ToList();
                return Ok(orderDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting orders for customer {customerId}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// L?y danh sách t?t c? ??n hàng
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetAll()
        {
            try
            {
                var orders = await _orderRepository.GetAllAsync();
                var orderDtos = orders.Select(o => MapToDto(o)).ToList();
                return Ok(orderDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all orders");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// T?o ??n hàng m?i t? gi? hàng
        /// </summary>
        [HttpPost("customer/{customerId}/checkout")]
        public async Task<ActionResult<OrderDto>> CreateOrder(int customerId, [FromBody] CreateOrderDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // L?y customer
                var customer = await _customerRepository.GetByUserIdAsync(customerId);
                if (customer == null)
                    return NotFound(new { message = $"Customer not found" });

                // L?y gi? hàng
                var cart = await _cartRepository.GetByCustomerIdAsync(customer.Id);
                if (cart == null || cart.CartItems.Count == 0)
                    return BadRequest(new { message = "Cart is empty" });

                // T?o order
                var totalAmount = cart.CartItems.Sum(ci => (ci.Product?.Price ?? 0) * ci.Quantity);
                var order = new Order
                {
                    CustomerId = customer.Id,
                    TotalAmount = totalAmount,
                    ShippingAddress = createDto.ShippingAddress ?? customer.Address,
                    Status = "PENDING"
                };

                var createdOrder = await _orderRepository.CreateAsync(order);

                // T?o order items t? cart items
                foreach (var cartItem in cart.CartItems)
                {
                    var orderItem = new OrderItem
                    {
                        OrderId = createdOrder.Id,
                        ProductId = cartItem.ProductId,
                        Price = cartItem.Product?.Price ?? 0,
                        Quantity = cartItem.Quantity,
                        Subtotal = (cartItem.Product?.Price ?? 0) * cartItem.Quantity
                    };
                    createdOrder.OrderItems.Add(orderItem);
                }

                // L?u order items vào database
                await _cartRepository.SaveChangesAsync();

                // Xóa cart items
                await _cartRepository.ClearCartAsync(cart.Id);

                var createdOrderWithItems = await _orderRepository.GetByIdAsync(createdOrder.Id);
                return Ok(new
                {
                    message = "??n hàng ?ã ???c t?o thành công",
                    order = MapToDto(createdOrderWithItems!)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating order for customer {customerId}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// C?p nh?t tr?ng thái ??n hàng
        /// </summary>
        [HttpPut("{id}/status")]
        public async Task<ActionResult<OrderDto>> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var validStatuses = new[] { "PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED" };
                if (!validStatuses.Contains(updateDto.Status))
                    return BadRequest(new { message = "Invalid order status" });

                var updatedOrder = await _orderRepository.UpdateOrderStatusAsync(id, updateDto.Status);
                return Ok(new
                {
                    message = "Tr?ng thái ??n hàng ?ã ???c c?p nh?t",
                    order = MapToDto(updatedOrder)
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating order {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Xóa ??n hàng
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _orderRepository.DeleteAsync(id);

                if (!result)
                    return NotFound(new { message = $"Order with ID {id} not found" });

                return Ok(new { message = "Order deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting order {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// L?y t?ng doanh thu
        /// </summary>
        [HttpGet("stats/revenue")]
        public async Task<ActionResult> GetTotalRevenue()
        {
            try
            {
                var revenue = await _orderRepository.GetTotalRevenueAsync();
                var totalOrders = await _orderRepository.GetTotalOrdersAsync();
                return Ok(new
                {
                    totalRevenue = revenue,
                    totalOrders = totalOrders,
                    averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting revenue stats");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Map Order to OrderDto
        /// </summary>
        private OrderDto MapToDto(Order order)
        {
            var orderItems = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name ?? "",
                Price = oi.Price,
                Quantity = oi.Quantity,
                Subtotal = oi.Subtotal
            }).ToList();

            return new OrderDto
            {
                Id = order.Id,
                OrderCode = order.OrderCode,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                OrderItems = orderItems,
                CreatedAt = order.CreatedAt
            };
        }
    }
}
