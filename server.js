/**
 * Main Express Server
 * Mini website with intentional vulnerabilities for demonstration
 */

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const csrf = require('csurf');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Template engine configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Secure session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-dev-only',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// CSRF Protection
const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const homeRoutes = require('./routes/home');

// Use routes
app.use('/', homeRoutes);

// Convenience aliases
app.get('/login', (req, res) => res.redirect('/auth/login'));
app.get('/register', (req, res) => res.redirect('/auth/register'));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Start server
app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Server started on http://localhost:${PORT}`);
    }
});
