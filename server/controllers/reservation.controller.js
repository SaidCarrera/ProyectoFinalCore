const Reservation = require('../models/reservation.model');
const Book = require('../models/book.model');

const createReservation = async (req, res) => {
  try {
    const { bookId, startDate, endDate } = req.body;
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.stock <= 0) {
      return res.status(400).json({ message: 'Book is out of stock' });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      book: bookId,
      startDate,
      endDate,
      status: 'active'
    });

    // Update book stock
    book.stock -= 1;
    await book.save();

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('book')
      .sort('-createdAt');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({})
      .populate('user', 'username email')
      .populate('book')
      .sort('-createdAt');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (status === 'cancelled' && reservation.status === 'active') {
      const book = await Book.findById(reservation.book);
      book.stock += 1;
      await book.save();
    }

    reservation.status = status;
    await reservation.save();

    res.json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  getAllReservations,
  updateReservationStatus
};