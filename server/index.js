require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./config/db');
const { SERVER_CONFIG } = require('./config/constants');
const { logServerStart, logError } = require('./utils/logger');

const app = express();

// Middleware
app.use(cors(SERVER_CONFIG.CORS_OPTIONS));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/reservations', require('./routes/reservation.routes'));
app.use('/api/purchases', require('./routes/purchase.routes'));
app.use('/api/stats', require('./routes/stats.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  logError(err);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || SERVER_CONFIG.DEFAULT_PORT;

const startServer = async () => {
  try {
    await database.connect();
    
    app.listen(PORT, () => {
      logServerStart(PORT);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logError(err);
  console.error('Unhandled Promise Rejection. Shutting down...');
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logError(err);
  console.error('Uncaught Exception. Shutting down...');
  process.exit(1);
});