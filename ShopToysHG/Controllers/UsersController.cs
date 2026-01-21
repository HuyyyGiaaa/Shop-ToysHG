using Microsoft.AspNetCore.Mvc;
using Shop_ToysHG.Models;
using Shop_ToysHG.DTOs;
using Shop_ToysHG.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace Shop_ToysHG.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly ICartRepository _cartRepository;
        private readonly ILogger<UsersController> _logger;

        public UsersController(
            IUserRepository userRepository,
            ICustomerRepository customerRepository,
            ICartRepository cartRepository,
            ILogger<UsersController> logger)
        {
            _userRepository = userRepository;
            _customerRepository = customerRepository;
            _cartRepository = cartRepository;
            _logger = logger;
        }

        /// <summary>
        /// ??ng kí tài kho?n m?i
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterUserDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Ki?m tra username ho?c email ?ã t?n t?i
                if (await _userRepository.UserExistsAsync(registerDto.Username, registerDto.Email))
                    return BadRequest(new { message = "Username ho?c email ?ã t?n t?i" });

                // L?y Role CUSTOMER (m?c ??nh RoleId = 3)
                // Gi? s? Roles: 1=ADMIN, 2=STAFF, 3=CUSTOMER
                const int customerRoleId = 3;

                // T?o User
                var user = new User
                {
                    Username = registerDto.Username,
                    Email = registerDto.Email,
                    PasswordHash = HashPassword(registerDto.Password),
                    RoleId = customerRoleId,
                    Status = 1
                };

                var createdUser = await _userRepository.CreateAsync(user);

                return Ok(new
                {
                    message = "??ng kí thành công. Vui lòng ??ng nh?p.",
                    user = new UserDto
                    {
                        Id = createdUser.Id,
                        Username = createdUser.Username,
                        Email = createdUser.Email,
                        Role = "CUSTOMER",
                        Status = createdUser.Status,
                        IsCustomer = false,
                        CustomerId = null
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// ??ng nh?p
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginUserDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = await _userRepository.GetByUsernameAsync(loginDto.Username);

                if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
                    return Unauthorized(new { message = "Username ho?c password không ??ng" });

                if (user.Status == 0)
                    return Unauthorized(new { message = "Tài kho?n ?ã b? khóa" });

                return Ok(new
                {
                    message = "??ng nh?p thành công",
                    user = await MapToDtoAsync(user)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging in");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// L?y thông tin user theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetById(int id)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(id);

                if (user == null)
                    return NotFound(new { message = $"User with ID {id} not found" });

                return Ok(await MapToDtoAsync(user));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting user {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// L?y danh sách t?t c? users (ch? admin)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> GetAll()
        {
            try
            {
                var users = await _userRepository.GetAllAsync();
                var userDtos = new List<UserDto>();
                foreach (var u in users)
                {
                    userDtos.Add(await MapToDtoAsync(u));
                }
                return Ok(userDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// C?p nh?t thông tin user
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Update(int id, [FromBody] UserDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = new User
                {
                    Email = updateDto.Email,
                    Status = updateDto.Status,
                    RoleId = 3  // M?c ??nh CUSTOMER (RoleId=3)
                };

                var updatedUser = await _userRepository.UpdateAsync(id, user);
                return Ok(new
                {
                    message = "C?p nh?t thành công",
                    user = await MapToDtoAsync(updatedUser)
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating user {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Xóa user
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _userRepository.DeleteAsync(id);

                if (!result)
                    return NotFound(new { message = $"User with ID {id} not found" });

                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting user {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Map User to UserDto (async version)
        /// </summary>
        private async Task<UserDto> MapToDtoAsync(User user)
        {
            // Ki?m tra user có ph?i là Customer không
            var customer = await _customerRepository.GetByUserIdAsync(user.Id);
            
            // L?y role name t? RoleId
            string roleName = user.Role?.Name ?? "CUSTOMER";
            
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = roleName,
                Status = user.Status,
                IsCustomer = customer != null,
                CustomerId = customer?.Id
            };
        }

        /// <summary>
        /// Map User to UserDto (sync version - cho Register)
        /// </summary>
        private UserDto MapToDto(User user)
        {
            string roleName = user.Role?.Name ?? "CUSTOMER";
            
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = roleName,
                Status = user.Status,
                IsCustomer = false,
                CustomerId = null
            };
        }

        /// <summary>
        /// Hash password
        /// </summary>
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        /// <summary>
        /// Verify password
        /// </summary>
        private bool VerifyPassword(string password, string hash)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput == hash;
        }
    }
}
