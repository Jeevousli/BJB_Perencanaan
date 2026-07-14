import axiosClient from "@/lib/axios";

export const getAuditLogApi = async (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await axiosClient.get(`/audit${params}`);
    return response.data;
};
