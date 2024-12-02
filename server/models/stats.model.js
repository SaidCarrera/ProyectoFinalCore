const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  totalUsers: {
    type: Number,
    default: 0
  },
  adminUsers: {
    type: Number,
    default: 0
  },
  regularUsers: {
    type: Number,
    default: 0
  },
  totalBooks: {
    type: Number,
    default: 0
  },
  totalPurchases: {
    type: Number,
    default: 0
  },
  totalReservations: {
    type: Number,
    default: 0
  },
  activeReservations: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Stats = mongoose.model('Stats', statsSchema);
module.exports = Stats;