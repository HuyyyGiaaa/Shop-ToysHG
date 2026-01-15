using Microsoft.AspNetCore.Mvc;
using Shop_ToysHG.Models;
using Shop_ToysHG.DTOs;
using Shop_ToysHG.Repositories;

namespace Shop_ToysHG.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _repository;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IProductRepository repository, ILogger<ProductsController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        /// <summary>
        /// L?y danh sách t?t c? s?n ph?m
        /// </summary>
        /// <returns>List of all products</returns>
        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> GetAll()
        {
            try
            {
                var products = await _repository.GetAllAsync();
                var productDtos = products.Select(p => MapToDto(p)).ToList();
                return Ok(productDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all products");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// L?y s?n ph?m theo ID
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <returns>Product details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            try
            {
                var product = await _repository.GetByIdAsync(id);
                
                if (product == null)
                    return NotFound(new { message = $"Product with ID {id} not found" });

                return Ok(MapToDto(product));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting product {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// L?y s?n ph?m theo danh m?c
        /// </summary>
        /// <param name="category">Category name</param>
        /// <returns>List of products in category</returns>
        [HttpGet("category/{category}")]
        public async Task<ActionResult<List<ProductDto>>> GetByCategory(string category)
        {
            try
            {
                var products = await _repository.GetByCategoryAsync(category);
                var productDtos = products.Select(p => MapToDto(p)).ToList();
                return Ok(productDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting products by category {category}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// T?o s?n ph?m m?i
        /// </summary>
        /// <param name="createProductDto">Create product data</param>
        /// <returns>Created product</returns>
        [HttpPost]
        public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductDto createProductDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Map DTO to Product model
                var product = new Product
                {
                    Name = createProductDto.Name,
                    Description = createProductDto.Description,
                    Price = createProductDto.Price,
                    Stock = createProductDto.Stock,
                    Category = createProductDto.Category
                };

                var createdProduct = await _repository.CreateAsync(product);
                return CreatedAtAction(nameof(GetById), new { id = createdProduct.Id }, MapToDto(createdProduct));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// C?p nh?t s?n ph?m
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <param name="updateProductDto">Update product data</param>
        /// <returns>Updated product</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDto>> Update(int id, [FromBody] UpdateProductDto updateProductDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Map DTO to Product model
                var product = new Product
                {
                    Name = updateProductDto.Name,
                    Description = updateProductDto.Description,
                    Price = updateProductDto.Price,
                    Stock = updateProductDto.Stock,
                    Category = updateProductDto.Category
                };

                var updatedProduct = await _repository.UpdateAsync(id, product);
                return Ok(MapToDto(updatedProduct));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating product {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Xóa s?n ph?m
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <returns>Delete result message</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _repository.DeleteAsync(id);
                
                if (!result)
                    return NotFound(new { message = $"Product with ID {id} not found" });

                return Ok(new { message = "Product deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting product {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Map Product model to ProductDto
        /// </summary>
        /// <param name="product">Product model</param>
        /// <returns>ProductDto</returns>
        private ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                Category = product.Category
            };
        }
    }
}
