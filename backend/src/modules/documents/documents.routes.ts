import { Router } from 'express';
import * as documentController from './documents.controller';
import { authenticateJWT, authorizeRole } from '../../middlewares/auth.middleware';
import { uploadPdf } from '../../middlewares/upload.middleware';

const router = Router();

// Wajib Login
router.use(authenticateJWT);

// Semua orang (ADMIN & VIEWER) bisa melihat daftar dokumen
router.get('/', authorizeRole(['ADMIN', 'VIEWER']), documentController.getAllDocuments);
router.get('/by-subcategory/:subCategoryId', authorizeRole(['ADMIN', 'VIEWER']), documentController.getDocumentsBySubCategory);
router.get('/by-category/:categoryId', authorizeRole(['ADMIN', 'VIEWER']), documentController.getDocumentsByCategory);

router.get('/:id', authorizeRole(['ADMIN', 'VIEWER']), documentController.getDocumentById);

// HANYA ADMIN yang boleh Upload & Delete!
// Perhatikan penggunaan uploadPdf.single('file') di tengah
router.post(
    '/',
    authorizeRole(['ADMIN']),
    uploadPdf.single('file'),
    documentController.uploadDocuments
);

router.delete('/:id', authorizeRole(['ADMIN']), documentController.deleteDocument);


export default router;
