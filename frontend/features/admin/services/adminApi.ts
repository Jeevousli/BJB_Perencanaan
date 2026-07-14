import axiosClient from "@/lib/axios";

// Reuse existing endpoints and aggregate on frontend
export const getDashboardStatsApi = async () => {
    const [docsRes, bannersRes, categoriesRes, usersRes, auditRes] = await Promise.all([
        axiosClient.get('/documents'),
        axiosClient.get('/banners'),
        axiosClient.get('/categories'),
        axiosClient.get('/users'),
        axiosClient.get('/audit?limit=8'),
    ]);

    const documents = docsRes.data?.data || [];
    const banners = bannersRes.data?.data || [];
    const categories = categoriesRes.data?.data || [];
    const users = usersRes.data?.data || [];
    const recentActivity = auditRes.data?.data || [];

    // Hitung banner aktif
    const activeBanners = banners.filter((b: any) => b.isActive).length;

    // Hitung total kategori + sub kategori
    const totalCategories = categories.length;
    const totalSubCategories = categories.reduce((sum: number, cat: any) => sum + (cat.subCategories?.length || 0), 0);

    // Breakdown dokumen per kategori
    const docsByCategory = categories.map((cat: any) => {
        const count = documents.filter((doc: any) => doc.category?.name === cat.name).length;
        return { name: cat.name, count };
    }).sort((a: any, b: any) => b.count - a.count);

    return {
        totalDocuments: documents.length,
        activeBanners,
        totalCategories,
        totalSubCategories,
        totalUsers: users.length,
        docsByCategory,
        recentActivity,
    };
};
