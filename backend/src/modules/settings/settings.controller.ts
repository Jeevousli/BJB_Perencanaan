import { Request, Response } from 'express';
import * as settingsService from './settings.service';

export const getSiteSetting = async (req: Request, res: Response) => {
    try {
        const setting = await settingsService.getSiteSetting();
        res.status(200).json({
            message: 'Berhasil mengambil pengaturan situs',
            data: setting
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSiteSetting = async (req: Request, res: Response) => {
    try {
        const { heroTitle, heroSubtitle } = req.body;
        const setting = await settingsService.updateSiteSetting({ heroTitle, heroSubtitle });
        res.status(200).json({
            message: 'Pengaturan situs berhasil diperbarui',
            data: setting
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
