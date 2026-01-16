# 🚀 Hướng Dẫn Cài Đặt Nhanh Frontend ShopToysHG

## 📋 Yêu Cầu Hệ Thống

- 🌐 Trình duyệt hiện đại (Chrome, Firefox, Edge, Safari)
- 🔧 Backend ShopToysHG đang chạy trên `http://localhost:5000`
- ✅ CORS được kích hoạt trên Backend

## 📝 Các Bước Cài Đặt

### Bước 1: Kiểm tra Backend

```bash
# Kiểm tra Backend đang chạy
curl http://localhost:5000/api/products

# Hoặc truy cập trên browser
http://localhost:5000/swagger/index.html
```

### Bước 2: Cấu hình Frontend

1. Mở file `js/config.js`
2. Đảm bảo URL chính xác:

```javascript
const CONFIG = {
    BACKEND_URL: 'http://localhost:5000',  // Đổi nếu cần
    TIMEOUT: 5000
};
```

### Bước 3: Chạy Frontend

#### **Cách 1: Sử dụng Live Server (VS Code)**
```
1. Chuột phải vào index.html
2. Chọn "Open with Live Server"
3. Tự động mở http://localhost:5500
```

#### **Cách 2: Sử dụng Python**
```bash
cd Shop.ToysHG.Web
python -m http.server 8000

# Truy cập: http://localhost:8000
```

#### **Cách 3: Sử dụng Node.js**
```bash
npm install -g http-server
cd Shop.ToysHG.Web
http-server

# Truy cập: http://localhost:8080
```

#### **Cách 4: Sử dụng PHP**
```bash
cd Shop.ToysHG.Web
php -S localhost:8000

# Truy cập: http://localhost:8000
```

## ✅ Thử Nghiệm Tính Năng

### 1️⃣ Test Kết Nối
```
Nhấn nút "🔧 Test kết nối"
✅ Nếu thấy "✅ Kết nối thành công!" thì OK
```

### 2️⃣ Test Sản Phẩm
```
Nhấn "📦 Sản phẩm"
✅ Xem được danh sách sản phẩm từ backend
```

### 3️⃣ Test Giỏ Hàng
```
Nhấn "📦 Sản phẩm" → "🛒 Thêm vào giỏ"
✅ Nhấn "🛒 Giỏ hàng"
✅ Xem được sản phẩm đã thêm
```

### 4️⃣ Test Đăng Ký/Đăng Nhập
```
Nhấn "👥 Người dùng" → Tab "📝 Đăng ký"
✅ Điền thông tin → Nhấn "✅ Đăng ký"
✅ Sau đó "🔑 Đăng nhập"
```

### 5️⃣ Test Quản Lý
```
Nhấn "⚙️ Quản lý"
✅ Thêm sản phẩm mới
✅ Chỉnh sửa hoặc xóa sản phẩm
```

## 🔍 Kiểm Tra Lỗi

### Nếu không thấy sản phẩm

**Kiểm tra:**
```
1. Nhấn F12 → Console
2. Kiểm tra có lỗi không (red text)
3. Kiểm tra Network tab → Requests có thành công không
4. Backend có dữ liệu sản phẩm không
```

**Giải pháp:**
```bash
# Backend: Thêm sản phẩm test
# POST /api/products
{
  "name": "Gấu bông test",
  "price": 100000,
  "stock": 10,
  "category": "Gấu bông"
}
```

### Nếu CORS lỗi

**Backend Program.cs cần có:**
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:*")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

app.UseCors("AllowFrontend");
```

### Nếu không kết nối được Backend

**Kiểm tra:**
```bash
# Port 5000 có lắng nghe không?
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux

# Ping Backend
curl http://localhost:5000/health
```

## 📂 Cấu Trúc Tập Cần Thiết

```
Shop.ToysHG.Web/
├── index.html                 ← Trang chính
├── css/
│   └── style.css            ← CSS chính
├── js/
│   ├── config.js            ← Cấu hình
│   ├── api.js               ← API Service
│   ├── auth.js              ← Auth Service
│   ├── cart.js              ← Cart Service
│   ├── user.js              ← User UI
│   ├── customer.js          ← Customer UI
│   ├── order.js             ← Order UI
│   └── app.js               ← App chính
├── API_EXAMPLES.js          ← Ví dụ API
├── TEST_CONSOLE.js          ← Test helpers
├── GUIDE.md                 ← Hướng dẫn chi tiết
└── README.md                ← Readme
```

## 🎮 Dùng Console để Test

Nhấn `F12` → `Console` → Gõ:

```javascript
// Xem dữ liệu hiện tại
checkAllData()

// Khởi tạo dữ liệu test
initTestData()

// Thêm sản phẩm vào giỏ
addToCart(1, 'Gấu bông', 150000)

// Xem giỏ hàng
console.log(getCartItems())

// Xem tổng tiền
console.log(getCartTotal())

// Xem hướng dẫn
help()
```

> 📌 Cần `TEST_CONSOLE.js` được load (tự động trong `index.html`)

## 📊 Dữ Liệu Test

### User Test
```
Username: testuser
Password: password123
Email: test@example.com
```

### Sản Phẩm Test
```
Gấu bông xanh - 150,000đ
Xe đồ chơi - 200,000đ
Búp bê Barbie - 300,000đ
```

## 📱 Kiểm Tra Responsive

```
F12 → Ctrl+Shift+M (hoặc Cmd+Shift+M)
→ Chọn kích thước khác nhau
```

Các kích thước được hỗ trợ:
- 📱 Mobile: < 768px
- 📱 Tablet: 768px - 1024px
- 💻 Desktop: > 1024px

## 📚 Tài Liệu Thêm

| Tập | Mô Tả |
|-----|-------|
| **GUIDE.md** | Hướng dẫn chi tiết tất cả tính năng |
| **API_EXAMPLES.js** | Ví dụ requests cho tất cả API |
| **TEST_CONSOLE.js** | Helper functions để test |

## ⚡ Lệnh Nhanh

### Xóa Cache
```
Ctrl+Shift+Del → Cookies and cached files → Clear
```

### Reload Hard
```
Ctrl+Shift+R (hoặc Cmd+Shift+R)
```

### Xem Console Errors
```
F12 → Console → Xem red error messages
```

### Xem Network Requests
```
F12 → Network → Reload page → Xem requests
```

## ✅ Hoàn Tất!

Nếu bạn có thể:
- ✅ Xem được danh sách sản phẩm
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Đăng ký/đăng nhập
- ✅ Quản lý users, customers, orders

→ **Thiết lập đã hoàn tất!** 🎉

## 📞 Liên Hệ Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra Console (F12)
2. Kiểm tra Network requests
3. Kiểm tra Backend logs
4. Đọc GUIDE.md
5. Test API bằng Postman/curl

---

**Lần cập nhật cuối:** 2026-01-14  
**Phiên bản:** 1.0.0
