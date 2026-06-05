const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || '';

  // First try the provided MONGO_URI
  if (uri) {
    try {
      await mongoose.connect(uri);
      console.log(`MongoDB connected: ${mongoose.connection.host}`);
      return;
    } catch (error) {
      console.warn(`Unable to connect to MONGO_URI (${uri}): ${error.message}`);
      // fall through to in-memory fallback in dev
    }
  }

  // In non-production environments, start an in-memory MongoDB server
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`Connected to in-memory MongoDB: ${mongoose.connection.host}`);
      return;
    } catch (error) {
      // If mongodb-memory-server is not installed or fails, log and continue
      console.error('Failed to start in-memory MongoDB:', error && error.message ? error.message : error);
      if (error && /Cannot find module 'mongodb-memory-server'/.test(String(error))) {
        console.warn('mongodb-memory-server is not installed; continuing without an in-memory DB in development.');
        return;
      }
      // For other errors, do not crash the whole process in dev
      return;
    }
  }

  console.error('No MongoDB connection available and running in production mode. Exiting.');
  process.exit(1);
};

const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) await mongoMemoryServer.stop();
  } catch (err) {
    // ignore
  }
};

module.exports = connectDB;
module.exports.closeDB = closeDB;
