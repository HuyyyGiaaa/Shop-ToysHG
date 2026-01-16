/**
 * Service Xác thực và Quản lí User
 */

// Lưu trữ User hiển thị
let currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;

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
        return { success: true, user: currentUser };
    }
    
    return result;
}

/**
 * Đăng xuất
 */
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
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
    return currentUser !== null;
}
