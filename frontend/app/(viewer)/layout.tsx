import ViewerNavbar from "@/components/layout/ViewerNavbar";

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
            {/* Navbar selalu ada di atas */}
            <ViewerNavbar />

            {/* Konten Halaman (Dashboard, Kategori, dll) akan dirender di sini */}
            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </div>
    );
}
