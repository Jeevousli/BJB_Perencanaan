'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronRight, FileText, Download } from 'lucide-react';
import { getDocumentsBySubCategoryApi, getDocumentsByCategoryApi } from '@/features/documents/services/documentApi';

// Tipe data dokumen dari backend
interface Document {
    id: string;
    title: string;
    fileUrl: string;
    unitPenyusun: string;
    tanggalPublikasi: string;
    category: { name: string };
    subCategory: { name: string } | null;
}

// Tipe untuk data yang sudah dikelompokkan
// { "2026": { "Januari": [dok1, dok2], "Februari": [dok3] } }
type GroupedDocuments = {
    [year: string]: {
        [month: string]: Document[];
    };
};

// ============================================================
// FUNGSI HELPER: Mengubah array datar → objek bertingkat
// Ini adalah implementasi .reduce() yang kita pelajari tadi
// ============================================================
function groupByYearAndMonth(documents: Document[]): GroupedDocuments {
    return documents.reduce((acc, doc) => {
        const date = new Date(doc.tanggalPublikasi);
        const year = date.getFullYear().toString();
        const month = date.toLocaleString('id-ID', { month: 'long' }); // "Januari", "Februari"

        if (!acc[year]) acc[year] = {};
        if (!acc[year][month]) acc[year][month] = [];
        acc[year][month].push(doc);

        return acc;
    }, {} as GroupedDocuments);
}

export default function CategoryPage() {
    // useParams() = hook untuk membaca nilai dari URL dinamis [id]
    const params = useParams();
    const searchParams = useSearchParams();
    
    const id = params.id as string;
    const type = searchParams.get('type');

    const [grouped, setGrouped] = useState<GroupedDocuments>({});
    const [pageTitle, setPageTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // State untuk melacak akordion mana yang terbuka
    // Kita simpan sebagai Set agar bisa buka banyak akordion sekaligus
    const [openYears, setOpenYears] = useState<Set<string>>(new Set());
    const [openMonths, setOpenMonths] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchDocs = async () => {
            setIsLoading(true);
            try {
                let res;
                if (type === 'main') {
                    res = await getDocumentsByCategoryApi(id);
                } else {
                    res = await getDocumentsBySubCategoryApi(id);
                }
                
                const docs: Document[] = res.data;

                // Ambil judul halaman (Kategori Utama atau SubKategori)
                if (docs.length > 0) {
                    if (type === 'main') {
                        setPageTitle(docs[0].category.name);
                    } else if (docs[0].subCategory) {
                        setPageTitle(docs[0].subCategory.name);
                    }
                }

                // Kelompokkan dokumen
                const groupedData = groupByYearAndMonth(docs);
                setGrouped(groupedData);

                // Buka tahun terbaru secara otomatis
                const years = Object.keys(groupedData).sort((a, b) => Number(b) - Number(a));
                if (years.length > 0) {
                    setOpenYears(new Set([years[0]]));
                }
            } catch (error) {
                console.error('Gagal memuat dokumen:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchDocs();
    }, [id, type]);

    // Toggle buka/tutup akordion Tahun
    const toggleYear = (year: string) => {
        setOpenYears(prev => {
            const next = new Set(prev);
            next.has(year) ? next.delete(year) : next.add(year);
            return next;
        });
    };

    // Toggle buka/tutup akordion Bulan
    const toggleMonth = (key: string) => {
        setOpenMonths(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

    return (
        <div className="flex-1 px-6 md:px-20 py-8">
            {/* Judul Halaman */}
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{pageTitle || 'Kategori'}</h1>
            <p className="text-sm text-gray-500 mb-6">Daftar dokumen berdasarkan tahun dan bulan publikasi</p>

            {isLoading ? (
                <div className="text-gray-400 text-sm py-12 text-center">Memuat dokumen...</div>
            ) : years.length === 0 ? (
                <div className="text-gray-400 text-sm py-12 text-center">Belum ada dokumen di kategori ini.</div>
            ) : (
                <div className="space-y-3">
                    {years.map(year => (
                        <div key={year} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">

                            {/* Akordion Level 1: TAHUN */}
                            <button
                                onClick={() => toggleYear(year)}
                                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <span className="text-lg font-bold text-gray-800">{year}</span>
                                {openYears.has(year)
                                    ? <ChevronDown className="w-5 h-5 text-gray-500" />
                                    : <ChevronRight className="w-5 h-5 text-gray-500" />
                                }
                            </button>

                            {/* Konten Tahun: List Bulan */}
                            {openYears.has(year) && (
                                <div className="border-t border-gray-100">
                                    {Object.keys(grouped[year]).map(month => {
                                        const monthKey = `${year}-${month}`;
                                        const docs = grouped[year][month];
                                        return (
                                            <div key={month} className="border-b border-gray-100 last:border-0">

                                                {/* Akordion Level 2: BULAN */}
                                                <button
                                                    onClick={() => toggleMonth(monthKey)}
                                                    className="w-full flex items-center justify-between px-8 py-3 text-left hover:bg-amber-50 transition-colors cursor-pointer"
                                                >
                                                    <span className="text-sm font-semibold text-amber-600">{month}</span>
                                                    {openMonths.has(monthKey)
                                                        ? <ChevronDown className="w-4 h-4 text-amber-500" />
                                                        : <ChevronRight className="w-4 h-4 text-amber-500" />
                                                    }
                                                </button>

                                                {/* Konten Bulan: Grid Dokumen */}
                                                {openMonths.has(monthKey) && (
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-8 py-4 bg-gray-50">
                                                        {docs.map(doc => (
                                                            <div key={doc.id} className="flex items-start gap-2 p-2 bg-white rounded-lg border border-gray-100 hover:border-amber-300 transition-colors group">
                                                                <FileText className="w-8 h-8 text-red-500 shrink-0 mt-0.5" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-medium text-gray-700 leading-tight truncate">{doc.title}</p>
                                                                    <a
                                                                        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000'}/uploads/document/${doc.fileUrl}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-[10px] text-amber-600 font-semibold hover:underline flex items-center gap-1 mt-1"
                                                                    >
                                                                        <Download className="w-3 h-3" /> Unduh
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
