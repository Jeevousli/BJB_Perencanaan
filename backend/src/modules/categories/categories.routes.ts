import { Router } from 'express';
import * as categoryController from './categories.controller';
import * as categoryBannersController from './categoryBanners.controller';
import { authenticateJWT, authorizeRole } from '../../middlewares/auth.middleware';
import { uploadImage } from '../../middlewares/upload.middleware';

const router = Router();

// wajib login
router.use(authenticateJWT);

// GET /api/categories → Bisa diakses ADMIN dan VIEWER
router.get('/', authorizeRole(['ADMIN', 'VIEWER']), categoryController.getAllCategories);

// PUT /api/categories/:id → Update kategori (hanya admin)
router.put(
    '/:id',
    authorizeRole(['ADMIN']),
    uploadImage.single('banner'),
    categoryController.updateCategory
);

// PUT /api/categories/sub/:id → Update subkategori (hanya admin)
router.put(
    '/sub/:id',
    authorizeRole(['ADMIN']),
    uploadImage.single('banner'),
    categoryController.updateSubCategory
);

// Banners for Category
router.get('/:id/banners', authorizeRole(['ADMIN', 'VIEWER']), categoryBannersController.getBannersByCategory);
router.post(
    '/:id/banners',
    authorizeRole(['ADMIN']),
    uploadImage.single('banner'),
    categoryBannersController.addBannerToCategory
);

// Banners for SubCategory
router.get('/sub/:id/banners', authorizeRole(['ADMIN', 'VIEWER']), categoryBannersController.getBannersBySubCategory);
router.post(
    '/sub/:id/banners',
    authorizeRole(['ADMIN']),
    uploadImage.single('banner'),
    categoryBannersController.addBannerToSubCategory
);

// Delete Banner
router.delete('/banners/:bannerId', authorizeRole(['ADMIN']), categoryBannersController.deleteBanner);

export default router;