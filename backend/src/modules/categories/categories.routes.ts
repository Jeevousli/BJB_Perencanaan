import { Router } from 'express';
import * as categoryController from './categories.controller';
import { authenticateJWT, authorizeRole } from '../../middlewares/auth.middleware';

const router = Router();

// wajib login
router.use(authenticateJWT);

// GET /api/categories → Bisa diakses ADMIN dan VIEWER
router.get('/', authorizeRole(['ADMIN', 'VIEWER']), categoryController.getAllCategories);
export default router;