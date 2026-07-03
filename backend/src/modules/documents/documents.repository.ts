import prisma from '../../config/database';

// ambil semua dokumen 

export const findAllDocuments = async () => {
    return prisma.document.findMany({
        include: {
            uploader: {
                select: {
                    username: true, email: true
                }
            },
            category: true, subCategory: true
        }
    })
}

// ambil dookumen id

export const findDocumentById = async (id: string) => {
    return prisma.document.findUnique({
        where: { id },
        include: {
            uploader: {
                select: {
                    username: true, email: true
                }
            },
            category: true, subCategory: true
        }
    })
}

// simpan data dokumen baru

export const createDocument = async (data: any) => {
    return prisma.document.create({
        data
    })
}

// hapus data 

export const deleteDocument = async (id: string) => {
    return prisma.document.delete({
        where: { id }
    })
}