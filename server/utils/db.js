// utils/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;