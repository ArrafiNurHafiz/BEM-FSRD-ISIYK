const mysql = require('mysql2/promise');
require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'development';

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bem_isi_yogyakarta',
    waitForConnections: true,
    connectionLimit: NODE_ENV === 'production' ? 20 : 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    // SSL configuration (if needed for production)
    ...(process.env.DB_SSL === 'true' && {
        ssl: {
            rejectUnauthorized: false
        }
    })
};

const pool = mysql.createPool(dbConfig);

// Test connection with retry logic
let retryCount = 0;
const maxRetries = 5;
const retryDelay = 2000; // 2 seconds

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        console.log(`📊 Connection pool: ${dbConfig.connectionLimit} connections`);
        connection.release();
        retryCount = 0;
    } catch (err) {
        retryCount++;
        console.error(`❌ Database connection error (attempt ${retryCount}/${maxRetries}):`, err.message);
        
        if (retryCount < maxRetries) {
            console.log(`🔄 Retrying connection in ${retryDelay}ms...`);
            setTimeout(testConnection, retryDelay);
        } else {
            console.error('❌ Failed to connect to database after multiple attempts');
            if (NODE_ENV === 'production') {
                // In production, you might want to exit and let PM2 restart
                console.error('Exiting...');
                process.exit(1);
            }
        }
    }
}

// Initial connection test
testConnection();

// Handle connection errors
pool.on('connection', (connection) => {
    if (NODE_ENV === 'development') {
        console.log('🔌 New database connection established');
    }
});

pool.on('error', (err) => {
    console.error('❌ Database pool error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('🔄 Attempting to reconnect to database...');
        testConnection();
    } else {
        throw err;
    }
});

module.exports = pool;

