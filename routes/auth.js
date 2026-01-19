/**
 * Authentication routes
 * WARNING: Contains intentional SQL Injection vulnerabilities
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

// Rate limiter for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * GET /auth/register - Display registration form
 */
router.get('/register', (req, res) => {
    res.render('register', { 
        error: null, 
        success: null,
        csrfToken: req.csrfToken()
    });
});

/**
 * POST /auth/register - Process registration
 */
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    
    // Data validation
    if (!username || username.trim().length < 3) {
        return res.render('register', { 
            error: 'Username must contain at least 3 characters', 
            success: null,
            csrfToken: req.csrfToken()
        });
    }
    const hasStrongPassword = (value) => {
        if (typeof value !== 'string') return false;
        // Min 8, at least 1 upper, 1 lower, 1 digit, 1 special
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
    };

    if (!hasStrongPassword(password)) {
        return res.render('register', {
            error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
            success: null,
            csrfToken: req.csrfToken()
        });
    }
    
    try {
        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Use prepared statement to avoid SQL injection
        const query = 'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)';
        
        db.query(query, [username, hashedPassword, email || null, 'user'], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.render('register', { 
                        error: 'This username already exists', 
                        success: null,
                        csrfToken: req.csrfToken()
                    });
                }
                return res.render('register', { 
                    error: 'Error creating account', 
                    success: null,
                    csrfToken: req.csrfToken()
                });
            }
            
            // Account created successfully
            res.render('register', { 
                error: null, 
                success: 'Account created successfully! You can now log in.',
                csrfToken: req.csrfToken()
            });
        });
    } catch (error) {
        res.render('register', { 
            error: 'Error creating account', 
            success: null,
            csrfToken: req.csrfToken()
        });
    }
});

/**
 * GET /auth/login - Display login form
 */
router.get('/login', (req, res) => {
    res.render('login', { 
        error: null,
        csrfToken: req.csrfToken()
    });
});

/**
 * POST /auth/login - Process login
 * SECURITY VULNERABILITY #3: SQL Injection possible!
 */
router.post('/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;

    const genericError = () => res.render('login', {
        error: 'Identifiants incorrects',
        csrfToken: req.csrfToken()
    });

    const query = 'SELECT id, username, password, email, role FROM users WHERE username = ? LIMIT 1';

    db.query(query, [username], async (err, results) => {
        if (err || !results || results.length === 0) {
            return genericError();
        }

        try {
            const user = results[0];
            const ok = await bcrypt.compare(password, user.password);
            if (!ok) {
                return genericError();
            }

            // Prevent session fixation: rotate session ID after login
            req.session.regenerate((regenErr) => {
                if (regenErr) {
                    return genericError();
                }

                req.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };

                res.redirect('/products');
            });
        } catch (compareErr) {
            genericError();
        }
    });
});

/**
 * GET /auth/logout - Logout
 */
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
