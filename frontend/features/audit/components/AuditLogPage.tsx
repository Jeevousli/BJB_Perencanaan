'use client';

import { useEffect, useState } from 'react';
import { getAuditLogApi } from '../services/auditApi';
import { FileText, Image as ImageIcon, FolderTree, Upload, Pencil, Filter } from 'lucide-react';

interface AuditEntry {
    id: string;
    action: 'CREATE' | 'UPDATE';
    entity: 'Document' | 'Banner' | 'CategoryBanner' | 'Category' | 'SubCategory';
    entityName: string;
    actor: string;
    timestamp: string;
}

type FilterType = 'ALL' | 'Document' | 'Banner' | 'Category';

// Menghitung waktu relatif ("5 menit lalu", "2 jam lalu")
function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatFullDate(dateString: string): string {
    return new Date(dateString).toLocaleString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

// Ikon dan warna per tipe entitas
function getEntityMeta(entity: string, action: string) {
    const actionIcon = action === 'CREATE' ? Upload : Pencil;
    switch (entity) {
        case 'Document':
            return { icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-100', label: 'Dokumen' };
        case 'Banner':
            return { icon: ImageIcon, color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Banner Beranda' };
        case 'CategoryBanner':
            return { icon: ImageIcon, color: 'text-purple-600 bg-purple-50 border-purple-100', label: 'Banner Kategori' };
        case 'Category':
            return { icon: FolderTree, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Kategori' };
        case 'SubCategory':
            return { icon: FolderTree, color: 'text-teal-600 bg-teal-50 border-teal-100', label: 'Sub Kategori' };
        default:
            return { icon: FileText, color: 'text-gray-600 bg-gray-50 border-gray-100', label: entity };
    }
}

function getActionLabel(action: string): { text: string; style: string } {
    switch (action) {
        case 'CREATE': return { text: 'Dibuat', style: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' };
        case 'UPDATE': return { text: 'Diperbarui', style: 'bg-blue-50 text-blue-700 border border-blue-200/60' };
        default: return { text: action, style: 'bg-gray-50 text-gray-700 border border-gray-200/60' };
    }
}

export default function AuditLogPage() {
    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('ALL');

    useEffect(() => {
        const fetchAuditLog = async () => {
            setIsLoading(true);
            try {
                const res = await getAuditLogApi();
                setEntries(res.data || []);
            } catch (error) {
                console.error('Gagal memuat audit log:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAuditLog();
    }, []);

    // Filter entries berdasarkan tipe yang dipilih
    const filteredEntries = entries.filter(entry => {
        if (filter === 'ALL') return true;
        if (filter === 'Document') return entry.entity === 'Document';
        if (filter === 'Banner') return entry.entity === 'Banner' || entry.entity === 'CategoryBanner';
        if (filter === 'Category') return entry.entity === 'Category' || entry.entity === 'SubCategory';
        return true;
    });

    const filterOptions: { label: string; value: FilterType }[] = [
        { label: 'Semua', value: 'ALL' },
        { label: 'Dokumen', value: 'Document' },
        { label: 'Banner', value: 'Banner' },
        { label: 'Kategori', value: 'Category' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-0.5">
                    <h1 className="text-lg font-bold text-gray-900">Audit Log</h1>
                    <p className="text-[13px] text-gray-500">Riwayat seluruh aktivitas pengelolaan konten pada sistem.</p>
                </div>
                <div className="text-[12px] text-gray-400 font-medium tabular-nums">
                    {filteredEntries.length} aktivitas
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-400" />
                {filterOptions.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => setFilter(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                            filter === opt.value
                                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-16 text-center text-gray-400 text-[13px]">Memuat audit log...</div>
                ) : filteredEntries.length === 0 ? (
                    <div className="p-16 text-center text-gray-400 text-[13px]">Belum ada aktivitas yang tercatat.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredEntries.map((entry) => {
                            const meta = getEntityMeta(entry.entity, entry.action);
                            const actionLabel = getActionLabel(entry.action);
                            const Icon = meta.icon;

                            return (
                                <div
                                    key={entry.id}
                                    className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors group"
                                >
                                    {/* Icon */}
                                    <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${meta.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <p className="text-[13px] font-semibold text-gray-900 truncate">{entry.entityName}</p>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold w-fit ${actionLabel.style}`}>
                                                {actionLabel.text}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[11px] text-gray-400 font-medium">{meta.label}</span>
                                            <span className="text-gray-300">·</span>
                                            <span className="text-[11px] text-gray-500 font-medium">oleh {entry.actor}</span>
                                        </div>
                                    </div>

                                    {/* Timestamp */}
                                    <div className="shrink-0 text-right" title={formatFullDate(entry.timestamp)}>
                                        <p className="text-[11px] text-gray-400 font-medium whitespace-nowrap">{timeAgo(entry.timestamp)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
