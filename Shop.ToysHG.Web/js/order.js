/**
 * Service Quản lý Đơn hàng
 */

/**
 * Load giao diện quản lí Orders
 */
async function loadOrders() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="section">
            <h2>🛒 Quản lí Đơn hàng</h2>
            
            <div class="orders-container">
                <!-- Tabs -->
                <div class="tabs">
                    <button class="tab-btn active" onclick="switchOrderTab('list')">📋 Danh sách Đơn hàng</button>
                    <button class="tab-btn" onclick="switchOrderTab('create')">🆕 Tạo Đơn hàng</button>
                    <button class="tab-btn" onclick="switchOrderTab('stats')">📊 Thống kê</button>
                </div>

                <!-- Tab Danh sách Orders -->
                <div id="orders-list-tab" class="tab-content active">
                    <h3>Danh sách Đơn hàng</h3>
                    <div class="search-container">
                        <input type="text" id="order-search" placeholder="🔍 Tìm theo mã hoặc tên khách..." onkeyup="searchOrders()">
                        <select id="order-status-filter" onchange="filterOrdersByStatus()" style="margin-left: 10px; padding: 10px 15px; border: 2px solid #dee2e6; border-radius: 25px; font-size: 1em; cursor: pointer;">
                            <option value="">Tất cả trạng thái</option>
                            <option value="PENDING">Chờ xác nhận</option>
                            <option value="CONFIRMED">Đã xác nhận</option>
                            <option value="SHIPPING">Đang giao</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="CANCELLED">Hủy</option>
                        </select>
                    </div>
                    <div id="orders-list-container"></div>
                </div>

                <!-- Tab Tạo Order -->
                <div id="orders-create-tab" class="tab-content">
                    <h3>Tạo đơn hàng từ giỏ hàng</h3>
                    <form id="create-order-form" onsubmit="handleCreateOrder(event)">
                        <div class="form-group">
                            <label>Khách hàng:</label>
                            <select id="create-order-customer" required>
                                <option value="">-- Chọn khách hàng --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Địa chỉ giao hàng:</label>
                            <textarea id="create-order-address" placeholder="Nhập địa chỉ giao hàng" rows="3" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Sản phẩm:</label>
                            <div id="create-order-items" style="border: 1px solid #dee2e6; padding: 10px; border-radius: 5px; max-height: 300px; overflow-y: auto;"></div>
                            <small>Chọn sản phẩm từ giỏ hàng hoặc danh sách</small>
                        </div>
                        <div class="form-group">
                            <label>Tổng cộng:</label>
                            <input type="text" id="create-order-total" readonly style="background: #f0f0f0;">
                        </div>
                        <button type="submit">🆕 Tạo đơn hàng</button>
                    </form>
                </div>

                <!-- Tab Thống kê -->
                <div id="orders-stats-tab" class="tab-content">
                    <h3>📊 Thống kê Đơn hàng</h3>
                    <div id="orders-stats-container"></div>
                </div>
            </div>
        </div>
    `;

    fetchAllOrders();
    loadCustomersForOrderDropdown();
    loadOrderStats();
}

/**
 * Chuyển đổi tab
 */
function switchOrderTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`orders-${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

/**
 * Lấy danh sách tất cả đơn hàng
 */
async function fetchAllOrders() {
    const result = await api.get('/api/orders');
    const container = document.getElementById('orders-list-container');

    if (result.success && Array.isArray(result.data)) {
        if (result.data.length === 0) {
            container.innerHTML = '<p>Không có đơn hàng nào.</p>';
            return;
        }

        const html = result.data.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <h4>Đơn hàng: ${order.orderCode}</h4>
                    <span class="order-status status-${order.status.toLowerCase()}">${getOrderStatusLabel(order.status)}</span>
                </div>
                <div class="order-info">
                    <p><strong>ID:</strong> ${order.id}</p>
                    <p><strong>Khách hàng:</strong> ${order.customer?.fullName || 'N/A'}</p>
                    <p><strong>Tổng tiền:</strong> <span class="price">₫${Number(order.totalAmount).toLocaleString('vi-VN')}</span></p>
                    <p><strong>Địa chỉ:</strong> ${order.shippingAddress || 'N/A'}</p>
                    <p><strong>Ngày tạo:</strong> ${new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div class="order-actions">
                    <button onclick="viewOrderDetails(${order.id})" class="btn-view">🔍 Chi tiết</button>
                    <button onclick="updateOrderStatus(${order.id})" class="btn-edit">✏️ Cập nhật</button>
                    <button onclick="deleteOrder(${order.id})" class="btn-delete">🗑️ Hủy</button>
                </div>
            </div>
        `).join('');
        container.innerHTML = html;
    } else {
        container.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error}</p>`;
    }
}

/**
 * Lấy nhãn trạng thái
 */
function getOrderStatusLabel(status) {
    const statusMap = {
        'PENDING': '⏳ Chờ xác nhận',
        'CONFIRMED': '✅ Đã xác nhận',
        'SHIPPING': '🚚 Đang giao',
        'COMPLETED': '✔️ Hoàn thành',
        'CANCELLED': '❌ Đã hủy'
    };
    return statusMap[status] || status;
}

/**
 * Tìm kiếm đơn hàng
 */
async function searchOrders() {
    const searchValue = document.getElementById('order-search').value.toLowerCase();
    const result = await api.get('/api/orders');
    const container = document.getElementById('orders-list-container');

    if (result.success) {
        const filtered = result.data.filter(order =>
            order.orderCode.toLowerCase().includes(searchValue) ||
            (order.customer?.fullName || '').toLowerCase().includes(searchValue)
        );
        displayOrders(filtered);
    } else {
        container.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error}</p>`;
    }
}

/**
 * Lọc đơn hàng theo trạng thái
 */
async function filterOrdersByStatus() {
    const statusValue = document.getElementById('order-status-filter').value;
    const result = await api.get('/api/orders');
    const container = document.getElementById('orders-list-container');

    if (result.success) {
        let filtered = result.data;
        if (statusValue) {
            filtered = filtered.filter(order => order.status === statusValue);
        }
        displayOrders(filtered);
    } else {
        container.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error}</p>`;
    }
}

/**
 * Hiển thị đơn hàng
 */
function displayOrders(orders) {
    const container = document.getElementById('orders-list-container');

    if (!orders || orders.length === 0) {
        container.innerHTML = '<p>Không có đơn hàng nào phù hợp.</p>';
        return;
    }

    const html = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h4>Đơn hàng: ${order.orderCode}</h4>
                <span class="order-status status-${order.status.toLowerCase()}">${getOrderStatusLabel(order.status)}</span>
            </div>
            <div class="order-info">
                <p><strong>ID:</strong> ${order.id}</p>
                <p><strong>Khách hàng:</strong> ${order.customer?.fullName || 'N/A'}</p>
                <p><strong>Tổng tiền:</strong> <span class="price">₫${Number(order.totalAmount).toLocaleString('vi-VN')}</span></p>
                <p><strong>Địa chỉ:</strong> ${order.shippingAddress || 'N/A'}</p>
                <p><strong>Ngày tạo:</strong> ${new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
            <div class="order-actions">
                <button onclick="viewOrderDetails(${order.id})" class="btn-view">🔍 Chi tiết</button>
                <button onclick="updateOrderStatus(${order.id})" class="btn-edit">✏️ Cập nhật</button>
                <button onclick="deleteOrder(${order.id})" class="btn-delete">🗑️ Hủy</button>
            </div>
        </div>
    `).join('');
    container.innerHTML = html;
}

/**
 * Xem chi tiết đơn hàng
 */
async function viewOrderDetails(orderId) {
    const result = await api.get(`/api/orders/${orderId}`);

    if (result.success) {
        const order = result.data;
        let itemsHtml = '<strong>Các sản phẩm:</strong><br>';
        
        if (order.orderItems && order.orderItems.length > 0) {
            itemsHtml += order.orderItems.map(item => 
                `• ${item.product?.name || 'N/A'}: ${item.quantity} x ₫${Number(item.price).toLocaleString('vi-VN')} = ₫${Number(item.subtotal).toLocaleString('vi-VN')}`
            ).join('<br>');
        }

        const details = `
🔍 Chi tiết đơn hàng #${order.id}:
───────────────────────────────
Mã: ${order.orderCode}
Khách hàng: ${order.customer?.fullName || 'N/A'}
Trạng thái: ${getOrderStatusLabel(order.status)}
Tổng tiền: ₫${Number(order.totalAmount).toLocaleString('vi-VN')}
Địa chỉ giao: ${order.shippingAddress || 'N/A'}
Ngày tạo: ${new Date(order.createdAt).toLocaleDateString('vi-VN')}
${itemsHtml}
        `;

        alert(details);
    } else {
        alert(`? L?i: ${result.error}`);
    }
}

/**
 * Cập nhật trạng thái đơn hàng
 */
async function updateOrderStatus(orderId) {
    const result = await api.get(`/api/orders/${orderId}`);

    if (!result.success) {
        alert('❌ Không tìm thấy đơn hàng');
        return;
    }

    const order = result.data;
    const newStatus = prompt(
        `Trạng thái hiện tại: ${getOrderStatusLabel(order.status)}\n\n` +
        'Nhập trạng thái mới (PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED):',
        order.status
    );

    if (!newStatus) return;

    const updateData = {
        customerId: order.customerId,
        orderCode: order.orderCode,
        totalAmount: order.totalAmount,
        status: newStatus.toUpperCase(),
        shippingAddress: order.shippingAddress
    };

    const updateResult = await api.put(`/api/orders/${orderId}`, updateData);

    if (updateResult.success) {
        alert('✅ Cập nhật trạng thái thành công!');
        fetchAllOrders();
    } else {
        alert(`❌ Lỗi: ${updateResult.error}`);
    }
}

/**
 * Xóa đơn hàng
 */
async function deleteOrder(orderId) {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        return;
    }

    const result = await api.delete(`/api/orders/${orderId}`);

    if (result.success) {
        alert('✅ Hủy đơn hàng thành công!');
        fetchAllOrders();
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Load khách hàng vào dropdown
 */
async function loadCustomersForOrderDropdown() {
    const result = await api.get('/api/customers');
    const select = document.getElementById('create-order-customer');

    if (result.success && Array.isArray(result.data)) {
        const options = result.data
            .map(customer => `<option value="${customer.id}">${customer.id} - ${customer.fullName}</option>`)
            .join('');
        select.innerHTML = '<option value="">-- Chọn khách hàng --</option>' + options;
    }
}

/**
 * Xử lý tạo đơn hàng
 */
async function handleCreateOrder(event) {
    event.preventDefault();

    const customerId = parseInt(document.getElementById('create-order-customer').value);
    const address = document.getElementById('create-order-address').value;

    if (!customerId || !address) {
        alert('❗ Vui lòng điền đầy đủ thông tin!');
        return;
    }

    const orderData = {
        customerId: customerId,
        totalAmount: getCartTotal(),
        shippingAddress: address,
        orderItems: getCartItems().map(item => ({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal
        }))
    };

    const result = await api.post('/api/orders', orderData);

    if (result.success) {
        alert('✅ Tạo đơn hàng thành công!');
        clearCart();
        document.getElementById('create-order-form').reset();
        fetchAllOrders();
        switchOrderTab('list');
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Tải thống kê đơn hàng
 */
async function loadOrderStats() {
    const result = await api.get('/api/orders');
    const container = document.getElementById('orders-stats-container');

    if (result.success && Array.isArray(result.data)) {
        const orders = result.data;
        
        // Tính toán thống kê
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const byStatus = {};
        
        orders.forEach(order => {
            byStatus[order.status] = (byStatus[order.status] || 0) + 1;
        });

        let statsHtml = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div class="stat-box">
                    <h4>📦 Tổng đơn hàng</h4>
                    <p style="font-size: 2em; color: #007bff;">${totalOrders}</p>
                </div>
                <div class="stat-box">
                    <h4>💰 Tổng doanh thu</h4>
                    <p style="font-size: 1.5em; color: #28a745;">₫${Number(totalRevenue).toLocaleString('vi-VN')}</p>
                </div>
        `;

        // Thêm thống kê theo trạng thái
        Object.entries(byStatus).forEach(([status, count]) => {
            statsHtml += `
                <div class="stat-box">
                    <h4>${getOrderStatusLabel(status)}</h4>
                    <p style="font-size: 1.5em; color: #666;">${count}</p>
                </div>
            `;
        });

        statsHtml += '</div>';
        container.innerHTML = statsHtml;
    } else {
        container.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error}</p>`;
    }
}

/**
 * Xem chi tiết Order
 */
async function viewOrder(orderId) {
    const result = await api.get(`/api/orders/${orderId}`);
    if (!result.success) {
        alert('❌ Lỗi: ' + result.error);
        return;
    }

    const order = result.data;
    const itemsText = order.orderItems?.map(item => `- ${item.productId}: ${item.quantity}x ₫${Number(item.price).toLocaleString('vi-VN')}`).join('\n') || 'N/A';
    alert(`Mã đơn: ${order.orderCode}\nTổng tiền: ₫${Number(order.totalAmount).toLocaleString('vi-VN')}\nStatus: ${order.status}\n\nItems:\n${itemsText}`);
}
