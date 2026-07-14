import * as documentRepository from './documents.repository';
import fs from 'fs';
import path from 'path';
import { deleteFromAzureBlob } from '../../services/azureStorage.service';

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

export const updateDocument = async (id: string, data: any) => {
    const doc = await getDocumentById(id);
    
    // Jika ada fileUrl baru (PDF baru) dan ada file lama, hapus file lama dari Azure/Lokal
    if (data.fileUrl && doc.fileUrl) {
        if (doc.fileUrl.startsWith('http')) {
            await deleteFromAzureBlob(doc.fileUrl, 'documents');
        } else {
            const filePath = path.join(process.cwd(), 'uploads/documents', doc.fileUrl)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        }
    }

    return await documentRepository.updateDocument(id, data);
}

export const deleteDocument = async (id: string) => {
    // cari docs nya
    const doc = await getDocumentById(id);
    // Hapus dari Azure Blob Storage
    if (doc.fileUrl && doc.fileUrl.startsWith('http')) {
        await deleteFromAzureBlob(doc.fileUrl, 'documents');
    } else {
        // Fallback jika file sebelumnya disimpan secara lokal
        const filePath = path.join(process.cwd(), 'uploads/documents', doc.fileUrl)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
    // hapus data dri database

    return await documentRepository.deleteDocument(id)
}

export const getDocumentsBySubCategory = async (subCategoryId: string) => {
    return await documentRepository.findDocumentsBySubCategory(subCategoryId);
};

export const getDocumentsByCategory = async (categoryId: string) => {
    return await documentRepository.findDocumentsByCategory(categoryId);
};
