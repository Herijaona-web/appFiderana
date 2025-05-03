import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Seed data
const seedUsers = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'nodejs',
    role: 'admin'
  },
  {
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    role: 'user'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    console.log('Data cleared...');

    // Insert new data
    const users = await User.create(seedUsers);
    console.log(`${users.length} users created!`);
    
    console.log('Admin login credentials:');
    console.log('Username: admin');
    console.log('Email: admin@example.com');
    console.log('Password: nodejs');

    // Exit process
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run seed function
// seedDatabase();
export default seedDatabase;