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
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Foreign key: products -> categories
ALTER TABLE products
    ADD CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL;

-- Seed categories
INSERT INTO categories (name, icon) VALUES 
('Électronique', '💻'),
('Accessoires', '🖱️'),
('Périphériques', '⌨️'),
('Audio', '🎧'),
('Autre', '📦');

-- Insert test users
-- Passwords hashed with bcrypt (cost 10)
INSERT INTO users (username, password, email) VALUES 
('admin', '$2b$10$rBV2L7Z9Z9Z9Z9Z9Z9Z9ZeHxKqV3YJYqXGZqXxXxXxXxe5KqV3YJYa', 'admin@example.com'),
('user', '$2b$10$rBV2L7Z9Z9Z9Z9Z9Z9Z9ZeHxKqV3YJYqXGZqXxXxXxXxe5KqV3YJYa', 'user@example.com'),
('test', '$2b$10$rBV2L7Z9Z9Z9Z9Z9Z9Z9ZeHxKqV3YJYqXGZqXxXxXxXxe5KqV3YJYa', 'test@example.com');

-- Insert demo products
INSERT INTO products (name, description, price, category_id) VALUES 
('Laptop', 'High-performance laptop for gaming and work', 899.99, (SELECT id FROM categories WHERE name = 'Électronique')),
('Wireless Mouse', 'Ergonomic mouse with precise optical sensor', 29.99, (SELECT id FROM categories WHERE name = 'Accessoires')),
('Mechanical Keyboard', 'RGB gaming keyboard with mechanical switches', 79.99, (SELECT id FROM categories WHERE name = 'Périphériques')),
('27-inch Monitor', 'Full HD IPS monitor with 144Hz refresh rate', 299.99, (SELECT id FROM categories WHERE name = 'Périphériques')),
('Headphones', 'Bluetooth headphones with active noise cancellation', 159.99, (SELECT id FROM categories WHERE name = 'Audio'));

-- Display inserted data
SELECT 'Users created:' as Info;
SELECT * FROM users;

SELECT 'Products created:' as Info;
SELECT * FROM products;
