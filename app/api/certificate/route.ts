import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    // Tangkap dari Query Parameter
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const customerId = searchParams.get('customerId');

    if (!courseId || !customerId) {
        return NextResponse.json({ error: 'Data kelas dan peserta tidak lengkap.' }, { status: 400 });
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // ✨ Gabungkan ke Endpoint Katib yang baru
    const targetUrl = `${baseUrl}/detail/sales_course_certificate/${courseId}/${customerId}`;
    const serviceToken = process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN;

    const backendResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      cache: 'no-store' 
    });

    const responseText = await backendResponse.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`[CRITICAL] Backend Katib TIDAK mengirim JSON:\n`, responseText);
      return NextResponse.json({ error: 'Sistem Katib merespons dengan format tidak valid.' }, { status: 502 });
    }

    if (!backendResponse.ok) {
       console.error(`[Proxy Cert] Katib menolak. Status: ${backendResponse.status}`);
       return NextResponse.json(
         { error: data?.detail?.message || data?.message || `Akses ditolak oleh Katib (Status ${backendResponse.status})` },
         { status: backendResponse.status }
       );
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error(`[Proxy Cert] Fetch Gagal [${error.code || error.name}]:`, error.message);
    return NextResponse.json({ error: 'Server internal gagal memproses request ke Backend.' }, { status: 500 });
  }
}