import express from 'express';
import { login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

export default router;