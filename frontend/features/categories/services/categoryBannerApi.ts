import axiosClient from "@/lib/axios";

export const getBannersByCategoryApi = async (categoryId: string) => {
    const response = await axiosClient.get(`/categories/${categoryId}/banners`);
    return response.data;
};

export const getBannersBySubCategoryApi = async (subCategoryId: string) => {
    const response = await axiosClient.get(`/categories/sub/${subCategoryId}/banners`);
    return response.data;
};

export const addBannerToCategoryApi = async (categoryId: string, data: FormData) => {
    const response = await axiosClient.post(`/categories/${categoryId}/banners`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const addBannerToSubCategoryApi = async (subCategoryId: string, data: FormData) => {
    const response = await axiosClient.post(`/categories/sub/${subCategoryId}/banners`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteCategoryBannerApi = async (bannerId: string) => {
    const response = await axiosClient.delete(`/categories/banners/${bannerId}`);
    return response.data;
};
