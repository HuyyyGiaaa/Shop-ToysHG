/**
 * Service Quản lí User
 */

/**
 * Load giao diện quản lí Users
 */
async function loadUsers() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="section">
            <h2>👥 Quản lí người dùng</h2>
            
            <div class="users-container">
                <!-- Tabs -->
                <div class="tabs">
                    <button class="tab-btn active" onclick="switchUserTab('list')">📋 Danh sách</button>
                    <button class="tab-btn" onclick="switchUserTab('login')">🔐 Đăng nhập</button>
                    <button class="tab-btn" onclick="switchUserTab('register')">📝 Đăng ký</button>
                </div>

                <!-- Tab Danh sách Users -->
                <div id="users-list-tab" class="tab-content active">
                    <h3>Danh sách người dùng</h3>
                    <div id="users-list-container"></div>
                </div>

                <!-- Tab Đăng nhập -->
                <div id="users-login-tab" class="tab-content">
                    <h3>Đăng nhập</h3>
                    <form id="login-form" onsubmit="handleLogin(event)">
                        <div class="form-group">
                            <label>Tên người dùng:</label>
                            <input type="text" id="login-username" placeholder="Nhập tên người dùng" required>
                        </div>
                        <div class="form-group">
                            <label>Mật khẩu:</label>
                            <input type="password" id="login-password" placeholder="Nhập mật khẩu" required>
                        </div>
                        <button type="submit">🔐 Đăng nhập</button>
                    </form>
                </div>

                <!-- Tab Đăng ký -->
                <div id="users-register-tab" class="tab-content">
                    <h3>Đăng ký tài khoản</h3>
                    <form id="register-form" onsubmit="handleRegister(event)">
                        <div class="form-group">
                            <label>Tên người dùng:</label>
                            <input type="text" id="register-username" placeholder="Nhập tên người dùng" required>
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" id="register-email" placeholder="Nhập email" required>
                        </div>
                        <div class="form-group">
                            <label>Mật khẩu:</label>
                            <input type="password" id="register-password" placeholder="Nhập mật khẩu" required>
                        </div>
                        <div class="form-group">
                            <label>Họ và tên:</label>
                            <input type="text" id="register-fullname" placeholder="Nhập họ và tên" required>
                        </div>
                        <button type="submit">📝 Đăng ký</button>
                    </form>
                </div>
            </div>

            <div id="current-user-info" style="margin-top: 30px;">
                <!-- Hiển thị thông tin user đang đăng nhập -->
            </div>
        </div>
    `;

    fetchAllUsers();
    displayCurrentUserInfo();
}

/**
 * Chuyển đổi tab
 */
function switchUserTab(tabName) {
    // ẩn tất cả tab
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Hiển thị tab được chọn
    document.getElementById(`users-${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

/**
 * Lấy danh sách tất cả users
 */
async function fetchAllUsers() {
    const result = await api.get('/api/users');
    const container = document.getElementById('users-list-container');

    if (result.success && Array.isArray(result.data)) {
        const html = result.data.map(user => `
            <div class="user-card">
                <div class="user-info">
                    <h4>${user.username}</h4>
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Vai trò:</strong> <span class="role-badge role-${user.role.toLowerCase()}">${user.role}</span></p>
                    <p><strong>Trạng thái:</strong> <span class="${user.status === 1 ? 'status-active' : 'status-inactive'}">
                        ${user.status === 1 ? '🟢 Hoạt động' : '🔴 Khóa'}
                    </span></p>
                </div>
                <div class="user-actions">
                    <button onclick="viewUserDetails(${user.id})" class="btn-view">🧐 Xem chi tiết</button>
                    <button onclick="editUserStatus(${user.id}, ${user.status})" class="btn-edit">✏️ Sửa</button>
                    <button onclick="deleteUser(${user.id})" class="btn-delete">??? X�a</button>
                </div>
            </div>
        `).join('');
        container.innerHTML = html;
    } else {
        container.innerHTML = `<p style="color: red;">❌ Lỗi: ${result.error}</p>`;
    }
}

/**
 * Hiển thị thông tin user hiện tại
 */
function displayCurrentUserInfo() {
    const container = document.getElementById('current-user-info');
    const user = getCurrentUser();

    if (user) {
        container.innerHTML = `
            <div class="current-user-box">
                <h3>👤 Thông tin người dùng hiện tại</h3>
                <p><strong>T�n:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Vai trò:</strong> ${user.role}</p>
                <button onclick="logoutCurrentUser()" class="btn-logout">🚪 Đăng xuất</button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="current-user-box warning">
                <p>⚠️ Bạn chưa đăng nhập</p>
            </div>
        `;
    }
}

/**
 * Xử lý đăng nhập
 */
async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const result = await loginUser(username, password);

    if (result.success) {
        alert(`✅ Đăng nhập thành công! Chào mừng ${result.user.username}`);
        displayCurrentUserInfo();
        document.getElementById('login-form').reset();
    } else {
        alert(`❌ Lỗi: ${result.error || 'Đăng nhập thất bại'}`);
    }
}

/**
 * Xử lý đăng ký
 */
async function handleRegister(event) {
    event.preventDefault();

    const registerData = {
        username: document.getElementById('register-username').value,
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value,
        fullName: document.getElementById('register-fullname').value
    };

    const result = await registerUser(registerData);

    if (result.success) {
        alert('✅ Đăng ký thành công! Vui lòng đăng nhập.');
        document.getElementById('register-form').reset();
        switchUserTab('login');
        fetchAllUsers();
    } else {
        alert(`❌ Lỗi: ${result.error || 'Đăng ký thất bại'}`);
    }
}

/**
 * Xem chi tiết user
 */
async function viewUserDetails(userId) {
    const result = await api.get(`/api/users/${userId}`);

    if (result.success) {
        const user = result.data;
        alert(`
👤 Chi tiết người dùng:
=======================
ID: ${user.id}
Tên: ${user.username}
Email: ${user.email}
Vai trò: ${user.role}
Trạng thái: ${user.status === 1 ? 'Hoạt động' : 'Khóa'}
        `);
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Chỉnh sửa trạng thái user
 */
async function editUserStatus(userId, currentStatus) {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const statusText = newStatus === 1 ? 'Hoạt động' : 'Khóa';
    if (!confirm(`Bạn có chắc chắn muốn thay đổi trạng thái thành "${statusText}"?`)) {
        return;
    }

    // Lấy thông tin user hiện tại
    const getUserResult = await api.get(`/api/users/${userId}`);
    if (!getUserResult.success) {
        alert('❌ Không tìm thấy user');
        return;
    }

    const user = getUserResult.data;
    const updateData = {
        email: user.email,
        role: user.role,
        status: newStatus
    };

    const result = await api.put(`/api/users/${userId}`, updateData);

    if (result.success) {
        alert(`✅ Cập nhật trạng thái thành công!`);
        fetchAllUsers();
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Xóa user
 */
async function deleteUser(userId) {
    if (!confirm('Bạn có chắc chắn muốn xóa user này? Hành động này không thể hoàn tác!')) {
        return;
    }

    const result = await api.delete(`/api/users/${userId}`);

    if (result.success) {
        alert('✅ Xóa user thành công!');
        fetchAllUsers();
    } else {
        alert(`❌ Lỗi: ${result.error}`);
    }
}

/**
 * Đăng xuất user hiện tại
 */
function logoutCurrentUser() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        logoutUser();
        alert('✅ Đăng xuất thành công!');
        displayCurrentUserInfo();
    }
}
