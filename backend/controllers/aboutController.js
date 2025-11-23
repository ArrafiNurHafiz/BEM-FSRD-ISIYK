const db = require('../config/database');

// Get about sections
exports.getAboutSections = async (req, res) => {
    try {
        const { section_type } = req.query;

        let query = 'SELECT * FROM about_sections WHERE 1=1';
        const params = [];

        if (section_type) {
            query += ' AND section_type = ?';
            params.push(section_type);
        }

        query += ' ORDER BY order_index ASC, created_at ASC';

        const [sections] = await db.query(query, params);

        res.json({
            success: true,
            data: sections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create/Update about section
exports.upsertAboutSection = async (req, res) => {
    try {
        const { section_type, title, content, order_index } = req.body;
        const image = req.file ? `/uploads/about/${req.file.filename}` : null;

        // Check if section exists
        const [existing] = await db.query(
            'SELECT id FROM about_sections WHERE section_type = ?',
            [section_type]
        );

        if (existing.length > 0) {
            // Update
            let updateFields = [];
            let params = [];

            if (title) {
                updateFields.push('title = ?');
                params.push(title);
            }
            if (content) {
                updateFields.push('content = ?');
                params.push(content);
            }
            if (order_index !== undefined) {
                updateFields.push('order_index = ?');
                params.push(order_index);
            }
            if (image) {
                updateFields.push('image = ?');
                params.push(image);
            }

            params.push(existing[0].id);

            await db.query(
                `UPDATE about_sections SET ${updateFields.join(', ')} WHERE id = ?`,
                params
            );

            res.json({
                success: true,
                message: 'Section updated successfully'
            });
        } else {
            // Create
            const [result] = await db.query(
                'INSERT INTO about_sections (section_type, title, content, image, order_index) VALUES (?, ?, ?, ?, ?)',
                [section_type, title, content, image, order_index || 0]
            );

            res.status(201).json({
                success: true,
                message: 'Section created successfully',
                data: { id: result.insertId }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

