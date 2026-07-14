import * as categoryRepository from './categories.repository';
import { deleteFromAzureBlob } from '../../services/azureStorage.service';
import fs from 'fs';
import path from 'path';

export const getAllCategories = async () => {
    return await categoryRepository.findAllCategories()
}

export const updateCategory = async (id: string, data: any) => {
    const category = await categoryRepository.findCategoryById(id);
    if (!category) throw new Error("Kategori tidak ditemukan");

    if (data.bannerUrl && category.bannerUrl) {
        if (category.bannerUrl.startsWith('http')) {
            await deleteFromAzureBlob(category.bannerUrl, 'categories');
        } else {
            const filePath = path.join(process.cwd(), 'uploads/categories', category.bannerUrl);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
    }

    return await categoryRepository.updateCategory(id, data);
}

export const updateSubCategory = async (id: string, data: any) => {
    const subCategory = await categoryRepository.findSubCategoryById(id);
    if (!subCategory) throw new Error("SubKategori tidak ditemukan");

    if (data.bannerUrl && subCategory.bannerUrl) {
        if (subCategory.bannerUrl.startsWith('http')) {
            await deleteFromAzureBlob(subCategory.bannerUrl, 'categories');
        } else {
            const filePath = path.join(process.cwd(), 'uploads/categories', subCategory.bannerUrl);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
    }

    return await categoryRepository.updateSubCategory(id, data);
}