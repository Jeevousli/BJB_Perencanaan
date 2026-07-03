import { Request, Response } from 'express';
import * as categoryService from './categories.service';
import { json } from 'node:stream/consumers';

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