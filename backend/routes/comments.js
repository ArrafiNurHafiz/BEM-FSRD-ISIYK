const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/news/:newsId', commentController.getComments);
router.post('/news/:newsId', commentController.createComment);

// Admin routes
router.put('/:id/status', authenticate, authorize('admin', 'editor'), commentController.updateCommentStatus);
router.delete('/:id', authenticate, authorize('admin'), commentController.deleteComment);

module.exports = router;

