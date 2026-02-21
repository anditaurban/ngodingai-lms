import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. Ambil ID Customer dari URL (contoh: /api/certificate/32557)
  const customerId = params.id;
  
  // 2. Siapkan URL Backend
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud';
  const targetUrl = `${baseUrl}/detail/sales_course_certificate/${customerId}`;
  
  // 3. Ambil Token Rahasia dari .env.local (Sama dengan token Update Profile)
  const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN || 'DpacnJf3uEQeM7HN'; 

  try {
    // 4. Tembak API Backend Katib secara diam-diam dari Server Next.js
    const backendResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // KUNCI SUKSES: Masukkan Token Rahasia di sini!
        'Authorization': `Bearer ${serviceToken}` 
      },
      // Matikan cache agar data sertifikat selalu terbaru
      cache: 'no-store' 
    });

    // 5. Tangkap Response
    const data = await backendResponse.json();

    if (!backendResponse.ok) {
       console.error(`[Proxy Cert] Backend Error ${backendResponse.status}:`, data);
       return NextResponse.json(
         { error: data.message || `Backend merespons dengan status ${backendResponse.status}` },
         { status: backendResponse.status }
       );
    }

    // 6. Kembalikan data sukses ke Frontend (CertificatesTab.tsx)
    return NextResponse.json(data);

  } catch (error) {
    console.error("[Proxy Cert] Gagal menghubungi backend:", error);
    return NextResponse.json({ error: 'Gagal memproses permintaan sertifikat' }, { status: 500 });
  }
}