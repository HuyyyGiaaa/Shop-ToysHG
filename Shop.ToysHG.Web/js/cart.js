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
    if (!user.customerId) {
        alert('❌ Lỗi: Không tìm thấy Customer ID. Vui lòng tạo hồ sơ Customer.');
        return;
    }

    // Gọi API thêm vào giỏ
    const result = await api.post(`/api/carts/customer/${user.customerId}/add`, {
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
 * Xử lý tạo hồ sơ Customer
 */
async function handleCreateCustomer(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    const fullName = document.getElementById('customer-fullname').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const gender = parseInt(document.getElementById('customer-gender').value);
    const birthDate = document.getElementById('customer-birthdate').value;
    
    const result = await api.post('/api/customers', {
        userId: user.id,
        fullName,
        phone,
        address,
        gender,
        birthDate: birthDate ? new Date(birthDate).toISOString() : null
    });
    
    if (result.success) {
        alert('✅ Tạo hồ sơ Customer thành công!');
        // Cập nhật user state
        currentUser.isCustomer = true;
        currentUser.customerId = result.data.id;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadHome();
    } else {
        alert(`❌ Lỗi: ${result.error || 'Tạo hồ sơ thất bại'}`);
    }
}
