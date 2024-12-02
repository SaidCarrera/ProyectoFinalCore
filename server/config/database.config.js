const { DB_CONFIG } = require('./constants');

const databaseConfig = {
  url: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/library',
  options: {
    serverSelectionTimeoutMS: DB_CONFIG.TIMEOUT_MS,
    socketTimeoutMS: DB_CONFIG.SOCKET_TIMEOUT_MS,
    family: DB_CONFIG.IP_VERSION,
    maxPoolSize: 10,
    minPoolSize: 5,
    retryWrites: true,
    retryReads: true,
    connectTimeoutMS: 30000
  }
};

module.exports = databaseConfig;