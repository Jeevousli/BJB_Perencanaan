'use client'
import { useEffect, useState } from 'react';
import { getSiteSettingApi } from '../services/settingsApi';

export default function HeroSection() {
    const [title, setTitle] = useState("Selamat datang di situs Research and Office of Economist bank bjb");
    const [subtitle, setSubtitle] = useState("Temukan dan unduh dokumen kajian ekonomi & perbankan BJB");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await getSiteSettingApi();
                if (res.data) {
                    if (res.data.heroTitle) setTitle(res.data.heroTitle);
                    if (res.data.heroSubtitle) setSubtitle(res.data.heroSubtitle);
                }
            } catch (error) {
                console.error("Gagal mengambil pengaturan situs:", error);
            }
        };
        fetchSettings();
    }, []);

    // Memecah teks title agar ada efek bold (opsional, tergantung teks default)
    // Jika tidak mau ribet, tampilkan utuh saja.
    return (
        <div className="bg-[#1e293b] py-10 px-6 md:px-20 text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {title}
            </h1>
            <p className="text-blue-300 text-sm">
                {subtitle}
            </p>
        </div>
    );
}
