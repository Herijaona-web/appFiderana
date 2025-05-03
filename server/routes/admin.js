import express from 'express';
import {
  renderLogin,
  handleLogin,
  handleLogout,
  getTarika,
  createTarika,
  getDashboard,
  getUsers,
  createUser,
  updateOrDeleteUser
} from '../controllers/adminController.js';

import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Auth
router.get('/login', renderLogin);
router.post('/login', handleLogin);
router.get('/logout', handleLogout);



router.use(protect);
router.use(adminOnly);

router.get('/', getDashboard);
router.get('/users', getUsers);
router.post('/users', createUser);
router.post('/users/:id', updateOrDeleteUser);

// Tarika
router.get('/tarika', getTarika);
router.post('/tarika', createTarika);

export default router;
