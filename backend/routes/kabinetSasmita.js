const express = require('express');
const router = express.Router();
const kabinetSasmitaController = require('../controllers/kabinetSasmitaController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', kabinetSasmitaController.getKabinetSasmita);

// Protected routes
router.post('/', authenticate, authorize('admin', 'editor'), kabinetSasmitaController.upsertKabinetSasmita);

module.exports = router;

