import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || '';

async function connectDB() {
    try {
        await mongoose.connect(DATABASE_URL, {
            serverSelectionTimeoutMS: 5000, // Reduce timeout
        });
        console.log('🚀 Connected to MongoDB successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

export default connectDB;
