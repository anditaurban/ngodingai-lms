import { NextResponse } from 'next/server';

// KODE AJAIB: Mencegah ECONNRESET (Sama seperti di Sertifikat)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    // 1. Tangkap keyword dari URL UI React Anda
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    
    // 2. Siapkan URL Backend Katib
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud';
    
    // Asumsi ownerId = 1 seperti di log terminal Anda. 
    // Sesuaikan jika ini harus dinamis.
    const ownerId = "1"; 
    const targetUrl = `${baseUrl}/table/region/${ownerId}/1?search=${encodeURIComponent(keyword)}`;

    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN || 'DpacnJf3uEQeM7HN';

    // 3. Eksekusi Fetch ke Backend
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
        // Samarkan sebagai Browser agar tidak diblokir Firewall
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
      },
      cache: 'no-store'
    });

    const responseText = await res.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("[Region Proxy] Gagal parse JSON dari Katib:", responseText);
      return NextResponse.json({ error: 'Sistem Backend Katib merespons dengan format salah.' }, { status: 502 });
    }

    if (!res.ok) {
       return NextResponse.json({ error: data.message || 'Gagal mengambil data' }, { status: res.status });
    }

    // ✨ MODIFIKASI DI SINI ✨
    // Kita ekstrak langsung array "tableData"-nya agar UI React bisa langsung melakukan .map()
    // Jika tableData kosong/tidak ada, kita kembalikan array kosong [] agar tidak error
    const regionArray = data.tableData || [];
    
    return NextResponse.json(regionArray);

  } catch (error: any) {
    console.error("[Region Proxy] Error Koneksi:", error.message);
    return NextResponse.json({ error: 'Server internal gagal memproses request.' }, { status: 500 });
  }
}