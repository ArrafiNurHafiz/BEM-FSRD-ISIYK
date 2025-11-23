const db = require('../config/database');
const path = require('path');

// Get all hero sliders
exports.getAllHeroSliders = async (req, res) => {
    try {
        const { active } = req.query;
        
        let query = 'SELECT * FROM hero_slider WHERE 1=1';
        const params = [];

        if (active === 'true') {
            query += ' AND is_active = TRUE';
        }

        query += ' ORDER BY order_index ASC, created_at DESC';

        const [sliders] = await db.query(query, params);

        res.json({
            success: true,
            data: sliders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get single hero slider
exports.getHeroSliderById = async (req, res) => {
    try {
        const { id } = req.params;

        const [sliders] = await db.query('SELECT * FROM hero_slider WHERE id = ?', [id]);

        if (sliders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hero slider not found'
            });
        }

        res.json({
            success: true,
            data: sliders[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create hero slider
exports.createHeroSlider = async (req, res) => {
    try {
        const { title, subtitle, link_url, link_text, order_index, is_active } = req.body;

        if (!title || !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Judul dan gambar wajib diisi'
            });
        }

        // Get correct path based on where file was actually saved
        let image_path = null;
        if (req.file) {
            const filePath = req.file.path.replace(/\\/g, '/');
            const uploadDir = path.resolve(process.env.UPLOAD_PATH || './uploads');
            const normalizedFilePath = path.resolve(filePath).replace(/\\/g, '/');
            const normalizedUploadDir = uploadDir.replace(/\\/g, '/');
            
            let relativePath = normalizedFilePath.replace(normalizedUploadDir, '').replace(/^\/+/, '');
            
            if (!relativePath.startsWith('uploads/')) {
                relativePath = relativePath.replace(/^uploads\//, '');
            }
            
            image_path = `/uploads/${relativePath}`;
        }

        // Parse boolean values
        const activeValue = is_active === 'true' || is_active === true || is_active === '1' || is_active === 1;
        const orderValue = parseInt(order_index) || 0;

        const [result] = await db.query(
            `INSERT INTO hero_slider (title, subtitle, image_path, link_url, link_text, order_index, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                subtitle || null,
                image_path,
                link_url || null,
                link_text || 'Lihat Program',
                orderValue,
                activeValue ? 1 : 0
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Hero slider berhasil ditambahkan',
            data: { id: result.insertId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update hero slider
exports.updateHeroSlider = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, link_url, link_text, order_index, is_active } = req.body;

        const [existing] = await db.query('SELECT id FROM hero_slider WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hero slider not found'
            });
        }

        let updateFields = [];
        let params = [];

        if (title) {
            updateFields.push('title = ?');
            params.push(title);
        }
        if (subtitle !== undefined) {
            updateFields.push('subtitle = ?');
            params.push(subtitle || null);
        }
        if (link_url !== undefined) {
            updateFields.push('link_url = ?');
            params.push(link_url || null);
        }
        if (link_text) {
            updateFields.push('link_text = ?');
            params.push(link_text);
        }
        if (order_index !== undefined) {
            updateFields.push('order_index = ?');
            params.push(parseInt(order_index) || 0);
        }
        if (is_active !== undefined) {
            // Parse boolean values
            const activeValue = is_active === 'true' || is_active === true || is_active === '1' || is_active === 1;
            updateFields.push('is_active = ?');
            params.push(activeValue ? 1 : 0);
        }
        if (req.file) {
            // Get correct path
            const filePath = req.file.path.replace(/\\/g, '/');
            const uploadDir = path.resolve(process.env.UPLOAD_PATH || './uploads');
            const normalizedFilePath = path.resolve(filePath).replace(/\\/g, '/');
            const normalizedUploadDir = uploadDir.replace(/\\/g, '/');
            
            let relativePath = normalizedFilePath.replace(normalizedUploadDir, '').replace(/^\/+/, '');
            
            if (!relativePath.startsWith('uploads/')) {
                relativePath = relativePath.replace(/^uploads\//, '');
            }
            
            updateFields.push('image_path = ?');
            params.push(`/uploads/${relativePath}`);
        }

        params.push(id);

        await db.query(
            `UPDATE hero_slider SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );

        res.json({
            success: true,
            message: 'Hero slider berhasil diperbarui'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete hero slider
exports.deleteHeroSlider = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM hero_slider WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hero slider not found'
            });
        }

        res.json({
            success: true,
            message: 'Hero slider berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

