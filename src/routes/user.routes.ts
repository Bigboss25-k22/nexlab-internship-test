import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Protected routes - require authentication
router.get('/profile', authenticate, userController.getProfile);

// Admin only route example
// router.get('/admin', authenticate, authorize('admin'), someController);

export default router;
