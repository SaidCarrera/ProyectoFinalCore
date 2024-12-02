const logConnection = (host) => {
  console.log(`MongoDB Connected: ${host}`);
  console.log(`Database URL: ${process.env.NODE_ENV === 'development' ? process.env.MONGO_URI : '[HIDDEN]'}`);
};

const logError = (error) => {
  console.error(`Error: ${error.message}`);
  if (error.stack && process.env.NODE_ENV === 'development') {
    console.error('Stack:', error.stack);
  }
};

const logServerStart = (port) => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
};

const logShutdown = (type) => {
  console.log(`${type} signal received: closing HTTP server`);
};

const logMongoError = (error) => {
  console.error(`MongoDB Connection Error: ${error.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error('Full error:', error);
  }
};

module.exports = {
  logConnection,
  logError,
  logServerStart,
  logShutdown,
  logMongoError
};