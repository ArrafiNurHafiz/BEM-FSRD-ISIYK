const express = require('express');
const router = express.Router();
const aspirationController = require('../controllers/aspirationController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.post('/', aspirationController.submitAspiration);

// Admin routes
router.get('/', authenticate, authorize('admin', 'editor'), aspirationController.getAllAspirations);
router.put('/:id/status', authenticate, authorize('admin', 'editor'), aspirationController.updateAspirationStatus);
router.delete('/:id', authenticate, authorize('admin'), aspirationController.deleteAspiration);

module.exports = router;

