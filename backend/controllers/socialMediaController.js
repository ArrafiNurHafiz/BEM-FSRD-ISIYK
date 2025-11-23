const db = require('../config/database');

// Get all social media links
exports.getAllSocialMedia = async (req, res) => {
    try {
        const [socialMedia] = await db.query(
            'SELECT * FROM social_media ORDER BY order_index ASC'
        );

        res.json({
            success: true,
            data: socialMedia
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create social media link
exports.createSocialMedia = async (req, res) => {
    try {
        const { platform, url, icon, order_index } = req.body;

        const [result] = await db.query(
            'INSERT INTO social_media (platform, url, icon, order_index) VALUES (?, ?, ?, ?)',
            [platform, url, icon, order_index || 0]
        );

        res.status(201).json({
            success: true,
            message: 'Social media link created successfully',
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

// Update social media link
exports.updateSocialMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform, url, icon, order_index } = req.body;

        let updateFields = [];
        let params = [];

        if (platform) {
            updateFields.push('platform = ?');
            params.push(platform);
        }
        if (url) {
            updateFields.push('url = ?');
            params.push(url);
        }
        if (icon) {
            updateFields.push('icon = ?');
            params.push(icon);
        }
        if (order_index !== undefined) {
            updateFields.push('order_index = ?');
            params.push(order_index);
        }

        params.push(id);

        await db.query(
            `UPDATE social_media SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );

        res.json({
            success: true,
            message: 'Social media link updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete social media link
exports.deleteSocialMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM social_media WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Social media link not found'
            });
        }

        res.json({
            success: true,
            message: 'Social media link deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

