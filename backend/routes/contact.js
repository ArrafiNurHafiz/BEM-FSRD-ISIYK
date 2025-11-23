const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.post('/', contactController.submitContact);

// Admin routes
router.get('/', authenticate, authorize('admin', 'editor'), contactController.getAllMessages);
router.put('/:id/status', authenticate, authorize('admin', 'editor'), contactController.updateMessageStatus);
router.delete('/:id', authenticate, authorize('admin'), contactController.deleteMessage);

module.exports = router;

