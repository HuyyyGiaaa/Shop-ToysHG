namespace Shop_ToysHG.DTOs
{
    /// <summary>
    /// DTO for updating an existing product
    /// </summary>
    public class UpdateProductDto
    {
        /// <summary>
        /// Product name (required)
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Product description (optional)
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Product price (required)
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Product stock quantity (required)
        /// </summary>
        public int Stock { get; set; }

        /// <summary>
        /// Product category (optional)
        /// </summary>
        public string? Category { get; set; }
    }
}
