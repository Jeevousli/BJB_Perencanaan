import prisma from '../../config/database';

// mengambil semua kategori dan sub kategori
export const findAllCategories = async () => {
    return prisma.category.findMany({
        include: {
            subCategories: true
        }
    })
}