import express from 'express';
import {
  getAuthenticatedUser,
  login,
  logout,
  signup,
} from '../controllers/usersController';
import { requiresAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', requiresAuth, getAuthenticatedUser);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
