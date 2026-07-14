'use client';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Trash2, PlusCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getBannersByCategoryApi, getBannersBySubCategoryApi, addBannerToCategoryApi, addBannerToSubCategoryApi, deleteCategoryBannerApi } from '../services/categoryBannerApi';

interface CategoryBanner {
    id: string;
    judul: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    createdBy?: { username: string };
    updatedBy?: { username: string };
}

interface CategoryBannerModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    categoryId: string;
    categoryName: string;
    type: 'main' | 'sub';
}

export default function CategoryBannerModal({ isOpen, setIsOpen, categoryId, categoryName, type }: CategoryBannerModalProps) {
    const [banners, setBanners] = useState<CategoryBanner[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Upload state
    const [isUploading, setIsUploading] = useState(false);
    const [uploadJudul, setUploadJudul] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const fetchBanners = useCallback(async () => {
        if (!categoryId) return;
        setIsLoading(true);
        try {
            const res = type === 'main' 
                ? await getBannersByCategoryApi(categoryId)
                : await getBannersBySubCategoryApi(categoryId);
            setBanners(res.data);
        } catch {
            toast.error('Gagal memuat daftar banner kategori');
        } finally {
            setIsLoading(false);
        }
    }, [categoryId, type]);

    useEffect(() => {
        if (isOpen) {
            fetchBanners();
            setUploadJudul('');
            setUploadFile(null);
        }
    }, [isOpen, fetchBanners]);

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Hapus banner "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
        try {
            await deleteCategoryBannerApi(id);
            toast.success('Banner berhasil dihapus');
            fetchBanners();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menghapus banner');
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile) {
            toast.error('Pilih file gambar terlebih dahulu');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('judul', uploadJudul);
            formData.append('banner', uploadFile);

            if (type === 'main') {
                await addBannerToCategoryApi(categoryId, formData);
            } else {
                await addBannerToSubCategoryApi(categoryId, formData);
            }

            toast.success('Banner berhasil ditambahkan');
            setUploadJudul('');
            setUploadFile(null);
            fetchBanners();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal mengupload banner');
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-blue-600" />
                            Kelola Banner Kategori
                        </h2>
                        <p className="text-[12px] text-gray-500 mt-1">Kategori: <span className="font-semibold text-gray-700">{categoryName}</span></p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Form Upload Baru */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                        <h3 className="text-[12px] font-bold text-blue-800 uppercase tracking-wide mb-3">Tambah Banner Baru</h3>
                        <form onSubmit={handleUpload} className="flex gap-4 items-end">
                            <div className="flex-1 space-y-1">
                                <label className="text-[11px] font-semibold text-gray-600">Judul Banner (Opsional)</label>
                                <input
                                    type="text"
                                    value={uploadJudul}
                                    onChange={(e) => setUploadJudul(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-blue-500 bg-white"
                                    placeholder="Masukkan judul banner..."
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-[11px] font-semibold text-gray-600">File Gambar *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[13px] bg-white cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-gray-100"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isUploading || !uploadFile}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-[13px] font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
                            >
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                                Upload
                            </button>
                        </form>
                    </div>

                    {/* List Banner Saat Ini */}
                    <div>
                        <h3 className="text-[12px] font-bold text-gray-700 uppercase tracking-wide mb-3">Banner Saat Ini ({banners.length})</h3>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            {isLoading ? (
                                <div className="p-8 text-center text-gray-400 text-[13px]">Memuat data...</div>
                            ) : banners.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">
                                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-[13px]">Belum ada banner di kategori ini.</p>
                                </div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50/50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Preview</th>
                                            <th className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Judul</th>
                                            <th className="text-right px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {banners.map((banner) => (
                                            <tr key={banner.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-4 py-2 w-32">
                                                    <img
                                                        src={banner.imageUrl.startsWith('http') ? banner.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000'}/uploads/categories/${banner.imageUrl}`}
                                                        alt={banner.judul}
                                                        className="w-24 h-12 object-cover rounded border border-gray-200"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 font-medium text-gray-900 text-[13px]">
                                                    <div className="truncate">{banner.judul || '-'}</div>
                                                    <div className="text-[10px] text-gray-400 font-normal mt-1 leading-tight">
                                                        Dibuat: {banner.createdBy?.username || '-'}
                                                        {banner.updatedBy && <><br/>Diubah: {banner.updatedBy.username}</>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        onClick={() => handleDelete(banner.id, banner.judul)}
                                                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100 bg-white shadow-sm border border-transparent group-hover:border-red-100"
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
                    </div>
                </div>
            </div>
        </div>
    );
}
