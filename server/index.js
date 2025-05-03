import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import expressLayouts from 'express-ejs-layouts';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import apiRoutes from './routes/api.js';
import adminRoutes from './routes/admin.js';

// Import database connection
import connectDB from './config/db.js';

import seedDatabase from './seeds/index.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Connect to MongoDB
connectDB();

// seedDatabase();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', apiRoutes);

// Admin Routes
app.use('/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Node.js Admin Application',
    description: 'A Node.js application with admin interface and API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).render('error', {
    title: 'Error',
    error: err.message || 'Server Error'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;