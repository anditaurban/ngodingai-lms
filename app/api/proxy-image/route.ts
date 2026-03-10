import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new NextResponse('URL gambar tidak disertakan', { status: 400 });
    }

    // ✨ STRICT MODE: Wajib pakai .env (Tanpa Hardcode)
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN;

    if (!serviceToken) {
       console.error("[Proxy Image Error] CUSTOMER_UPDATE_TOKEN hilang di .env");
       return new NextResponse('Server Configuration Error', { status: 500 });
    }
    
    // ✨ OPTIMASI 1: Header Penyamaran + LANGSUNG BAWA TOKEN
    // Kita hapus proses "coba-coba tanpa token" yang memakan waktu 2.5 detik!
    const headers: any = {
        'Accept': 'image/webp,image/apng,image/jpeg,image/*,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Authorization': `Bearer ${serviceToken}`
    };

    // Langsung tembak 1 kali secara akurat!
    const backendResponse = await fetch(imageUrl, {
        method: 'GET',
        headers,
        // (Kita biarkan Next.js default caching bekerja di sini)
    });

    if (!backendResponse.ok) {
        console.error(`[Proxy Image Error] Gagal menarik gambar: ${backendResponse.status}`);
        return new NextResponse('Gagal menarik gambar dari Katib', { status: backendResponse.status });
    }

    const buffer = await backendResponse.arrayBuffer();

    // ✨ OPTIMASI 2: Cache Control 1 Hari
    // Memaksa browser menyimpan gambar ini seharian agar perpindahan halaman jadi secepat kilat (0 detik)
    return new NextResponse(buffer, {
        status: 200,
        headers: {
            'Content-Type': backendResponse.headers.get('Content-Type') || 'image/webp',
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
        },
    });
  } catch (error: any) {
    console.error('[Proxy Image Fatal Error]:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}