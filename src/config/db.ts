import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/wink-blog';
  await mongoose.connect(uri, { autoIndex: true});
  console.log(`MongoDB connected: ${uri}`);
};
