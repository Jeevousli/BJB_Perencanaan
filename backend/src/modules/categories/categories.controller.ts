import { Request, Response } from 'express';
import * as categoryService from './categories.service';
import { uploadToAzureBlob } from '../../services/azureStorage.service';

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({
            message: 'Berhasil mengambil data kategori', data: categories
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const updateCategory = async (req: any, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const user = req.user;
        const file = req.file;

        const dataToUpdate: any = { updatedById: user.userId };
        if (req.body.pageTitle !== undefined) dataToUpdate.pageTitle = req.body.pageTitle;

        if (file) {
            const fileUrl = await uploadToAzureBlob(file, 'categories');
            dataToUpdate.bannerUrl = fileUrl;
        }

        const updated = await categoryService.updateCategory(id, dataToUpdate);
        res.status(200).json({ message: 'Kategori berhasil diupdate', data: updated });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const updateSubCategory = async (req: any, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const user = req.user;
        const file = req.file;

        const dataToUpdate: any = { updatedById: user.userId };
        if (req.body.pageTitle !== undefined) dataToUpdate.pageTitle = req.body.pageTitle;

        if (file) {
            const fileUrl = await uploadToAzureBlob(file, 'categories');
            dataToUpdate.bannerUrl = fileUrl;
        }

        const updated = await categoryService.updateSubCategory(id, dataToUpdate);
        res.status(200).json({ message: 'SubKategori berhasil diupdate', data: updated });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}