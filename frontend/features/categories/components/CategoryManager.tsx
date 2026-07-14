'use client';

import React, { useEffect, useState } from 'react';
import { ListTree, Edit3, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getCategoriesApi } from '../services/categoryApi';
import EditCategoryModal from './EditCategoryModal';
import CategoryBannerModal from './CategoryBannerModal';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

interface SubCategory {
    id: string;
    name: string;
    pageTitle?: string;
    bannerUrl?: string;
    updatedBy?: { username: string };
}

interface Category {
    id: string;
    name: string;
    pageTitle?: string;
    bannerUrl?: string;
    updatedBy?: { username: string };
    subCategories: SubCategory[];
}

export default function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | SubCategory | null>(null);
    const [editType, setEditType] = useState<'main' | 'sub'>('main');

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await getCategoriesApi();
            setCategories(res.data);
        } catch (error: any) {
            toast.error('Gagal mengambil daftar kategori');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = (category: Category | SubCategory, type: 'main' | 'sub') => {
        setSelectedCategory(category);
        setEditType(type);
        setIsEditModalOpen(true);
    };

    const handleManageBanners = (category: Category | SubCategory, type: 'main' | 'sub') => {
        setSelectedCategory(category);
        setEditType(type);
        setIsBannerModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
                <div className="space-y-0.5">
                    <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        Kelola Kategori & Sub Kategori
                    </h1>
                    <p className="text-[13px] text-gray-500">Ubah judul halaman dan banner untuk setiap kategori atau subkategori.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] overflow-x-auto">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-500 font-medium">Sedang memuat kategori...</div>
                ) : categories.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 font-medium">Belum ada kategori.</div>
                ) : (
                    <Table>
                        <TableHeader className="bg-white">
                            <TableRow className="border-b border-gray-100 hover:bg-transparent">
                                <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Nama (Kategori / Sub)</TableHead>
                                <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Tipe</TableHead>
                                <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Judul Halaman</TableHead>
                                <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Banner</TableHead>
                                <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right whitespace-nowrap">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((cat) => (
                                <React.Fragment key={cat.id}>
                                    <TableRow className="hover:bg-slate-50/50 border-b border-gray-100 group">
                                        <TableCell className="font-semibold text-gray-900 text-[13px] min-w-[200px]">
                                            <div className="truncate">{cat.name}</div>
                                            <div className="text-[10px] text-gray-400 font-normal mt-1 leading-tight">
                                                {cat.updatedBy && <>Diubah: {cat.updatedBy.username}</>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-500 font-medium text-[11px] whitespace-nowrap">KATEGORI UTAMA</TableCell>
                                        <TableCell className="text-gray-600 text-[13px] whitespace-nowrap">{cat.pageTitle || '-'}</TableCell>
                                        <TableCell className="text-gray-600 text-[13px] whitespace-nowrap">
                                            {cat.bannerUrl ? <span className="text-emerald-600 flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Ada</span> : '-'}
                                        </TableCell>
                                        <TableCell className="text-right flex items-center justify-end gap-2 whitespace-nowrap">
                                            <button
                                                onClick={() => handleManageBanners(cat, 'main')}
                                                className="text-gray-400 hover:text-emerald-600 p-1.5 rounded-lg transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center gap-1"
                                                title="Kelola Banners"
                                            >
                                                <ImageIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(cat, 'main')}
                                                className="text-gray-400 hover:text-blue-600 p-1.5 rounded-lg transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                                title="Edit Detail"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                    {cat.subCategories.map((sub) => (
                                        <TableRow key={sub.id} className="hover:bg-slate-50/50 border-b border-gray-100 group">
                                            <TableCell className="font-medium text-gray-700 pl-8 flex flex-col text-[13px] min-w-[200px]">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0"></div>
                                                    <span className="truncate">{sub.name}</span>
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-normal mt-1 ml-3.5 leading-tight">
                                                    {sub.updatedBy && <>Diubah: {sub.updatedBy.username}</>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-400 font-medium text-[11px] whitespace-nowrap">SUB KATEGORI</TableCell>
                                            <TableCell className="text-gray-600 text-[13px] whitespace-nowrap">{sub.pageTitle || '-'}</TableCell>
                                            <TableCell className="text-gray-600 text-[13px] whitespace-nowrap">
                                                {sub.bannerUrl ? <span className="text-emerald-600 flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Ada</span> : '-'}
                                            </TableCell>
                                            <TableCell className="text-right flex items-center justify-end gap-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleManageBanners(sub, 'sub')}
                                                    className="text-gray-400 hover:text-emerald-600 p-1.5 rounded-lg transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center gap-1"
                                                    title="Kelola Banners"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(sub, 'sub')}
                                                    className="text-gray-400 hover:text-blue-600 p-1.5 rounded-lg transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                                    title="Edit Detail"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {selectedCategory && (
                <>
                    <EditCategoryModal
                        isOpen={isEditModalOpen}
                        setIsOpen={setIsEditModalOpen}
                        onSuccess={fetchCategories}
                        categoryData={selectedCategory}
                        type={editType}
                    />
                    <CategoryBannerModal
                        isOpen={isBannerModalOpen}
                        setIsOpen={setIsBannerModalOpen}
                        categoryId={selectedCategory.id}
                        categoryName={selectedCategory.name}
                        type={editType}
                    />
                </>
            )}
        </div>
    );
}
