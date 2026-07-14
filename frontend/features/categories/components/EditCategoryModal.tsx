'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Edit3, Image as ImageIcon } from 'lucide-react';
import { updateCategoryApi, updateSubCategoryApi } from '../services/categoryApi';

const editSchema = z.object({
    pageTitle: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

interface EditCategoryModalProps {
    onSuccess: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    categoryData: any; 
    type: 'main' | 'sub';
}

export default function EditCategoryModal({ onSuccess, isOpen, setIsOpen, categoryData, type }: EditCategoryModalProps) {
    
    const {
        register, handleSubmit, setValue, reset, formState: {
            errors, isSubmitting
        } } = useForm<EditFormValues>({
            resolver: zodResolver(editSchema),
            defaultValues: {
                pageTitle: '',
            }
        });

    useEffect(() => {
        if (isOpen && categoryData) {
            setValue('pageTitle', categoryData.pageTitle || '');
        }
    }, [isOpen, categoryData, setValue]);

    const onSubmit = async (data: EditFormValues) => {
        try {
            const formData = new FormData();
            if (data.pageTitle) {
                formData.append('pageTitle', data.pageTitle);
            }
            
            if (type === 'main') {
                await updateCategoryApi(categoryData.id, formData);
            } else {
                await updateSubCategoryApi(categoryData.id, formData);
            }

            toast.success('Kategori berhasil diupdate!');
            reset();
            setIsOpen(false);
            onSuccess();
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Gagal mengupdate kategori.';
            toast.error(errMsg);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-blue-600" />
                        Ubah Detail {type === 'main' ? 'Kategori' : 'Sub Kategori'}
                    </h2>
                    <button
                        onClick={() => { reset(); setIsOpen(false); }}
                        className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 flex-1">
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Nama (Tidak Bisa Diubah)</label>
                        <input
                            type="text"
                            disabled
                            value={categoryData?.name || ''}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-gray-50 outline-none cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Judul Halaman (Opsional)</label>
                        <input
                            type="text"
                            {...register('pageTitle')}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:border-blue-500 outline-none"
                            placeholder="Contoh: Publikasi Makroekonomi"
                        />
                        {errors.pageTitle && <p className="text-[11px] text-red-500">{errors.pageTitle.message}</p>}
                    </div>
                    {/* Banner upload has been moved to CategoryBannerModal */}

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
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Perubahan'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
