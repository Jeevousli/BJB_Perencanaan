'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronRight, FileText, Download, Search } from 'lucide-react';
import { getDocumentsBySubCategoryApi, getDocumentsByCategoryApi, getCategoriesApi } from '@/features/documents/services/documentApi';
import { getBannersByCategoryApi, getBannersBySubCategoryApi } from '@/features/categories/services/categoryBannerApi';
import CategoryCarousel from '@/features/categories/components/CategoryCarousel';

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
type GroupedDocuments = {
    [year: string]: {
        [quarter: string]: Document[];
    };
};

function groupByYearAndQuarter(documents: Document[]): GroupedDocuments {
    return documents.reduce((acc, doc) => {
        const date = new Date(doc.tanggalPublikasi);
        const year = date.getFullYear().toString();
        const month = date.getMonth(); // 0-11
        
        let quarter = 'Triwulan 1';
        if (month >= 3 && month <= 5) quarter = 'Triwulan 2';
        else if (month >= 6 && month <= 8) quarter = 'Triwulan 3';
        else if (month >= 9) quarter = 'Triwulan 4';

        if (!acc[year]) acc[year] = {};
        if (!acc[year][quarter]) acc[year][quarter] = [];
        acc[year][quarter].push(doc);

        return acc;
    }, {} as GroupedDocuments);
}

export default function CategoryPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    
    const id = params.id as string;
    const type = searchParams.get('type');

    const [grouped, setGrouped] = useState<GroupedDocuments>({});
    const [pageTitle, setPageTitle] = useState('');
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // State untuk melacak akordion mana yang terbuka
    const [openYears, setOpenYears] = useState<Set<string>>(new Set());
    const [openQuarters, setOpenQuarters] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchDocsAndCategory = async () => {
            setIsLoading(true);
            try {
                // Fetch categories to get banner and title
                const catRes = await getCategoriesApi();
                const categories = catRes.data;
                let foundTitle = 'Kategori';

                if (type === 'main') {
                    const cat = categories.find((c: any) => c.id === id);
                    if (cat) {
                        foundTitle = cat.pageTitle || cat.name;
                    }
                } else {
                    for (const cat of categories) {
                        const sub = cat.subCategories.find((s: any) => s.id === id);
                        if (sub) {
                            foundTitle = sub.pageTitle || sub.name;
                            break;
                        }
                    }
                }
                setPageTitle(foundTitle);

                let res;
                let bannersRes;
                if (type === 'main') {
                    res = await getDocumentsByCategoryApi(id);
                    bannersRes = await getBannersByCategoryApi(id);
                } else {
                    res = await getDocumentsBySubCategoryApi(id);
                    bannersRes = await getBannersBySubCategoryApi(id);
                }
                
                setBanners(bannersRes.data || []);
                const docs: Document[] = res.data;

                // Kelompokkan dokumen
                const groupedData = groupByYearAndQuarter(docs);
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

        if (id) fetchDocsAndCategory();
    }, [id, type]);

    // Toggle buka/tutup akordion Tahun
    const toggleYear = (year: string) => {
        setOpenYears(prev => {
            const next = new Set(prev);
            next.has(year) ? next.delete(year) : next.add(year);
            return next;
        });
    };

    // Toggle buka/tutup akordion Quarter
    const toggleQuarter = (key: string) => {
        setOpenQuarters(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

    return (
        <div className="flex-1 flex flex-col">
            
            <div className="flex-1 px-6 md:px-20 py-8 space-y-8">
                
                {/* Banner Carousel */}
                <section>
                    <CategoryCarousel banners={banners} pageTitle={pageTitle} />
                </section>

                {/* Search Bar */}
                <section>
                    <div className="flex w-full bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                        <input
                            type="text"
                            placeholder={`Temukan dokumen di ${pageTitle}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg bg-transparent text-gray-800 text-sm outline-none"
                        />
                        <button className="bg-[#d99614] hover:bg-[#c58b19] px-6 py-2 rounded-lg text-white text-sm font-medium cursor-pointer transition-colors">
                            Cari
                        </button>
                    </div>
                </section>

                {/* Dokumen Accordion */}
                <section>
                    <h2 className="text-lg font-bold text-gray-700 mb-4">Daftar Dokumen</h2>
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

                                    {/* Konten Tahun: List Triwulan */}
                                    {openYears.has(year) && (
                                        <div className="border-t border-gray-100">
                                            {Object.keys(grouped[year]).map(quarter => {
                                                const quarterKey = `${year}-${quarter}`;
                                                
                                                // Filter dokumen dalam triwulan ini berdasarkan search term
                                                const docs = grouped[year][quarter].filter(doc => 
                                                    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                    doc.unitPenyusun.toLowerCase().includes(searchTerm.toLowerCase())
                                                );

                                                // Jika tidak ada dokumen yang cocok, jangan tampilkan triwulan ini
                                                if (docs.length === 0) return null;

                                                return (
                                                    <div key={quarter} className="border-b border-gray-100 last:border-0">
                                                        {/* Akordion Level 2: TRIWULAN */}
                                                        <button
                                                            onClick={() => toggleQuarter(quarterKey)}
                                                            className="w-full flex items-center justify-between px-8 py-3 text-left hover:bg-amber-50 transition-colors cursor-pointer"
                                                        >
                                                            <span className="text-sm font-semibold text-amber-600">{quarter}</span>
                                                            {openQuarters.has(quarterKey)
                                                                ? <ChevronDown className="w-4 h-4 text-amber-500" />
                                                                : <ChevronRight className="w-4 h-4 text-amber-500" />
                                                            }
                                                        </button>

                                                        {/* Konten Triwulan: Grid Dokumen */}
                                                        {openQuarters.has(quarterKey) && (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-8 py-4 bg-gray-50">
                                                                {docs.map(doc => (
                                                                    <div key={doc.id} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-gray-100 hover:border-amber-300 transition-colors group">
                                                                        <FileText className="w-8 h-8 text-red-500 shrink-0 mt-0.5" />
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-xs font-semibold text-gray-700 leading-tight truncate" title={doc.title}>{doc.title}</p>
                                                                            <p className="text-[10px] text-gray-500 mt-1 truncate" title={doc.unitPenyusun}>✍️ {doc.unitPenyusun}</p>
                                                                            <a
                                                                                href={doc.fileUrl.startsWith('http') ? doc.fileUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000'}/uploads/document/${doc.fileUrl}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-[10px] text-amber-600 font-bold hover:underline flex items-center gap-1 mt-2"
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
                </section>
            </div>
        </div>
    );
}
