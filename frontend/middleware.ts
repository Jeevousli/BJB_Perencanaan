import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // ambbil token dari cookiw
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // halaman dilindungi (hanya bisa admin)
    if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/category'))) {

        // tendang ke halaman login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // jika user sudah login tapi mencoba membuka halaman /login kembali

    if (token && pathname === '/login') {
        // Karena kita belum mengurai role di middleware, kita arahkan default ke /admin/dashboard
        // Nanti di client-side kita bisa redirect ulang jika rolenya adalah VIEWER
        return NextResponse.redirect(new URL('/dashboard', request.url));

    }

    //Izinkan request lanjut
    return NextResponse.next();
}

// konfigurasi route mana saja yang wajib diperiksa middleware

export const config = {
    matcher: [
        '/admin/:path*',
        '/dashboard/:path*',
        '/dashboard',
        '/category/:path*',
        '/login'
    ]

}