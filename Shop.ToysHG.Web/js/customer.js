/**
 * Service Quản lý Khách hàng
 */

/**
 * Xem thông tin Customer
 */
async function viewCustomer(id) {
    const result = await api.get(`/api/customers/${id}`);
    if (!result.success) {
        alert('❌ Lỗi: ' + result.error);
        return;
    }

    const customer = result.data;
    alert(`ID: ${customer.id}\nHọ tên: ${customer.fullName}\nSĐT: ${customer.phone}\nĐịa chỉ: ${customer.address}\nGiới tính: ${customer.gender}`);
}
