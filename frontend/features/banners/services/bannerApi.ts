import axiosClient from "@/lib/axios";

export const getBannerApi = async () => {
    const response = await axiosClient.get('/banners');
    return response.data
}

export const createBannerApi = async (formData: FormData) => {
    const response = await axiosClient.post('/banners', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // wajib setel khusus untuk upload file saja 
        }
    })
    return response.data
}

export const deleteBannersApi = async (id: string) => {
    const response = await axiosClient.delete(`/banners/${id}`)
    return response.data
}