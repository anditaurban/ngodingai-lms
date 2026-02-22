import { NextResponse } from 'next/server';

// ========================================================================
// KODE AJAIB (MAGIC BULLET): Memaksa Node.js bersikap seperti Postman
// Ini akan mengabaikan error SSL/HTTPS dari server dev.katib.cloud
// yang sering menyebabkan ECONNRESET.
// ========================================================================
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const customerId = resolvedParams.id;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud';
  const targetUrl = `${baseUrl}/detail/sales_course_certificate/${customerId}`;
  const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN || 'DpacnJf3uEQeM7HN'; 

  try {
    const backendResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
        // Samarkan Node.js agar terlihat seperti Browser
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      cache: 'no-store' 
    });

    const responseText = await backendResponse.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`[CRITICAL] Backend Katib TIDAK mengirim JSON. Respons Asli: \n`, responseText);
      return NextResponse.json({ error: 'Sistem Katib merespons dengan format tidak valid.' }, { status: 502 });
    }

    if (!backendResponse.ok) {
       console.error(`[Proxy Cert] Katib menolak. Status: ${backendResponse.status}`);
       return NextResponse.json(
         { error: data.message || `Akses ditolak oleh Katib (Status ${backendResponse.status})` },
         { status: backendResponse.status }
       );
    }

    return NextResponse.json(data);

  } catch (error: any) {
    // Menangkap error spesifik untuk debugging log yang lebih baik
    console.error(`[Proxy Cert] Fetch Gagal [${error.code || error.name}]:`, error.message);
    return NextResponse.json({ error: 'Server internal gagal memproses request ke Backend.' }, { status: 500 });
  }
}