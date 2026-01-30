/**
 * Ứng dụng Frontend chính
 */

// Khởi tạo khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Ứng dụng đã tải');
    renderNavigation(); // ← Render menu theo role
    checkBackendStatus();
});

/**
 * Kiểm tra trạng thái Backend
 */
async function checkBackendStatus() {
    const isConnected = await api.testConnection();
    const statusElement = document.getElementById('backend-status');
    
    if (isConnected) {
        statusElement.textContent = '🟢 Đã kết nối';
        statusElement.style.color = 'green';
    } else {
        statusElement.textContent = '🔴 Chưa kết nối';
        statusElement.style.color = 'red';
    }
}

/**
 * Render Navigation Menu theo Role
 */
function renderNavigation() {
    const nav = document.querySelector('nav');
    const user = getCurrentUser();
    
    let menuHTML = '';

    // Tất cả role
    menuHTML += '<button onclick="loadHome()">🏠 Trang chủ</button>';
    menuHTML += '<button onclick="loadProducts()">📦 Sản phẩm</button>';

    // Giỏ hàng + Đơn hàng (CUSTOMER ONLY)
    if (user.role === 'CUSTOMER') {
        menuHTML += '<button onclick="loadCart()">🛒 Giỏ hàng</button>';
        menuHTML += '<button onclick="loadOrders()">📋 Đơn hàng</button>';
        menuHTML += '<button onclick="loadProfile()">👤 Hồ Sơ</button>';
    }

    // Người dùng + Khách hàng + Quản lý (ADMIN ONLY)
    if (user.role === 'ADMIN') {
        menuHTML += '<button onclick="loadUsers()">👥 Người dùng</button>';
        menuHTML += '<button onclick="loadCustomers()">👤 Khách hàng</button>';
        menuHTML += '<button onclick="loadManagement()">⚙️ Quản lý</button>';
    }

    // Test kết nối (Tất cả)
    menuHTML += '<button onclick="testConnection()">🔧 Test kết nối</button>';

    // Đăng nhập / Đăng ký (ANONYMOUS ONLY)
    if (user.role === 'ANONYMOUS') {
        menuHTML += '<button onclick="loadLoginForm()">🔑 Đăng nhập</button>';
        menuHTML += '<button onclick="loadRegisterForm()">✍️ Đăng ký</button>';
    }

    // Đăng xuất (CUSTOMER + ADMIN)
    if (user.role !== 'ANONYMOUS') {
        menuHTML += '<button onclick="handleLogout()" style="background: #dc3545;">🚪 Đăng xuất</button>';
    }

    nav.innerHTML = menuHTML;
}

/**
 * Xử lý Đăng xuất
 */
function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        logoutUser();
        renderNavigation(); // Cập nhật menu
        loadHome(); // Quay lại trang chủ
        alert('✅ Đăng xuất thành công!');
    }
}

/**
 * Load trang chủ
 */
function loadHome() {
    const user = getCurrentUser();
    const content = document.getElementById('content');
    
    let welcomeText = '';
    if (user.role === 'ANONYMOUS') {
        welcomeText = 'Chào mừng khách! Vui lòng đăng nhập để mua sắm.';
    } else if (user.role === 'CUSTOMER') {
        welcomeText = `Xin chào ${user.username}! Chào mừng đến ShopToysHG!`;
    } else if (user.role === 'ADMIN') {
        welcomeText = `Xin chào Admin ${user.username}! Chào mừng đến trang quản trị!`;
    }
    
    content.innerHTML = `
        <div class="section">
            <h2>🏠 Trang chủ</h2>
            <p>${welcomeText}</p>
            <p>Đây là ứng dụng Frontend kết nối với Backend .NET Core 9</p>
            <p>Tổng cộng: <strong id="total-products">0</strong> sản phẩm</p>
            ${user.role === 'CUSTOMER' ? '<p>Giỏ hàng: <strong id="cart-count">0</strong> sản phẩm</p>' : ''}
            <button onclick="loadProducts()">Xem tất cả sản phẩm</button>
            ${user.role === 'CUSTOMER' ? '<button onclick="loadCart()">Xem giỏ hàng</button>' : ''}
            <button onclick="testConnection()">Test kết nối</button>
        </div>
    `;
    fetchTotalProducts();
    if (user.role === 'CUSTOMER') {
        updateCartCount();
    }
}

