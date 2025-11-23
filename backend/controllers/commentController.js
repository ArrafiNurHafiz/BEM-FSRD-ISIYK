const db = require('../config/database');

// Get comments for a news
exports.getComments = async (req, res) => {
    try {
        const { newsId } = req.params;
        const { status = 'approved' } = req.query;

        const [comments] = await db.query(
            'SELECT * FROM comments WHERE news_id = ? AND status = ? ORDER BY created_at DESC',
            [newsId, status]
        );

        res.json({
            success: true,
            data: comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create comment
exports.createComment = async (req, res) => {
    try {
        const { newsId } = req.params;
        const { name, email, content } = req.body;

        // Check if news exists
        const [news] = await db.query('SELECT id FROM news WHERE id = ? AND status = ?', [newsId, 'published']);
        if (news.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'News not found or not published'
            });
        }

        const [result] = await db.query(
            'INSERT INTO comments (news_id, name, email, content) VALUES (?, ?, ?, ?)',
            [newsId, name, email, content]
        );

        res.status(201).json({
            success: true,
            message: 'Comment submitted. Waiting for approval.',
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

// Update comment status (admin)
exports.updateCommentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        await db.query('UPDATE comments SET status = ? WHERE id = ?', [status, id]);

        res.json({
            success: true,
            message: 'Comment status updated'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM comments WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

