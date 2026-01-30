/**
 * Service Giỏ hàng (Cart) - Lưu vào Database, không phải localStorage
 */

/**
 * Kiểm tra user có phải Customer không
 */
function isCustomer() {
    const user = getCurrentUser();
    return user && user.isCustomer;
}

/**
 * Thêm sản phẩm vào giỏ hàng (gọi API)
 */
async function addToCart(productId, productName, price) {
    const user = getCurrentUser();
    console.log('🛒 Adding to cart:', user);
    // Kiểm tra user có phải ANONYMOUS không
    if (user.role === 'ANONYMOUS') {
        alert('⚠️ Bạn cần đăng nhập trước!');
        loadLoginForm();
        return;
    }

    // ADMIN không thể thêm giỏ hàng
    if (user.role === 'ADMIN') {
        alert('⚠️ Admin không có chức năng thêm giỏ hàng!');
        return;
    }

    // Kiểm tra user là CUSTOMER và có Customer profile
    // ADMIN không cần có Customer profile
    if (user.role === 'CUSTOMER' && !user.isCustomer) {
        alert('⚠️ Bạn cần tạo hồ sơ Customer trước khi thêm sản phẩm vào giỏ!');
        // Chuyển sang tab thêm customer
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="section">
                <h2>👤 Tạo Hồ Sơ Customer</h2>
                <form onsubmit="handleCreateCustomer(event)">
                    <div class="form-group">
                        <label>Họ tên:</label>
                        <input type="text" id="customer-fullname" placeholder="Nhập họ tên" required>
                    </div>
                    <div class="form-group">
                        <label>SĐT:</label>
                        <input type="tel" id="customer-phone" placeholder="Nhập SĐT" required>
                    </div>
                    <div class="form-group">
                        <label>Địa chỉ:</label>
                        <input type="text" id="customer-address" placeholder="Nhập địa chỉ" required>
                    </div>
                    <div class="form-group">
                        <label>Giới tính:</label>
                        <select id="customer-gender" required>
                            <option value="0">Nữ</option>
                            <option value="1">Nam</option>
                            <option value="-1">Khác</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ngày sinh:</label>
                        <input type="date" id="customer-birthdate">
                    </div>
                    <button type="submit" class="btn-primary">💾 Tạo Hồ Sơ</button>
                </form>
            </div>
        `;
        return;
    }

    // Kiểm tra customerId có tồn tại không (ADMIN + CUSTOMER)
    if (!user.id) {
        alert('❌ Lỗi: Không tìm thấy Customer ID. Vui lòng tạo hồ sơ Customer.');
        return;
    }

    // ✅ FIX: Gọi API với customerId (hoặc lấy từ user nếu cần)
    const result = await api.post(`/api/carts/customer/${user.id}/add`, {
        productId: productId,
        quantity: 1
    });

    if (result.success) {
        showCartNotification(`✅ Đã thêm "${productName}" vào giỏ hàng`);
        updateCartCount(); // Cập nhật số lượng giỏ
    } else {
        alert(`❌ Lỗi: ${result.error || 'Không thể thêm vào giỏ'}`);
    }
}

/**
 * Lấy giỏ hàng từ database (gọi API)
 */
async function getCartItems() {
    const user = getCurrentUser();
    
    // ANONYMOUS không thể lấy giỏ
    if (user.role === 'ANONYMOUS') {
        return [];
    }
    
    // Kiểm tra customerId (Admin + CUSTOMER đều có)
    if (!user.customerId) {
        return [];
    }

    try {
        const result = await api.get(`/api/carts/customer/${user.customerId}`);
        
        if (result.success && result.data) {
            return result.data.cartItems || [];
        }
    } catch (error) {
        console.error('Error getting cart items:', error);
    }
    
    return [];
}

/**
 * Xóa sản phẩm khỏi giỏ hàng (gọi API)
 */
async function removeFromCart(cartItemId) {
    const result = await api.delete(`/api/carts/items/${cartItemId}`);

    if (result.success) {
        alert('✅ Sản phẩm đã được xóa khỏi giỏ hàng');
        loadCart(); // Làm mới giao diện
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Cập nhật số lượng sản phẩm (gọi API)
 */
async function updateCartQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
        removeFromCart(cartItemId);
        return;
    }

    const result = await api.put(`/api/carts/items/${cartItemId}`, {
        quantity: parseInt(quantity)
    });

    if (result.success) {
        loadCart(); // Làm mới giao diện
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}


/**
 * Chỉnh sửa hồ sơ
 */
async function editProfile() {
    const user = getCurrentUser();
    
    if (!user.customerId) {
        alert('❌ Không tìm thấy Customer ID');
        return;
    }
    
    const result = await api.get(`/api/customers/${user.customerId}`);
    
    if (!result.success) {
        alert('❌ Lỗi tải thông tin');
        return;
    }
    
    const customer = result.data;
    const content = document.getElementById('content');
    
    // Format birthDate cho input type="date" (format: YYYY-MM-DD)
    let birthDateValue = '';
    if (customer.birthDate) {
        const date = new Date(customer.birthDate);
        // Đảm bảo lấy đúng ngày (tránh timezone issues)
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        birthDateValue = `${year}-${month}-${day}`;
    }
    
    // Hiển thị ngày tháng năm đúng format Việt Nam
    const birthDateDisplay = customer.birthDate 
        ? new Date(customer.birthDate).toLocaleDateString('vi-VN')
        : 'Chưa cập nhật';
    
    console.log('📝 Edit profile birthDate:', {
        original: customer.birthDate,
        formatted: birthDateValue
    });
    
    content.innerHTML = `
        <div class="section">
            <h2>✏️ Chỉnh Sửa Hồ Sơ</h2>
            <form onsubmit="handleUpdateProfile(event, ${customer.id})" style="max-width: 500px;">
                <div class="form-group">
                    <label>Họ tên:</label>
                    <input type="text" id="edit-fullname" value="${customer.fullName}" required>
                </div>
                <div class="form-group">
                    <label>SĐT:</label>
                    <input type="tel" id="edit-phone" value="${customer.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Địa chỉ:</label>
                    <input type="text" id="edit-address" value="${customer.address || ''}">
                </div>
                <div class="form-group">
                    <label>Giới tính:</label>
                    <select id="edit-gender">
                        <option value="0" ${customer.gender === 0 ? 'selected' : ''}>Nữ</option>
                        <option value="1" ${customer.gender === 1 ? 'selected' : ''}>Nam</option>
                        <option value="-1" ${customer.gender === -1 ? 'selected' : ''}>Khác</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Ngày sinh:</label>
                    <input type="date" id="edit-birthdate" value="${birthDateValue}">
                </div>
                <div style="display: flex; gap: 10px;">
                    <button type="submit" class="btn-primary">💾 Cập Nhật</button>
                    <button type="button" onclick="loadProfile()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ❌ Hủy
                    </button>
                </div>
            </form>
        </div>
    `;
}

/**
 * Xử lý cập nhật hồ sơ
 */
async function handleUpdateProfile(event, customerId) {
    event.preventDefault();
    
    const fullName = document.getElementById('edit-fullname').value;
    const phone = document.getElementById('edit-phone').value;
    const address = document.getElementById('edit-address').value;
    const gender = parseInt(document.getElementById('edit-gender').value);
    const birthDateInput = document.getElementById('edit-birthdate').value;
    
    // Format ngày tháng năm
    let birthDate = null;
    if (birthDateInput) {
        // birthDateInput format: YYYY-MM-DD
        const [year, month, day] = birthDateInput.split('-');
        // Tạo ISO string (YYYY-MM-DDTHH:mm:ss.sssZ)
        birthDate = new Date(year, month - 1, day).toISOString();
    }
    
    console.log('📝 Update profile data:', {
        fullName,
        phone,
        address,
        gender,
        birthDateInput,
        birthDateISO: birthDate
    });
    
    const updateData = {
        fullName: fullName,
        phone: phone,
        address: address,
        gender: gender,
        birthDate: birthDate
    };
    
    const result = await api.put(`/api/customers/${customerId}`, updateData);
    
    console.log('📊 Update response:', result);
    
    if (result.success) {
        alert('✅ Cập nhật hồ sơ thành công!');
        loadProfile();
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Lấy tổng số lượng sản phẩm
 */
async function getCartCount() {
    const items = await getCartItems();
    return items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Lấy tổng tiền
 */
async function getCartTotal() {
    const items = await getCartItems();
    return items.reduce((total, item) => total + item.subtotal, 0);
}

/**
 * Xóa toàn bộ giỏ hàng (gọi API)
 */
async function clearCart() {
    const user = getCurrentUser();
    
    // ANONYMOUS hoặc không có customerId - không thể xóa giỏ
    if (user.role === 'ANONYMOUS' || !user.customerId) {
        return;
    }

    const result = await api.delete(`/api/carts/customer/${user.customerId}/clear`);

    if (result.success) {
        alert('✅ Giỏ hàng đã được xóa');
        loadCart(); // Làm mới
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Tạo đơn hàng từ giỏ hàng (gọi API)
 */
async function createOrderFromCart(customerId, shippingAddress) {
    const items = await getCartItems();
    
    if (items.length === 0) {
        alert('❌ Giỏ hàng trống!');
        return null;
    }

    const orderData = {
        customerId: customerId,
        totalAmount: await getCartTotal(),
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
        alert('✅ Tạo đơn hàng thành công!');
        await clearCart();
        return result.data;
    } else {
        alert(`❌ Lỗi tạo đơn hàng: ${result.error}`);
        return null;
    }
}

/**
 * Hiển thị thông báo (Notification)
 */
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * ✅ XỬ LÝ TẠO HỒ SƠ CUSTOMER - FIXED
 */
async function handleCreateCustomer(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    const fullName = document.getElementById('customer-fullname').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const gender = parseInt(document.getElementById('customer-gender').value);
    const birthDate = document.getElementById('customer-birthdate').value;
    
    console.log('📝 Creating customer with data:', {
        userId: user.id,
        fullName,
        phone,
        address,
        gender,
        birthDate
    });
    
    // ✅ FIX: Gọi API tạo customer
    const result = await api.post('/api/customers', {
        userId: user.id,
        fullName,
        phone,
        address,
        gender,
        birthDate: birthDate ? birthDate + 'T00:00:00Z' : null
    });
    
    console.log('📊 API Response:', result);
    
    if (result.success) {
        console.log('✅ API Success:', result);
        
        // ✅ FIX: API returns { message, data: CustomerDto }
        // So result.data = { message, data: {...} }
        // And actual customer = result.data.data
        const customerData = result.data.data || result.data;
        console.log('✅ Customer data from API:', customerData);
        console.log('✅ Customer ID from API:', customerData.id);
        
        if (!customerData || !customerData.id) {
            alert('❌ Lỗi: Không nhận được Customer ID từ server');
            console.error('Invalid customer data:', result);
            return;
        }
        
        alert('✅ Tạo hồ sơ Customer thành công!');
        
        // ✅ FIX: Use updateCurrentUser function from auth.js
        if (typeof updateCurrentUser === 'function') {
            updateCurrentUser({
                isCustomer: true,
                customerId: parseInt(customerData.id)
            });
            console.log('📝 Updated currentUser via updateCurrentUser()');
        } else {
            // Fallback: manual update
            const currentUserObj = getCurrentUser();
            currentUserObj.isCustomer = true;
            currentUserObj.customerId = parseInt(customerData.id);
            localStorage.setItem('currentUser', JSON.stringify(currentUserObj));
            console.log('📝 Updated currentUser via fallback');
        }
        
        // Verify save
        const verify = JSON.parse(localStorage.getItem('currentUser'));
        console.log('✅ Verified from localStorage:', JSON.stringify(verify));
        
        // Reload menu
        renderNavigation();
        
        // Delay and redirect
        setTimeout(() => {
            console.log('🔄 Redirecting to home...');
            loadHome();
        }, 500);
    } else {
        console.error('❌ API Error:', result);
        alert(`❌ Lỗi: ${result.error || 'Tạo hồ sơ thất bại'}`);
    }
}

/**
 * ✅ LOAD TRANG HỒ SƠ CÁ NHÂN - FIXED
 */
async function loadProfile() {
    const user = getCurrentUser();
    const content = document.getElementById('content');
    
    // Kiểm tra user đã login hay chưa
    if (user.role === 'ANONYMOUS') {
        content.innerHTML = `
            <div class="section">
                <h2>👤 Hồ Sơ Cá Nhân</h2>
                <p style="color: #dc3545;">⚠️ Bạn cần đăng nhập để xem hồ sơ!</p>
                <button onclick="loadLoginForm()">🔑 Đăng nhập</button>
            </div>
        `;
        return;
    }
    
    content.innerHTML = `
        <div class="section">
            <h2>👤 Hồ Sơ Cá Nhân</h2>
            <div id="profile-container" style="margin-top: 20px;">
                <p>⏳ Đang tải...</p>
            </div>
        </div>
    `;
    
    displayProfile();
}

/**
 * ✅ HIỂN THỊ HỒ SƠ CÁ NHÂN - FIXED
 */
async function displayProfile() {
    const user = getCurrentUser();
    const container = document.getElementById('profile-container');
    
    console.log('📝 displayProfile() called for user:', user);
    
    // Nếu là ADMIN, không có customer profile
    if (user.role === 'ADMIN') {
        container.innerHTML = `
            <div style="padding: 20px; background: #e7f3ff; border-radius: 5px; border-left: 4px solid #007bff;">
                <p style="margin: 0;">ℹ️ Admin không có hồ sơ Customer</p>
            </div>
        `;
        return;
    }
    
    // Nếu là CUSTOMER nhưng chưa có customer profile
    if (!user.isCustomer || !user.customerId) {
        console.log('⚠️ User has no customer profile yet');
        container.innerHTML = `
            <div style="padding: 20px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
                <p style="margin: 0;">⚠️ Bạn chưa tạo hồ sơ Customer</p>
                <button onclick="showCreateCustomerForm()" style="margin-top: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    👤 Tạo Hồ Sơ
                </button>
            </div>
        `;
        return;
    }
    
    // Lấy thông tin customer từ database
    try {
        console.log('🔄 Fetching customer from API for userId:', user.id);
        const result = await api.get(`/api/customers/user/${user.id}`);
        
        console.log('📊 API Response:', result);
        
        if (result.success && result.data) {
            // ✅ FIX: Handle both response.data structure
            const customer = result.data;
            
            console.log('✅ Customer data:', customer);
            
            // Validate customer data
            if (!customer || !customer.id) {
                throw new Error('Invalid customer data: missing id');
            }
            
            const genderLabel = {
                0: 'Nữ',
                1: 'Nam',
                '-1': 'Khác'
            }[customer.gender] || 'Không xác định';
            
            const birthDateDisplay = customer.birthDate 
                ? new Date(customer.birthDate).toLocaleDateString('vi-VN')
                : 'Chưa cập nhật';
            
            container.innerHTML = `
                <div style="border: 1px solid #dee2e6; padding: 20px; border-radius: 5px;">
                    <h3>📋 Thông Tin Cá Nhân</h3>
                    
                    <table style="width: 100%; margin-top: 15px;">
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 10px; font-weight: bold; width: 30%;">Tài Khoản:</td>
                            <td style="padding: 10px;">${user.username}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 10px; font-weight: bold;">Email:</td>
                            <td style="padding: 10px;">${user.email}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 10px; font-weight: bold;">Vai Trò:</td>
                            <td style="padding: 10px;">${user.role}</td>
                        </tr>
                    </table>
                    
                    <h3 style="margin-top: 25px;">👤 Thông Tin Khách Hàng</h3>
                    
                    <table style="width: 100%; margin-top: 15px;">
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 10px; font-weight: bold; width: 30%;">ID:</td>
                            <td style="padding: 10px;">${customer.id}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 10px; font-weight: bold;">Họ Tên:</td>
                            <td style="padding: 10px;">${customer.fullName}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 10px; font-weight: bold;">SĐT:</td>
                            <td style="padding: 10px;">${customer.phone || 'Chưa cập nhật'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 10px; font-weight: bold;">Địa Chỉ:</td>
                            <td style="padding: 10px;">${customer.address || 'Chưa cập nhật'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 10px; font-weight: bold;">Giới Tính:</td>
                            <td style="padding: 10px;">${genderLabel}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 10px; font-weight: bold;">Ngày Sinh:</td>
                            <td style="padding: 10px;">${birthDateDisplay}</td>
                        </tr>
                    </table>
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button onclick="editProfile()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            ✏️ Chỉnh Sửa
                        </button>
                        <button onclick="loadHome()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            ◀️ Quay Lại
                        </button>
                    </div>
                </div>
            `;
        } else {
            console.error('❌ API returned no data:', result);
            container.innerHTML = `
                <div style="padding: 20px; background: #f8d7da; border-radius: 5px; border-left: 4px solid #dc3545; color: #721c24;">
                    <p style="margin: 0;">❌ Không tìm thấy hồ sơ Customer</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px;">${result.message || 'No data returned'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Error loading profile:', error);
        container.innerHTML = `
            <div style="padding: 20px; background: #f8d7da; border-radius: 5px; border-left: 4px solid #dc3545; color: #721c24;">
                <p style="margin: 0;">❌ Lỗi tải hồ sơ: ${error.message}</p>
            </div>
        `;
    }
}

/**
 * ✅ HIỆN FORM TẠO CUSTOMER PROFILE - FIXED
 */
function showCreateCustomerForm() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="section">
            <h2>👤 Tạo Hồ Sơ Customer</h2>
            <form onsubmit="handleCreateCustomer(event)" style="max-width: 500px;">
                <div class="form-group">
                    <label>Họ tên:</label>
                    <input type="text" id="customer-fullname" placeholder="Nhập họ tên" required>
                </div>
                <div class="form-group">
                    <label>SĐT:</label>
                    <input type="tel" id="customer-phone" placeholder="Nhập SĐT" required>
                </div>
                <div class="form-group">
                    <label>Địa chỉ:</label>
                    <input type="text" id="customer-address" placeholder="Nhập địa chỉ" required>
                </div>
                <div class="form-group">
                    <label>Giới tính:</label>
                    <select id="customer-gender" required>
                        <option value="0">Nữ</option>
                        <option value="1">Nam</option>
                        <option value="-1">Khác</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Ngày sinh:</label>
                    <input type="date" id="customer-birthdate">
                </div>
                <button type="submit" class="btn-primary">💾 Tạo Hồ Sơ</button>
            </form>
        </div>
    `;
}
