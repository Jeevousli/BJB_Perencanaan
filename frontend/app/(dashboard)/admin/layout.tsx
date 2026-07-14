'use client';

import { useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-[#f5f5f7] min-h-screen font-sans">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="flex-1 p-4 md:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
