import prisma from "../../config/database";

export const getSiteSetting = async () => {
    let setting = await prisma.siteSetting.findFirst();
    if (!setting) {
        setting = await prisma.siteSetting.create({
            data: {
                id: "1",
                heroTitle: "Selamat datang di situs Research and Office of Economist bank bjb",
                heroSubtitle: "Temukan dan unduh dokumen kajian ekonomi & perbankan BJB"
            }
        });
    }
    return setting;
};

export const updateSiteSetting = async (data: { heroTitle?: string; heroSubtitle?: string }) => {
    const setting = await getSiteSetting();
    return await prisma.siteSetting.update({
        where: { id: setting.id },
        data
    });
};
