import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('id');

    if (!customerId) return NextResponse.json({ detail: null }, { status: 200 });

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud';
    const targetUrl = `${baseUrl}/detail/customer/${customerId}`;
    
    // ✨ SECURITY UPDATE: Wajib dari .env, hapus fallback hardcoded!
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN;
    if (!serviceToken) {
        console.error("CRITICAL SECURITY ALERT: CUSTOMER_UPDATE_TOKEN missing in .env");
        return NextResponse.json({ detail: null, message: "Missing Env Token" }, { status: 500 });
    }

    const backendResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${serviceToken}` 
      },
      cache: 'no-store' 
    });

    if (!backendResponse.ok) {
       return NextResponse.json({ detail: null, message: "Silent Katib Error" }, { status: 200 });
    }

    const responseText = await backendResponse.text();
    
    try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        return NextResponse.json({ detail: null, message: "Invalid JSON" }, { status: 200 });
    }

  } catch (error: any) {
    return NextResponse.json({ detail: null, message: "Server Error" }, { status: 200 });
  }
}