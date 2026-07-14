'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, ImagePlus, Image as ImageIcon } from 'lucide-react';
import { createBannerApi } from '../services/bannerApi';

// ============================================================
// 1. ZOD SCHEMA � Aturan validasi form untuk BANNER (gambar, bukan PDF)
// ============================================================
const bannerSchema = z.object({
    title: z.string().min(1, 'Judul banner wajib diisi!'),
    order: z.string().optional(),
    file: z.any()
        .refine((files) => files && files.length > 0, 'Gambar banner wajib diupload!')
        .refine(
            (files) => files && ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type),
            'Hanya file JPG, PNG, atau WEBP yang diizinkan!'
        )
        .refine(
            (files) => files && files[0]?.size <= 5 * 1024 * 1024,
            'Ukuran gambar maksimal 5MB!'
        ),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

// ============================================================
// 2. PROPS INTERFACE
// ============================================================
interface UploadBannerModalProps {
    onSuccess: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

// ============================================================
// 3. KOMPONEN UTAMA
// ============================================================
export default function UploadBannerModal({ onSuccess, isOpen, setIsOpen }: UploadBannerModalProps) {

    // State preview gambar: null = belum dipilih, string = URL base64 gambar
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<BannerFormValues>({
        resolver: zodResolver(bannerSchema),
        defaultValues: { title: '', order: '1' }
    });

    // ============================================================
    // 4. FILEREADER API � Membaca file gambar & menghasilkan URL preview
    // FileReader adalah Web API bawaan browser, tidak perlu install library
    // ============================================================
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader(); // Alat pembaca file

            // Callback dijalankan SETELAH file selesai dibaca (async, mirip .then())
            reader.onload = (e) => {
                // e.target.result = string "data:image/jpeg;base64,..."
                // String ini bisa langsung dipakai sebagai src di tag <img>
                setPreviewUrl(e.target?.result as string);
            };

            // Perintah untuk mulai membaca file sebagai URL data (base64)
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    // ============================================================
    // 5. KIRIM DATA KE BACKEND
    // ============================================================
    const onSubmit = async (data: BannerFormValues) => {
        try {
            const formData = new FormData();
            formData.append('judul', data.title);
            if (data.order) formData.append('order', data.order);
            formData.append('file', data.file[0]); // field name must be 'file' matching backend multer

            await createBannerApi(formData);

            toast.success('Banner berhasil dipublikasikan!');
            handleClose();
            onSuccess();
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Gagal mengupload banner.';
            toast.error(errMsg);
        }
    };

    const handleClose = () => {
        reset();
        setPreviewUrl(null);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-gray-100 flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <ImagePlus className="w-4 h-4 text-blue-600" />
                        Tambah Banner Beranda
                    </h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer">✕</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

                    {/* Judul */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Judul Banner</label>
                        <input
                            type="text"
                            {...register('title')}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:border-blue-500 outline-none"
                            placeholder="Contoh: Promo Bulan Juli 2026"
                        />
                        {errors.title && <p className="text-[11px] text-red-500">{errors.title.message}</p>}
                    </div>

                    {/* Urutan Tampil */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Urutan Tampil</label>
                        <input
                            type="number"
                            min="1"
                            {...register('order')}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:border-blue-500 outline-none"
                        />
                        <p className="text-[10px] text-gray-400">Angka lebih kecil = tampil lebih dulu di carousel</p>
                    </div>

                    {/* Upload Gambar + Preview */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">File Gambar Banner</label>

                        {/* Preview kondisional: tampil jika sudah ada gambar dipilih */}
                        {previewUrl ? (
                            <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                                <img src={previewUrl} alt="Preview banner" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setPreviewUrl(null)}
                                    className="absolute top-2 right-2 bg-black/50 text-white text-[11px] px-2 py-1 rounded-md hover:bg-black/70 cursor-pointer"
                                >
                                    Ganti
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 aspect-video text-gray-400">
                                <ImageIcon className="w-8 h-8 mb-2 opacity-40" />
                                <p className="text-[11px]">Preview gambar akan muncul di sini</p>
                            </div>
                        )}

                        {/* Input file: dua handler sekaligus
                            - register('file').onChange => validasi Zod tetap berjalan
                            - handleFileChange => generate preview pakai FileReader */}
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            {...register('file')}
                            onChange={(e) => {
                                register('file').onChange(e);
                                handleFileChange(e);
                            }}
                            className="w-full border border-dashed border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-slate-50 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        <p className="text-[10px] text-gray-400">Format: JPG, PNG, WEBP. Maksimal 5MB.</p>
                        {errors.file && <p className="text-[11px] text-red-500">{errors.file.message as string}</p>}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-medium cursor-pointer">
                            Batal
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50">
                            {isSubmitting ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /><span>Mengupload...</span></>
                            ) : (
                                <><ImagePlus className="w-4 h-4" /><span>Upload Banner</span></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
