const Stats = require('../models/stats.model');
const User = require('../models/user.model');
const Book = require('../models/book.model');
const Purchase = require('../models/purchase.model');
const Reservation = require('../models/reservation.model');

class StatsService {
  static async updateStats() {
    try {
      const [users, books, purchases, reservations] = await Promise.all([
        User.find(),
        Book.find(),
        Purchase.find(),
        Reservation.find()
      ]);

      const stats = {
        totalUsers: users.length,
        adminUsers: users.filter(user => user.role === 'admin').length,
        regularUsers: users.filter(user => user.role === 'user').length,
        totalBooks: books.length,
        totalPurchases: purchases.length,
        totalReservations: reservations.length,
        activeReservations: reservations.filter(res => res.status === 'active').length,
        lastUpdated: new Date()
      };

      await Stats.findOneAndUpdate({}, stats, { upsert: true, new: true });
      return stats;
    } catch (error) {
      throw new Error(`Error updating stats: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      const stats = await Stats.findOne();
      if (!stats) {
        return await this.updateStats();
      }
      return stats;
    } catch (error) {
      throw new Error(`Error getting stats: ${error.message}`);
    }
  }
}

module.exports = StatsService;