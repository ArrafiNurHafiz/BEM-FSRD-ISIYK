const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/:id/rsvp', eventController.rsvpEvent);

// Protected routes
router.post('/', authenticate, authorize('admin', 'editor'), upload.single('image'), eventController.createEvent);
router.put('/:id', authenticate, authorize('admin', 'editor'), upload.single('image'), eventController.updateEvent);
router.delete('/:id', authenticate, authorize('admin'), eventController.deleteEvent);
router.get('/:id/rsvps', authenticate, authorize('admin', 'editor'), eventController.getEventRsvps);
router.get('/rsvps/all', authenticate, authorize('admin', 'editor'), eventController.getAllRsvps);

module.exports = router;

