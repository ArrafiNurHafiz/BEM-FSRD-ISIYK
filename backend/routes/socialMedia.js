const express = require('express');
const router = express.Router();
const socialMediaController = require('../controllers/socialMediaController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', socialMediaController.getAllSocialMedia);

// Protected routes
router.post('/', authenticate, authorize('admin'), socialMediaController.createSocialMedia);
router.put('/:id', authenticate, authorize('admin'), socialMediaController.updateSocialMedia);
router.delete('/:id', authenticate, authorize('admin'), socialMediaController.deleteSocialMedia);

module.exports = router;

