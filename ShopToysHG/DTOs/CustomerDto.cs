namespace Shop_ToysHG.DTOs
{
    /// <summary>
    /// DTO for customer response
    /// </summary>
    public class CustomerDto
    {
        /// <summary>
        /// Customer ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// User ID
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Full name
        /// </summary>
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Phone number
        /// </summary>
        public string? Phone { get; set; }

        /// <summary>
        /// Default address
        /// </summary>
        public string? Address { get; set; }

        /// <summary>
        /// Gender (0: female, 1: male, -1: other)
        /// </summary>
        public int Gender { get; set; }

        /// <summary>
        /// Birth date
        /// </summary>
        public DateTime? BirthDate { get; set; }
    }

    /// <summary>
    /// DTO for updating customer
    /// </summary>
    public class UpdateCustomerDto
    {
        /// <summary>
        /// Full name
        /// </summary>
        public string? FullName { get; set; }

        /// <summary>
        /// Phone number
        /// </summary>
        public string? Phone { get; set; }

        /// <summary>
        /// Default address
        /// </summary>
        public string? Address { get; set; }

        /// <summary>
        /// Gender (0: female, 1: male, -1: other)
        /// </summary>
        public int? Gender { get; set; }

        /// <summary>
        /// Birth date
        /// </summary>
        public DateTime? BirthDate { get; set; }
    }
}
