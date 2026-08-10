import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedDatabase } from '../controllers/seedController.js';

dotenv.config();

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flowforge';
    await mongoose.connect(mongoUri);
    console.log(`[Seed CLI] Connected to MongoDB: ${mongoUri}`);

    const result = await seedDatabase();
    console.log('[Seed CLI] Output:', result.message);
    console.log('[Seed CLI] Pre-populated Logins:');
    console.table(result.credentials);

    process.exit(0);
  } catch (error) {
    console.error('[Seed CLI Error]', error.message);
    process.exit(1);
  }
};

runSeed();
