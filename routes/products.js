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

function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    if (req.session.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }
    next();
}

/**
 * GET /products - Display product list
 */
router.get('/', requireAuth, (req, res) => {
    db.query('SELECT * FROM products ORDER BY id DESC', (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.render('products', { 
            products: results,
            user: req.session.user,
            csrfToken: req.csrfToken()
        });
    });
});

/**
 * POST /products/add - Add a new product
 */
router.post('/add', requireAdmin, (req, res) => {
    const { name, description, price } = req.body;
    
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
    
    db.query(query, [sanitizedName, sanitizedDescription, parseFloat(price)], (err) => {
        if (err) {
            return res.status(500).send('Database error: ' + err.message);
        }
        res.redirect('/products');
    });
});

router.post('/update/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    
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
    const query = 'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?';
    
    db.query(query, [sanitizedName, sanitizedDescription, numericPrice, id], (err) => {
        if (err) {
            return res.status(500).send('Error updating product');
        }
        res.redirect('/products');
    });
});

/**
 * POST /products/delete/:id - Delete a product
 */
router.post('/delete/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    
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
    
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
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
