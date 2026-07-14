import axiosClient from "@/lib/axios";
//mengambil semua daftar docs dri backend

export const getDocumentApi =
    async () => {
        const response = await axiosClient.get('/documents');
        return response.data
    }

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
}

// upload dokcs baru, parameter form data karena upload file pdf

export const createDocumentApi = async (formData: FormData) => {
    const response = await axiosClient.post('/documents', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // wajib setel khusus untuk upload file saja 
        }
    })
    return response.data;
}

export const updateDocumentApi = async (id: string, formData: FormData) => {
    const response = await axiosClient.put(`/documents/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data;
}

export const deleteDocumentApi = async (id: string) => {
    const response = await axiosClient.delete(`/documents/${id}`)
    return response.data
}

export const getDocumentsBySubCategoryApi = async (subCategoryId: string) => {
    const response = await axiosClient.get(`/documents/by-subcategory/${subCategoryId}`);
    return response.data;
};

export const getDocumentsByCategoryApi = async (categoryId: string) => {
    const response = await axiosClient.get(`/documents/by-category/${categoryId}`);
    return response.data;
};
