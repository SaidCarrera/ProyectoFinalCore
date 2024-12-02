const mongoose = require('mongoose');
const databaseConfig = require('./database.config');
const { logConnection, logMongoError } = require('../utils/logger');

class DatabaseConnection {
  constructor() {
    this.retryCount = 0;
    this.maxRetries = 5;
    this.retryDelay = 5000;
  }

  async connect() {
    try {
      // In development, use in-memory MongoDB
      if (process.env.NODE_ENV === 'development') {
        console.log('Using in-memory database for development');
        return this.setupInMemoryDB();
      }

      const conn = await mongoose.connect(databaseConfig.url, databaseConfig.options);
      this.setupEventListeners();
      logConnection(conn.connection.host);
      return conn;
    } catch (error) {
      return this.handleConnectionError(error);
    }
  }

  setupEventListeners() {
    mongoose.connection.on('error', (err) => {
      logMongoError(err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

    process.on('SIGINT', this.handleAppTermination.bind(this));
    process.on('SIGTERM', this.handleAppTermination.bind(this));
  }

  async setupInMemoryDB() {
    // For development, we'll use the existing connection without actually connecting to MongoDB
    console.log('Development mode: Using in-memory data storage');
    return {
      connection: {
        host: 'in-memory'
      }
    };
  }

  async handleConnectionError(error) {
    logMongoError(error);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Continuing with in-memory storage');
      return this.setupInMemoryDB();
    }
    
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Retrying connection attempt ${this.retryCount} of ${this.maxRetries}`);
      
      await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      return this.connect();
    }
    
    throw new Error('Failed to connect to MongoDB after maximum retry attempts');
  }

  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (err) {
      console.error('Error during MongoDB connection closure:', err);
      process.exit(1);
    }
  }
}

module.exports = new DatabaseConnection();