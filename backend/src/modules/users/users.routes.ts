import { Router } from 'express';
import * as userController from './users.controller';
import { authenticateJWT, authorizeRole } from '../../middlewares/auth.middleware';

const router = Router();
// semua route harus login terlebih dahulu

router.use(authenticateJWT);
// GET /api/users → Bisa diakses ADMIN dan VIEWER

router.get('/', authorizeRole(['ADMIN', 'VIEWER']), userController.getAllUsers);

// GET /api/users/:id → Bisa diakses ADMIN dan VIEWER
router.get("/:id", authorizeRole(['ADMIN', 'VIEWER']), userController.getUserById)

// POST /api/users → HANYA BISA DIAKSES ADMIN
router.post('/', authorizeRole(['ADMIN']), userController.createUser)

// PUT /api/users/:id → HANYA BISA DIAKSES ADMIN
router.put('/:id', authorizeRole(['ADMIN']), userController.updateUser)


// DELETE /api/users/:id → HANYA BISA DIAKSES ADMIN
router.delete('/:id', authorizeRole(['ADMIN']), userController.deleteUser);
export default router;
