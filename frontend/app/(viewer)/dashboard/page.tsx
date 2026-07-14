import BannerCarousel from '@/features/banners/components/BannerCarousel';
import RecentDocuments from '@/features/documents/components/RecentDocument';
import HeroSection from '@/features/banners/components/HeroSection';

export default function DashboardPage() {
    return (
        <div className="flex-1 flex flex-col">

            {/* HERO SECTION */}
            <HeroSection />

            {/* KONTEN UTAMA */}
            <div className="flex-1 px-6 md:px-20 py-8 space-y-8">

                {/* Banner Carousel dari Admin */}
                <section>
                    <h2 className="text-lg font-bold text-gray-700 mb-3">Informasi & Highlight</h2>
                    <BannerCarousel />
                </section>

                {/* Search Bar */}
                <section>
                    <div className="flex w-full bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                        <input
                            type="text"
                            placeholder="Temukan dokumen..."
                            className="flex-1 px-4 py-2 rounded-lg bg-transparent text-gray-800 text-sm outline-none"
                        />
                        <button className="bg-[#d99614] hover:bg-[#c58b19] px-6 py-2 rounded-lg text-white text-sm font-medium cursor-pointer transition-colors">
                            Cari
                        </button>
                    </div>
                </section>

                {/* Dokumen Terbaru */}
                <section>
                    <h2 className="text-lg font-bold text-gray-700 mb-3">Dokumen Upload Terbaru</h2>
                    {/* Hapus div abu-abu "(Segera hadir)" lalu ganti dengan ini: */}
                    <RecentDocuments />
                </section>

            </div>
        </div>
    );
}
