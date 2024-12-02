const asyncHandler = require('express-async-handler');
const Purchase = require('../models/purchase.model');
const Book = require('../models/book.model');
const StatsService = require('../services/stats.service');

const createPurchase = asyncHandler(async (req, res) => {
  const { bookId, quantity } = req.body;
  
  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  if (book.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }

  const purchase = await Purchase.create({
    userId: req.user._id,
    bookId,
    quantity,
    totalPrice: book.price * quantity
  });

  // Update book stock
  book.stock -= quantity;
  await book.save();

  // Update stats
  await StatsService.updateStats();

  res.status(201).json(purchase);
});

const getUserPurchases = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find({ userId: req.user._id })
    .populate('bookId')
    .sort('-createdAt');
  res.json(purchases);
});

const getAllPurchases = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find({})
    .populate('userId', 'username email')
    .populate('bookId')
    .sort('-createdAt');
  res.json(purchases);
});

module.exports = {
  createPurchase,
  getUserPurchases,
  getAllPurchases
};