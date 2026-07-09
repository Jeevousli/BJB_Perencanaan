import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-[#f8f9fa] min-h-screen font-sans">

            {/* 1. Sidebar Navigasi di sebelah kiri (Lebar tetap: 64 / 256px) */}
            <AdminSidebar />

            {/* 2. Area Konten Utama di sebelah kanan (Sisa lebar layar: flex-1) */}
            <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">

                {/* Top Header/Bar untuk navigasi atas */}
                <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8">
                    <div className="text-sm font-medium text-gray-500">
                        Sistem Manajemen Publikasi Riset & Perencanaan
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        Administrator Active
                    </div>
                </header>

                {/* Isi halaman dinamis (Dashboard, Dokumen, dll) akan masuk di children ini */}
                <div className="flex-1 p-8">
                    {children}
                </div>

            </main>
        </div>
    );
}