/**
 * Tiến hành thanh toán
 */
function proceedToCheckout() {
    const user = getCurrentUser();
    
    if (!user) {
        alert('⚠️ Bạn cần đăng nhập để thanh toán!');
        switchUserTab('login');
        return;
    }

    // Chuyển đến tạo đơn hàng
    switchOrderTab('create');
    loadOrders();
}

/**
 * Load sản phẩm
 */
function loadProducts() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="section">
            <h2>📦 Danh sách sản phẩm</h2>
            
            <div class="search-container">
                <input type="text" id="search-input" placeholder="🔍 Tìm kiếm theo tên..." onkeyup="searchProducts()">
                <select id="category-search" onchange="searchByCategory()" style="margin-left: 10px; padding: 10px 15px; border: 2px solid #dee2e6; border-radius: 25px; font-size: 1em; cursor: pointer;">
                    <option value="">🔽 Tìm kiếm theo danh mục</option>
                    <option value="Gấu bông">Gấu bông</option>
                    <option value="Búp bê">Búp bê</option>
                    <option value="Xe đồ chơi">Xe đồ chơi</option>
                    <option value="Lego & Xây dựng">Lego & Xây dựng</option>
                    <option value="Trò chơi bàn">Trò chơi bàn</option>
                    <option value="Nhân vật & Mô hình">Nhân vật & Mô hình</option>
                </select>
            </div>

            <div class="filter">
                <button onclick="filterProducts('all')" class="active">Tất cả</button>
                <button onclick="filterProducts('Gấu bông')">Gấu bông</button>
                <button onclick="filterProducts('Búp bê')">Búp bê</button>
                <button onclick="filterProducts('Xe đồ chơi')">Xe đồ chơi</button>
                <button onclick="filterProducts('Lego & Xây dựng')">Lego</button>
                <button onclick="filterProducts('Trò chơi bàn')">Trò chơi bàn</button>
                <button onclick="filterProducts('Nhân vật & Mô hình')">Nhân vật</button>
            </div>
            <div id="products-container" class="products-grid"></div>
        </div>
    `;
    fetchAllProducts();
}

/**
 * Lấy tất cả sản phẩm từ Backend
 */
async function fetchAllProducts() {
    const result = await api.get('/api/products');
    const container = document.getElementById('products-container');

    if (result.success) {
        displayProducts(result.data);
    } else {
        container.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error}</p>`;
    }
}

/**
 * Lọc sản phẩm theo danh mục
 */
async function filterProducts(category) {
    const container = document.getElementById('products-container');
    
    if (category === 'all') {
        fetchAllProducts();
        return;
    }

    const result = await api.get(`/api/products/category/${category}`);

    if (result.success) {
        displayProducts(result.data);
        // Cập nhật nút active
        document.querySelectorAll('.filter button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    } else {
        container.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error}</p>`;
    }
}

/**
 * Tìm kiếm sản phẩm theo tên
 */
async function searchProducts() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const container = document.getElementById('products-container');

    if (searchValue.trim() === '') {
        // Nếu search trống, hiển thị tất cả
        fetchAllProducts();
        return;
    }

    const result = await api.get('/api/products');

    if (result.success) {
        // Lọc sản phẩm dựa vào tên
        const filtered = result.data.filter(product =>
            product.name.toLowerCase().includes(searchValue)
        );
        displayProducts(filtered);
    } else {
        container.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error}</p>`;
    }
}

/**
 * Tìm kiếm sản phẩm theo danh mục (dropdown)
 */
