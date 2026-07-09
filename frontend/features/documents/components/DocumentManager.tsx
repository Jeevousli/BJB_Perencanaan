'use client';

import { useEffect, useState } from 'react';
import { FileText, Plus, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { getDocumentApi, deleteDocumentApi } from '../services/documentApi';
import UploadDocModal from './UploadDocModal';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'; // Menggunakan tabel bawaan Shadcn UI kamu

interface Document {
    id: string;
    title: string;
    unitPenyusun: string;
    tanggalPublikasi: string;
    fileUrl: string;
    category: { name: string };
    subCategory?: { name: string } | null;
}

export default function DocumentManager() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Fungsi mengambil daftar dokumen dari backend
    const fetchDocuments = async () => {
        setIsLoading(true);
        try {
            const res = await getDocumentApi();
            setDocuments(res.data);
        } catch (error: any) {
            toast.error('Gagal mengambil daftar dokumen');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // 2. Fungsi menghapus dokumen
    const handleDelete = async (id: string, title: string) => {
        // Konfirmasi standar industri untuk mencegah salah klik hapus
        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus kajian "${title}"?`);
        if (!confirmDelete) return;

        try {
            await deleteDocumentApi(id);
            toast.success('Kajian berhasil dihapus!');
            fetchDocuments(); // Refresh daftar tabel
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Gagal menghapus dokumen.';
            toast.error(errMsg);
        }
    };

    // 3. Fungsi memformat tanggal ke format Indonesia (Contoh: 12 Januari 2026)
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-6">

            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Kelola Dokumen Publikasi
                    </h1>
                    <p className="text-sm text-gray-500">Unggah dan kelola dokumen riset ekonomi serta kajian perencanaan.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md shadow-blue-500/10 cursor-pointer self-start sm:self-auto transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Dokumen
                </button>
            </div>

            {/* Tabel Daftar Dokumen */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-500 font-medium">Sedang memuat dokumen...</div>
                ) : documents.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 font-medium">Belum ada dokumen yang diunggah.</div>
                ) : (
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-semibold text-gray-700">Judul Kajian</TableHead>
                                <TableHead className="font-semibold text-gray-700">Kategori</TableHead>
                                <TableHead className="font-semibold text-gray-700">Sub Kategori</TableHead>
                                <TableHead className="font-semibold text-gray-700">Penyusun</TableHead>
                                <TableHead className="font-semibold text-gray-700">Tanggal Rilis</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((doc) => (
                                <TableRow key={doc.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium text-gray-900 max-w-xs truncate">{doc.title}</TableCell>
                                    <TableCell className="text-gray-600">{doc.category.name}</TableCell>
                                    <TableCell className="text-gray-600">{doc.subCategory?.name || '-'}</TableCell>
                                    <TableCell className="text-gray-600">{doc.unitPenyusun}</TableCell>
                                    <TableCell className="text-gray-600">{formatDate(doc.tanggalPublikasi)}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {/* Buka PDF di Tab Baru */}
                                        <a
                                            href={`http://127.0.0.1:4000/uploads/document/${doc.fileUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            Buka PDF
                                        </a>
                                        {/* Hapus Dokumen */}
                                        <button
                                            onClick={() => handleDelete(doc.id, doc.title)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Hapus
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Modal Dialog Pop-up Upload */}
            <UploadDocModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                onSuccess={fetchDocuments} // Jika sukses upload, picu refresh tabel
            />

        </div>
    );
}
