'use client';

import { useEffect, useState } from 'react';
import { FileText, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';
import { getDocumentApi } from '@/features/documents/services/documentApi';
export default function AdminDashboard() {
    const [adminName, setAdminName] = useState('Administrator');
    const [totalDocument, setTotalDocument] = useState(0)
    const [totalBanner, setTotalBanner] = useState(0)
    // Membaca nama admin dari localStorage secara aman setelah komponen ter-render di browser
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed && parsed.username) {
                    // Mengubah huruf pertama menjadi kapital untuk estetika
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
            try {
                const docsResponse = await getDocumentApi();
                setTotalDocument(docsResponse.data.length);
            } catch (error) {
                console.error("Gagal memuat data statistik: ", error);
            }
        };
        fetchStats();
    }, [])

    // Data tiruan untuk statistik (Nanti bisa kita hubungkan ke API backend riil)
    const stats = [
        { name: 'Total Dokumen', value: totalDocument.toString(), description: 'Kajian terunggah', icon: FileText, color: 'text-blue-600 bg-blue-50' },
        { name: 'Banner Aktif', value: '4', description: 'Carousel beranda', icon: ImageIcon, color: 'text-amber-600 bg-amber-50' },
        { name: 'Status Server', value: 'Normal', description: 'Koneksi Database', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
    ];

    return (
        <div className="space-y-8">

            {/* 1. Welcome Banner */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">
                    Selamat Datang, <span className="text-blue-600">{adminName}</span>! 👋
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                    Melalui panel ini, Anda dapat mengelola publikasi riset, mengatur banner beranda utama, dan memantau aktivitas portal.
                </p>
            </div>

            {/* 2. Grid Statistik Kartu (Card Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{stat.name}</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                                <p className="text-xs text-gray-500">{stat.description}</p>
                            </div>
                            <div className={`p-4 rounded-xl ${stat.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. Panel Info Tambahan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    Status Sistem & Log
                </h2>
                <div className="border-t border-gray-100 pt-4 text-sm text-gray-600 space-y-2">
                    <p>🟢 Layanan API Backend terhubung pada port <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">4000</span></p>
                    <p>🟢 Direktori upload file PDF diaktifkan di <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">/uploads/document</span></p>
                    <p>🟢 Direktori upload Gambar Banner diaktifkan di <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">/uploads/banners</span></p>
                </div>
            </div>

        </div>
    );
}
