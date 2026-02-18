import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');

    if (!keyword) {
      return NextResponse.json({ message: 'Keyword kosong' }, { status: 400 });
    }

    // --- MENGAMBIL VARIABLE DARI .ENV.LOCAL ---
    // Pastikan nama variabelnya SAMA PERSIS dengan yang Anda tulis di .env
    const baseUrl = process.env.REGION_API_URL;         // https://region.katib.cloud
    const token = process.env.REGION_SERVICE_TOKEN;     // 0f4d...
    const ownerId = process.env.NEXT_PUBLIC_OWNER_ID;   // 4409

    // Validasi Config
    if (!baseUrl || !token) {
      console.error("ENV Error: REGION_API_URL atau REGION_SERVICE_TOKEN belum dibaca.");
      return NextResponse.json({ message: 'Server Configuration Error' }, { status: 500 });
    }

    // Panggil API Region (Server to Server)
    const targetUrl = `${baseUrl}/table/region/${ownerId}/1?search=${encodeURIComponent(keyword)}`;

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Token rahasia disisipkan di sini
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Proxy Region Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}