async function searchByCategory() {
    const categoryValue = document.getElementById('category-search').value;
    const container = document.getElementById('products-container');

    if (categoryValue === '') {
        // Nếu chưa chọn, hiển thị tất cả
        fetchAllProducts();
        return;
    }

    const result = await api.get(`/api/products/category/${categoryValue}`);

    if (result.success) {
        displayProducts(result.data);
    } else {
        container.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error}</p>`;
    }
}

/**
 * Hiển thị sản phẩm
 */
function displayProducts(products) {
    const container = document.getElementById('products-container');
    
    if (!products || products.length === 0) {
        container.innerHTML = '<p>Không có sản phẩm nào</p>';
        return;
    }

    const html = products.map(product => `
        <div class="product-card">
            <div class="product-header">
                <h3>${product.name}</h3>
                <span class="category-badge">${product.category}</span>
            </div>
            <p class="product-description">${product.description || 'Không có mô tả'}</p>
            <div class="product-footer">
                <div class="product-price">
                    <strong>₫${Number(product.price).toLocaleString('vi-VN')}</strong>
                </div>
                <div class="product-stock">
                    Kho: <span class="${product.stock > 0 ? 'in-stock' : 'out-stock'}">${product.stock}</span>
                </div>
            </div>
            <button class="btn-add-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price}); updateCartCount();">
                🛒 Thêm vào giỏ
            </button>
        </div>
    `).join('');

    container.innerHTML = html;
}

/**
 * Load trang Quản lý (CRUD)
 */
function loadManagement() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="section">
            <h2>⚙️ Quản lý sản phẩm (CRUD)</h2>
            
            <div class="management-container">
                <div class="form-section">
                    <h3>➕ Thêm sản phẩm mới</h3>
                    <form id="add-product-form" onsubmit="handleAddProduct(event)">
                        <input type="text" id="product-name" placeholder="Tên sản phẩm" required>
                        <textarea id="product-desc" placeholder="Mô tả" rows="3"></textarea>
                        <input type="number" id="product-price" placeholder="Giá" required min="0">
                        <input type="number" id="product-stock" placeholder="Kho" required min="0">
                        <input type="text" id="product-category" placeholder="Danh mục" required>
                        <button type="submit">💾 Thêm mới</button>
                    </form>
                </div>

                <div class="list-section">
                    <h3>📋 Danh sách sản phẩm</h3>
                    <div id="management-products-list"></div>
                </div>
            </div>
        </div>
    `;
    loadManagementProducts();
}

/**
 * Load danh sách sản phẩm cho quản lý
 */
async function loadManagementProducts() {
    const result = await api.get('/api/products');
    const listDiv = document.getElementById('management-products-list');

    if (result.success) {
        const html = result.data.map(product => `
            <div class="management-item">
                <div class="item-info">
                    <strong>${product.name}</strong> - ₫${Number(product.price).toLocaleString('vi-VN')}
                    <br><small>${product.category} | Kho: ${product.stock}</small>
                </div>
                <div class="item-actions">
                    <button onclick="editProduct(${product.id})" class="btn-edit">✏️ Sửa</button>
                    <button onclick="deleteProduct(${product.id})" class="btn-delete">🗑️ Xóa</button>
                </div>
            </div>
        `).join('');
        listDiv.innerHTML = html;
    } else {
        listDiv.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error}</p>`;
    }
}

/**
 * Thêm sản phẩm mới
 */
async function handleAddProduct(event) {
    event.preventDefault();

    const newProduct = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-desc').value,
        price: Number(document.getElementById('product-price').value),
        stock: Number(document.getElementById('product-stock').value),
        category: document.getElementById('product-category').value
    };

    const result = await api.post('/api/products', newProduct);

    if (result.success) {
        alert('✅ Thêm sản phẩm thành công!');
        document.getElementById('add-product-form').reset();
        loadManagementProducts();
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Chỉnh sửa sản phẩm
 */
async function editProduct(id) {
    const result = await api.get(`/api/products/${id}`);

    if (!result.success) {
        alert('❌ Không tìm thấy sản phẩm');
        return;
    }

    const product = result.data;
    
    // Tạo form sửa
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="section">
            <h2>✏️ Sửa sản phẩm</h2>
            <form id="edit-product-form" onsubmit="handleEditProduct(event, ${id})">
                <input type="text" id="edit-name" value="${product.name}" placeholder="Tên sản phẩm" required>
                <textarea id="edit-desc" placeholder="Mô tả" rows="3">${product.description || ''}</textarea>
                <input type="number" id="edit-price" value="${product.price}" placeholder="Giá" required min="0">
                <input type="number" id="edit-stock" value="${product.stock}" placeholder="Kho" required min="0">
                <input type="text" id="edit-category" value="${product.category || ''}" placeholder="Danh mục" required>
                <div style="display: flex; gap: 10px;">
                    <button type="submit">💾 Cập nhật</button>
                    <button type="button" onclick="loadManagement()" style="background: #6c757d;">❌ Hủy</button>
                </div>
            </form>
        </div>
    `;
}

