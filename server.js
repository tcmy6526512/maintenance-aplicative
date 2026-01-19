/**
 * Main Express Server
 * Mini website with intentional vulnerabilities for demonstration
 */

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const csrf = require('csurf');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Template engine configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// If behind a reverse proxy (common in production), allow secure cookies + req.secure
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Security headers (CSP, HSTS in production, etc.)
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:'],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            frameAncestors: ["'none'"],
            formAction: ["'self'"]
        }
    },
    hsts: process.env.NODE_ENV === 'production'
}));

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        const proto = req.headers['x-forwarded-proto'];
        if (req.secure || proto === 'https') {
            return next();
        }
        return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    });
}

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
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Start server
app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Server started on http://localhost:${PORT}`);
    }
});
