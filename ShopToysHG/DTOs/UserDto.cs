namespace Shop_ToysHG.DTOs
{
    /// <summary>
    /// DTO for user registration
    /// </summary>
    public class RegisterUserDto
    {
        /// <summary>
        /// Username (required)
        /// </summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Password (required)
        /// </summary>
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// Email (required)
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Full name (required)
        /// </summary>
        public string FullName { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for user login
    /// </summary>
    public class LoginUserDto
    {
        /// <summary>
        /// Username (required)
        /// </summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Password (required)
        /// </summary>
        public string Password { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for user response
    /// </summary>
    public class UserDto
    {
        /// <summary>
        /// User ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Username
        /// </summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Email
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// User role
        /// </summary>
        public string Role { get; set; } = string.Empty;

        /// <summary>
        /// User status
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// Ki?m tra user ?ã là customer
        /// </summary>
        public bool IsCustomer { get; set; }

        /// <summary>
        /// Customer ID
        /// </summary>
        public int? CustomerId { get; set; }
    }
}
