import mongoose from 'mongoose';
import { connectDB } from './src/lib/db/connect';

async function drop() {
  await connectDB();
  await mongoose.connection.db?.dropDatabase();
  console.log('Database dropped');
  process.exit(0);
}

drop().catch(console.error);
