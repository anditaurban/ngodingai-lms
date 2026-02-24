import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new NextResponse('URL gambar tidak disertakan', { status: 400 });
    }

    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN || 'DpacnJf3uEQeM7HN';
    
    // Header standar untuk menyamar sebagai browser biasa
    const headers: any = {
        'Accept': 'image/webp,image/apng,image/jpeg,image/*,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    // 1. Percobaan Pertama: TANPA TOKEN (Karena Katib 401 saat kita kirim token ke file statis)
    let backendResponse = await fetch(imageUrl, {
        method: 'GET',
        headers,
        cache: 'no-store'
    });

    // 2. Percobaan Kedua (Auto-Fallback): Jika Katib MENUNTUT token, kita coba suntikkan token
    if (backendResponse.status === 401) {
        console.warn("[Proxy Image] 401 Tanpa Token, Mencoba ulang dengan Token...");
        headers['Authorization'] = `Bearer ${serviceToken}`;
        backendResponse = await fetch(imageUrl, {
            method: 'GET',
            headers,
            cache: 'no-store'
        });
    }

    if (!backendResponse.ok) {
        console.error(`[Proxy Image] Gagal menarik gambar: ${backendResponse.status}`);
        return new NextResponse('Gagal menarik gambar dari Katib', { status: backendResponse.status });
    }

    const buffer = await backendResponse.arrayBuffer();

    return new NextResponse(buffer, {
        status: 200,
        headers: {
            'Content-Type': backendResponse.headers.get('Content-Type') || 'image/webp',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
    });
  } catch (error: any) {
    console.error('[Proxy Image Error]:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}