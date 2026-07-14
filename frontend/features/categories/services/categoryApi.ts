import axiosClient from "@/lib/axios";

export const getCategoriesApi = async () => {
    const response = await axiosClient.get('/categories');
    if (response.data && response.data.data) {
        const sortedCategories = response.data.data.map((cat: any) => ({
            ...cat,
            subCategories: cat.subCategories ? cat.subCategories.sort((a: any, b: any) => a.name.localeCompare(b.name)) : []
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));
        return { ...response.data, data: sortedCategories };
    }
    return response.data;
};

export const updateCategoryApi = async (id: string, formData: FormData) => {
    const response = await axiosClient.put(`/categories/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const updateSubCategoryApi = async (id: string, formData: FormData) => {
    const response = await axiosClient.put(`/categories/sub/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};
