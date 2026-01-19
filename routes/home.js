/**
 * Home page routes
 */

const express = require('express');
const router = express.Router();

/**
 * GET / - Home page
 * Displays the home page with login status
 */
router.get('/', (req, res) => {
    res.render('index', { 
        user: req.session.user || null,
        csrfToken: req.csrfToken()
    });
});

module.exports = router;
