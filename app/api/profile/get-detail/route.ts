import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('id');

    if (!customerId) return NextResponse.json({ detail: null, message: "ID Kosong" }, { status: 200 });

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud';
    // Pastikan path ini benar sesuai dokumentasi Postman Head Team Anda
    const targetUrl = `${baseUrl}/detail/customer/${customerId}`; 
    
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN || 'DpacnJf3uEQeM7HN';

    const backendResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${serviceToken}`
      },
      cache: 'no-store' 
    });

    const responseText = await backendResponse.text();

    if (!backendResponse.ok) {
       console.error(`[Get Detail Proxy] Katib Error ${backendResponse.status}:`, responseText);
       // Jika 404 (Data Tidak Ditemukan) atau error lain, kita kembalikan status 200 agar frontend tidak panik,
       // tapi isi pesannya jelas.
       return NextResponse.json({ detail: null, message: `Katib Error: ${backendResponse.status}` }, { status: 200 });
    }
    
    try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        console.error("[Get Detail Proxy] Format JSON Katib rusak:", responseText);
        return NextResponse.json({ detail: null, message: "Invalid JSON dari Katib" }, { status: 200 });
    }

  } catch (error: any) {
    console.error("[Get Detail Proxy] Server Error:", error.message);
    return NextResponse.json({ detail: null, message: error.message }, { status: 200 });
  }
}