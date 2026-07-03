import { Router } from 'express';
import * as bannerController from './banners.controller';
import { authenticateJWT, authorizeRole } from '../../middlewares/auth.middleware';
import { uploadImage } from '../../middlewares/upload.middleware';

const router = Router();

router.use(authenticateJWT)

router.get('/', authorizeRole(['ADMIN', 'VIEWER']), bannerController.getAllBanners)

// HANYA ADMIN

router.post(
    '/',
    authorizeRole(['ADMIN']),
    uploadImage.single('file'),
    bannerController.createBanner
);
// Update Banner (Bisa ubah judul dan gambar)
router.put(
    '/:id',
    authorizeRole(['ADMIN']),
    uploadImage.single('file'),
    bannerController.updateBanner
);
// Ubah Status On/Off Banner
// (Kita gunakan nama toggleBannner sesuai dengan yang ada di controller kamu)
router.patch('/:id/status', authorizeRole(['ADMIN']), bannerController.toggleBanner);
// Hapus Banner
// (Kita gunakan nama deleteBanne sesuai dengan yang ada di controller kamu)
router.delete('/:id', authorizeRole(['ADMIN']), bannerController.deleteBanner);
export default router;