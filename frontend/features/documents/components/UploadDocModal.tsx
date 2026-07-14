'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import { getCategoriesApi, createDocumentApi } from '../services/documentApi';

// definisikan tipe kategori dan subkategori

interface SubCategory {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
    subCategories: SubCategory[]
}

const uploadSchema = z.object({
    title: z.string().min(1, 'Judul kajian wajib diisi!'),
    description: z.string().optional(),
    categoryId: z.string().min(1, 'Kategori wajib dipilih!'),
    subCategoryId: z.string().optional(),
    unitPenyusun: z.string().min(1, 'Unit penyusun wajib diisi!'),
    tanggalPublikasi: z.string().min(1, 'Tanggal publikasi wajib diisi!'),
    file: z.any()
        .refine((files) => files && files.length > 0, 'File PDF wajib diupload!')
        .refine((files) => files && files[0]?.type === 'application/pdf', 'Hanya file PDF yang diizinkan!')
        .refine((files) => files && files[0]?.size <= 10 * 1024 * 1024, 'Ukuran file maksimal 10MB!'),
});

type UploadFomValues = z.infer<typeof uploadSchema>

interface UploadDocModalProps {
    onSuccess: () => void // fungsi refresh tabel dafta etelah berhasil upload
    isOpen: boolean;
    setIsOpen: (open: boolean) => void
}

export default function UploadDocModal({ onSuccess, isOpen, setIsOpen }: UploadDocModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
    // setup form
    const {
        register, handleSubmit, watch, setValue, reset, formState: {
            errors, isSubmitting
        } } = useForm<UploadFomValues>({
            resolver: zodResolver(uploadSchema),
            defaultValues: {
                title: '',
                description: '',
                categoryId: '',
                subCategoryId: '',
                unitPenyusun: 'Tim Riset BJB',
                tanggalPublikasi: new Date().toISOString().split('T')[0],

            }
        })

    // membaca pilihan kategori realtime
    const selectedCategoryId = watch('categoryId')

    //panggil daftar kategori dribackend saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            getCategoriesApi().then((res) => {
                setCategories(res.data);
            }).catch(() => {
                toast.error('Gagal memuat daftar kategori')
            })
        }
    }, [isOpen])

    // logika dropdown kategori dinamis 
    useEffect(() => {
        if (selectedCategoryId) {
            const foundCategory = categories.find((cat) => cat.id === selectedCategoryId);
            if (foundCategory && foundCategory.subCategories.length > 0) {
                setFilteredSubCategories(foundCategory.subCategories);
            } else {
                setFilteredSubCategories([]); // Kosongkan jika kategori tidak punya sub
            }
            setValue('subCategoryId', ''); // Reset pilihan sub-kategori sebelumnya
        } else {
            setFilteredSubCategories([]);
        }
    }, [selectedCategoryId, categories, setValue]);
    // D. Kirim Data dengan FormData
    const onSubmit = async (data: UploadFomValues) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description || '');
            formData.append('categoryId', data.categoryId);
            if (data.subCategoryId) {
                formData.append('subCategoryId', data.subCategoryId);
            }
            formData.append('unitPenyusun', data.unitPenyusun);
            formData.append('tanggalPublikasi', new Date(data.tanggalPublikasi).toISOString());

            // Mengambil file biner fisik dari input file React
            formData.append('file', data.file[0]);
            await createDocumentApi(formData);

            toast.success('Dokumen berhasil dipublikasikan!');
            reset(); // Reset form isian menjadi bersih
            setIsOpen(false); // Tutup Modal
            onSuccess(); // Refresh tabel dokumen utama
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Gagal mengupload dokumen.';
            toast.error(errMsg);
        }
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">

                {/* Header Modal */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-600" />
                        Tambah Dokumen Kajian
                    </h2>
                    <button
                        onClick={() => { reset(); setIsOpen(false); }}
                        className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
                {/* Form Modal */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 flex-1">

                    {/* Judul Kajian */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Judul Kajian</label>
                        <input
                            type="text"
                            {...register('title')}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:border-blue-500 outline-none"
                            placeholder="Contoh: Outlook Ekonomi Jawa Barat 2026"
                        />
                        {errors.title && <p className="text-[11px] text-red-500">{errors.title.message}</p>}
                    </div>
                    {/* Deskripsi */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Deskripsi Ringkas</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:border-blue-500 outline-none resize-none"
                            placeholder="Tulis ringkasan singkat isi kajian..."
                        />
                    </div>
                    {/* Grid Kategori & Sub Kategori */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Dropdown Kategori */}
                        <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Kategori</label>
                            <select
                                {...register('categoryId')}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:border-blue-500 outline-none cursor-pointer"
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <p className="text-[11px] text-red-500">{errors.categoryId.message}</p>}
                        </div>
                        {/* Dropdown Sub Kategori (Dinamis) */}
                        <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sub Kategori</label>
                            <select
                                {...register('subCategoryId')}
                                disabled={filteredSubCategories.length === 0}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:border-blue-500 outline-none cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                            >
                                <option value="">-- Tanpa Sub Kategori --</option>
                                {filteredSubCategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Grid Unit & Tanggal */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Unit Penyusun */}
                        <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Unit Penyusun</label>
                            <input
                                type="text"
                                {...register('unitPenyusun')}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:border-blue-500 outline-none"
                            />
                            {errors.unitPenyusun && <p className="text-[11px] text-red-500">{errors.unitPenyusun.message}</p>}
                        </div>
                        {/* Tanggal Publikasi */}
                        <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tanggal Publikasi</label>
                            <input
                                type="date"
                                {...register('tanggalPublikasi')}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:border-blue-500 outline-none cursor-pointer"
                            />
                            {errors.tanggalPublikasi && <p className="text-[11px] text-red-500">{errors.tanggalPublikasi.message}</p>}
                        </div>
                    </div>
                    {/* File PDF Input */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">File PDF Kajian</label>
                        <input
                            type="file"
                            accept=".pdf"
                            {...register('file')}
                            className="w-full border border-gray-200 border-dashed rounded-lg px-3 py-2 text-[13px] bg-slate-50 focus:border-blue-500 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        <p className="text-[10px] text-gray-400">Hanya dokumen PDF, maksimal ukuran 10 MB</p>
                        {errors.file && <p className="text-[11px] text-red-500 mt-1">{errors.file.message as string}</p>}
                    </div>
                    {/* Tombol Aksi */}
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => { reset(); setIsOpen(false); }}
                            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-medium cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Mengupload...
                                </>
                            ) : (
                                'Upload Dokumen'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


