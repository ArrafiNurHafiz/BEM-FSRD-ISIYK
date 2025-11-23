const db = require('../config/database');

// Get all programs
exports.getAllPrograms = async (req, res) => {
    try {
        const { category, status } = req.query;

        let query = `
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM programs p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (category) {
            query += ' AND c.slug = ?';
            params.push(category);
        }

        if (status) {
            query += ' AND p.status = ?';
            params.push(status);
        }

        query += ' ORDER BY p.created_at DESC';

        const [programs] = await db.query(query, params);

        res.json({
            success: true,
            data: programs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get single program
exports.getProgramById = async (req, res) => {
    try {
        const { id } = req.params;

        const [programs] = await db.query(
            `SELECT p.*, c.name as category_name, c.slug as category_slug
             FROM programs p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.id = ?`,
            [id]
        );

        if (programs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
            });
        }

        res.json({
            success: true,
            data: programs[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create program
exports.createProgram = async (req, res) => {
    try {
        const { title, description, content, category_id, start_date, end_date, location, status } = req.body;
        const image = req.file ? `/uploads/programs/${req.file.filename}` : null;

        const slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const [result] = await db.query(
            `INSERT INTO programs (title, slug, description, content, category_id, image, start_date, end_date, location, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, slug, description, content, category_id, image, start_date, end_date, location, status || 'upcoming']
        );

        res.status(201).json({
            success: true,
            message: 'Program created successfully',
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

// Update program
exports.updateProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, content, category_id, start_date, end_date, location, status } = req.body;

        const [existing] = await db.query('SELECT id FROM programs WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
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
        if (description) {
            updateFields.push('description = ?');
            params.push(description);
        }
        if (content) {
            updateFields.push('content = ?');
            params.push(content);
        }
        if (category_id) {
            updateFields.push('category_id = ?');
            params.push(category_id);
        }
        if (start_date) {
            updateFields.push('start_date = ?');
            params.push(start_date);
        }
        if (end_date) {
            updateFields.push('end_date = ?');
            params.push(end_date);
        }
        if (location) {
            updateFields.push('location = ?');
            params.push(location);
        }
        if (status) {
            updateFields.push('status = ?');
            params.push(status);
        }
        if (req.file) {
            updateFields.push('image = ?');
            params.push(`/uploads/programs/${req.file.filename}`);
        }

        params.push(id);

        await db.query(
            `UPDATE programs SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );

        res.json({
            success: true,
            message: 'Program updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete program
exports.deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM programs WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
            });
        }

        res.json({
            success: true,
            message: 'Program deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

