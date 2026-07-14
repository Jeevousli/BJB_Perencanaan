import { Request, Response } from 'express';
import * as categoryBannersService from './categoryBanners.service';
import { uploadToAzureBlob } from '../../services/azureStorage.service';

export const getBannersByCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const banners = await categoryBannersService.getBannersByCategory(id);
        res.status(200).json({ data: banners });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getBannersBySubCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const banners = await categoryBannersService.getBannersBySubCategory(id);
        res.status(200).json({ data: banners });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addBannerToCategory = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = req.user;
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: 'File gambar wajib diupload' });
            return;
        }

        const fileUrl = await uploadToAzureBlob(file, 'categories');
        const banner = await categoryBannersService.addBanner({
            judul: req.body.judul || '',
            imageUrl: fileUrl,
            categoryId: id,
            createdById: user.userId,
            updatedById: user.userId
        });

        res.status(201).json({ message: 'Banner kategori berhasil ditambahkan', data: banner });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const addBannerToSubCategory = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = req.user;
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: 'File gambar wajib diupload' });
            return;
        }

        const fileUrl = await uploadToAzureBlob(file, 'categories');
        const banner = await categoryBannersService.addBanner({
            judul: req.body.judul || '',
            imageUrl: fileUrl,
            subCategoryId: id,
            createdById: user.userId,
            updatedById: user.userId
        });

        res.status(201).json({ message: 'Banner subkategori berhasil ditambahkan', data: banner });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const { bannerId } = req.params;
        await categoryBannersService.deleteBanner(bannerId);
        res.status(200).json({ message: 'Banner berhasil dihapus' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
