import axiosClient from "@/lib/axios";

// fungsi menembak API Login

export const loginApi = async (username: string, password: string) => {
    // axios client sudah otomatis menembak endpoint backend kita ya
    const response = await axiosClient.post('auth/login', {
        username, password
    })

    return response.data;
}