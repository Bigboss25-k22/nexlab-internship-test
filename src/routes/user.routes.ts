import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Protected routes - require authentication
router.get('/profile', authenticate, userController.getProfile);

export default router;
