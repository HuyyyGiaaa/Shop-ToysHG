using Microsoft.AspNetCore.Mvc;
using Shop_ToysHG.Models;
using Shop_ToysHG.DTOs;
using Shop_ToysHG.Repositories;

namespace Shop_ToysHG.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartsController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;
        private readonly ILogger<CartsController> _logger;

        public CartsController(
            ICartRepository cartRepository,
            IProductRepository productRepository,
            ILogger<CartsController> logger)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
            _logger = logger;
        }

        /// <summary>
        /// L?y gi? hàng theo Customer ID
        /// </summary>
        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<CartDto>> GetByCustomerId(int customerId)
        {
            try
            {
                var cart = await _cartRepository.GetByCustomerIdAsync(customerId);

                if (cart == null)
                    return NotFound(new { message = $"Cart for customer {customerId} not found" });

                return Ok(MapToDto(cart));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting cart for customer {customerId}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Thêm s?n ph?m vào gi? hàng
        /// </summary>
        [HttpPost("customer/{customerId}/add")]
        public async Task<ActionResult<CartDto>> AddToCart(int customerId, [FromBody] AddToCartDto addDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (addDto.Quantity <= 0)
                    return BadRequest(new { message = "Quantity must be greater than 0" });

                // L?y ho?c t?o gi? hàng
                var cart = await _cartRepository.GetByCustomerIdAsync(customerId);
                if (cart == null)
                {
                    cart = await _cartRepository.CreateCartAsync(customerId);
                }

                // Ki?m tra s?n ph?m t?n t?i
                var product = await _productRepository.GetByIdAsync(addDto.ProductId);
                if (product == null)
                    return BadRequest(new { message = $"Product with ID {addDto.ProductId} not found" });

                // Ki?m tra stock
                if (product.Stock < addDto.Quantity)
                    return BadRequest(new { message = $"Insufficient stock. Available: {product.Stock}" });

                // Thêm vào gi?
                await _cartRepository.AddToCartAsync(cart.Id, addDto.ProductId, addDto.Quantity);

                // L?y gi? hàng ?ã c?p nh?t
                var updatedCart = await _cartRepository.GetByCustomerIdAsync(customerId);
                return Ok(new
                {
                    message = "S?n ph?m ?ã ???c thêm vào gi? hàng",
                    cart = MapToDto(updatedCart)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding to cart for customer {customerId}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// C?p nh?t s? l??ng s?n ph?m trong gi?
        /// </summary>
        [HttpPut("items/{cartItemId}")]
        public async Task<ActionResult<CartItemDto>> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (updateDto.Quantity <= 0)
                    return BadRequest(new { message = "Quantity must be greater than 0" });

                var cartItem = await _cartRepository.UpdateCartItemAsync(cartItemId, updateDto.Quantity);
                return Ok(new
                {
                    message = "C?p nh?t s? l??ng thành công",
                    cartItem = new CartItemDto
                    {
                        Id = cartItem.Id,
                        ProductId = cartItem.ProductId,
                        Quantity = cartItem.Quantity,
                        ProductName = cartItem.Product?.Name ?? "",
                        ProductPrice = cartItem.Product?.Price ?? 0,
                        Subtotal = (cartItem.Product?.Price ?? 0) * cartItem.Quantity
                    }
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating cart item {cartItemId}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Xóa s?n ph?m kh?i gi? hàng
        /// </summary>
        [HttpDelete("items/{cartItemId}")]
        public async Task<ActionResult> RemoveFromCart(int cartItemId)
        {
            try
            {
                var result = await _cartRepository.RemoveFromCartAsync(cartItemId);

                if (!result)
                    return NotFound(new { message = $"Cart item with ID {cartItemId} not found" });

                return Ok(new { message = "S?n ph?m ?ã ???c xóa kh?i gi? hàng" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error removing cart item {cartItemId}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Xóa t?t c? s?n ph?m trong gi? hàng
        /// </summary>
        [HttpDelete("customer/{customerId}/clear")]
        public async Task<ActionResult> ClearCart(int customerId)
        {
            try
            {
                var cart = await _cartRepository.GetByCustomerIdAsync(customerId);
                if (cart == null)
                    return NotFound(new { message = $"Cart for customer {customerId} not found" });

                await _cartRepository.ClearCartAsync(cart.Id);
                return Ok(new { message = "Gi? hàng ?ã ???c xóa" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error clearing cart for customer {customerId}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Map Cart to CartDto
        /// </summary>
        private CartDto MapToDto(Cart cart)
        {
            var cartItems = cart.CartItems.Select(ci => new CartItemDto
            {
                Id = ci.Id,
                ProductId = ci.ProductId,
                ProductName = ci.Product?.Name ?? "",
                ProductPrice = ci.Product?.Price ?? 0,
                Quantity = ci.Quantity,
                Subtotal = (ci.Product?.Price ?? 0) * ci.Quantity
            }).ToList();

            return new CartDto
            {
                Id = cart.Id,
                CartItems = cartItems,
                TotalAmount = cartItems.Sum(ci => ci.Subtotal)
            };
        }
    }
}
