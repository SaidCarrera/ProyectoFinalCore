const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const { getStats, updateStats } = require('../controllers/stats.controller');

router.get('/', protect, admin, getStats);
router.post('/update', protect, admin, updateStats);

module.exports = router;