import axiosClient from "@/lib/axios";

export const getSiteSettingApi = async () => {
    const response = await axiosClient.get('/settings');
    return response.data;
};

export const updateSiteSettingApi = async (data: { heroTitle?: string; heroSubtitle?: string }) => {
    const response = await axiosClient.put('/settings', data);
    return response.data;
};
