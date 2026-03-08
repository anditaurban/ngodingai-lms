import { NextResponse } from "next/server";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get("batchId");

    if (!batchId) {
      return NextResponse.json({ message: "Batch ID parameter is required." }, { status: 400 });
    }

    // ✨ STRICT MODE: Menggunakan Environment Variables
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN;

    // 🛡️ Fail-Safe Keamanan
    if (!baseUrl || !serviceToken) {
      console.error("[API Proxy Error] Missing Environment Variables.");
      return NextResponse.json(
        { message: "Internal Server Error: Konfigurasi Keamanan Tidak Lengkap." }, 
        { status: 500 }
      );
    }

    const targetUrl = `${baseUrl}/detail/course_video/${batchId}`;
    console.log(`[API Proxy] Menembak Detail Video ke: ${targetUrl}`);

    const backendResponse = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${serviceToken}`,
      },
      cache: "no-store",
    });

    const responseText = await backendResponse.text();

    if (!backendResponse.ok) {
      console.error(`[Katib Error ${backendResponse.status}]:`, responseText);
      return NextResponse.json(
        { message: `Katib Error: ${backendResponse.status}` },
        { status: backendResponse.status }
      );
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data, { status: 200 });
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON format from backend" }, { status: 500 });
    }

  } catch (error: any) {
    console.error("[API Proxy Error] Get Detail Video:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}