namespace Shop_ToysHG.DTOs
{
    /// <summary>
    /// DTO for cart item
    /// </summary>
    public class CartItemDto
    {
        /// <summary>
        /// Cart item ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Product ID
        /// </summary>
        public int ProductId { get; set; }

        /// <summary>
        /// Product name
        /// </summary>
        public string ProductName { get; set; } = string.Empty;

        /// <summary>
        /// Product price
        /// </summary>
        public decimal ProductPrice { get; set; }

        /// <summary>
        /// Quantity
        /// </summary>
        public int Quantity { get; set; }

        /// <summary>
        /// Subtotal (price * quantity)
        /// </summary>
        public decimal Subtotal { get; set; }
    }

    /// <summary>
    /// DTO for cart response
    /// </summary>
    public class CartDto
    {
        /// <summary>
        /// Cart ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Cart items
        /// </summary>
        public List<CartItemDto> CartItems { get; set; } = new List<CartItemDto>();

        /// <summary>
        /// Total amount
        /// </summary>
        public decimal TotalAmount { get; set; }
    }

    /// <summary>
    /// DTO for adding item to cart
    /// </summary>
    public class AddToCartDto
    {
        /// <summary>
        /// Product ID
        /// </summary>
        public int ProductId { get; set; }

        /// <summary>
        /// Quantity
        /// </summary>
        public int Quantity { get; set; }
    }

    /// <summary>
    /// DTO for updating cart item quantity
    /// </summary>
    public class UpdateCartItemDto
    {
        /// <summary>
        /// New quantity
        /// </summary>
        public int Quantity { get; set; }
    }
}
