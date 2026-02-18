import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_id, ...payload } = body;

    if (!customer_id) {
      return NextResponse.json({ message: 'Customer ID is required' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const token = process.env.CUSTOMER_UPDATE_TOKEN;

    if (!baseUrl || !token) {
      return NextResponse.json({ message: 'Server Config Error' }, { status: 500 });
    }

    const targetUrl = `${baseUrl}/update/customer/${customer_id}`;

    console.log(`[Proxy] Updating: ${targetUrl}`);
    console.log(`[Proxy] Payload:`, payload);

    const response = await fetch(targetUrl, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    const status = response.status;
    console.log(`[Proxy] Status: ${status}`);

    if (responseText.trim().startsWith('<')) {
      console.error("[Proxy Error] Backend HTML:", responseText.substring(0, 100));
      return NextResponse.json({ 
        message: `Backend Error (${status}). Method might be wrong.` 
      }, { status: 500 });
    }

    const data = JSON.parse(responseText);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('[Proxy Critical Error]:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}