import * as documentRepository from './documents.repository';
import fs from 'fs';
import path from 'path';

export const getAllDocuments = async () => {
    return await documentRepository.findAllDocuments();
}

export const getDocumentById = async (id: string) => {
    const doc = await documentRepository.findDocumentById(id)
    if (!doc) {
        throw new Error("Dokumen tidak ditemukan")
    }
    return doc
}

export const createDocument = async (data: any) => {
    return await documentRepository.createDocument(data)
}

export const deleteDocument = async (id: string) => {
    // cari docs nya
    const doc = await getDocumentById(id);
    // tentukan lokasi file fisik 
    const filePath = path.join(process.cwd(), 'uploads/documents', doc.fileUrl)
    // cek filenya di hardisk, jika ada, hapus
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
    }
    // hapus data dri database

    return await documentRepository.deleteDocument(id)
}