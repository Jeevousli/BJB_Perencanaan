'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  LogOut,
  ListTree,
  Eye,
  Search,
  Settings,
  X,
  History
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminSidebarProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState('Administrator');

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
              console.error('Gagal membaca data user', e);
          }
      }
  }, []);

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Kategori', href: '/admin/categories', icon: ListTree },
    { name: 'Kelola Dokumen', href: '/admin/documents', icon: FileText },
    { name: 'Kelola Banner', href: '/admin/banners', icon: ImageIcon },
    { name: 'Audit Log', href: '/admin/audit-log', icon: History },
  ];

  const utilityItems = [
    { name: 'Beralih ke Viewer', href: '/dashboard', icon: Eye },
  ];

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    localStorage.removeItem('user');
    toast.success('Berhasil keluar sistem.');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-[260px] bg-white flex flex-col shadow-[1px_0_15px_rgb(0,0,0,0.03)] z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Brand / Logo Area */}
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-gray-900 tracking-tight text-lg">BJB Planning</span>
          </div>
          
          {/* Close button for mobile */}
          <button 
            className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsOpen?.(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      {/* Search Bar (Visual Only) */}
      <div className="px-5 mb-4">
        <div className="bg-gray-100/50 rounded-xl px-3 py-2.5 flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Menu Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pb-2">
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Main</p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-4 pt-4">
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Utility</p>
          <nav className="space-y-1">
            {utilityItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                  <Icon className="w-4 h-4" strokeWidth={2} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 mt-auto">
        <div className="flex items-center justify-between hover:bg-gray-50 p-2.5 rounded-xl transition-all cursor-pointer group" onClick={handleLogout}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shrink-0">
              <span className="text-blue-700 font-bold text-sm">
                {adminName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">{adminName}</p>
              <p className="text-[11px] text-gray-500 truncate group-hover:text-red-500 transition-colors">Logout Account</p>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
        </div>
      </div>
    </aside>
    </>
  );
}
