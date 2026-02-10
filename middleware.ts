import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 1. Ambil token dari cookies
  const token = request.cookies.get('token')?.value;

  // Definisi Halaman Public (Login)
  const isPublicPath = path === '/';

  // --- LOGIKA REDIRECT (Sama seperti sebelumnya) ---
  
  // Jika User SUDAH Login tapi buka halaman Login -> Lempar ke Dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika User BELUM Login tapi buka halaman Private -> Lempar ke Login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // --- FITUR BARU: ROLLING SESSION (PERPANJANG OTOMATIS) ---
  
  // Siapkan respons "Lanjut" (Allow)
  const response = NextResponse.next();

  // Jika user punya token (sedang login) dan sedang akses halaman private
  if (token && !isPublicPath) {
    // Kita perbarui masa berlaku Cookie-nya jadi 7 hari LAGI dari DETIK INI
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 hari dalam milidetik
    
    response.cookies.set('token', token, {
      path: '/',
      expires: new Date(Date.now() + oneWeek), // Reset timer kiamat
      // Opsional: Tambahkan secure flag untuk produksi
      // secure: process.env.NODE_ENV === 'production',
      // httpOnly: false, // Biar bisa dibaca client-side js-cookie jika perlu
    });
  }

  return response;
}

// Konfigurasi halaman mana saja yang dijaga
export const config = {
  matcher: [
    '/',              
    '/dashboard',     
    '/my-class',      
    '/profile',       
    '/course/:path*', 
    '/schedule',      
    '/assignments'    
  ],
};