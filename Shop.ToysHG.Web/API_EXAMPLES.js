/**
 * V� d? API Requests cho ShopToysHG
 * S? d?ng Postman ho?c curl ?? test
 */

// ============================================
// 1. USERS API
// ============================================

/**
 * ??NG K� T�I KHO?N
 * POST http://localhost:5000/api/users/register
 */
{
  "username": "khachhang001",
  "email": "khachhang001@example.com",
  "password": "password123",
  "fullName": "Nguy?n V?n A"
}

/**
 * ??NG NH?P
 * POST http://localhost:5000/api/users/login
 */
{
  "username": "khachhang001",
  "password": "password123"
}

/**
 * L?Y DANH S�CH USERS
 * GET http://localhost:5000/api/users
 * Response:
 * [
 *   {
 *     "id": 1,
 *     "username": "khachhang001",
 *     "email": "khachhang001@example.com",
 *     "role": "CUSTOMER",
 *     "status": 1,
 *     "createdAt": "2026-01-14T00:00:00",
 *     "updatedAt": "2026-01-14T00:00:00"
 *   }
 * ]
 */

/**
 * L?Y USER THEO ID
 * GET http://localhost:5000/api/users/1
 */

/**
 * C?P NH?T USER
 * PUT http://localhost:5000/api/users/1
 */
{
  "email": "khachhang001@example.com",
  "role": "CUSTOMER",
  "status": 1
}

/**
 * X�A USER
 * DELETE http://localhost:5000/api/users/1
 */

// ============================================
// 2. CUSTOMERS API
// ============================================

/**
 * L?Y DANH S�CH CUSTOMERS
 * GET http://localhost:5000/api/customers
 */

/**
 * TH�M CUSTOMER
 * POST http://localhost:5000/api/customers
 */
{
  "userId": 1,
  "fullName": "Nguy?n V?n A",
  "phone": "0123456789",
  "address": "123 ???ng ABC, Qu?n 1, TP.HCM",
  "gender": 1,
  "birthDate": "1990-01-15"
}

/**
 * L?Y CUSTOMER THEO ID
 * GET http://localhost:5000/api/customers/1
 */

/**
 * C?P NH?T CUSTOMER
 * PUT http://localhost:5000/api/customers/1
 */
{
  "fullName": "Nguy?n V?n A",
  "phone": "0123456789",
  "address": "123 ???ng ABC, Qu?n 1, TP.HCM",
  "gender": 1,
  "birthDate": "1990-01-15"
}

/**
 * X�A CUSTOMER
 * DELETE http://localhost:5000/api/customers/1
 */

// ============================================
// 3. PRODUCTS API
// ============================================

/**
 * L?Y DANH S�CH PRODUCTS
 * GET http://localhost:5000/api/products
 */

/**
 * L?Y PRODUCT THEO ID
 * GET http://localhost:5000/api/products/1
 */

/**
 * L?Y PRODUCTS THEO DANH M?C
 * GET http://localhost:5000/api/products/category/G?u b�ng
 */

/**
 * TH�M PRODUCT
 * POST http://localhost:5000/api/products
 */
{
  "name": "G?u b�ng xanh d??ng",
  "description": "G?u b�ng m?m m?i, an to�n cho tr? em",
  "price": 150000,
  "stock": 50,
  "category": "G?u b�ng"
}

/**
 * C?P NH?T PRODUCT
 * PUT http://localhost:5000/api/products/1
 */
{
  "name": "G?u b�ng xanh d??ng",
  "description": "G?u b�ng m?m m?i, an to�n cho tr? em",
  "price": 150000,
  "stock": 50,
  "category": "G?u b�ng"
}

/**
 * X�A PRODUCT
 * DELETE http://localhost:5000/api/products/1
 */

// ============================================
// 4. ORDERS API
// ============================================

/**
 * L?Y DANH S�CH ORDERS
 * GET http://localhost:5000/api/orders
 */

/**
 * L?Y ORDER THEO ID
 * GET http://localhost:5000/api/orders/1
 */

/**
 * TH�M ORDER
 * POST http://localhost:5000/api/orders
 */
{
  "customerId": 1,
  "totalAmount": 300000,
  "shippingAddress": "123 ???ng ABC, Qu?n 1, TP.HCM",
  "orderItems": [
    {
      "productId": 1,
      "price": 150000,
      "quantity": 2,
      "subtotal": 300000
    }
  ]
}

/**
 * C?P NH?T ORDER
 * PUT http://localhost:5000/api/orders/1
 */
{
  "customerId": 1,
  "orderCode": "ORD-001",
  "totalAmount": 300000,
  "status": "CONFIRMED",
  "shippingAddress": "123 ???ng ABC, Qu?n 1, TP.HCM"
}

/**
 * X�A ORDER
 * DELETE http://localhost:5000/api/orders/1
 */

// ============================================
// CURL Examples
// ============================================

/**
 * CURL: ??NG K�
 */
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "khachhang001",
    "email": "khachhang001@example.com",
    "password": "password123",
    "fullName": "Nguy?n V?n A"
  }'

/**
 * CURL: ??NG NH?P
 */
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "khachhang001",
    "password": "password123"
  }'

/**
 * CURL: L?Y DANH S�CH PRODUCTS
 */
curl -X GET http://localhost:5000/api/products

/**
 * CURL: TH�M PRODUCT
 */
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "G?u b�ng xanh d??ng",
    "description": "G?u b�ng m?m m?i",
    "price": 150000,
    "stock": 50,
    "category": "G?u b�ng"
  }'

/**
 * CURL: TH�M CUSTOMER
 */
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "fullName": "Nguy?n V?n A",
    "phone": "0123456789",
    "address": "123 ???ng ABC, Qu?n 1, TP.HCM",
    "gender": 1,
    "birthDate": "1990-01-15"
  }'

/**
 * CURL: TH�M ORDER
 */
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "totalAmount": 300000,
    "shippingAddress": "123 ???ng ABC, Qu?n 1, TP.HCM",
    "orderItems": [
      {
        "productId": 1,
        "price": 150000,
        "quantity": 2,
        "subtotal": 300000
      }
    ]
  }'

/**
 * CURL: C?P NH?T TR?NG TH�I ORDER
 */
curl -X PUT http://localhost:5000/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "orderCode": "ORD-001",
    "totalAmount": 300000,
    "status": "SHIPPED",
    "shippingAddress": "123 ???ng ABC, Qu?n 1, TP.HCM"
  }'

// ============================================
// POSTMAN Collection JSON
// ============================================

{
  "info": {
    "name": "ShopToysHG API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Users",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/users/register"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/users/login"
          }
        },
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/users"
          }
        }
      ]
    },
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/products"
          }
        },
        {
          "name": "Get Products by Category",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/products/category/G?u b�ng"
          }
        },
        {
          "name": "Create Product",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/products"
          }
        }
      ]
    },
    {
      "name": "Customers",
      "item": [
        {
          "name": "Get All Customers",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/customers"
          }
        },
        {
          "name": "Create Customer",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/customers"
          }
        }
      ]
    },
    {
      "name": "Orders",
      "item": [
        {
          "name": "Get All Orders",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/orders"
          }
        },
        {
          "name": "Create Order",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/orders"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ]
}
