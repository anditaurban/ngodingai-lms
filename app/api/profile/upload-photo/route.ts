import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('id');

    if (!customerId) return NextResponse.json({ error: "ID Customer tidak ditemukan." }, { status: 400 });

    const targetUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud'}/update/customer_photo/${customerId}`;
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN || 'DpacnJf3uEQeM7HN';

    // 1. Ambil FormData dari request browser (Sudah pakai key 'file')
    const incomingData = await request.formData();
    const uploadedFile = incomingData.get('file') as File;

    if (!uploadedFile) {
      return NextResponse.json({ error: "File tidak ditemukan dalam request." }, { status: 400 });
    }

    // 2. ⚡ TEKNIK PROXY PALING AMAN (NATIVE NODE.JS) ⚡
    // Jangan buat FormData baru. Kita rakit FormData secara manual menggunakan
    // standar Web API yang didukung penuh oleh Vercel/Next.js
    const outgoingData = new FormData();
    
    // Kita baca file sebagai Blob/ArrayBuffer agar tidak korup saat dikirim ulang
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: uploadedFile.type });
    
    // Append ke outgoingData dengan key 'file' dan nama aslinya
    outgoingData.append('file', blob, uploadedFile.name);

    // 3. Tembak ke Backend Katib
    const backendResponse = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${serviceToken}`,
        'Accept': 'application/json',
        // Biarkan browser/fetch yang mengatur Content-Type beserta boundary-nya otomatis
      },
      body: outgoingData,
    });

    // 4. Tangani respons Katib
    const responseText = await backendResponse.text();
    let data;

    try { 
      data = JSON.parse(responseText); 
    } catch (e) { 
      console.error("[Proxy Katib Response Error]:", responseText.substring(0, 200));
      return NextResponse.json({ error: "Respons Katib bukan JSON" }, { status: 502 });
    }

    if (!backendResponse.ok) {
       console.error("[Proxy] Ditolak Katib:", data);
       return NextResponse.json({ error: data.message || "Katib menolak file." }, { status: backendResponse.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("[Proxy 500 Error]:", error);
    return NextResponse.json({ error: `Server Proxy Error: ${error.message}` }, { status: 500 });
  }
}