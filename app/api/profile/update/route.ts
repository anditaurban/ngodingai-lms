import { NextResponse } from 'next/server';

// Mencegah ECONNRESET / SSL Error di localhost
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// ✨ FUNGSI UTAMA (Kita namakan UpdateHandler) ✨
async function UpdateHandler(request: Request) {
  try {
    const bodyData = await request.json(); 
    
    if (!bodyData.customer_id) {
        return NextResponse.json({ error: "ID Customer tidak ditemukan. Gagal update." }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud';
    
    // Sesuaikan dengan endpoint Postman Anda
    const targetUrl = `${baseUrl}/update/customer/${bodyData.customer_id}`; 
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN || 'DpacnJf3uEQeM7HN';

    // Eksekusi ke Katib
    const backendResponse = await fetch(targetUrl, {
      method: 'PUT', // Biasanya API Katib tetap butuh PUT, kita standarkan di sini
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify(bodyData), 
      cache: 'no-store'
    });

    const responseText = await backendResponse.text();
    let data;
    
    // Validasi agar terhindar dari "Unexpected end of JSON input"
    if (!responseText) {
       console.error("[Profile Update Proxy] Katib merespons dengan body KOSONG.");
       return NextResponse.json({ error: 'Server tidak mengembalikan data.' }, { status: 502 });
    }

    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("[Profile Update Proxy] Gagal parse JSON dari Katib:", responseText);
      return NextResponse.json({ error: 'Format data dari server salah.' }, { status: 502 });
    }
    
    if (!backendResponse.ok) {
       console.error(`[Profile Update Proxy] Gagal. Status: ${backendResponse.status}`, data);
       return NextResponse.json({ error: data.message || "Gagal menyimpan perubahan profil" }, { status: backendResponse.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("[Profile Update Proxy] Error Internal/Koneksi:", error.message);
    return NextResponse.json({ error: 'Server internal gagal memproses request update.' }, { status: 500 });
  }
}

// ============================================================================
// ✨ EXPORT MULTIPLE METHODS ✨
// Sekarang API ini mau menerima dikirim pakai POST ataupun PUT dari UI Anda!
// ============================================================================
export async function POST(request: Request) {
  return UpdateHandler(request);
}

export async function PUT(request: Request) {
  return UpdateHandler(request);
}