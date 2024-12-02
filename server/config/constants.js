const DB_CONFIG = {
  TIMEOUT_MS: 5000,
  SOCKET_TIMEOUT_MS: 45000,
  IP_VERSION: 4,
  DEFAULT_PORT: 27017,
  RETRY_ATTEMPTS: 5,
  CONNECTION_OPTIONS: {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  }
};

const SERVER_CONFIG = {
  DEFAULT_PORT: 5000,
  RETRY_DELAY_MS: 5000,
  CORS_OPTIONS: {
    origin: 'http://localhost:4200',
    credentials: true
  }
};

const AUTH_CONFIG = {
  JWT_EXPIRES_IN: '30d',
  SALT_ROUNDS: 10
};

module.exports = {
  DB_CONFIG,
  SERVER_CONFIG,
  AUTH_CONFIG
};