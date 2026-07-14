import { Request, Response } from 'express';
import * as bannerService from './banners.service';
import { uploadToAzureBlob } from '../../services/azureStorage.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

// tambah banner baru

export const createBanner = async (req: any, res: Response): Promise<void> => {
    try {
        const file = (req as any).file;
        const user = req.user;

        if (!file) {
            res.status(400).json({
                message: 'Gambar banner wajib diupload'
            })
            return
        }
        const fileUrl = await uploadToAzureBlob(file, 'banners');
        const { judul, label, isActive } = req.body;
        const data = {
            judul,
            label: label ? label : null,
            isActive: isActive === 'false' ? false : true,
            imageUrl: fileUrl,
            createdById: user.userId
        }
        const newBanner = await bannerService.createBanner(data)
        res.status(200).json({
            message: 'Banner berhasil dibuat', data: newBanner
        })


    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}

// ambil semua banner

export const getAllBanners = async (req: Request, res: Response) => {
    try {
        const banners = await bannerService.getAllBanners();
        res.status(200).json({
            message: ' Berhasil mengambil banner', data: banners
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}

// tombol on/off banner

export const toggleBanner = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const user = req.user;

        if (!id || typeof id !== 'string') {
            res.status(400).json({ message: "Format ID tidak valid atau kosong!" });
            return;
        }

        const status = isActive === true || isActive === 'true'
        await bannerService.updateBanner(id, { isActive: status, updatedById: user.userId });
        res.status(200).json({
            message: ' Status banner berhasil diubah menjadi' + status
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}
// update banner

export const updateBanner = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!id || typeof id !== 'string') {
            res.status(400).json({ message: "Format ID tidak valid atau kosong!" });
            return;
        }
        const { judul, label, isActive } = req.body;
        const dataToUpdate: any = {
            updatedById: user.userId
        };
        // hanya masukan data yg hanya dikirim user
        if (judul) dataToUpdate.judul = judul;
        if (label !== undefined) dataToUpdate.label = label;
        if (isActive !== undefined) dataToUpdate.isActive = isActive === 'false' ? false : true;
        // PENTING: Jika ada gambar BARU yang diupload, tambahkan ke dataToUpdate
        if ((req as any).file) {
            const fileUrl = await uploadToAzureBlob((req as any).file, 'banners');
            dataToUpdate.imageUrl = fileUrl;
        }

        const updatedBanner = await bannerService.updateBanner(id, dataToUpdate);
        res.status(200).json({
            message: 'Banner berhasil diupdate', data: updatedBanner
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}

// hapus banner

export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            res.status(400).json({ message: "Format ID tidak valid atau kosong!" });
            return;
        }
        await bannerService.deleteBanner(id);
        res.status(200).json({
            message: 'Banner berhasil dihapus'
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}