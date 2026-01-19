/**
 * Category management routes (CRUD)
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const validator = require('validator');

function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
}

// “Soft” admin check: if a role exists, enforce admin; otherwise allow.
// This avoids breaking behavior before the roles feature branch is merged.
function requireAdminSoft(req, res, next) {
    const role = req.session.user && req.session.user.role;
    if (role && role !== 'admin') {
        return res.status(403).send('Forbidden');
    }
    next();
}

router.get('/', requireAuth, (req, res) => {
    db.query('SELECT * FROM categories ORDER BY name ASC', (err, categories) => {
        if (err) {
            return res.status(500).send('Server error');
        }

        res.render('categories', {
            categories,
            user: req.session.user,
            csrfToken: req.csrfToken()
        });
    });
});

router.post('/add', requireAuth, requireAdminSoft, (req, res) => {
    const { name, description, icon } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(400).send('Category name is required');
    }

    const sanitizedName = validator.escape(name.trim());
    const sanitizedDescription = description ? validator.escape(description.trim()) : null;
    const sanitizedIcon = icon ? validator.escape(icon.trim()) : null;

    const query = 'INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)';
    db.query(query, [sanitizedName, sanitizedDescription, sanitizedIcon], (err) => {
        if (err) {
            return res.status(500).send('Database error');
        }
        res.redirect('/categories');
    });
});

router.post('/update/:id', requireAuth, requireAdminSoft, (req, res) => {
    const { id } = req.params;
    const { name, description, icon } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(400).send('Category name is required');
    }

    const sanitizedName = validator.escape(name.trim());
    const sanitizedDescription = description ? validator.escape(description.trim()) : null;
    const sanitizedIcon = icon ? validator.escape(icon.trim()) : null;

    const query = 'UPDATE categories SET name = ?, description = ?, icon = ? WHERE id = ?';
    db.query(query, [sanitizedName, sanitizedDescription, sanitizedIcon, id], (err) => {
        if (err) {
            return res.status(500).send('Database error');
        }
        res.redirect('/categories');
    });
});

router.post('/delete/:id', requireAuth, requireAdminSoft, (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM categories WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).send('Database error');
        }
        res.redirect('/categories');
    });
});

module.exports = router;
