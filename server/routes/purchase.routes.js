const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const {
  createPurchase,
  getUserPurchases,
  getAllPurchases
} = require('../controllers/purchase.controller');

router.route('/')
  .post(protect, createPurchase)
  .get(protect, getUserPurchases);

router.get('/all', protect, admin, getAllPurchases);

module.exports = router;