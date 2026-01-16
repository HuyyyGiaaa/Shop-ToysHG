/**
 * Service Quản lý Customer
 */

/**
 * Load giao diện quản lý Customers
 */
async function loadCustomers() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="section">
            <h2>👤 Quản lý khách hàng</h2>
            
            <div class="customers-container">
                <!-- Tabs -->
                <div class="tabs">
                    <button class="tab-btn active" onclick="switchCustomerTab('list')">📋 Danh sách khách hàng</button>
                    <button class="tab-btn" onclick="switchCustomerTab('add')">➕ Thêm khách hàng</button>
                </div>

                <!-- Tab Danh sách Customers -->
                <div id="customers-list-tab" class="tab-content active">
                    <h3>Danh sách khách hàng</h3>
                    <div id="customers-list-container"></div>
                </div>

                <!-- Tab Thêm Customer -->
                <div id="customers-add-tab" class="tab-content">
                    <h3>Thêm khách hàng mới</h3>
                    <form id="add-customer-form" onsubmit="handleAddCustomer(event)">
                        <div class="form-group">
                            <label>User ID:</label>
                            <select id="add-customer-userid" required>
                                <option value="">-- Chọn người dùng --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Họ và tên:</label>
                            <input type="text" id="add-customer-fullname" placeholder="Nhập họ và tên" required>
                        </div>
                        <div class="form-group">
                            <label>Số điện thoại:</label>
                            <input type="tel" id="add-customer-phone" placeholder="Nhập số điện thoại">
                        </div>
                        <div class="form-group">
                            <label>Địa chỉ:</label>
                            <textarea id="add-customer-address" placeholder="Nhập địa chỉ" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Giới tính:</label>
                            <select id="add-customer-gender">
                                <option value="0">Nữ</option>
                                <option value="1">Nam</option>
                                <option value="-1">Khác</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Ngày sinh:</label>
                            <input type="date" id="add-customer-birthdate">
                        </div>
                        <button type="submit">✅ Thêm khách hàng</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    fetchAllCustomers();
    loadUsersForDropdown();
}

/**
 * Chuyển đổi tab
 */
function switchCustomerTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`customers-${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

/**
 * Lấy danh sách tất cả customers
 */
async function fetchAllCustomers() {
    const result = await api.get('/api/customers');
    const container = document.getElementById('customers-list-container');

    if (result.success && Array.isArray(result.data)) {
        if (result.data.length === 0) {
            container.innerHTML = '<p>Không có khách hàng nào.</p>';
            return;
        }

        const html = result.data.map(customer => `
            <div class="customer-card">
                <div class="customer-info">
                    <h4>${customer.fullName}</h4>
                    <p><strong>ID:</strong> ${customer.id}</p>
                    <p><strong>User ID:</strong> ${customer.userId}</p>
                    <p><strong>Số điện thoại:</strong> ${customer.phone || 'N/A'}</p>
                    <p><strong>Địa chỉ:</strong> ${customer.address || 'N/A'}</p>
                    <p><strong>Giới tính:</strong> ${getGenderLabel(customer.gender)}</p>
                    <p><strong>Ngày sinh:</strong> ${customer.birthDate ? new Date(customer.birthDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>
                <div class="customer-actions">
                    <button onclick="viewCustomerDetails(${customer.id})" class="btn-view">🔍 Chi tiết</button>
                    <button onclick="editCustomer(${customer.id})" class="btn-edit">✏️ Sửa</button>
                    <button onclick="deleteCustomer(${customer.id})" class="btn-delete">🗑️ Xóa</button>
                </div>
            </div>
        `).join('');
        container.innerHTML = html;
    } else {
        container.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error}</p>`;
    }
}

/**
 * Lấy tên giới tính
 */
function getGenderLabel(gender) {
    const genderMap = {
        0: 'Nữ',
        1: 'Nam',
        '-1': 'Khác'
    };
    return genderMap[gender] || 'N/A';
}

/**
 * Load users vào dropdown
 */
async function loadUsersForDropdown() {
    const result = await api.get('/api/users');
    const select = document.getElementById('add-customer-userid');

    if (result.success && Array.isArray(result.data)) {
        const options = result.data
            .map(user => `<option value="${user.id}">${user.id} - ${user.username}</option>`)
            .join('');
        select.innerHTML = '<option value="">-- Chọn người dùng --</option>' + options;
    }
}

