const db = require('../config/database');
const path = require('path');
const { validationResult } = require('express-validator');

// Get all news (public)
exports.getAllNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, status, search } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT n.*, c.name as category_name, u.nama_lengkap as author_name
            FROM news n
            LEFT JOIN categories c ON n.category_id = c.id
            LEFT JOIN users u ON n.author_id = u.id
            WHERE 1=1
        `;
        const params = [];

        // Check if user is admin/editor for status filter
        const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'editor');
        
        if (status === 'all' && isAdmin) {
            // Admin can see all statuses
            // No status filter
        } else if (status && isAdmin) {
            query += ' AND n.status = ?';
            params.push(status);
        } else {
            // Public users or no admin: only show published
            query += ' AND n.status = ?';
            params.push('published');
        }

        if (category) {
            query += ' AND c.slug = ?';
            params.push(category);
        }

        if (search) {
            query += ' AND (n.title LIKE ? OR n.excerpt LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        query += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [news] = await db.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM news n LEFT JOIN categories c ON n.category_id = c.id WHERE 1=1';
        const countParams = [];
        
        const isAdminCount = req.user && (req.user.role === 'admin' || req.user.role === 'editor');
        
        if (status === 'all' && isAdminCount) {
            // No status filter for admin
        } else if (status && isAdminCount) {
            countQuery += ' AND n.status = ?';
            countParams.push(status);
        } else {
            countQuery += ' AND n.status = ?';
            countParams.push('published');
        }

        if (category) {
            countQuery += ' AND c.slug = ?';
            countParams.push(category);
        }

        if (search) {
            countQuery += ' AND (n.title LIKE ? OR n.excerpt LIKE ?)';
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm);
        }

        const [countResult] = await db.query(countQuery, countParams);
        const total = countResult[0].total;

        res.json({
            success: true,
            data: news,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get single news
exports.getNewsById = async (req, res) => {
    try {
        const { id } = req.params;

        const [news] = await db.query(
            `SELECT n.*, c.name as category_name, c.slug as category_slug, 
             u.nama_lengkap as author_name, u.avatar as author_avatar
             FROM news n
             LEFT JOIN categories c ON n.category_id = c.id
             LEFT JOIN users u ON n.author_id = u.id
             WHERE n.id = ?`,
            [id]
        );

        if (news.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        // Increment views
        await db.query('UPDATE news SET views = views + 1 WHERE id = ?', [id]);

        // Get comments
        const [comments] = await db.query(
            'SELECT * FROM comments WHERE news_id = ? AND status = ? ORDER BY created_at DESC',
            [id, 'approved']
        );

        res.json({
            success: true,
            data: {
                ...news[0],
                comments
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create news
exports.createNews = async (req, res) => {
    try {
        const { title, excerpt, content, category_id, status } = req.body;
        
        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Judul dan isi berita wajib diisi'
            });
        }

        // Get correct path based on where file was actually saved
        let featured_image = null;
        if (req.file) {
            // File path relative to uploads directory
            const filePath = req.file.path.replace(/\\/g, '/'); // Normalize path separators
            const uploadDir = path.resolve(process.env.UPLOAD_PATH || './uploads');
            const normalizedFilePath = path.resolve(filePath).replace(/\\/g, '/');
            const normalizedUploadDir = uploadDir.replace(/\\/g, '/');
            
            // Get relative path from uploads directory
            let relativePath = normalizedFilePath.replace(normalizedUploadDir, '').replace(/^\/+/, '');
            
            // Ensure it starts with /uploads
            if (!relativePath.startsWith('uploads/')) {
                relativePath = relativePath.replace(/^uploads\//, '');
            }
            
            featured_image = `/uploads/${relativePath}`;
        }

        // Generate slug
        let slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        
        // Ensure slug is unique
        let finalSlug = slug;
        let counter = 1;
        while (true) {
            const [existing] = await db.query('SELECT id FROM news WHERE slug = ?', [finalSlug]);
            if (existing.length === 0) break;
            finalSlug = `${slug}-${counter}`;
            counter++;
        }

        // Check if category exists if provided
        if (category_id) {
            const [catCheck] = await db.query('SELECT id FROM categories WHERE id = ?', [category_id]);
            if (catCheck.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Kategori tidak ditemukan'
                });
            }
        }

        const [result] = await db.query(
            `INSERT INTO news (title, slug, excerpt, content, featured_image, category_id, author_id, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, finalSlug, excerpt || null, content, featured_image, category_id || null, req.user.id, status || 'draft']
        );

        res.status(201).json({
            success: true,
            message: 'News created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create news error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Gagal menyimpan berita'
        });
    }
};

// Update news
exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, category_id, status } = req.body;

        // Check if news exists
        const [existing] = await db.query('SELECT id FROM news WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        let updateFields = [];
        let params = [];

        if (title) {
            const slug = title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            updateFields.push('title = ?', 'slug = ?');
            params.push(title, slug);
        }
        if (excerpt) {
            updateFields.push('excerpt = ?');
            params.push(excerpt);
        }
        if (content) {
            updateFields.push('content = ?');
            params.push(content);
        }
        if (category_id) {
            updateFields.push('category_id = ?');
            params.push(category_id);
        }
        if (status) {
            updateFields.push('status = ?');
            params.push(status);
        }
        if (req.file) {
            updateFields.push('featured_image = ?');
            params.push(`/uploads/news/${req.file.filename}`);
        }

        params.push(id);

        await db.query(
            `UPDATE news SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );

        res.json({
            success: true,
            message: 'News updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete news
exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM news WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        res.json({
            success: true,
            message: 'News deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

