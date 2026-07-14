'use client'
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Trash2, PlusCircle, Image as ImageIcon, Save } from 'lucide-react';
import { getBannerApi, deleteBannersApi } from '../services/bannerApi';
import { getSiteSettingApi, updateSiteSettingApi } from '../services/settingsApi';
import UploadBannerModal from './UploadBannerModal';

interface Banner {
    id: string;
    judul: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    createdBy?: { username: string };
    updatedBy?: { username: string };
}

export default function BerandaManager() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form settings
    const [heroTitle, setHeroTitle] = useState('');
    const [heroSubtitle, setHeroSubtitle] = useState('');
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    const fetchBannersAndSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const [bannersRes, settingsRes] = await Promise.all([
                getBannerApi(),
                getSiteSettingApi()
            ]);
            setBanners(bannersRes.data);
            if (settingsRes.data) {
                setHeroTitle(settingsRes.data.heroTitle);
                setHeroSubtitle(settingsRes.data.heroSubtitle);
            }
        } catch {
            toast.error('Gagal memuat data beranda');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBannersAndSettings();
    }, [fetchBannersAndSettings]);

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Hapus banner "${title}"? Tindakan ini tidak bisa dibatalkan.`))
            return;
        try {
            await deleteBannersApi(id);
            toast.success('Banner berhasil dihapus');
            fetchBannersAndSettings();
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Gagal menghapus banner';
            toast.error(errMsg);
        }
    }

    const handleSaveSettings = async () => {
        setIsSavingSettings(true);
        try {
            await updateSiteSettingApi({ heroTitle, heroSubtitle });
            toast.success('Pengaturan teks beranda berhasil disimpan');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menyimpan teks');
        } finally {
            setIsSavingSettings(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="mb-2">
                <h2 className="text-lg font-bold text-gray-900">Kelola Beranda Utama</h2>
                <p className="text-[13px] text-gray-500 mt-0.5">Atur teks sambutan dan gambar banner carousel pada halaman beranda viewer</p>
            </div>

            {/* Pengaturan Teks */}
            <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] p-6 space-y-4">
                <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Teks Sambutan Utama (Hero Section)</h3>
                
                <div className="space-y-3">
                    <div>
                        <label className="block text-[12px] font-medium text-gray-600 mb-1">Judul Utama (Title)</label>
                        <input 
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-blue-500 transition-colors"
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                            placeholder="Selamat datang di situs..."
                        />
                    </div>
                    <div>
                        <label className="block text-[12px] font-medium text-gray-600 mb-1">Sub Judul (Subtitle)</label>
                        <textarea 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-blue-500 transition-colors min-h-[80px]"
                            value={heroSubtitle}
                            onChange={(e) => setHeroSubtitle(e.target.value)}
                            placeholder="Temukan dan unduh dokumen kajian..."
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button 
                        onClick={handleSaveSettings}
                        disabled={isSavingSettings}
                        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSavingSettings ? 'Menyimpan...' : 'Simpan Teks'}
                    </button>
                </div>
            </div>

            {/* Banner Carousel Manager */}
            <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Banner Carousel Highlight</h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[12px] font-medium shadow-sm transition-colors cursor-pointer"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Tambah Banner
                    </button>
                </div>
                
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400 text-[13px]">Memuat data...</div>
                ) : banners.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-[13px]">Belum ada banner. Klik "Tambah Banner" untuk mulai.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Preview</th>
                                    <th className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Judul</th>
                                    <th className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                                    <th className="text-right px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {banners.map((banner) => (
                                    <tr key={banner.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-3">
                                            <img
                                                src={banner.imageUrl.startsWith('http') ? banner.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000'}/uploads/banners/${banner.imageUrl}`}
                                                alt={banner.judul}
                                                className="w-20 h-12 object-cover rounded-md border border-gray-200 shadow-sm"
                                            />
                                        </td>
                                        <td className="px-6 py-3 font-medium text-gray-900 text-[13px] min-w-[150px]">
                                            <div className="truncate">{banner.judul}</div>
                                            <div className="text-[10px] text-gray-400 font-normal mt-1 leading-tight">
                                                Dibuat: {banner.createdBy?.username || '-'}
                                                {banner.updatedBy && <><br/>Diubah: {banner.updatedBy.username}</>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${banner.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                                {banner.isActive ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleDelete(banner.id, banner.judul)}
                                                className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            <UploadBannerModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                onSuccess={fetchBannersAndSettings}
            />
        </div>
    );
}