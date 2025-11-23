const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', programController.getAllPrograms);
router.get('/:id', programController.getProgramById);

// Protected routes
router.post('/', authenticate, authorize('admin', 'editor'), upload.single('image'), programController.createProgram);
router.put('/:id', authenticate, authorize('admin', 'editor'), upload.single('image'), programController.updateProgram);
router.delete('/:id', authenticate, authorize('admin'), programController.deleteProgram);

module.exports = router;

