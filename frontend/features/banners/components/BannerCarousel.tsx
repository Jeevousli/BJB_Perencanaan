'use client';

import { useEffect, useState } from 'react';
import { getBannerApi } from '../services/bannerApi';

// Tipe data Banner sesuai struktur dari backend/Prisma
interface Banner {
    id: string;
    judul: string;
    imageUrl: string;
    isActive: boolean;
}

export default function BannerCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Index gambar yang sedang tampil

    // Ambil data banner dari backend saat komponen pertama kali muncul
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await getBannerApi();
                // Saring hanya yang isActive = true
                const activeBanners = res.data.filter((b: Banner) => b.isActive);
                setBanners(activeBanners);
            } catch (error) {
                console.error('Gagal memuat banner:', error);
            }
        };
        fetchBanners();
    }, []);

    // AUTO-SLIDE: Jalankan timer, setiap 4 detik pindah ke gambar berikutnya
    // useEffect ini bergantung pada 'banners' — baru aktif setelah data tersedia
    useEffect(() => {
        if (banners.length <= 1) return; // Tidak perlu slide jika cuma 1 banner

        const timer = setInterval(() => {
            // Jika sudah di gambar terakhir, kembali ke 0. Jika belum, tambah 1.
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 4000); // 4000 ms = 4 detik

        // Cleanup: Matikan timer saat komponen ini dihapus dari layar
        // Ini penting untuk mencegah memory leak!
        return () => clearInterval(timer);
    }, [banners]);

    // Jika data belum ada, tampilkan placeholder abu-abu
    if (banners.length === 0) {
        return (
            <div className="w-full aspect-[16/5] bg-gray-200 animate-pulse rounded-xl" />
        );
    }

    return (
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg aspect-[16/5]">
            {/* Tampilkan semua banner, tapi hanya yang currentIndex yang terlihat */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={banner.imageUrl.startsWith('http') ? banner.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000'}/uploads/banners/${banner.imageUrl}`}
                        alt={banner.judul}
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay gelap + Judul banner */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                        <h2 className="text-white text-xl font-bold drop-shadow">{banner.judul}</h2>
                    </div>
                </div>
            ))}

            {/* Titik navigasi (dots) di bawah */}
            <div className="absolute bottom-3 right-4 flex gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
