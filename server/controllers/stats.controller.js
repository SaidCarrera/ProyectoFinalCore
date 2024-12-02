const asyncHandler = require('express-async-handler');
const StatsService = require('../services/stats.service');

const getStats = asyncHandler(async (req, res) => {
  const stats = await StatsService.getStats();
  res.json(stats);
});

const updateStats = asyncHandler(async (req, res) => {
  const stats = await StatsService.updateStats();
  res.json(stats);
});

module.exports = {
  getStats,
  updateStats
};