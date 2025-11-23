const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', galleryController.getAllGallery);
router.get('/batch/:batch_id', galleryController.getBatchImages);
router.get('/:id', galleryController.getGalleryById);

// Protected routes
router.post('/', authenticate, authorize('admin', 'editor'), upload.single('image'), galleryController.createGalleryItem);
router.post('/bulk', authenticate, authorize('admin', 'editor'), upload.array('images', 50), galleryController.createBulkGalleryItems);
router.put('/:id', authenticate, authorize('admin', 'editor'), upload.single('image'), galleryController.updateGalleryItem);
router.delete('/:id', authenticate, authorize('admin'), galleryController.deleteGalleryItem);

module.exports = router;

