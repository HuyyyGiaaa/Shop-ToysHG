/**
 * File Test - D? li?u m?u ?? test Frontend
 * Ch?y code này trong Console (F12) ?? thêm d? li?u test
 */

console.log('=== SHOPTOYSHG - TEST DATA ===');

// ============================================
// TEST 1: Gi? hàng
// ============================================
console.log('\n?? TEST 1: Thêm s?n ph?m vào gi? hàng');
addToCart(1, 'G?u bông xanh', 150000);
addToCart(2, 'Xe ?? ch?i ??', 200000);
addToCart(3, 'Búp bê Barbie', 300000);
console.log('Gi? hàng:', getCartItems());
console.log('T?ng ti?n:', getCartTotal());
console.log('S? l??ng:', getCartCount());

// ============================================
// TEST 2: C?p nh?t gi? hàng
// ============================================
console.log('\n?? TEST 2: C?p nh?t gi? hàng');
updateCartQuantity(1, 3);  // T?ng s? l??ng g?u bông lên 3
console.log('Sau c?p nh?t:', getCartItems());
console.log('T?ng ti?n m?i:', getCartTotal());

// ============================================
// TEST 3: Xóa kh?i gi? hàng
// ============================================
console.log('\n??? TEST 3: Xóa s?n ph?m kh?i gi?');
removeFromCart(2);  // Xóa xe ?? ch?i
console.log('Sau xóa:', getCartItems());

// ============================================
// TEST 4: Ki?m tra localStorage
// ============================================
console.log('\n?? TEST 4: localStorage');
console.log('Cart trong localStorage:', localStorage.getItem('cart'));

// ============================================
// TEST 5: ??ng nh?p (mô ph?ng)
// ============================================
console.log('\n?? TEST 5: ??ng nh?p');
// Mô ph?ng user ??ng nh?p
const testUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'CUSTOMER',
  status: 1
};
localStorage.setItem('currentUser', JSON.stringify(testUser));
console.log('User ?ã ??ng nh?p:', getCurrentUser());

// ============================================
// TEST 6: T?o ??n hàng test
// ============================================
console.log('\n?? TEST 6: D? li?u ??n hàng test');
const testOrder = {
  customerId: 1,
  totalAmount: getCartTotal(),
  shippingAddress: '123 ???ng ABC, Qu?n 1, TP.HCM',
  orderItems: getCartItems().map(item => ({
    productId: item.productId,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.subtotal
  }))
};
console.log('Order data:', JSON.stringify(testOrder, null, 2));

// ============================================
// HELPER FUNCTIONS FOR TESTING
// ============================================

/**
 * Xóa t?t c? d? li?u test
 */
function clearTestData() {
  localStorage.removeItem('cart');
  localStorage.removeItem('currentUser');
  console.log('? ?ã xóa t?t c? d? li?u test');
}

/**
 * T?o d? li?u test ban ??u
 */
function initTestData() {
  // Reset
  clearTestData();
  
  // Thêm gi? hàng test
  const testCart = [
    {
      id: 1,
      productId: 1,
      productName: 'G?u bông xanh',
      price: 150000,
      quantity: 2,
      subtotal: 300000
    },
    {
      id: 2,
      productId: 2,
      productName: 'Xe ?? ch?i',
      price: 200000,
      quantity: 1,
      subtotal: 200000
    }
  ];
  
  // Thêm user test
  const testUser = {
    id: 1,
    username: 'khachhang1',
    email: 'khachhang1@example.com',
    role: 'CUSTOMER',
    status: 1
  };
  
  localStorage.setItem('cart', JSON.stringify(testCart));
  localStorage.setItem('currentUser', JSON.stringify(testUser));
  
  console.log('? ?ã t?o d? li?u test');
  console.log('Gi? hàng test:', testCart);
  console.log('User test:', testUser);
}

/**
 * Ki?m tra t?t c? d? li?u
 */
function checkAllData() {
  console.log('\n?? === KI?M TRA T?T C? D? LI?U ===');
  console.log('Cart:', JSON.parse(localStorage.getItem('cart') || '[]'));
  console.log('Current User:', JSON.parse(localStorage.getItem('currentUser') || 'null'));
  console.log('Cart Count:', getCartCount());
  console.log('Cart Total:', getCartTotal());
  console.log('Is Logged In:', isUserLoggedIn());
}

/**
 * Xóa localStorage
 */
function resetStorage() {
  localStorage.clear();
  console.log('? ?ã xóa localStorage');
  location.reload();
}

// ============================================
// QUICK COMMANDS
// ============================================

/*
Ch?y các l?nh này trong Console (F12):

1. Xem d? li?u hi?n t?i:
   checkAllData()

2. Kh?i t?o d? li?u test:
   initTestData()

3. Xóa t?t c? d? li?u:
   resetStorage()

4. Thêm 1 s?n ph?m vào gi?:
   addToCart(4, 'S?n ph?m m?i', 100000)

5. C?p nh?t s? l??ng:
   updateCartQuantity(1, 5)

6. Xóa s?n ph?m:
   removeFromCart(1)

7. Xem gi? hàng:
   console.log(getCartItems())

8. Xem t?ng ti?n:
   console.log(getCartTotal())

9. ??ng xu?t:
   logoutUser()

10. Ki?m tra localStorage:
    console.log(localStorage)
*/

console.log('\n? Test file ?ã t?i xong!');
console.log('Gõ "help()" ?? xem h??ng d?n');

function help() {
  console.log(`
?? H??NG D?N S? D?NG CONSOLE TEST:

?? Ki?m tra d? li?u:
   checkAllData()           - Ki?m tra t?t c? d? li?u
   
?? Kh?i t?o/Reset:
   initTestData()          - T?o d? li?u test
   resetStorage()          - Xóa t?t c? (reload page)
   clearTestData()         - Xóa d? li?u test
   
?? Qu?n lý gi? hàng:
   addToCart(id, name, price)       - Thêm s?n ph?m
   updateCartQuantity(id, qty)      - C?p nh?t s? l??ng
   removeFromCart(id)               - Xóa s?n ph?m
   clearCart()                      - Xóa toàn b? gi?
   getCartItems()                   - Xem danh sách
   getCartTotal()                   - Tính t?ng ti?n
   getCartCount()                   - ??m s? s?n ph?m
   
?? Qu?n lý User:
   getCurrentUser()                 - User hi?n t?i
   isUserLoggedIn()                 - ?ã ??ng nh?p?
   logoutUser()                     - ??ng xu?t
   
?? LocalStorage:
   localStorage.getItem('cart')
   localStorage.getItem('currentUser')
   localStorage.clear()
  `);
}

// Hi?n th? help khi load
console.log('Gõ help() ?? xem chi ti?t');
