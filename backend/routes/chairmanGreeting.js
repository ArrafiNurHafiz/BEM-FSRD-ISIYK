const express = require('express');
const router = express.Router();
const chairmanGreetingController = require('../controllers/chairmanGreetingController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', chairmanGreetingController.getChairmanGreeting);

// Protected routes
router.post('/', authenticate, authorize('admin', 'editor'), upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
]), chairmanGreetingController.upsertChairmanGreeting);

router.delete('/', authenticate, authorize('admin', 'editor'), chairmanGreetingController.deleteChairmanGreeting);

module.exports = router;

