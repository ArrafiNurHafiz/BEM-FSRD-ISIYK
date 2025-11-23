const db = require('../config/database');

// Submit contact form
exports.submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const [result] = await db.query(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );

        res.status(201).json({
            success: true,
            message: 'Message sent successfully. We will get back to you soon.',
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

// Get all messages (admin)
exports.getAllMessages = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM contact_messages WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [messages] = await db.query(query, params);

        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM contact_messages ${status ? 'WHERE status = ?' : ''}`,
            status ? [status] : []
        );

        res.json({
            success: true,
            data: messages,
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

// Update message status
exports.updateMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['unread', 'read', 'replied'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        await db.query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);

        res.json({
            success: true,
            message: 'Message status updated'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete message
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

