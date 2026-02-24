import { NextResponse } from 'next/server';

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
    
    // Bentuk URL sesuai spesifikasi: {{baseURL}}/table/course_assignment/32455/{{currentPage}}?search=...
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
      cache: 'no-store'
    });

    if (!backendResponse.ok) {
       return NextResponse.json(
           { error: `Gagal mengambil data. Status: ${backendResponse.status}` }, 
           { status: backendResponse.status }
       );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("[Proxy Assignment Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}