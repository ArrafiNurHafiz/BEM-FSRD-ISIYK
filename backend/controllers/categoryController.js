const db = require('../config/database');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const { type } = req.query;

        let query = 'SELECT * FROM categories WHERE 1=1';
        const params = [];

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        query += ' ORDER BY name ASC';

        const [categories] = await db.query(query, params);

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create category
exports.createCategory = async (req, res) => {
    try {
        const { name, type, description } = req.body;

        const slug = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const [result] = await db.query(
            'INSERT INTO categories (name, slug, type, description) VALUES (?, ?, ?, ?)',
            [name, slug, type, description]
        );

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Category slug already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        let updateFields = [];
        let params = [];

        if (name) {
            const slug = name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            updateFields.push('name = ?', 'slug = ?');
            params.push(name, slug);
        }
        if (description) {
            updateFields.push('description = ?');
            params.push(description);
        }

        params.push(id);

        await db.query(
            `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );

        res.json({
            success: true,
            message: 'Category updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

