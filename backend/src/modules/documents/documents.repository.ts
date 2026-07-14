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
            updatedBy: {
                select: {
                    username: true
                }
            },
            category: true, subCategory: true
        },
        orderBy: {
            createdAt: 'desc'
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
            updatedBy: {
                select: {
                    username: true
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

// update dokumen
export const updateDocument = async (id: string, data: any) => {
    return prisma.document.update({
        where: { id },
        data
    });
}

// Ambil dokumen berdasarkan subCategoryId
export const findDocumentsBySubCategory = async (subCategoryId: string) => {
    return prisma.document.findMany({
        where: { subCategoryId },
        include: {
            uploader: { select: { username: true } },
            updatedBy: { select: { username: true } },
            category: true,
            subCategory: true
        },
        orderBy: { tanggalPublikasi: 'desc' }
    });
};

// Ambil dokumen berdasarkan categoryId utama
export const findDocumentsByCategory = async (categoryId: string) => {
    return prisma.document.findMany({
        where: { categoryId },
        include: {
            uploader: { select: { username: true } },
            updatedBy: { select: { username: true } },
            category: true,
            subCategory: true
        },
        orderBy: { tanggalPublikasi: 'desc' }
    });
};
