import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // --- 1. BYPASS FILE STATIS & CSS (PENTING!) ---
  // Mencegah proxy mencegat file CSS, JS, dan Gambar saat diakses via IP
  if (
    path.startsWith('/_next') ||
    path.startsWith('/assets') ||
    path.startsWith('/api') ||
    path.includes('.') // Mengabaikan semua file berekstensi (.css, .png, .ico, dll)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const isPublicPath = path === '/';

  // --- 2. LOGIKA REDIRECT ---
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // --- 3. LOGIKA ROLLING SESSION & SECURITY HEADERS ---
  const response = NextResponse.next();

  // Rolling Session (Perpanjang token jika user aktif)
  if (token && !isPublicPath) {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    response.cookies.set('token', token, {
      path: '/',
      expires: new Date(Date.now() + oneWeek),
    });
  }

  // SECURITY: Cegah Back Button Cache setelah Logout
  if (!isPublicPath) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

// Konfigurasi Matcher menggunakan Negative Lookahead standar industri
export const config = {
  matcher: [
    /*
     * Mengeksekusi proxy pada semua path, KECUALI yang diawali dengan:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - serta semua file yang memiliki ekstensi/titik (.*\\..*)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};