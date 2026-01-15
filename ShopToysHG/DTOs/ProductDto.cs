namespace Shop_ToysHG.DTOs
{
    /// <summary>
    /// DTO for product response data
    /// </summary>
    public class ProductDto
    {
        /// <summary>
        /// Product ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Product name
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Product description
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Product price
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Product stock quantity
        /// </summary>
        public int Stock { get; set; }

        /// <summary>
        /// Product category
        /// </summary>
        public string? Category { get; set; }
    }
}
