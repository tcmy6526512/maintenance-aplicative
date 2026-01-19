-- Database creation script
-- Mini Website - MySQL Database

-- Create database
CREATE DATABASE IF NOT EXISTS mini_site_db;
USE mini_site_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert test users
-- Passwords hashed with bcrypt (cost 10)
INSERT INTO users (username, password, email) VALUES 
('admin', '$2b$10$rBV2L7Z9Z9Z9Z9Z9Z9Z9ZeHxKqV3YJYqXGZqXxXxXxXxe5KqV3YJYa', 'admin@example.com'),
('user', '$2b$10$rBV2L7Z9Z9Z9Z9Z9Z9Z9ZeHxKqV3YJYqXGZqXxXxXxXxe5KqV3YJYa', 'user@example.com'),
('test', '$2b$10$rBV2L7Z9Z9Z9Z9Z9Z9Z9ZeHxKqV3YJYqXGZqXxXxXxXxe5KqV3YJYa', 'test@example.com');

-- Insert demo products
INSERT INTO products (name, description, price) VALUES 
('Laptop', 'High-performance laptop for gaming and work', 899.99),
('Wireless Mouse', 'Ergonomic mouse with precise optical sensor', 29.99),
('Mechanical Keyboard', 'RGB gaming keyboard with mechanical switches', 79.99),
('27-inch Monitor', 'Full HD IPS monitor with 144Hz refresh rate', 299.99),
('Headphones', 'Bluetooth headphones with active noise cancellation', 159.99);

-- Display inserted data
SELECT 'Users created:' as Info;
SELECT * FROM users;

SELECT 'Products created:' as Info;
SELECT * FROM products;
