import BannerCarousel from '@/features/banners/components/BannerCarousel';
import RecentDocuments from '@/features/documents/components/RecentDocument';

export default function DashboardPage() {
    return (
        <div className="flex-1 flex flex-col">

            {/* HERO SECTION */}
            <div className="bg-[#1e293b] py-10 px-6 md:px-20 text-white">
                <h1 className="text-2xl md:text-3xl font-normal mb-1">
                    Selamat datang di situs{' '}
                    <span className="font-bold">Research and Office of Economist bank bjb</span>
                </h1>
                <p className="text-blue-300 text-sm mb-6">
                    Temukan dan unduh dokumen kajian ekonomi & perbankan BJB
                </p>

                {/* Search Bar */}
                <div className="flex max-w-lg">
                    <input
                        type="text"
                        placeholder="Temukan dokumen..."
                        className="flex-1 px-5 py-3 rounded-l-xl bg-white text-gray-800 text-sm outline-none"
                    />
                    <button className="bg-[#d99614] hover:bg-[#c58b19] px-5 py-3 rounded-r-xl text-white text-sm font-medium cursor-pointer transition-colors">
                        Cari
                    </button>
                </div>
            </div>

            {/* KONTEN UTAMA */}
            <div className="flex-1 px-6 md:px-20 py-8 space-y-8">

                {/* Banner Carousel dari Admin */}
                <section>
                    <h2 className="text-lg font-bold text-gray-700 mb-3">Informasi & Highlight</h2>
                    <BannerCarousel />
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
