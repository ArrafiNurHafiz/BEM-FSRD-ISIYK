const db = require('../config/database');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
    try {
        const { email, name } = req.body;

        // Check if already subscribed
        const [existing] = await db.query(
            'SELECT id, status FROM newsletter_subscribers WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            if (existing[0].status === 'active') {
                return res.status(400).json({
                    success: false,
                    message: 'Email already subscribed'
                });
            } else {
                // Reactivate subscription
                await db.query(
                    'UPDATE newsletter_subscribers SET status = ?, subscribed_at = NOW() WHERE email = ?',
                    ['active', email]
                );
                return res.json({
                    success: true,
                    message: 'Subscription reactivated'
                });
            }
        }

        const [result] = await db.query(
            'INSERT INTO newsletter_subscribers (email, name) VALUES (?, ?)',
            [email, name]
        );

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to newsletter',
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

// Unsubscribe from newsletter
exports.unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        const [result] = await db.query(
            'UPDATE newsletter_subscribers SET status = ? WHERE email = ?',
            ['unsubscribed', email]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Email not found in subscribers list'
            });
        }

        res.json({
            success: true,
            message: 'Successfully unsubscribed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get all subscribers (admin)
exports.getAllSubscribers = async (req, res) => {
    try {
        const { status = 'active', page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        const [subscribers] = await db.query(
            'SELECT * FROM newsletter_subscribers WHERE status = ? ORDER BY subscribed_at DESC LIMIT ? OFFSET ?',
            [status, parseInt(limit), parseInt(offset)]
        );

        const [countResult] = await db.query(
            'SELECT COUNT(*) as total FROM newsletter_subscribers WHERE status = ?',
            [status]
        );

        res.json({
            success: true,
            data: subscribers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0].total,
                pages: Math.ceil(countResult[0].total / limit)
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

