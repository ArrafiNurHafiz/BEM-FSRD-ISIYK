const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', aboutController.getAboutSections);

// Protected routes
router.post('/', authenticate, authorize('admin', 'editor'), upload.single('image'), aboutController.upsertAboutSection);

module.exports = router;

