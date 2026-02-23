import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new NextResponse('URL gambar tidak disertakan', { status: 400 });
    }

    // ✨ FIX 401: KITA TIDAK MENGIRIMKAN TOKEN! ✨
    // File .webp di Katib adalah file statis publik (hanya bermasalah di SSL-nya saja).
    // Mengirimkan Header Authorization ke file statis justru membuat Katib memblokirnya (401).
    const backendResponse = await fetch(imageUrl, {
        method: 'GET',
        headers: {
            'Accept': 'image/webp,image/apng,image/jpeg,image/*,*/*;q=0.8',
            // Dihapus: 'Authorization': `Bearer ...`
        },
        cache: 'no-store'
    });

    if (!backendResponse.ok) {
        console.warn(`[Proxy Image] Katib menolak akses gambar statis: ${backendResponse.status}`);
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