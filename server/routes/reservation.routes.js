const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const {
  createReservation,
  getUserReservations,
  getAllReservations,
  updateReservationStatus
} = require('../controllers/reservation.controller');

router.route('/')
  .post(protect, createReservation)
  .get(protect, getUserReservations);

router.get('/all', protect, admin, getAllReservations);
router.put('/:id/status', protect, admin, updateReservationStatus);

module.exports = router;