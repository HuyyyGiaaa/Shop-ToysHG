/**
 * Service Xác thực và Quản lý User
 */

// Lưu trữ User hiển thị - Mặc định là anonymous
let currentUser = localStorage.getItem('currentUser') 
    ? JSON.parse(localStorage.getItem('currentUser')) 
    : {
        id: null,
        username: 'Anonymous',
        email: null,
        role: 'ANONYMOUS',  // ← Mặc định anonymous
        status: 1,
        isCustomer: false,
        customerId: null
    };

/**
 * Đăng kí tài khoản mới
 */
async function registerUser(registerData) {
    return await api.post('/api/users/register', {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        fullName: registerData.fullName
    });
}

/**
 * Đăng nhập
 */
async function loginUser(username, password) {
    const result = await api.post('/api/users/login', {
        username: username,
        password: password
    });

    if (result.success && result.data.user) {
        currentUser = result.data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Cập nhật menu sau khi login
        if (typeof renderNavigation === 'function') {
            renderNavigation();
        }
        
        return { success: true, user: currentUser };
    }
    
    return result;
}

/**
 * Đăng xuất
 */
function logoutUser() {
    // Reset về anonymous
    currentUser = {
        id: null,
        username: 'Anonymous',
        email: null,
        role: 'ANONYMOUS',
        status: 1,
        isCustomer: false,
        customerId: null
    };
    localStorage.removeItem('currentUser');
    
    // Cập nhật menu sau khi logout
    if (typeof renderNavigation === 'function') {
        renderNavigation();
    }
}

/**
 * Lấy thông tin user hiện tại
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Kiểm tra user đã đăng nhập
 */
function isUserLoggedIn() {
    return currentUser && currentUser.role !== 'ANONYMOUS';
}