/**
 * Xem chi tiết customer
 */
async function viewCustomerDetails(customerId) {
    const result = await api.get(`/api/customers/${customerId}`);

    if (result.success) {
        const c = result.data;
        alert(`
🔍 Chi tiết khách hàng:
─────────────────────────
ID: ${c.id}
Họ tên: ${c.fullName}
Điện thoại: ${c.phone || 'N/A'}
Địa chỉ: ${c.address || 'N/A'}
Giới tính: ${getGenderLabel(c.gender)}
Ngày sinh: ${c.birthDate ? new Date(c.birthDate).toLocaleDateString('vi-VN') : 'N/A'}
User ID: ${c.userId}
        `);
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Xử lý thêm customer
 */
async function handleAddCustomer(event) {
    event.preventDefault();

    const customerData = {
        userId: parseInt(document.getElementById('add-customer-userid').value),
        fullName: document.getElementById('add-customer-fullname').value,
        phone: document.getElementById('add-customer-phone').value || null,
        address: document.getElementById('add-customer-address').value || null,
        gender: parseInt(document.getElementById('add-customer-gender').value),
        birthDate: document.getElementById('add-customer-birthdate').value || null
    };

    const result = await api.post('/api/customers', customerData);

    if (result.success) {
        alert('✅ Thêm khách hàng thành công!');
        document.getElementById('add-customer-form').reset();
        fetchAllCustomers();
        switchCustomerTab('list');
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Chỉnh sửa customer
 */
async function editCustomer(customerId) {
    const result = await api.get(`/api/customers/${customerId}`);

    if (!result.success) {
        alert('❌ Không tìm thấy khách hàng');
        return;
    }

    const c = result.data;
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="section">
            <h2>✏️ Sửa khách hàng</h2>
            <form id="edit-customer-form" onsubmit="handleEditCustomer(event, ${customerId})">
                <div class="form-group">
                    <label>Họ và tên:</label>
                    <input type="text" id="edit-customer-fullname" value="${c.fullName}" placeholder="Nhập họ và tên" required>
                </div>
                <div class="form-group">
                    <label>Số điện thoại:</label>
                    <input type="tel" id="edit-customer-phone" value="${c.phone || ''}" placeholder="Nhập số điện thoại">
                </div>
                <div class="form-group">
                    <label>Địa chỉ:</label>
                    <textarea id="edit-customer-address" placeholder="Nhập địa chỉ" rows="3">${c.address || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Giới tính:</label>
                    <select id="edit-customer-gender">
                        <option value="0" ${c.gender === 0 ? 'selected' : ''}>Nữ</option>
                        <option value="1" ${c.gender === 1 ? 'selected' : ''}>Nam</option>
                        <option value="-1" ${c.gender === -1 ? 'selected' : ''}>Khác</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Ngày sinh:</label>
                    <input type="date" id="edit-customer-birthdate" value="${c.birthDate ? c.birthDate.split('T')[0] : ''}">
                </div>
                <div style="display: flex; gap: 10px;">
                    <button type="submit">💾 Cập nhật</button>
                    <button type="button" onclick="loadCustomers()" style="background: #6c757d;">❌ Hủy</button>
                </div>
            </form>
        </div>
    `;
}

/**
 * Xử lý cập nhật customer
 */
async function handleEditCustomer(event, customerId) {
    event.preventDefault();

    const customerData = {
        fullName: document.getElementById('edit-customer-fullname').value,
        phone: document.getElementById('edit-customer-phone').value || null,
        address: document.getElementById('edit-customer-address').value || null,
        gender: parseInt(document.getElementById('edit-customer-gender').value),
        birthDate: document.getElementById('edit-customer-birthdate').value || null
    };

    const result = await api.put(`/api/customers/${customerId}`, customerData);

    if (result.success) {
        alert('✅ Cập nhật khách hàng thành công!');
        loadCustomers();
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Xóa customer
 */
async function deleteCustomer(customerId) {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
        return;
    }

    const result = await api.delete(`/api/customers/${customerId}`);

    if (result.success) {
        alert('✅ Xóa khách hàng thành công!');
        fetchAllCustomers();
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}
