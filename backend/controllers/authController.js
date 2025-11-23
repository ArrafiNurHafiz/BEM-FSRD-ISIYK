const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

// Register (Admin only)
exports.register = async (req, res) => {
    try {
        const { username, email, password, role, full_name } = req.body;

        // Check if user exists
        const [existing] = await db.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (using nama_lengkap for compatibility)
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role, nama_lengkap) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, role || 'staff', full_name]
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { id: result.insertId, username, email, role: role || 'staff' }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username dan password harus diisi'
            });
        }

        // Check JWT_SECRET
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET tidak ditemukan di .env');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error. JWT_SECRET tidak ditemukan.'
            });
        }

        // Find user (using nama_lengkap instead of full_name for compatibility)
        const [users] = await db.query(
            'SELECT id, username, email, password, role, nama_lengkap as full_name, avatar FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }

        const user = users[0];

        // Check if password is set (not default placeholder)
        if (!user.password || user.password.length < 10) {
            return res.status(401).json({
                success: false,
                message: 'Password belum di-set. Silakan buat admin user terlebih dahulu dengan: npm run create-admin'
            });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    full_name: user.full_name || null,
                    avatar: user.avatar || null
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific database errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
            return res.status(500).json({
                success: false,
                message: 'Database connection error. Periksa konfigurasi database di .env'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get current user
exports.getMe = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, username, email, role, nama_lengkap as full_name, avatar, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

