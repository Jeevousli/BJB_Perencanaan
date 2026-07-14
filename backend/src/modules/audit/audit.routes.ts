import { Router } from 'express';
import * as auditController from './audit.controller';
import { authenticateJWT, authorizeRole } from '../../middlewares/auth.middleware';

const router = Router();

// Semua route audit hanya bisa diakses oleh ADMIN
router.use(authenticateJWT);

// GET /api/audit → Daftar aktivitas audit log
router.get('/', authorizeRole(['ADMIN']), auditController.getAuditLog);

export default router;
