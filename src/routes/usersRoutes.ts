import express from 'express';
import {
  getAuthenticatedUser,
  login,
  logout,
  signup,
} from '../controllers/usersController';
import { requiresAuth } from '../middleware/authMiddleware';
import cors from 'cors';

const router = express.Router();

router.options('/', cors());
router.options('/signup', cors());
router.options('/login', cors());
router.options('/logout', cors());
router.get('/', cors(), requiresAuth, getAuthenticatedUser);
router.post('/signup', cors(), signup);
router.post('/login', cors(), login);
router.post('/logout', cors(), logout);

export default router;
