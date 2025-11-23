const db = require('../config/database');

// Submit aspiration (anonymous allowed)
exports.submitAspiration = async (req, res) => {
    try {
        const { name, email, message, is_anonymous } = req.body;

        // Validate message
        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Pesan tidak boleh kosong.'
            });
        }

        // If anonymous, set name and email to NULL
        const finalName = (is_anonymous || !name || name.trim() === '') ? null : name.trim();
        const finalEmail = (is_anonymous || !email || email.trim() === '') ? null : email.trim();
        const isAnonymous = Boolean(is_anonymous || !finalName);

        console.log('Submitting aspiration:', { finalName, finalEmail, isAnonymous, messageLength: message.length });

        const [result] = await db.query(
            'INSERT INTO aspirations (name, email, message, is_anonymous) VALUES (?, ?, ?, ?)',
            [finalName, finalEmail, message.trim(), isAnonymous]
        );

        res.status(201).json({
            success: true,
            message: 'Aspirasi berhasil dikirim! Terima kasih atas masukan Anda.',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Error submitting aspiration:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengirim aspirasi. Silakan coba lagi.',
            error: error.message
        });
    }
};

// Get all aspirations (admin)
exports.getAllAspirations = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM aspirations WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [aspirations] = await db.query(query, params);

        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM aspirations ${status ? 'WHERE status = ?' : ''}`,
            status ? [status] : []
        );

        res.json({
            success: true,
            data: aspirations,
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

// Update aspiration status
exports.updateAspirationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['unread', 'read', 'addressed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        await db.query('UPDATE aspirations SET status = ? WHERE id = ?', [status, id]);

        res.json({
            success: true,
            message: 'Aspiration status updated'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete aspiration
exports.deleteAspiration = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM aspirations WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aspiration not found'
            });
        }

        res.json({
            success: true,
            message: 'Aspiration deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

