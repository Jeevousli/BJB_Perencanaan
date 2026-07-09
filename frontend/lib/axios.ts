import axios from 'axios';

// 1. Fungsi pembantu (helper) untuk membaca cookie berdasarkan nama di browser
const getCookie = (name: string) => {
    if (typeof window === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
};

// Membuat instance Axios
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : 'http://127.0.0.1:4000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Menyisipkan token dari Cookie otomatis
axiosClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        // --- PERBAIKAN: Membaca token dari Cookie, bukan LocalStorage ---
        const token = getCookie('token');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;
