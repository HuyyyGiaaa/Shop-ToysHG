# 📚 Hướng Dẫn Chi Tiết Frontend ShopToysHG

## 📑 Mục Lục
1. [Cấu trúc dự án](#cấu-trúc-dự-án)
2. [Các tính năng](#các-tính-năng)
3. [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
4. [API Reference](#api-reference)
5. [Troubleshooting](#troubleshooting)

---

## 📁💻 Cấu trúc dự án

### Các file JavaScript

#### `auth.js` - Xác thực người dùng
```javascript
// Đăng ký
registerUser(registerData)

// Đăng nhập
loginUser(username, password)

// Đăng xuất
logoutUser()

// Lấy user hiện tại
getCurrentUser()

// Kiểm tra đã đăng nhập
isUserLoggedIn()
```

#### `cart.js` - Quản lý giỏ hàng
```javascript
// Thêm vào giỏ
addToCart(productId, productName, price)

// Xóa khỏi giỏ
removeFromCart(productId)

// Cập nhật số lượng
updateCartQuantity(productId, quantity)

// Lấy tất cả sản phẩm
getCartItems()

// Lấy số lượng
getCartCount()

// Lấy tổng tiền
getCartTotal()

// Xóa giỏ
clearCart()

// Tạo đơn hàng
createOrderFromCart(customerId, shippingAddress)
```

#### `user.js` - Quản lý User
```javascript
// Load giao diện
loadUsers()

// Lấy danh sách
fetchAllUsers()

// Xem chi tiết
viewUserDetails(userId)

// Chỉnh sửa trạng thái
editUserStatus(userId, currentStatus)

// Xóa user
deleteUser(userId)
```

#### `customer.js` - Quản lý Customer
```javascript
// Load giao diện
loadCustomers()

// Lấy danh sách
fetchAllCustomers()

// Thêm mới
handleAddCustomer(event)

// Xem chi tiết
viewCustomerDetails(customerId)

// Chỉnh sửa
editCustomer(customerId)

// Xóa
deleteCustomer(customerId)
```

#### `order.js` - Quản lý Order
```javascript
// Load giao diện
loadOrders()

// Lấy danh sách
fetchAllOrders()

// Tìm kiếm
searchOrders()

// Lọc theo trạng thái
filterOrdersByStatus()

// Xem chi tiết
viewOrderDetails(orderId)

// Cập nhật trạng thái
updateOrderStatus(orderId)

// Xóa đơn hàng
deleteOrder(orderId)

// Thống kê
loadOrderStats()
```

#### `app.js` - Ứng dụng chính
```javascript
// Trang chủ
loadHome()

// Sản phẩm
loadProducts()
fetchAllProducts()
searchProducts()
filterProducts(category)
searchByCategory()
displayProducts(products)

// Quản lý
loadManagement()
loadManagementProducts()
handleAddProduct(event)
editProduct(id)
handleEditProduct(event, id)
deleteProduct(id)

// Test
testConnection()
```

---

## 🚀 Các tính năng

### 1️⃣ Đăng ký / Đăng nhập

**Quy trình:**
```
Nhấn "👥 Người dùng" → Chọn tab "📝 Đăng ký"
↓
Điền: Tên đăng nhập, Email, Mật khẩu, Họ tên
↓
Nhấn "✅ Đăng ký"
```

**Dữ liệu yêu cầu:**
```json
{
  "username": "string (50 ký tự)",
  "email": "email",
  "password": "string",
  "fullName": "string (100 ký tự)"
}
```

### 2️⃣ Giỏ hàng

**Thêm sản phẩm:**
```
Nhấn "📦 Sản phẩm"
↓
Chọn sản phẩm → Nhấn "🛒 Thêm vào giỏ"
↓
Thông báo xác nhận
```

**Xem giỏ hàng:**
```
Nhấn "🛒 Giỏ hàng"
↓
Xem danh sách sản phẩm
↓
Cập nhật số lượng hoặc xóa sản phẩm
```

**Dữ liệu giỏ (localStorage):**
```json
{
  "id": "number",
  "productId": "number",
  "productName": "string",
  "price": "number",
  "quantity": "number",
  "subtotal": "number"
}
```

### 3️⃣ Tạo đơn hàng

**Quy trình:**
```
1. Thêm sản phẩm vào giỏ
2. Nhấn "💳 Thanh toán"
3. Chọn khách hàng
4. Nhập địa chỉ giao hàng
5. Nhấn "✅ Tạo đơn hàng"
```

**Dữ liệu đơn hàng:**
```json
{
  "customerId": "number",
  "totalAmount": "decimal",
  "shippingAddress": "string",
  "orderItems": [
    {
      "productId": "number",
      "price": "decimal",
      "quantity": "number",
      "subtotal": "decimal"
    }
  ]
}
```

### 4️⃣ Quản lý User

**Danh sách:**
```
Nhấn "👥 Người dùng" → Tab "📋 Danh sách"
↓
Xem tất cả user
↓
Các thao tác: Xem chi tiết, Sửa, Xóa
```

**Trạng thái User:**
- ✅ `1` = Hoạt động
- 🔒 `0` = Khóa

**Vai trò User:**
- `ADMIN` = Quản trị viên
- `STAFF` = Nhân viên
- `CUSTOMER` = Khách hàng

### 5️⃣ Quản lý Customer

**Thêm khách hàng:**
```
Nhấn "👤 Khách hàng" → Tab "➕ Thêm khách hàng"
↓
Chọn User
↓
Điền: Họ tên, SĐT, Địa chỉ, Giới tính, Ngày sinh
↓
Nhấn "✅ Thêm khách hàng"
```

**Giới tính:**
- `0` = Nữ
- `1` = Nam
- `-1` = Khác

### 6️⃣ Quản lý Order

**Xem danh sách:**
```
Nhấn "📋 Đơn hàng" → Tab "📄 Danh sách đơn hàng"
↓
Tìm kiếm hoặc lọc theo trạng thái
↓
Xem chi tiết, Cập nhật, hoặc Hủy
```

**Trạng thái đơn hàng:**
- ⏳ `PENDING` = Chờ xác nhận
- ✅ `CONFIRMED` = Đã xác nhận
- 🚚 `SHIPPING` = Đang giao
- 🎉 `COMPLETED` = Hoàn thành
- ❌ `CANCELLED` = Đã hủy

**Thống kê:**
```
Nhấn "📋 Đơn hàng" → Tab "📊 Thống kê"
↓
Xem: Tổng đơn hàng, Doanh thu, Thống kê theo trạng thái
```

### 7️⃣ Quản lý Sản phẩm

**Thêm sản phẩm:**
```
Nhấn "⚙️ Quản lý" 
↓
Điền: Tên, Mô tả, Giá, Kho, Danh mục
↓
Nhấn "✅ Thêm mới"
```

**Chỉnh sửa:**
```
Nhấn "⚙️ Quản lý"
↓
Nhấn "✏️ Sửa" trên sản phẩm
↓
Cập nhật thông tin
↓
Nhấn "💾 Cập nhật"
```

---

## 🔌 API Reference

### Users API
```
POST /api/users/login
  Body: { username, password }
  Response: { user: { id, username, email, role, status } }

POST /api/users/register
  Body: { username, email, password, fullName }
  Response: { user: { ... }, message }

GET /api/users
  Response: [{ id, username, email, role, status, ... }]

GET /api/users/{id}
  Response: { id, username, email, role, status, ... }

PUT /api/users/{id}
  Body: { email, role, status }
  Response: { user: { ... }, message }

DELETE /api/users/{id}
  Response: { message }
```

### Customers API
```
GET /api/customers
  Response: [{ id, userId, fullName, phone, address, gender, birthDate, ... }]

GET /api/customers/{id}
  Response: { id, userId, fullName, phone, address, gender, birthDate, ... }

POST /api/customers
  Body: { userId, fullName, phone, address, gender, birthDate }
  Response: { ... }

PUT /api/customers/{id}
  Body: { fullName, phone, address, gender, birthDate }
  Response: { ... }

DELETE /api/customers/{id}
  Response: { message }
```

### Orders API
```
GET /api/orders
  Response: [{ id, customerId, orderCode, totalAmount, status, 
              shippingAddress, createdAt, customer: {...}, orderItems: [...] }]

GET /api/orders/{id}
  Response: { id, customerId, orderCode, totalAmount, status, 
              shippingAddress, createdAt, customer, orderItems }

POST /api/orders
  Body: { customerId, totalAmount, shippingAddress, orderItems: [...] }
  Response: { ... }

PUT /api/orders/{id}
  Body: { customerId, orderCode, totalAmount, status, shippingAddress }
  Response: { ... }

DELETE /api/orders/{id}
  Response: { message }
```

### Products API
```
GET /api/products
  Response: [{ id, name, description, price, stock, category, ... }]

GET /api/products/{id}
  Response: { id, name, description, price, stock, category, ... }

GET /api/products/category/{category}
  Response: [{ id, name, description, price, stock, category, ... }]

POST /api/products
  Body: { name, description, price, stock, category }
  Response: { ... }

PUT /api/products/{id}
  Body: { name, description, price, stock, category }
  Response: { ... }

DELETE /api/products/{id}
  Response: { message }
```

---

## 🛠️ Troubleshooting

### ❌ Lỗi "Không kết nối được Backend"

**Kiểm tra:**
1. Backend đang chạy?
   ```bash
   # Kiểm tra port 5000
   lsof -i :5000  # macOS/Linux
   netstat -ano | findstr :5000  # Windows
   ```

2. URL config.js đúng?
   ```javascript
   // js/config.js
   const CONFIG = {
       BACKEND_URL: 'http://localhost:5000'  // Đúng port?
   };
   ```

3. CORS được kích hoạt?
   ```csharp
   // Program.cs
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowFrontend", policy =>
       {
           policy.WithOrigins("http://localhost:5500")
                 .AllowAnyHeader()
                 .AllowAnyMethod();
       });
   });
   ```

### ❌ Lỗi "401 Unauthorized" khi đăng nhập

**Kiểm tra:**
1. Username/Password đúng?
2. User đã tạo trong database?
3. Check console backend có lỗi?

### ❌ Lỗi CORS

**Giải pháp:**
```javascript
// api.js - Thêm credentials
const response = await fetch(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'  // Thêm dòng này
});
```

### ❌ Giỏ hàng không lưu

**Kiểm tra:**
1. localStorage bị vô hiệu?
   ```javascript
   // Console
   localStorage.setItem('test', 'value');
   localStorage.getItem('test');
   ```

2. Xóa cache browser
   - Ctrl+Shift+Del (hoặc Cmd+Shift+Del trên Mac)
   - Chọn "Cookies and cached files"
   - Xóa

### ❌ Form không gửi được

**Kiểm tra:**
1. Browser console có lỗi?
   - Nhấn F12 → Console
   - Tìm red error messages

2. Dữ liệu đầu vào hợp lệ?
   - Email format đúng?
   - Các trường bắt buộc đã điền?

3. Backend API đang chạy?

---

## 🔍🐛 Chế độ Debug

**Bật logging chi tiết:**
```javascript
// api.js - Thêm vào class ApiService
console.log('🔍 Request:', {
    method: method,
    url: url,
    body: body,
    headers: headers
});
```

**Kiểm tra localStorage:**
```javascript
// Console
console.log(JSON.parse(localStorage.getItem('cart')));
console.log(JSON.parse(localStorage.getItem('currentUser')));
```

**Kiểm tra Network:**
1. Nhấn F12 → Network tab
2. Làm hành động (đăng nhập, thêm sản phẩm, v.v)
3. Xem request/response chi tiết

---

## 💡 Tips & Tricks

### Tăng tốc độ phát triển
```bash
# Sử dụng Live Server
# VS Code: Right-click index.html → Open with Live Server
```

### Reset dữ liệu
```javascript
// Console
localStorage.clear();
location.reload();
```

### Test API nhanh
```bash
# Sử dụng curl hoặc Postman
curl -X GET http://localhost:5000/api/products
```

---

## 📞 Liên hệ

Gặp vấn đề? Kiểm tra:
1. Console browser (F12)
2. Network requests (F12 → Network)
3. Backend logs
4. API documentation

---

**Cập nhật:** 2026-01-14