/**
 * Xử lý cập nhật sản phẩm
 */
async function handleEditProduct(event, id) {
    event.preventDefault();

    const updatedProduct = {
        name: document.getElementById('edit-name').value,
        description: document.getElementById('edit-desc').value,
        price: Number(document.getElementById('edit-price').value),
        stock: Number(document.getElementById('edit-stock').value),
        category: document.getElementById('edit-category').value
    };

    const updateResult = await api.put(`/api/products/${id}`, updatedProduct);

    if (updateResult.success) {
        alert('✅ Cập nhật sản phẩm thành công!');
        loadManagement();
    } else {
        alert(`❌ Lỗi: ${updateResult.error}`);
    }
}

/**
 * Xóa sản phẩm
 */
async function deleteProduct(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    const result = await api.delete(`/api/products/${id}`);

    if (result.success) {
        alert('✅ Xóa sản phẩm thành công!');
        loadManagementProducts();
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Test kết nối Backend
 */
async function testConnection() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="section">
            <h2>⚙️ Test kết nối</h2>
            <p>⏳ Đang kiểm tra...</p>
        </div>
    `;

    const isConnected = await api.testConnection();
    
    if (isConnected) {
        content.innerHTML = `
            <div class="section success">
                <h2>✅ Kết nối thành công!</h2>
                <p>Backend đang chạy tại: <strong>${CONFIG.BACKEND_URL}</strong></p>
                <p>Swagger UI: <a href="${CONFIG.BACKEND_URL}/swagger" target="_blank">Mở Swagger</a></p>
                <button onclick="loadProducts()">Xem sản phẩm</button>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div class="section error">
                <h2>❌ Lỗi kết nối</h2>
                <p>Không thể kết nối đến: <strong>${CONFIG.BACKEND_URL}</strong></p>
                <p>Vui lòng kiểm tra:</p>
                <ul>
                    <li>Backend đang chạy?</li>
                    <li>URL đúng không?</li>
                    <li>CORS được kích hoạt?</li>
                </ul>
            </div>
        `;
    }
}

// Tự động load trang chủ khi mở
loadHome();

/**
 * Load trang Người dùng (Admin)
 */
function loadUsers() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="section">
            <h2>👥 Quản lý Người dùng</h2>
            <div id="users-list" class="management-list"></div>
        </div>
    `;
    fetchUsers();
}

/**
 * Lấy danh sách người dùng
 */
async function fetchUsers() {
    const result = await api.get('/api/users');
    const listDiv = document.getElementById('users-list');

    if (result.success && Array.isArray(result.data)) {
        const html = result.data.map(user => `
            <div class="management-item">
                <div class="item-info">
                    <strong>${user.username}</strong> (${user.role})
                    <br><small>Email: ${user.email} | Status: ${user.status === 1 ? '✅ Active' : '❌ Locked'}</small>
                </div>
                <div class="item-actions">
                    <button onclick="viewUser(${user.id})" class="btn-edit">👁️ Xem</button>
                </div>
            </div>
        `).join('');
        listDiv.innerHTML = html;
    } else {
        listDiv.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error || 'Không thể lấy danh sách'}</p>`;
    }
}

/**
 * Load trang Khách hàng (Admin)
 */
function loadCustomers() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="section">
            <h2>👤 Quản lý Khách hàng</h2>
            <div id="customers-list" class="management-list"></div>
        </div>
    `;
    fetchCustomers();
}

/**
 * Lấy danh sách khách hàng
 */
async function fetchCustomers() {
    const result = await api.get('/api/customers');
    const listDiv = document.getElementById('customers-list');

    if (result.success && Array.isArray(result.data)) {
        const html = result.data.map(customer => `
            <div class="management-item">
                <div class="item-info">
                    <strong>${customer.fullName}</strong>
                    <br><small>SĐT: ${customer.phone || 'N/A'} | Địa chỉ: ${customer.address || 'N/A'}</small>
                </div>
                <div class="item-actions">
                    <button onclick="viewCustomer(${customer.id})" class="btn-edit">👁️ Xem</button>
                </div>
            </div>
        `).join('');
        listDiv.innerHTML = html;
    } else {
        listDiv.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error || 'Không thể lấy danh sách'}</p>`;
    }
}

/**
 * Load trang Đơn hàng
 */
function loadOrders() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="section">
            <h2>📋 Đơn hàng</h2>
            <div id="orders-list" class="management-list"></div>
        </div>
    `;
    fetchOrders();
}

/**
 * Lấy danh sách đơn hàng
 */
async function fetchOrders() {
    const result = await api.get('/api/orders');
    const listDiv = document.getElementById('orders-list');

    if (result.success && Array.isArray(result.data)) {
        const html = result.data.map(order => `
            <div class="management-item">
                <div class="item-info">
                    <strong>${order.orderCode}</strong> - ₫${Number(order.totalAmount).toLocaleString('vi-VN')}
                    <br><small>Status: ${order.status} | Ngày: ${new Date(order.createdAt).toLocaleDateString('vi-VN')}</small>
                </div>
                <div class="item-actions">
                    <button onclick="viewOrder(${order.id})" class="btn-edit">👁️ Xem chi tiết</button>
                </div>
            </div>
        `).join('');
        listDiv.innerHTML = html;
    } else {
        listDiv.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error || 'Không thể lấy danh sách'}</p>`;
    }
}

/**
 * Lấy tổng số sản phẩm
 */
async function fetchTotalProducts() {
    const result = await api.get('/api/products');
    const totalElement = document.getElementById('total-products');
    
    if (result.success && Array.isArray(result.data)) {
        totalElement.textContent = result.data.length;
    } else {
        totalElement.textContent = '0';
    }
}

/**
 * Cập nhật số lượng giỏ hàng
 */
async function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return; // Nếu không có element, bỏ qua
    
    const count = await getCartCount();
    cartCountElement.textContent = count;
}

/**
 * Load form Đăng nhập / Đăng ký
 */
function loadAuthForms() {
    const content = document.getElementById('content');
    const user = getCurrentUser();
    
    // Nếu đã login, không hiển thị form
    if (user.role !== 'ANONYMOUS') {
        alert('✅ Bạn đã đăng nhập rồi!');
        loadHome();
        return;
    }
    
    content.innerHTML = `
        <div class="auth-wrapper">
            <!-- TAB CHỌN -->
            <div class="auth-tabs">
                <button class="auth-tab-btn active" onclick="switchAuthTab('login')">🔑 Đăng Nhập</button>
                <button class="auth-tab-btn" onclick="switchAuthTab('register')">✍️ Đăng Ký</button>
            </div>

            <!-- FORM ĐĂNG NHẬP -->
            <div class="auth-form-container active" id="login-form-container">
                <div class="auth-form">
                    <h2>🔑 Đăng Nhập</h2>
                    <p class="auth-subtitle">Nhập thông tin để đăng nhập vào tài khoản</p>
                    
                    <form onsubmit="handleLogin(event)">
                        <div class="form-group">
                            <label>📝 Username</label>
                            <input type="text" id="login-username" placeholder="Nhập username của bạn" required>
                        </div>
                        
                        <div class="form-group">
                            <label>🔐 Password</label>
                            <input type="password" id="login-password" placeholder="Nhập password của bạn" required>
                        </div>
                        
                        <button type="submit" class="btn-primary btn-large">🔓 Đăng Nhập</button>
                    </form>
                    
                    <div class="auth-divider">hoặc</div>
                    
                    <p class="auth-footer">
                        Chưa có tài khoản? 
                        <a href="#" onclick="switchAuthTab('register'); return false;">Đăng ký ngay</a>
                    </p>
                </div>
            </div>

            <!-- FORM ĐĂNG KÝ -->
            <div class="auth-form-container" id="register-form-container">
                <div class="auth-form">
                    <h2>✍️ Đăng Ký Tài Khoản</h2>
                    <p class="auth-subtitle">Tạo tài khoản mới để bắt đầu mua sắm</p>
                    
                    <form onsubmit="handleRegister(event)">
                        <div class="form-group">
                            <label>📝 Username</label>
                            <input type="text" id="register-username" placeholder="Chọn username (ít nhất 3 ký tự)" required minlength="3" autofocus>
                        </div>
                        
                        <div class="form-group">
                            <label>📧 Email</label>
                            <input type="email" id="register-email" placeholder="Nhập email của bạn" required>
                        </div>
                        
                        <div class="form-group">
                            <label>👤 Họ Tên</label>
                            <input type="text" id="register-fullname" placeholder="Nhập họ và tên" required>
                        </div>
                        
                        <div class="form-group">
                            <label>🔐 Password</label>
                            <input type="password" id="register-password" placeholder="Nhập password (ít nhất 6 ký tự)" required minlength="6">
                        </div>
                        
                        <div class="form-group">
                            <label>✓ Xác Nhận Password</label>
                            <input type="password" id="register-password-confirm" placeholder="Nhập lại password" required minlength="6">
                        </div>
                        
                        <button type="submit" class="btn-primary btn-large">📝 Đăng Ký</button>
                    </form>
                    
                    <div class="auth-divider">hoặc</div>
                    
                    <p class="auth-footer">
                        Đã có tài khoản? 
                        <a href="#" onclick="switchAuthTab('login'); return false;">Đăng nhập ngay</a>
                    </p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Chuyển đổi giữa tab Đăng nhập và Đăng ký
 */
function switchAuthTab(tab) {
    // Ẩn tất cả form
    document.querySelectorAll('.auth-form-container').forEach(container => {
        container.classList.remove('active');
    });
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Hiển thị form được chọn
    if (tab === 'login') {
        document.getElementById('login-form-container').classList.add('active');
        document.querySelectorAll('.auth-tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('register-form-container').classList.add('active');
        document.querySelectorAll('.auth-tab-btn')[1].classList.add('active');
    }
}

/**
 * Xử lý form Đăng nhập
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        alert('❌ Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    console.log('🔍 Logging in with:', { username });
    
    const result = await loginUser(username, password);
    
    if (result.success) {
        alert(`✅ Đăng nhập thành công! Chào mừng ${result.user.username}`);
        renderNavigation();
        loadHome();
    } else {
        alert(`❌ Đăng nhập thất bại!\n${result.error || 'Username hoặc password sai'}`);
        document.getElementById('login-password').value = '';
        document.getElementById('login-username').focus();
    }
}

/**
 * Xử lý form Đăng ký
 */
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const fullName = document.getElementById('register-fullname').value.trim();
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    
    // Validation
    if (!username || !email || !fullName || !password || !passwordConfirm) {
        alert('❌ Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (username.length < 3) {
        alert('❌ Username phải ít nhất 3 ký tự!');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ Password phải ít nhất 6 ký tự!');
        return;
    }
    
    if (password !== passwordConfirm) {
        alert('❌ Password không trùng khớp!');
        document.getElementById('register-password').focus();
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('❌ Email không hợp lệ!');
        return;
    }
    
    console.log('🔍 Registering with:', { username, email, fullName });
    
    const result = await registerUser({
        username,
        email,
        fullName,
        password
    });
    
    if (result.success) {
        alert('✅ Đăng ký thành công!\nVui lòng đăng nhập với tài khoản của bạn.');
        loadLoginForm();
        // Pre-fill username
        setTimeout(() => {
            const usernameInput = document.getElementById('login-username');
            if (usernameInput) {
                usernameInput.value = username;
                usernameInput.focus();
            }
        }, 100);
    } else {
        alert(`❌ Đăng ký thất bại!\n${result.error || 'Username hoặc email đã tồn tại'}`);
        console.error('Register error:', result);
    }
}

/**
 * Load trang ĐĂNG NHẬP riêng
 */
function loadLoginForm() {
    const content = document.getElementById('content');
    const user = getCurrentUser();
    
    // Nếu đã login, không hiển thị form
    if (user.role !== 'ANONYMOUS') {
        alert('✅ Bạn đã đăng nhập rồi!');
        loadHome();
        return;
    }
    
    content.innerHTML = `
        <div class="auth-wrapper">
            <div class="auth-form">
                <h2>🔑 Đăng Nhập</h2>
                <p class="auth-subtitle">Nhập thông tin để đăng nhập vào tài khoản của bạn</p>
                
                <form onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label>📝 Username</label>
                        <input type="text" id="login-username" placeholder="Nhập username của bạn" required autofocus>
                    </div>
                    
                    <div class="form-group">
                        <label>🔐 Password</label>
                        <input type="password" id="login-password" placeholder="Nhập password của bạn" required>
                    </div>
                    
                    <button type="submit" class="btn-primary btn-large">🔓 Đăng Nhập</button>
                </form>
                
                <div class="auth-divider">hoặc</div>
                
                <p class="auth-footer">
                    Chưa có tài khoản? 
                    <a href="#" onclick="loadRegisterForm(); return false;">Đăng ký ngay</a>
                </p>
            </div>
        </div>
    `;
}

/**
 * Load trang ĐĂNG KÝ riêng
 */
function loadRegisterForm() {
    const content = document.getElementById('content');
    const user = getCurrentUser();
    
    // Nếu đã login, không hiển thị form
    if (user.role !== 'ANONYMOUS') {
        alert('✅ Bạn đã đăng nhập rồi!');
        loadHome();
        return;
    }
    
    content.innerHTML = `
        <div class="auth-wrapper">
            <div class="auth-form">
                <h2>✍️ Đăng Ký Tài Khoản</h2>
                <p class="auth-subtitle">Tạo tài khoản mới để bắt đầu mua sắm</p>
                
                <form onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label>📝 Username</label>
                        <input type="text" id="register-username" placeholder="Chọn username (ít nhất 3 ký tự)" required minlength="3" autofocus>
                    </div>
                    
                    <div class="form-group">
                        <label>📧 Email</label>
                        <input type="email" id="register-email" placeholder="Nhập email của bạn" required>
                    </div>
                    
                    <div class="form-group">
                        <label>👤 Họ Tên</label>
                        <input type="text" id="register-fullname" placeholder="Nhập họ và tên" required>
                    </div>
                    
                    <div class="form-group">
                        <label>🔐 Password</label>
                        <input type="password" id="register-password" placeholder="Nhập password (ít nhất 6 ký tự)" required minlength="6">
                    </div>
                    
                    <div class="form-group">
                        <label>✓ Xác Nhận Password</label>
                        <input type="password" id="register-password-confirm" placeholder="Nhập lại password" required minlength="6">
                    </div>
                    
                    <button type="submit" class="btn-primary btn-large">📝 Đăng Ký</button>
                </form>
                
                <div class="auth-divider">hoặc</div>
                
                <p class="auth-footer">
                    Đã có tài khoản? 
                    <a href="#" onclick="loadLoginForm(); return false;">Đăng nhập ngay</a>
                </p>
            </div>
        </div>
    `;
}

/**
 * Load giỏ hàng
 */
async function loadCart() {
    const user = getCurrentUser();
    const content = document.getElementById('content');
    
    // Kiểm tra user đã login hay chưa
    if (user.role === 'ANONYMOUS') {
        content.innerHTML = `
            <div class="section">
                <h2>🛒 Giỏ Hàng</h2>
                <p style="color: #dc3545;">⚠️ Bạn cần đăng nhập để xem giỏ hàng!</p>
                <button onclick="loadLoginForm()">🔑 Đăng nhập</button>
            </div>
        `;
        return;
    }
    
    content.innerHTML = `
        <div class="section">
            <h2>🛒 Giỏ Hàng</h2>
            
            <div id="cart-container" style="margin-top: 20px;">
                <p>⏳ Đang tải...</p>
            </div>
        </div>
    `;
    
    displayCart();
}

/**
 * Hiển thị giỏ hàng
 */
async function displayCart() {
    const items = await getCartItems();
    const total = await getCartTotal();
    const container = document.getElementById('cart-container');
    
    if (!items || items.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 0;">
                <p style="font-size: 1.2em; color: #666;">🛒 Giỏ hàng của bạn trống</p>
                <button onclick="loadProducts()" style="margin-top: 20px;">📦 Tiếp tục mua sắm</button>
            </div>
        `;
        return;
    }
    
    const cartItemsHtml = items.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #dee2e6; margin-bottom: 10px; border-radius: 5px;">
            <div style="flex: 1;">
                <h4 style="margin: 0 0 5px 0;">${item.productName}</h4>
                <p style="margin: 0; color: #666;">
                    Giá: ₫${Number(item.productPrice).toLocaleString('vi-VN')} 
                    | Số lượng: ${item.quantity} 
                    | Thành tiền: ₫${Number(item.subtotal).toLocaleString('vi-VN')}
                </p>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="number" value="${item.quantity}" min="1" 
                       onchange="updateCartQuantity(${item.id}, this.value)"
                       style="width: 60px; padding: 5px; border: 1px solid #dee2e6; border-radius: 3px;">
                <button onclick="removeFromCart(${item.id})" style="background: #dc3545; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer;">
                    🗑️ Xóa
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div style="border: 2px solid #dee2e6; padding: 20px; border-radius: 5px;">
            <h3>📦 Các sản phẩm trong giỏ:</h3>
            ${cartItemsHtml}
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #dee2e6;">
                <h3>💰 Tổng cộng: ₫${Number(total).toLocaleString('vi-VN')}</h3>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button onclick="loadProducts()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ◀️ Tiếp tục mua sắm
                </button>
                <button onclick="proceedCheckout()" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ✅ Thanh toán
                </button>
                <button onclick="clearCartConfirm()" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🗑️ Xóa toàn bộ
                </button>
            </div>
        </div>
    `;
}

/**
 * Xác nhận xóa toàn bộ giỏ
 */
function clearCartConfirm() {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
        clearCart();
    }
}

/**
 * Xử lý thanh toán
 */
async function proceedCheckout() {
    const user = getCurrentUser();
    const items = await getCartItems();
    const total = await getCartTotal();
    
    if (!items || items.length === 0) {
        alert('❌ Giỏ hàng trống!');
        return;
    }
    
    const shippingAddress = prompt('Nhập địa chỉ giao hàng:');
    
    if (!shippingAddress) {
        return;
    }
    
    const orderData = {
        customerId: user.customerId,
        totalAmount: total,
        shippingAddress: shippingAddress,
        orderItems: items.map(item => ({
            productId: item.productId,
            price: item.productPrice,
            quantity: item.quantity,
            subtotal: item.subtotal
        }))
    };
    
    const result = await api.post('/api/orders', orderData);
    
    if (result.success) {
        alert('✅ Tạo đơn hàng thành công!\nMã đơn hàng: ' + result.data.orderCode);
        await clearCart();
        loadHome();
    } else {
        alert('❌ Lỗi: ' + result.error);
    }
}