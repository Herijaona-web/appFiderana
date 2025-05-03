import express from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);
router.use(adminOnly);

// User routes
router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;