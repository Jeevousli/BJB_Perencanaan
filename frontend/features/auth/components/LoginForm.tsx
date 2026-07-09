'use client'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { loginApi } from '../services/authApi';
import { Loader2 } from 'lucide-react';
// --- 1. IMPORT USESTATE DAN USEEFFECT ---
import { useState, useEffect } from 'react';

const loginSchema = z.object({
    username: z.string().min(1, 'Username wajib diisi!'),
    password: z.string().min(4, 'Kata sandi minimal 4 karakter!')
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
    const router = useRouter();

    // --- 2. TAMBAHKAN LOGIKA MOUNTED STATE INI ---
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    // ----------------------------------------------

    const {
        register, handleSubmit, formState: {
            errors, isSubmitting
        }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await loginApi(data.username, data.password)
            const { token, user } = response.data;

            // Simpan data kredensial aman
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
            localStorage.setItem('user', JSON.stringify(user));

            toast.success('Selamat datang kembali, ' + user.username);

            // --- 3. UBAH KE WINDOW.LOCATION.HREF AGAR RELOAD BERSIH ---
            if (user.role === 'ADMIN') {
                window.location.href = '/admin/dashboard';
            } else {
                window.location.href = '/dashboard';
            }
            // ---------------------------------------------------------
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Login gagal, periksa kembali koneksi Anda.'
            toast.error(errMsg)
        }
    }

    // --- 4. TAMBAHKAN PENJAGA MOUNTED STATE DI SINI ---
    if (!isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }
    // --------------------------------------------------
    return (
        // Responsive grid: 1 kolom di HP, 2 kolom mulai ukuran laptop (md:)
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#f8f9fa] text-gray-800 font-sans">

            {/* 💻 SISI KIRI: Form Login */}
            <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">

                {/* Header Logo BJB (Di HP muncul di atas, di laptop tetap aman di pojok kiri) */}
                <div className="flex items-center gap-3 mb-12">
                    <div className="relative w-12 h-12">
                        <Image
                            src="/bjb.png"
                            alt="Logo Bank BJB"
                            fill
                            priority
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold tracking-wide text-blue-900 leading-tight">
                            Research and Office of Economist
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">bank bjb</p>
                    </div>
                </div>

                {/* Teks Judul Utama (Sesuai Desain Screenshot) */}
                <h1 className="text-2xl sm:text-3xl font-normal text-gray-800 mb-2 leading-snug">
                    Selamat datang di situs Research and Office of Economist bank <span className="font-bold">bjb</span>
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                    Silakan masuk untuk mengakses materi kajian.
                </p>

                {/* Form HTML Interaktif */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md w-full">

                    {/* Input Username */}
                    <div>
                        <div className="relative border border-gray-300 rounded-[20px] px-5 py-3.5 bg-white focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
                            <label htmlFor="username" className="absolute -top-2.5 left-5 bg-[#f8f9fa] px-2 text-xs text-gray-500 font-medium">
                                User
                            </label>
                            <input
                                id="username"
                                type="text"
                                disabled={isSubmitting}
                                {...register('username')}
                                className="w-full bg-transparent outline-none text-sm text-gray-800 disabled:opacity-50"
                                placeholder="Masukkan Username"
                            />
                        </div>
                        {/* Pesan Error Validasi Username */}
                        {errors.username && (
                            <p className="text-xs text-red-500 mt-1.5 px-2">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Input Kata Sandi */}
                    <div>
                        <div className="relative border border-gray-300 rounded-[20px] px-5 py-3.5 bg-white focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
                            <label htmlFor="password" className="absolute -top-2.5 left-5 bg-[#f8f9fa] px-2 text-xs text-gray-500 font-medium">
                                Kata Sandi
                            </label>
                            <input
                                id="password"
                                type="password"
                                disabled={isSubmitting}
                                {...register('password')}
                                className="w-full bg-transparent outline-none text-sm text-gray-800 disabled:opacity-50"
                                placeholder="Masukkan Kata Sandi"
                            />
                        </div>
                        {/* Pesan Error Validasi Password */}
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1.5 px-2">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Tombol Sign In (Kuning Mustard BJB) */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-40 bg-[#d99614] hover:bg-[#c58b19] active:scale-95 text-white font-medium py-3 rounded-[12px] text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Masuk...
                            </>
                        ) : (
                            'sign in'
                        )}
                    </button>
                </form>
            </div>

            {/* 🏢 SISI KANAN: Ilustrasi Gedung BJB (Disembunyikan di HP dengan 'hidden', muncul di laptop 'md:flex') */}
            <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-50 to-white overflow-hidden p-8 relative">

                {/* Ilustrasi Gedung BJB Vektor Interaktif (Premium & Ringan) */}
                <div className="relative w-full h-[80%] max-w-lg transition-transform duration-500 hover:scale-105">
                    <svg className="w-full h-full" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Background Bulatan Gradasi */}
                        <circle cx="250" cy="250" r="180" fill="url(#paint0_linear)" fillOpacity="0.3" />

                        {/* Alas Gedung */}
                        <path d="M80 420h340v20H80z" fill="#cbd5e1" />

                        {/* Gedung Utama Bank BJB */}
                        <rect x="140" y="240" width="180" height="180" rx="8" fill="#1e293b" />

                        {/* Ornamen Garis Biru Khas BJB */}
                        <rect x="140" y="400" width="180" height="12" fill="#2563eb" rx="2" />
                        <rect x="140" y="340" width="180" height="12" fill="#3b82f6" rx="2" />
                        <rect x="140" y="280" width="180" height="12" fill="#60a5fa" rx="2" />

                        {/* Tulisan Brand Bank BJB */}
                        <rect x="190" y="248" width="80" height="20" rx="4" fill="#2563eb" />
                        <text x="202" y="262" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">bank bjb</text>

                        {/* Jendela-jendela Gedung */}
                        <rect x="160" y="305" width="30" height="20" rx="3" fill="#f8fafc" fillOpacity="0.9" />
                        <rect x="215" y="305" width="30" height="20" rx="3" fill="#f8fafc" fillOpacity="0.9" />
                        <rect x="270" y="305" width="30" height="20" rx="3" fill="#f8fafc" fillOpacity="0.9" />

                        <rect x="160" y="365" width="30" height="20" rx="3" fill="#f8fafc" fillOpacity="0.9" />
                        <rect x="215" y="365" width="30" height="20" rx="3" fill="#f8fafc" fillOpacity="0.9" />
                        <rect x="270" y="365" width="30" height="20" rx="3" fill="#f8fafc" fillOpacity="0.9" />

                        {/* Menara Samping Tinggi */}
                        <rect x="330" y="160" width="40" height="260" rx="6" fill="#0f172a" />

                        {/* Logo Bulat di Menara */}
                        <circle cx="350" cy="200" r="12" fill="#3b82f6" />
                        <circle cx="350" cy="200" r="8" fill="white" />

                        {/* Garis-Garis Aksen Vektor */}
                        <path d="M90 180h40M70 210h80M380 250h50M390 280h30" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 5" />

                        <defs>
                            <linearGradient id="paint0_linear" x1="250" y1="70" x2="250" y2="430" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#3b82f6" />
                                <stop offset="1" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

        </div>
    );

}