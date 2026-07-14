'use client';

import { usePathname } from 'next/navigation';
import { Home, Bell, Settings, Menu } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
    toggleSidebar?: () => void;
}

export default function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
    const pathname = usePathname();
    
    // Simple breadcrumb logic based on pathname
    const segments = pathname.split('/').filter(Boolean);
    let currentPage = 'Dashboard';
    if (segments.length > 1) {
        const last = segments[segments.length - 1];
        currentPage = last.charAt(0).toUpperCase() + last.slice(1);
    }

    return (
        <header className="h-[64px] bg-white shadow-[0_1px_10px_rgb(0,0,0,0.02)] flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
            <div className="flex items-center gap-3">
                {/* Hamburger Menu (Mobile Only) */}
                <button 
                    onClick={toggleSidebar}
                    className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-2 text-[13px] font-medium text-gray-400">
                    <Link href="/admin/dashboard" className="hover:text-gray-900 transition-colors hidden sm:flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                    </Link>
                    <span className="text-gray-300 hidden sm:inline">›</span>
                    <span className="text-gray-900">{currentPage}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 text-gray-400">
                <button className="p-2 hover:text-gray-600 transition-colors">
                    <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 hover:text-gray-600 transition-colors">
                    <Bell className="w-4 h-4" />
                </button>
            </div>
        </header>
    );
}
