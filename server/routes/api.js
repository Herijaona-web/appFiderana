import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Simple API health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    env: process.env.NODE_ENV || 'development'
  });
});

// Protected route example
router.get('/protected', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'You have access to this protected route',
    user: req.user
  });
});

export default router;