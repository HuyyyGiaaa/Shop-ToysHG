namespace Shop_ToysHG.DTOs
{
    /// <summary>
    /// DTO for order item
    /// </summary>
    public class OrderItemDto
    {
        /// <summary>
        /// Order item ID
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
        /// Price at purchase time
        /// </summary>
        public decimal Price { get; set; }

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
    /// DTO for order response
    /// </summary>
    public class OrderDto
    {
        /// <summary>
        /// Order ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Order code
        /// </summary>
        public string OrderCode { get; set; } = string.Empty;

        /// <summary>
        /// Total amount
        /// </summary>
        public decimal TotalAmount { get; set; }

        /// <summary>
        /// Order status
        /// </summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Shipping address
        /// </summary>
        public string? ShippingAddress { get; set; }

        /// <summary>
        /// Order items
        /// </summary>
        public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();

        /// <summary>
        /// Created date
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// DTO for creating an order
    /// </summary>
    public class CreateOrderDto
    {
        /// <summary>
        /// Shipping address
        /// </summary>
        public string? ShippingAddress { get; set; }
    }

    /// <summary>
    /// DTO for updating order status
    /// </summary>
    public class UpdateOrderStatusDto
    {
        /// <summary>
        /// New status
        /// </summary>
        public string Status { get; set; } = string.Empty;
    }
}
