const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const commentRoutes = require('./routes/comments');
const programRoutes = require('./routes/programs');
const eventRoutes = require('./routes/events');
const galleryRoutes = require('./routes/gallery');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contact');
const aspirationRoutes = require('./routes/aspirations');
const categoryRoutes = require('./routes/categories');
const aboutRoutes = require('./routes/about');
const socialMediaRoutes = require('./routes/socialMedia');
const organizationRoutes = require('./routes/organization');
const heroSliderRoutes = require('./routes/heroSlider');
const chairmanGreetingRoutes = require('./routes/chairmanGreeting');
const kabinetSasmitaRoutes = require('./routes/kabinetSasmita');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy (important for production behind reverse proxy)
app.set('trust proxy', 1);

// CORS Configuration
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL?.split(',') || process.env.FRONTEND_URL || true
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));

// Body parser with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Security headers
  if (NODE_ENV === 'production') {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // HSTS (only in production with HTTPS)
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
  }
  
  next();
});

// Serve uploaded files
const uploadsPath = process.env.UPLOAD_PATH || path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log(`📁 Created uploads directory: ${uploadsPath}`);
}

app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    // Set proper content type for images
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (filePath.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
    
    // Cache control for uploads
    if (NODE_ENV === 'production') {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    }
  },
  dotfiles: 'deny', // Deny access to hidden files
  index: false // Don't serve directory listing
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/aspirations', aspirationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/social-media', socialMediaRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/hero-slider', heroSliderRoutes);
app.use('/api/chairman-greeting', chairmanGreetingRoutes);
app.use('/api/kabinet-sasmita', kabinetSasmitaRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
    const db = require('./config/database');
    let dbStatus = 'unknown';
    
    try {
        const [rows] = await db.query('SELECT 1 as health');
        dbStatus = rows.length > 0 ? 'connected' : 'disconnected';
    } catch (error) {
        dbStatus = 'error';
    }
    
    const health = {
        success: true,
        status: 'ok',
        message: 'BEM FSRD ISI Yogyakarta API is running',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        version: process.env.APP_VERSION || '1.0.0',
        uptime: process.uptime(),
        database: dbStatus,
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        }
    };
    
    const statusCode = dbStatus === 'connected' ? 200 : 503;
    res.status(statusCode).json(health);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    // Log error details
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
    };
    
    if (NODE_ENV === 'development') {
        console.error('❌ Error Details:', errorDetails);
    } else {
        // In production, log to file or external service
        console.error('❌ Error:', {
            message: err.message,
            url: req.url,
            method: req.method,
            timestamp: new Date().toISOString()
        });
    }
    
    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum size is 5MB.'
        });
    }
    
    // Default error response
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(NODE_ENV === 'development' && { 
            error: err.message,
            stack: err.stack,
            details: errorDetails
        })
    });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Set' : '❌ NOT SET - Please add JWT_SECRET to .env'}`);
    console.log(`💾 Database: ${process.env.DB_NAME || 'bem_isi_yogyakarta'}`);
    console.log(`📁 Uploads Path: ${uploadsPath}`);
    
    if (NODE_ENV === 'production') {
        console.log(`🔒 Production mode enabled`);
        console.log(`✅ Security headers enabled`);
        console.log(`✅ CORS configured for: ${process.env.FRONTEND_URL || 'configured origins'}`);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    if (NODE_ENV === 'production') {
        // In production, you might want to exit and let PM2 restart
        // process.exit(1);
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    if (NODE_ENV === 'production') {
        process.exit(1);
    }
});

module.exports = app;

