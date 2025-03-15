import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true, // if needed
    } as ConnectOptions);
    console.log('🚀 Connected to MongoDB successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

export default connectDB;
