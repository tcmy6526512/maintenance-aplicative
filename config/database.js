/**
 * MySQL database connection configuration
 */

const mysql = require('mysql2');
require('dotenv').config();

// Using environment variables for credentials
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mini_site_db'
});

/**
 * Establish database connection
 */
connection.connect((err) => {
    if (err) {
        // Log error in development only
        if (process.env.NODE_ENV !== 'production') {
            console.error('Database connection failed');
        }
        return;
    }
    if (process.env.NODE_ENV !== 'production') {
        console.log('Connected to MySQL database');
    }
});

module.exports = connection;
