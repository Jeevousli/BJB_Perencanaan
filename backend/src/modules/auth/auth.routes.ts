import { Router } from 'express';
import { login, getMe } from './auth.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';

const router = Router();

// POST /api/auth/login
router.post('/login', login);
// GET /api/auth/me -> pakai middleware authenticateJWT
router.get('/me', authenticateJWT, getMe);

export default router;
