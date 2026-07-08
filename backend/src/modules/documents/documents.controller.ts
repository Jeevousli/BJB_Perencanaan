import { Request, Response } from 'express';
import * as documentService from './documents.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

// upload dokumen baru

export const uploadDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // ini asil multer
        const user = req.user;
        const file = req.file;
        if (!file) {
            res.status(400)
                .json({
                    message: 'File PDF wajib diupload'
                })
            return;
        }
        // ambil inputan teks dri form
        const { title, description, categoryId, subCategoryId, unitPenyusun, tanggalPublikasi } = req.body;
        //susun data untuk disimpan ke database
        const documentData = {
            title,
            description,
            categoryId,
            subCategoryId: subCategoryId ? subCategoryId : null,
            unitPenyusun: unitPenyusun || "Tim Riset BJB", // Kasih nilai default kalau lupa diisi
            tanggalPublikasi: tanggalPublikasi ? new Date(tanggalPublikasi) : new Date(), // Ubah teks jadi format Waktu/Tanggal
            uploaderId: user.userId, // Ambil dari user yang sedang login
            fileUrl: file.filename   // Ambil dari file yang diupload multer
        };

        const newDoc = await documentService.createDocument(documentData)


        res.status(201).json({
            message: 'Dokumen berhasil di upload', data: newDoc
        })

    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }

}

// ambil semua document

export const getAllDocuments = async (req: Request, res: Response) => {
    try {
        const documents = await documentService.getAllDocuments();
        res.status(200).json({
            message: 'Berhasil mengabmbil data', data: documents
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        })
    }
}

// ambil data 1 dokumen
export const getDocumentById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            res.status(400).json({ message: "Format ID tidak valid atau kosong!" });
            return;
        }
        const doc = await documentService.getDocumentById(id);
        res.status(200).json({ message: "Berhasil mengambil data", data: doc });

    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

// hapus document
export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            res.status(400).json({ message: "Format ID tidak valid atau kosong!" });
            return;
        }
        await documentService.deleteDocument(id);
        res.status(200).json({
            message: 'Dokumen dan file fisiknya berhasil dihapus'
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}

export const getDocumentsBySubCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const subCategoryId = req.params.subCategoryId as string;

        const documents = await documentService.getDocumentsBySubCategory(subCategoryId);
        res.status(200).json({ message: 'Berhasil', data: documents });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getDocumentsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = req.params.categoryId as string;
        const documents = await documentService.getDocumentsByCategory(categoryId);
        res.status(200).json({ message: 'Berhasil', data: documents });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
