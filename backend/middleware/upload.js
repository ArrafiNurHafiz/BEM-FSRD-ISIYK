const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Ensure upload directory exists
// Use absolute path for production, relative for development
const uploadDir = process.env.UPLOAD_PATH 
    ? (path.isAbsolute(process.env.UPLOAD_PATH) 
        ? process.env.UPLOAD_PATH 
        : path.join(__dirname, '..', process.env.UPLOAD_PATH))
    : path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`📁 Created uploads directory: ${uploadDir}`);
}

// Ensure subdirectories exist
const subdirs = ['news', 'gallery', 'programs', 'events', 'organization', 'hero-slider', 'chairman', 'about', 'avatars', 'general'];
subdirs.forEach(subdir => {
    const subdirPath = path.join(uploadDir, subdir);
    if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath, { recursive: true });
    }
});

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'general';
        
        // Check URL path instead of route path
        const urlPath = req.originalUrl || req.url || '';
        
        if (urlPath.includes('/news') || urlPath.includes('/api/news')) {
            folder = 'news';
        } else if (urlPath.includes('/gallery') || urlPath.includes('/api/gallery')) {
            folder = 'gallery';
        } else if (urlPath.includes('/programs') || urlPath.includes('/api/programs')) {
            folder = 'programs';
        } else if (urlPath.includes('/events') || urlPath.includes('/api/events')) {
            folder = 'events';
        } else if (urlPath.includes('/organization') || urlPath.includes('/api/organization')) {
            folder = 'organization';
        } else if (urlPath.includes('/hero-slider') || urlPath.includes('/api/hero-slider')) {
            folder = 'hero-slider';
        } else if (urlPath.includes('/about') || urlPath.includes('/api/about')) {
            folder = 'about';
        } else if (urlPath.includes('/chairman') || urlPath.includes('/api/chairman-greeting')) {
            folder = 'chairman';
        } else if (urlPath.includes('/avatar')) {
            folder = 'avatars';
        }
        
        const dir = path.join(uploadDir, folder);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;

