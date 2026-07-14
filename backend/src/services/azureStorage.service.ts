import { BlobServiceClient } from '@azure/storage-blob';
import path from 'path';
import fs from 'fs';

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || '';

const blobServiceClient = AZURE_STORAGE_CONNECTION_STRING
    ? BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
    : null;

/**
 * Uploads a file to Azure Blob Storage
 * @param file The file buffer and metadata from Multer memory storage
 * @param containerName The name of the container ('documents' or 'banners')
 * @returns The public URL of the uploaded blob
 */
export const uploadToAzureBlob = async (file: Express.Multer.File, containerName: string): Promise<string> => {
    // Generate nama file yang unik
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const blobName = `${containerName}-${uniqueSuffix}${ext}`;

    if (!blobServiceClient) {
        // Fallback to local storage if Azure is not configured
        const uploadDir = path.join(process.cwd(), 'uploads', containerName);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, blobName);
        await fs.promises.writeFile(filePath, file.buffer);
        // Returning just the filename so frontend can build the URL
        return blobName;
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload dari buffer
    await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
            blobContentType: file.mimetype,
        }
    });

    return blockBlobClient.url;
};

/**
 * Menghapus file dari Azure Blob Storage berdasarkan URL
 */
export const deleteFromAzureBlob = async (blobUrl: string, containerName: string): Promise<void> => {
    if (!blobServiceClient) {
        // Fallback local delete
        if (!blobUrl.startsWith('http')) {
            const filePath = path.join(process.cwd(), 'uploads', containerName, blobUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        return;
    }
    
    try {
        const url = new URL(blobUrl);
        // Pathname biasanya berbentuk /containername/blobname.pdf
        const blobName = url.pathname.split(`/${containerName}/`)[1];
        
        if (blobName) {
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(decodeURIComponent(blobName));
            await blockBlobClient.deleteIfExists();
        }
    } catch (e) {
        console.error('Gagal menghapus file dari Azure Blob:', e);
    }
};
