'use client';

import { useEffect, useState } from 'react';
import { FileText, Plus, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { getDocumentApi, deleteDocumentApi } from '../services/documentApi';
import UploadDocModal from './UploadDocModal';
import EditDocModal from './EditDocModal';
import { Edit3 } from 'lucide-react';
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
    uploader?: { username: string };
    updatedBy?: { username: string };
    updatedAt?: string;
}

export default function DocumentManager() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

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
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
                <div className="space-y-0.5">
                    <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        Kelola Dokumen Publikasi
                    </h1>
                    <p className="text-[13px] text-gray-500">Unggah dan kelola dokumen riset ekonomi serta kajian perencanaan.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium flex items-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Dokumen
                </button>
            </div>

            {/* Tabel Daftar Dokumen */}
            <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] overflow-x-auto">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-500 font-medium">Sedang memuat dokumen...</div>
                ) : documents.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 font-medium">Belum ada dokumen yang diunggah.</div>
                ) : (
                    <Table>
                        <TableHeader className="bg-white">
                            <TableRow className="border-b border-gray-100 hover:bg-transparent">
                                <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Judul Kajian</TableHead>
                                <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Kategori</TableHead>
                                <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Sub Kategori</TableHead>
                                <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Penyusun</TableHead>
                                <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Tanggal Rilis</TableHead>
                                <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right whitespace-nowrap">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((doc) => (
                                <TableRow key={doc.id} className="hover:bg-slate-50/50 border-b border-gray-100 group">
                                    <TableCell className="font-medium text-gray-900 min-w-[200px] max-w-[300px] text-[13px]">
                                        <div className="truncate">{doc.title}</div>
                                        <div className="text-[10px] text-gray-400 font-normal mt-1 leading-tight">
                                            Dibuat: {doc.uploader?.username || '-'}
                                            {doc.updatedBy && <><br/>Diubah: {doc.updatedBy.username}</>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-[13px] whitespace-nowrap">{doc.category.name}</TableCell>
                                    <TableCell className="text-gray-500 text-[13px] whitespace-nowrap">{doc.subCategory?.name || '-'}</TableCell>
                                    <TableCell className="text-gray-500 text-[13px] whitespace-nowrap">{doc.unitPenyusun}</TableCell>
                                    <TableCell className="text-gray-500 text-[13px] whitespace-nowrap">{formatDate(doc.tanggalPublikasi)}</TableCell>
                                    <TableCell className="text-right space-x-1 whitespace-nowrap">
                                        {/* Buka PDF di Tab Baru */}
                                        <a
                                            href={doc.fileUrl.startsWith('http') ? doc.fileUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000'}/uploads/document/${doc.fileUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex p-1.5 text-gray-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                            title="Buka PDF"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        {/* Ubah Dokumen */}
                                        <button
                                            onClick={() => {
                                                setSelectedDoc(doc);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="inline-flex p-1.5 text-gray-400 hover:text-yellow-600 rounded-lg transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                            title="Edit"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        {/* Hapus Dokumen */}
                                        <button
                                            onClick={() => handleDelete(doc.id, doc.title)}
                                            className="inline-flex p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
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

            {/* Modal Dialog Pop-up Edit */}
            {selectedDoc && (
                <EditDocModal
                    isOpen={isEditModalOpen}
                    setIsOpen={setIsEditModalOpen}
                    onSuccess={fetchDocuments} // Jika sukses edit, picu refresh tabel
                    documentData={selectedDoc}
                />
            )}

        </div>
    );
}
