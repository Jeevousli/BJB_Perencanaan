import prisma from '../../config/database';

// mengambil semua kategori dan sub kategori
export const findAllCategories = async () => {
    return prisma.category.findMany({
        include: {
            subCategories: {
                include: {
                    updatedBy: { select: { username: true } }
                }
            },
            updatedBy: { select: { username: true } }
        }
    })
}

// update kategori
export const updateCategory = async (id: string, data: any) => {
    return prisma.category.update({
        where: { id },
        data
    });
}

// update subkategori
export const updateSubCategory = async (id: string, data: any) => {
    return prisma.subCategory.update({
        where: { id },
        data
    });
}

export const findCategoryById = async (id: string) => {
    return prisma.category.findUnique({
        where: { id }
    });
}

export const findSubCategoryById = async (id: string) => {
    return prisma.subCategory.findUnique({
        where: { id }
    });
}