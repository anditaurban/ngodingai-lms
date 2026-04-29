import { NextResponse } from 'next/server';

// Abaikan SSL strict (Berguna jika endpoint Dev Katib menggunakan SSL mandiri)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') || '';

    if (!customerId) {
        return NextResponse.json({ error: 'Customer ID diperlukan' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud';
    
    // Bentuk URL sesuai spesifikasi: {{baseURL}}/table/course_assignment/{customerId}/{page}
    let targetUrl = `${baseUrl}/table/course_assignment/${customerId}/${page}`;
    if (search) {
        targetUrl += `?search=${encodeURIComponent(search)}`;
    }

    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN;

    // ✨ LOGIC RETRY & ANTI-ECONNRESET ✨
    let backendResponse;
    let retries = 3; // Coba maksimal 3 kali jika server putus tiba-tiba

    for (let i = 0; i < retries; i++) {
        try {
            backendResponse = await fetch(targetUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${serviceToken}`,
                // ✨ MANTRA RAHASIA: Memaksa Node.js membuat koneksi TCP baru, mencegah ECONNRESET
                'Connection': 'close' 
              },
              cache: 'no-store' 
            });
            
            // Jika berhasil fetch (tidak putus jaringan), hentikan perulangan (loop)
            break; 
        } catch (err: any) {
            console.warn(`[API Assignments] Percobaan ${i + 1} gagal (Kemungkinan ECONNRESET). Mencoba lagi...`);
            if (i === retries - 1) throw err; // Lempar error jika sudah 3 kali gagal
            
            // Tunggu 1 detik sebelum mencoba lagi
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Pengecekan standar
    if (!backendResponse || !backendResponse.ok) {
        const status = backendResponse?.status || 500;
        console.error(`[API Assignments] Error Katib: Status ${status}`);
        return NextResponse.json(
            { error: `Gagal mengambil data. Status: ${status}` }, 
            { status: status }
        );
    }

    // Tangkap response sebagai teks terlebih dahulu untuk menghindari crash JSON.parse
    const textData = await backendResponse.text();
    
    // Fallback default jika data dari Katib kosong/error
    let data: any = { tableData: [], totalRecords: 0, totalPages: 1, currentPage: Number(page) };
    
    try {
        if (textData) {
            data = JSON.parse(textData);
        }
    } catch (e) {
        console.error(`[API Assignments] Katib tidak membalas JSON yang valid. Teks:`, textData.substring(0, 100));
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("[API Assignments Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}