'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryBanner {
    id: string;
    judul: string;
    imageUrl: string;
    isActive: boolean;
}

interface CategoryCarouselProps {
    banners: CategoryBanner[];
    pageTitle: string;
}

export default function CategoryCarousel({ banners, pageTitle }: CategoryCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const activeBanners = banners.filter(b => b.isActive);

    useEffect(() => {
        if (activeBanners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeBanners.length]);

    if (activeBanners.length === 0) {
        return (
            <div className="w-full h-64 md:h-[360px] rounded-2xl shadow-lg bg-slate-800 flex items-center px-6 md:px-20">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">{pageTitle}</h1>
            </div>
        );
    }

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);

    return (
        <div className="relative w-full h-64 md:h-[360px] rounded-2xl overflow-hidden bg-slate-900 group shadow-lg">
            {activeBanners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${banner.imageUrl.startsWith('http') ? banner.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000'}/uploads/categories/${banner.imageUrl}`})` }}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    
                    <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20">
                        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md mb-2 translate-y-4 opacity-0 animate-[slideUp_0.8s_ease-out_forwards]">
                            {pageTitle}
                        </h1>
                        {banner.judul && (
                            <p className="text-sm md:text-base text-gray-200 drop-shadow-md translate-y-4 opacity-0 animate-[slideUp_0.8s_ease-out_0.2s_forwards] max-w-2xl">
                                {banner.judul}
                            </p>
                        )}
                    </div>
                </div>
            ))}

            {activeBanners.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {activeBanners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                </>
            )}
            <style jsx>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
