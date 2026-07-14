'use client';

import { useEffect, useState } from 'react';
import { FileText, Image as ImageIcon, Users, FolderTree, Upload, Pencil, ArrowUpRight, Clock } from 'lucide-react';
import { getDashboardStatsApi } from '../services/adminApi';

interface DashboardStats {
    totalDocuments: number;
    activeBanners: number;
    totalCategories: number;
    totalSubCategories: number;
    totalUsers: number;
    docsByCategory: { name: string; count: number }[];
    recentActivity: {
        id: string;
        action: string;
        entity: string;
        entityName: string;
        actor: string;
        timestamp: string;
    }[];
}

function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Baru saja';
    if (diffMin < 60) return `${diffMin}m lalu`;
    if (diffHour < 24) return `${diffHour}j lalu`;
    if (diffDay < 7) return `${diffDay}h lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function getEntityIcon(entity: string) {
    switch (entity) {
        case 'Document': return { icon: FileText, color: 'text-blue-500' };
        case 'Banner': return { icon: ImageIcon, color: 'text-amber-500' };
        case 'CategoryBanner': return { icon: ImageIcon, color: 'text-purple-500' };
        case 'Category':
        case 'SubCategory': return { icon: FolderTree, color: 'text-emerald-500' };
        default: return { icon: FileText, color: 'text-gray-500' };
    }
}

export default function AdminDashboard() {
    const [adminName, setAdminName] = useState('Administrator');
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed && parsed.username) {
                    const formattedName = parsed.username.charAt(0).toUpperCase() + parsed.username.slice(1);
                    setAdminName(formattedName);
                }
            } catch (e) {
                console.error('Gagal membaca data user dari localStorage', e);
            }
        }
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const data = await getDashboardStatsApi();
                setStats(data);
            } catch (error) {
                console.error("Gagal memuat data dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const maxDocCount = stats ? Math.max(...stats.docsByCategory.map(c => c.count), 1) : 1;

    // macOS SF colors
    const statCards = [
        { name: 'Total Dokumen', value: stats?.totalDocuments ?? 0, icon: FileText, color: '#007AFF', bgColor: 'bg-[#007AFF]/5', borderColor: 'border-[#007AFF]/10', description: 'Kajian terpublikasi' },
        { name: 'Banner Aktif', value: stats?.activeBanners ?? 0, icon: ImageIcon, color: '#FF9500', bgColor: 'bg-[#FF9500]/5', borderColor: 'border-[#FF9500]/10', description: 'Carousel beranda' },
        { name: 'Kategori', value: `${stats?.totalCategories ?? 0} + ${stats?.totalSubCategories ?? 0}`, icon: FolderTree, color: '#34C759', bgColor: 'bg-[#34C759]/5', borderColor: 'border-[#34C759]/10', description: 'Kategori + Sub' },
        { name: 'Total Pengguna', value: stats?.totalUsers ?? 0, icon: Users, color: '#AF52DE', bgColor: 'bg-[#AF52DE]/5', borderColor: 'border-[#AF52DE]/10', description: 'Admin & Viewer' },
    ];

    // Greeting berdasarkan waktu
    const hour = new Date().getHours();
    let greeting = 'Selamat pagi';
    if (hour >= 11 && hour < 15) greeting = 'Selamat siang';
    else if (hour >= 15 && hour < 18) greeting = 'Selamat sore';
    else if (hour >= 18 || hour < 5) greeting = 'Selamat malam';

    return (
        <div className="space-y-6">

            {/* 1. Welcome Banner — macOS minimal */}
            <div>
                <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">
                    {greeting}, {adminName} 👋
                </h1>
                <p className="text-[13px] text-gray-500 mt-0.5">
                    Berikut ringkasan aktivitas dan data pada sistem Anda.
                </p>
            </div>

            {/* 2. Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={`bg-white rounded-2xl border border-gray-200/60 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow`}>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{stat.name}</p>
                                <div className={`w-8 h-8 rounded-xl ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center`}>
                                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                                </div>
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse" />
                                ) : (
                                    <h3 className="text-[28px] font-semibold text-gray-900 tracking-tight leading-none">{stat.value}</h3>
                                )}
                                <p className="text-[11px] text-gray-400 mt-1.5 font-medium">{stat.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. Two-column: Recent Activity + Docs by Category */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                {/* Kolom Kiri: Aktivitas Terbaru (3/5 width) */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <h2 className="text-[13px] font-bold text-gray-800">Aktivitas Terbaru</h2>
                        </div>
                        <a href="/admin/audit-log" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                            Lihat Semua <ArrowUpRight className="w-3 h-3" />
                        </a>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center text-gray-400 text-[13px]">Memuat...</div>
                    ) : !stats?.recentActivity?.length ? (
                        <div className="p-8 text-center text-gray-400 text-[13px]">Belum ada aktivitas.</div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {stats.recentActivity.map((entry) => {
                                const meta = getEntityIcon(entry.entity);
                                const Icon = meta.icon;
                                const isCreate = entry.action === 'CREATE';

                                return (
                                    <div key={entry.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                                        <div className={`shrink-0 w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center`}>
                                            <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] text-gray-800 font-medium truncate">
                                                <span className="font-semibold">{entry.actor}</span>
                                                <span className="text-gray-400"> {isCreate ? 'menambahkan' : 'memperbarui'} </span>
                                                <span className="text-gray-700">{entry.entityName}</span>
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-[10px] text-gray-400 font-medium tabular-nums whitespace-nowrap">
                                            {timeAgo(entry.timestamp)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Kolom Kanan: Dokumen per Kategori (2/5 width) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <FolderTree className="w-4 h-4 text-gray-400" />
                            <h2 className="text-[13px] font-bold text-gray-800">Dokumen per Kategori</h2>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center text-gray-400 text-[13px]">Memuat...</div>
                    ) : !stats?.docsByCategory?.length ? (
                        <div className="p-8 text-center text-gray-400 text-[13px]">Belum ada data.</div>
                    ) : (
                        <div className="p-5 space-y-4">
                            {stats.docsByCategory.map((cat, index) => {
                                const percentage = Math.round((cat.count / maxDocCount) * 100);
                                // macOS-style color palette
                                const colors = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF3B30', '#5AC8FA', '#FFCC00'];
                                const barColor = colors[index % colors.length];

                                return (
                                    <div key={cat.name}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[12px] font-medium text-gray-700 truncate">{cat.name}</span>
                                            <span className="text-[12px] font-semibold text-gray-900 tabular-nums ml-2">{cat.count}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%`, backgroundColor: barColor }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* 4. System Status — macOS style */}
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-5">
                <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">System Status</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Backend API', detail: 'Port 4000', status: true },
                        { label: 'Document Storage', detail: '/uploads/document', status: true },
                        { label: 'Banner Storage', detail: '/uploads/banners', status: true },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between bg-gray-50/70 px-4 py-3 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <span className={`w-2 h-2 rounded-full ${item.status ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`} />
                                <span className="text-[12px] font-medium text-gray-700">{item.label}</span>
                            </div>
                            <span className="font-mono text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-100">{item.detail}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
