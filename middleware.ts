import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;
  const isPublicPath = path === '/';

  // --- LOGIKA REDIRECT ---
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // --- LOGIKA ROLLING SESSION & SECURITY HEADERS (PENTING!) ---
  const response = NextResponse.next();

  // 1. Rolling Session (Perpanjang token jika user aktif)
  if (token && !isPublicPath) {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    response.cookies.set('token', token, {
      path: '/',
      expires: new Date(Date.now() + oneWeek),
    });
  }

  // 2. SECURITY: Cegah Back Button Cache setelah Logout
  // Ini memerintahkan browser untuk TIDAK menyimpan halaman ini di memori back/forward
  if (!isPublicPath) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

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