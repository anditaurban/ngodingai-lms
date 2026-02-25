import { NextResponse } from 'next/server';

// Opsional: Abaikan SSL strict (Berguna jika endpoint Dev Katib menggunakan SSL mandiri)
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

    const backendResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${serviceToken}`
      },
      cache: 'no-store' // Wajib agar tabel selalu real-time
    });

    if (!backendResponse.ok) {
        console.error(`[API Assignments] Error Katib: Status ${backendResponse.status}`);
       return NextResponse.json(
           { error: `Gagal mengambil data. Status: ${backendResponse.status}` }, 
           { status: backendResponse.status }
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
        // Jika gagal parse, sistem akan otomatis mereturn fallback data kosong di atas
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("[API Assignments Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}