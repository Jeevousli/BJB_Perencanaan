'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, UserCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { getCategoriesApi } from '@/features/documents/services/documentApi';

interface SubCategory {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
    subCategories: SubCategory[];
}

export default function ViewerNavbar() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    // Ambil data kategori dari backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategoriesApi();
                setCategories(res.data);
            } catch (error) {
                console.error("Gagal mengambil kategori:", error);
            }
        };
        fetchCategories();

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUserRole(parsed.role);
            } catch (e) {
                console.error("Gagal parse user data");
            }
        }
    }, []);

    const handleLogout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        localStorage.removeItem('user');
        toast.success('Berhasil keluar sistem.');
        window.location.href = '/login';
    };

    return (
        <nav className="bg-[#1e293b] text-white py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-md">

            {/* Bagian Kiri: Logo */}
            <Link href="/dashboard" className="flex items-center gap-3">
                <div className="relative w-10 h-10 bg-white rounded-lg p-1">
                    <Image src="/bjb.png" alt="Logo BJB" fill className="object-contain" />
                </div>
                <div>
                    <h1 className="text-sm font-semibold tracking-wide leading-tight">
                        Research and Office of Economist
                    </h1>
                    <p className="text-xs text-blue-300 font-bold">bank bjb</p>
                </div>
            </Link>

            {/* Bagian Tengah: Menu Kategori (Dinamis) */}
            <div className="hidden lg:flex items-center gap-6">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="relative group"
                        onMouseEnter={() => setActiveDropdown(category.id)}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <Link 
                            href={`/category/${category.id}?type=main`}
                            className="flex items-center gap-1 text-sm font-medium hover:text-amber-400 transition-colors py-2 cursor-pointer"
                        >
                            {category.name}
                            {category.subCategories.length > 0 && (
                                <ChevronDown className="w-4 h-4 opacity-70" />
                            )}
                        </Link>

                        {/* Dropdown Menu untuk Subkategori */}
                        {category.subCategories.length > 0 && activeDropdown === category.id && (
                            <div className="absolute top-full left-0 pt-2 w-48 z-50">
                                <div className="bg-white text-gray-800 rounded-xl shadow-xl py-2 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    {category.subCategories.map((sub) => (
                                        <Link
                                            key={sub.id}
                                            href={`/category/${sub.id}`}
                                            className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        >
                                            {sub.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bagian Kanan: Tombol Profil */}
            <div className="flex items-center relative">
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 bg-[#d99614] hover:bg-[#c58b19] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                    Profil <ChevronDown className="w-4 h-4" />
                </button>
                
                {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                        {userRole === 'ADMIN' && (
                            <Link 
                                href="/admin/dashboard"
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer font-medium border-b border-gray-100"
                            >
                                <UserCircle className="w-4 h-4" />
                                Dashboard Admin
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Keluar
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
