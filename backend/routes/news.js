const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Protected routes
router.post('/', authenticate, authorize('admin', 'editor'), upload.single('featured_image'), newsController.createNews);
router.put('/:id', authenticate, authorize('admin', 'editor'), upload.single('featured_image'), newsController.updateNews);
router.delete('/:id', authenticate, authorize('admin'), newsController.deleteNews);

module.exports = router;
