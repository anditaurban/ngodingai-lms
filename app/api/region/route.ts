import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// API Route ini berjalan di SERVER. Aman dari intipan browser.
export async function GET(request: NextRequest) {
  try {
    // 1. Ambil parameter pencarian dari URL frontend
    // Contoh: /api/region?keyword=bogor
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');

    if (!keyword) {
      return NextResponse.json({ message: 'Keyword is required' }, { status: 400 });
    }

    // 2. Ambil Konfigurasi Rahasia dari Environment
    const baseUrl = process.env.REGION_API_URL;
    const token = process.env.REGION_SERVICE_TOKEN;
    const ownerId = process.env.NEXT_PUBLIC_APP_ID; // Owner ID boleh publik

    if (!baseUrl || !token) {
      return NextResponse.json({ message: 'Server misconfiguration' }, { status: 500 });
    }

    // 3. Panggil API Eksternal (Server to Server)
    // URL Asli: https://region.katib.cloud/table/region/4409/1?search=...
    const targetUrl = `${baseUrl}/table/region/${ownerId}/1?search=${encodeURIComponent(keyword)}`;

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Token disisipkan di sini, aman di server
      },
    });

    const data = await res.json();

    // 4. Kembalikan hasil ke Frontend
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Proxy Region Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}