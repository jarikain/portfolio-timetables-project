import { Router } from 'express';
import {
  hasUser,
  initialRegister,
  logout,
  register,
  authenticateMiddleware,
  checkAuth,
  getAdminUser,
  postAdminUser,
  changePassword
} from '../controllers/admins.js';
import { isAuthenticated } from '../utils/middleware.js';

const router = Router();

router.post('/login', authenticateMiddleware);
router.get('/has-user', hasUser);
router.post('/logout', isAuthenticated, logout);
router.post('/register', isAuthenticated, register);
router.post('/initial-register', initialRegister);
router.get('/check-auth', checkAuth);

router.get('/admin-user', isAuthenticated, getAdminUser);
router.post('/admin-user/:id', isAuthenticated, postAdminUser);

router.post('/change-password', isAuthenticated, changePassword);

export default router;
