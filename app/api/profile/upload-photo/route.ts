import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('id');

    if (!customerId) {
      return NextResponse.json({ error: "ID Customer tidak ditemukan di URL." }, { status: 400 });
    }

    // 1. Tangkap koper dari Frontend
    const incomingFormData = await request.formData();
    
    // ✨ Karena di hook Anda pakai: formData.append('file', file), 
    // maka kita tangkap menggunakan key 'file' di sini! ✨
    const file = incomingFormData.get('file') as File | null; 

    if (!file) {
      return NextResponse.json({ error: "File gambar tidak ditemukan. Pastikan key formData adalah 'file'." }, { status: 400 });
    }

    // 2. Rekonstruksi koper untuk Katib
    const outgoingFormData = new FormData();
    outgoingFormData.append('file', file, file.name); // Kirim ke Katib dengan key 'file' dan sertakan nama filenya

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud';
    const targetUrl = `${baseUrl}/update/customer_photo/${customerId}`;
    
    // Pastikan token ini benar (dari .env)
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN || 'DpacnJf3uEQeM7HN';

    // 3. Tembak ke Katib menggunakan PUT
    const backendResponse = await fetch(targetUrl, {
      method: 'PUT', 
      headers: {
        'Authorization': `Bearer ${serviceToken}`,
        'Accept': 'application/json',
      },
      body: outgoingFormData,
      cache: 'no-store'
    });

    const responseText = await backendResponse.text();
    let data;

    if (!responseText) {
        if (backendResponse.ok) return NextResponse.json({ success: true });
        return NextResponse.json({ error: 'Server Katib tidak merespons.' }, { status: 502 });
    }

    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("[Upload Proxy] Crash Katib (HTML Error):", responseText.substring(0, 300));
      return NextResponse.json({ error: `Backend menolak pemrosesan gambar. Status: ${backendResponse.status}` }, { status: 502 });
    }

    if (!backendResponse.ok) {
       return NextResponse.json({ error: data.message || data.error || "Gagal mengunggah foto ke Katib" }, { status: backendResponse.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("[Upload Proxy] Error Internal:", error.message);
    return NextResponse.json({ error: `Server internal gagal: ${error.message}` }, { status: 500 });
  }
}