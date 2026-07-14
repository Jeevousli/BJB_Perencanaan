import prisma from "../../config/database";

export const getBannersByCategory = async (categoryId: string) => {
    return await prisma.categoryBanner.findMany({
        where: { categoryId },
        include: {
            createdBy: { select: { username: true } },
            updatedBy: { select: { username: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const getBannersBySubCategory = async (subCategoryId: string) => {
    return await prisma.categoryBanner.findMany({
        where: { subCategoryId },
        include: {
            createdBy: { select: { username: true } },
            updatedBy: { select: { username: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const addBanner = async (data: any) => {
    return await prisma.categoryBanner.create({
        data
    });
};

export const deleteBanner = async (id: string) => {
    return await prisma.categoryBanner.delete({
        where: { id }
    });
};
