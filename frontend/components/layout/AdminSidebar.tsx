'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  LogOut,
  User
} from 'lucide-react';
import { toast } from 'sonner';


export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  // Daftar menu navigasi admin
  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Dokumen', href: '/admin/documents', icon: FileText },
    { name: 'Kelola Banner', href: '/admin/banners', icon: ImageIcon },
  ];

  // fungsi hapus sesi / logout
  const handleLogout = () => {
    // Hapus cookie token dengan memundurkan tanggal kadaluarsanya ke tahun 1970
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

    // Hapus data user dari localStorage
    localStorage.removeItem('user');
    toast.success('Berhasil keluar sistem.');

    // Tendang ke halaman login
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800">
      <div>
        {/* Header Sidebar: Brand BJB */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="font-bold text-lg text-white tracking-wide">BJB Perencanaan</h1>
          <p className="text-xs text-slate-400 font-medium">Panel Administrator</p>
        </div>
        {/* Daftar Link Menu Navigasi */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Mengecek apakah link menu ini sedang aktif dibuka oleh user
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Footer Sidebar: Tombol Keluar */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg text-sm font-medium transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Keluar Sistem
        </button>
      </div>
    </aside>
  );
}
