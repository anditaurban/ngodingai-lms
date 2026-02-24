import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud';

// 1. FUNGSI ADD (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN;

    if (!serviceToken) {
        return NextResponse.json({ error: "Missing Env Token" }, { status: 500 });
    }

    // Endpoint asumsi Katib untuk Create Assignment
    const targetUrl = `${baseUrl}/course_assignment`;

    const backendResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceToken}`
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    const data = await backendResponse.json();
    
    if (!backendResponse.ok) {
       return NextResponse.json({ error: data.message || "Gagal menambah data" }, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 2. FUNGSI UPDATE & SOFT DELETE (PUT)
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('id');
    const body = await request.json();
    
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN;

    if (!serviceToken || !assignmentId) {
        return NextResponse.json({ error: "Missing Token or ID" }, { status: 400 });
    }

    // Endpoint asumsi Katib untuk Update (Menggunakan ID)
    const targetUrl = `${baseUrl}/course_assignment/${assignmentId}`;

    const backendResponse = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceToken}`
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
       return NextResponse.json({ error: data.message || "Gagal mengubah data" }, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}