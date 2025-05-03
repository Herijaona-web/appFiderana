import mongoose from 'mongoose';

const connectDB = async () => {
  // try {
    // Using a local MongoDB instance for development
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/admin-app');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  //   console.log('connected')
  // } catch (error) {
  //   console.error(`Error connecting to MongoDB: ${error.message}`);
  //   process.exit(1);
  // }
};

export default connectDB;