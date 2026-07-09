'use client'
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Trash2, PlusCircle, Image as ImageIcon } from 'lucide-react';
import { getBannerApi, deleteBannersApi } from '../services/bannerApi';
import UploadBannerModal from './UploadBannerModal';

interface Banner {
    id: string;
    judul: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
}

export default function BannerManager() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchBanners = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getBannerApi()
            setBanners(res.data)
        } catch {
            toast.error('Gagaal memuat daftar banner')
        } finally {
            setIsLoading(false)
        }
    }, [])

    // panggil fetchbanners saat komponen pertama kali dibuat

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    const handleDelete = async (id: string, title: string) => {
        // kofirmasi sblm hapus 

        if (!window.confirm(`Hapus banner "${title}"? Tindakan ini tidak bisa dibatalkan.`))
            return;
        try {
            await deleteBannersApi(id);
            toast.success('Banner berhasil dihapus')
            fetchBanners();
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Gagal menghapus banner'
            toast.error(errMsg)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Kelola Banner</h2>
                    <p className="text-sm text-gray-500 mt-1">Atur gambar carousel pada halaman beranda viewer</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    Tambah Banner
                </button>
            </div>
            {/* Tabel Banner */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400 text-sm">Memuat data...</div>
                ) : banners.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Belum ada banner. Klik "Tambah Banner" untuk mulai.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Preview</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Judul</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {banners.map((banner) => (
                                <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Thumbnail gambar */}
                                    <td className="px-6 py-3">
                                        <img
                                            src={`http://127.0.0.1:4000/uploads/banners/${banner.imageUrl}`}
                                            alt={banner.judul}
                                            className="w-24 h-14 object-cover rounded-lg border border-gray-200"
                                        />
                                    </td>
                                    <td className="px-6 py-3 font-medium text-gray-900">{banner.judul}</td>
                                    <td className="px-6 py-3 text-gray-500">{banner.isActive ? 'Aktif' : 'Tidak Aktif'}</td>
                                    <td className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => handleDelete(banner.id, banner.judul)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {/* Modal Upload Banner */}
            <UploadBannerModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                onSuccess={fetchBanners}
            />
        </div>
    );


}