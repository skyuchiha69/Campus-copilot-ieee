import mongoose from 'mongoose';

// Disable long buffering timeouts when MongoDB is offline
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 2500);

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-copilot';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.warn(`[Database Warning] The server is operational. Set MONGODB_URI in .env or run local mongod to persist data.`);
  }
};
