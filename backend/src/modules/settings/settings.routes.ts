import { Router } from 'express';
import { getSiteSetting, updateSiteSetting } from './settings.controller';
import { authenticateJWT, authorizeRole } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', getSiteSetting);
router.put('/', authenticateJWT, authorizeRole(['ADMIN']), updateSiteSetting);

export default router;
