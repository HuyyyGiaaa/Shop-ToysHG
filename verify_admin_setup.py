#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
?? Test Admin User Setup
"""

import mysql.connector
from mysql.connector import Error

# MySQL Connection Settings
config = {
    'host': 'localhost',
    'user': 'root',
    'password': '12345678',
    'database': 'shoptoyshg'
}

try:
    # Connect to MySQL
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    
    print("=" * 50)
    print("?? Admin User Verification")
    print("=" * 50)
    print()
    
    # Query 1: Check admin user
    query = """
    SELECT 
        u.Id, u.Username, u.Email, u.RoleId, r.Name as RoleName, 
        u.PasswordHash, u.Status
    FROM Users u
    LEFT JOIN Roles r ON u.RoleId = r.Id
    WHERE u.Username = 'admin'
    """
    
    cursor.execute(query)
    result = cursor.fetchone()
    
    if result:
        print("? Admin User Found!")
        print(f"  ID: {result[0]}")
        print(f"  Username: {result[1]}")
        print(f"  Email: {result[2]}")
        print(f"  RoleId: {result[3]}")
        print(f"  Role Name: {result[4]}")
        print(f"  Status: {result[6]}")
        print(f"  PasswordHash: {result[5][:50]}...")
    else:
        print("? Admin User NOT Found!")
    
    print()
    
    # Query 2: Check admin customer
    query2 = """
    SELECT c.Id, c.FullName, c.UserId
    FROM Customers c
    WHERE c.UserId = (SELECT Id FROM Users WHERE Username = 'admin')
    """
    
    cursor.execute(query2)
    result2 = cursor.fetchone()
    
    if result2:
        print("? Admin Customer Found!")
        print(f"  ID: {result2[0]}")
        print(f"  FullName: {result2[1]}")
        print(f"  UserId: {result2[2]}")
    else:
        print("??  Admin Customer NOT Found!")
    
    print()
    
    # Query 3: Check admin cart
    query3 = """
    SELECT c.Id, c.CustomerId
    FROM Carts c
    WHERE c.CustomerId IN (
        SELECT Id FROM Customers WHERE UserId = (
            SELECT Id FROM Users WHERE Username = 'admin'
        )
    )
    """
    
    cursor.execute(query3)
    result3 = cursor.fetchone()
    
    if result3:
        print("? Admin Cart Found!")
        print(f"  ID: {result3[0]}")
        print(f"  CustomerId: {result3[1]}")
    else:
        print("??  Admin Cart NOT Found!")
    
    print()
    print("=" * 50)
    print("?? Test Credentials")
    print("=" * 50)
    print(f"  Username: admin")
    print(f"  Password: admin123")
    print(f"  Expected Hash: QQjL5Ul3EkPuqQvnpHuBRQ2w5V7c9z+qzH/Q3V/J7dM=")
    print()
    
    cursor.close()
    conn.close()
    print("? Verification complete!")
    
except Error as e:
    print(f"? Error: {e}")
    exit(1)
