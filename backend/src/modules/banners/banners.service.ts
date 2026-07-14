import * as bannerRepository from './banners.repository';
import fs from 'fs';
import path from 'path';
import { deleteFromAzureBlob } from '../../services/azureStorage.service';

export const getAllBanners = async () => {
    return await bannerRepository.findAllBanners()
}

export const getBannersById = async (id: string) => {
    const banner = await bannerRepository.findBannersById(id);
    if (!banner) {
        throw new Error("Banner tidak ditemukan")
    }
    return banner
}

export const createBanner = async (data: any) => {
    return await bannerRepository.createBanner(data)
}
export const updateBanner = async (id: string, data: any) => {
    const banner = await getBannersById(id);
    if (data.imageUrl) {
        if (banner.imageUrl && banner.imageUrl.startsWith('http')) {
            await deleteFromAzureBlob(banner.imageUrl, 'banners');
        } else {
            const filePath = path.join(process.cwd(), 'uploads/banners', banner.imageUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        }
        return await bannerRepository.updateBanner(id, data)
    }

}

export const toggleBannerStatus = async (id: string, isActive: boolean) => {
    return await bannerRepository.toggleBannerStatus(id, isActive)

}

export const deleteBanner = async (id: string) => {
    const banner = await getBannersById(id);

    // Hapus file fisik GAMBAR-nya
    if (banner.imageUrl && banner.imageUrl.startsWith('http')) {
        await deleteFromAzureBlob(banner.imageUrl, 'banners');
    } else {
        const filePath = path.join(process.cwd(), 'uploads/banners', banner.imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    return await bannerRepository.deleteBanner(id);
};