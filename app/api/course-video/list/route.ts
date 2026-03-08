import { NextResponse } from "next/server";

// Mengabaikan error SSL lokal jika sertifikat dev.katib.cloud bermasalah
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId") || "1";

    // ✨ STRICT MODE: Hanya mengambil dari Environment Variables (.env)
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN;

    // 🛡️ Fail-Safe: Jika env lupa disetting di Vercel/Server, langsung tolak!
    if (!baseUrl || !serviceToken) {
      console.error("[API Proxy Error] Missing Environment Variables (Base URL atau Token).");
      return NextResponse.json(
        { message: "Internal Server Error: Konfigurasi Keamanan Tidak Lengkap." }, 
        { status: 500 }
      );
    }

    const targetUrl = `${baseUrl}/list/course_video/${courseId}`;
    console.log(`[API Proxy] Menembak List Video ke: ${targetUrl}`);

    const backendResponse = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${serviceToken}`,
      },
      cache: "no-store", // Selalu ambil data terbaru (dinamis)
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
    console.error("[API Proxy Error] Get List Video:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}