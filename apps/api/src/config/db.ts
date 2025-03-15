import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      ssl: true,
      sslValidate: true,
      // For Vercel serverless compatibility
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    } as mongoose.ConnectOptions);
    console.log('🚀 Connected to MongoDB successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection errors:', error);
    process.exit(1);
  }
}

export default connectDB;
