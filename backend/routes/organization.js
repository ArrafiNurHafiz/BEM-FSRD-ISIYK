const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', organizationController.getAllStructure);
router.get('/:id', organizationController.getMemberById);

// Protected routes
router.post('/', authenticate, authorize('admin', 'editor'), upload.single('photo'), organizationController.createMember);
router.put('/:id', authenticate, authorize('admin', 'editor'), upload.single('photo'), organizationController.updateMember);
router.delete('/:id', authenticate, authorize('admin'), organizationController.deleteMember);

module.exports = router;

