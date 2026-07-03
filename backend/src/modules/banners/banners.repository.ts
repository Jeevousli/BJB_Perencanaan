import prisma from "../../config/database";

export const findAllBanners = async () => {
    return prisma.masterBeranda.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export const findBannersById = async (id: string) => {
    return prisma.masterBeranda.findUnique({
        where: { id }
    })
}

export const createBanner = async (data: any) => {
    return prisma.masterBeranda.create({ data })
}

export const updateBanner = async (id: string, data: any) => {
    return prisma.masterBeranda.update({
        where: { id },
        data
    })
}

// fungsi on off banner

export const toggleBannerStatus = async (id: string, isActive: boolean) => {
    return prisma.masterBeranda.update({
        where: { id },
        data: { isActive }
    });
};

export const deleteBanner = async (id: string) => {
    return prisma.masterBeranda.delete({
        where: { id }
    })
}