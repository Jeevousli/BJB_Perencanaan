'use client';

import { useEffect, useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { getDocumentApi } from '../services/documentApi';

interface Document {
    id: string;
    title: string;
    fileUrl: string;
    unitPenyusun: string;
    tanggalPublikasi: string;
    category: { name: string };
    subCategory: { name: string } | null;
}

export default function RecentDocuments() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecentDocs = async () => {
            try {
                const res = await getDocumentApi();
                // 1. Urutkan berdasarkan tanggal publikasi terbaru
                const sortedDocs = res.data.sort((a: Document, b: Document) =>
                    new Date(b.tanggalPublikasi).getTime() - new Date(a.tanggalPublikasi).getTime()
                );

                // 2. Ambil hanya 12 teratas (terbaru)
                setDocuments(sortedDocs.slice(0, 12));
            } catch (error) {
                console.error('Gagal memuat dokumen terbaru:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentDocs();
    }, []);

    if (isLoading) {
        return <div className="text-gray-400 text-sm py-8 text-center animate-pulse">Memuat dokumen terbaru...</div>;
    }

    if (documents.length === 0) {
        return <div className="text-gray-400 text-sm py-8 text-center">Belum ada dokumen yang diupload.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.map((doc) => (
                <div key={doc.id} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all group">
                    <FileText className="w-8 h-8 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-tight truncate" title={doc.title}>
                            {doc.title}
                        </p>

                        <div className="mt-2 space-y-1">
                            <p className="text-[10px] text-gray-500 truncate">
                                ✍️ {doc.unitPenyusun}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                                📁 {doc.subCategory ? doc.subCategory.name : doc.category.name}
                            </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-50">
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000'}/uploads/document/${doc.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-amber-600 font-bold hover:text-amber-700 flex items-center gap-1 w-fit"
                            >
                                <Download className="w-3.5 h-3.5" /> Unduh
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
