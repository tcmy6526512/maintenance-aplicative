/**
 * Product management routes (CRUD)
 * WARNING: Contains an intentional bug in the update function
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const validator = require('validator');

/**
 * Middleware to check if user is logged in
 */
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
}

/**
 * GET /products - Display product list
 */
router.get('/', requireAuth, (req, res) => {
    const categoryId = req.query.category ? parseInt(req.query.category, 10) : null;

    const categoriesQuery = `
        SELECT c.*, COUNT(p.id) AS product_count
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id
        ORDER BY c.name ASC
    `;

    db.query(categoriesQuery, (categoryErr, categories) => {
        if (categoryErr) {
            return res.status(500).send('Server error');
        }

        const baseProductsQuery = `
            SELECT p.*, c.name AS category_name, c.icon AS category_icon
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        `;

        const productsQuery = Number.isInteger(categoryId)
            ? baseProductsQuery + ' WHERE p.category_id = ? ORDER BY p.id DESC'
            : baseProductsQuery + ' ORDER BY p.id DESC';

        const params = Number.isInteger(categoryId) ? [categoryId] : [];

        db.query(productsQuery, params, (err, results) => {
            if (err) {
                return res.status(500).send('Server error');
            }
            res.render('products', {
                products: results,
                categories,
                activeCategoryId: Number.isInteger(categoryId) ? categoryId : null,
                user: req.session.user,
                csrfToken: req.csrfToken()
            });
        });
    });
});

/**
 * POST /products/add - Add a new product
 */
router.post('/add', requireAuth, (req, res) => {
    const { name, description, price, category_id } = req.body;
    
    // Data validation
    if (!name || name.trim().length === 0) {
        return res.status(400).send('Product name is required');
    }
    if (!description || description.trim().length === 0) {
        return res.status(400).send('Description is required');
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        return res.status(400).send('Price must be a positive number');
    }
    
    // Sanitize inputs to prevent XSS
    const sanitizedName = validator.escape(name.trim());
    const sanitizedDescription = validator.escape(description.trim());
    
    const query = 'INSERT INTO products (name, description, price) VALUES (?, ?, ?)';

    const categoryId = category_id ? parseInt(category_id, 10) : null;
    const insertQuery = 'INSERT INTO products (name, description, price, category_id) VALUES (?, ?, ?, ?)';

    db.query(insertQuery, [sanitizedName, sanitizedDescription, parseFloat(price), Number.isInteger(categoryId) ? categoryId : null], (err) => {
        if (err) {
            return res.status(500).send('Database error: ' + err.message);
        }
        res.redirect('/products');
    });
});

/**
 * POST /products/update/:id - Update a product
 */
router.post('/update/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { name, description, price, category_id } = req.body;
    
    // Data validation
    if (!name || name.trim().length === 0) {
        return res.status(400).send('Product name is required');
    }
    if (!description || description.trim().length === 0) {
        return res.status(400).send('Description is required');
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        return res.status(400).send('Price must be a positive number');
    }
    
    // Sanitize inputs to prevent XSS
    const sanitizedName = validator.escape(name.trim());
    const sanitizedDescription = validator.escape(description.trim());
    
    // Convert price to number to ensure proper storage and calculations
    const numericPrice = parseFloat(price);
    const categoryId = category_id ? parseInt(category_id, 10) : null;
    const query = 'UPDATE products SET name = ?, description = ?, price = ?, category_id = ? WHERE id = ?';
    
    db.query(query, [sanitizedName, sanitizedDescription, numericPrice, Number.isInteger(categoryId) ? categoryId : null, id], (err) => {
        if (err) {
            return res.status(500).send('Error updating product');
        }
        res.redirect('/products');
    });
});

/**
 * POST /products/delete/:id - Delete a product
 */
router.post('/delete/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    
    // All logged-in users can delete products (intended behavior)
    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).send('Error deleting product');
        }
        res.redirect('/products');
    });
});

/**
 * GET /products/:id - Display product details
 */
router.get('/:id', requireAuth, (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT p.*, c.name AS category_name, c.icon AS category_icon
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }
        
        res.render('product-detail', { 
            product: results[0],
            user: req.session.user,
            csrfToken: req.csrfToken()
        });
    });
});

module.exports = router;
