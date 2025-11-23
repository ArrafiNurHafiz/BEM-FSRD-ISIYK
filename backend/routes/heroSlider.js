const express = require('express');
const router = express.Router();
const heroSliderController = require('../controllers/heroSliderController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', heroSliderController.getAllHeroSliders);
router.get('/:id', heroSliderController.getHeroSliderById);

// Protected routes
router.post('/', authenticate, authorize('admin', 'editor'), upload.single('image'), heroSliderController.createHeroSlider);
router.put('/:id', authenticate, authorize('admin', 'editor'), upload.single('image'), heroSliderController.updateHeroSlider);
router.delete('/:id', authenticate, authorize('admin'), heroSliderController.deleteHeroSlider);

module.exports = router;

