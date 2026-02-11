import mongoose from 'mongoose';

async function connectDb() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI in environment');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    autoIndex: true
  });

  console.log('MongoDB connected successfully');

  return mongoose.connection;
}

export { connectDb };
