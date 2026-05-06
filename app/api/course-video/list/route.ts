import { NextResponse } from "next/server";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId") || "1";
    const customerId = searchParams.get("customerId"); 

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN;

    if (!baseUrl || !serviceToken) {
      console.error("[API Proxy Error] Missing Environment Variables.");
      return NextResponse.json(
        { message: "Internal Server Error: Konfigurasi Keamanan Tidak Lengkap." }, 
        { status: 500 }
      );
    }

    if (!customerId) {
       return NextResponse.json(
         { message: "Bad Request: Parameter customerId wajib disertakan." },
         { status: 400 }
       );
    }

    const targetUrl = `${baseUrl}/list/course_video/${courseId}/${customerId}`;
    console.log(`[API Proxy] Menembak List Video ke: ${targetUrl}`);

    // ✨ LOGIC RETRY & ANTI-ECONNRESET DENGAN ABORT CONTROLLER ✨
    let backendResponse;
    let retries = 3; 

    for (let i = 0; i < retries; i++) {
        // ✨ PELINDUNG TIMEOUT: Batas 8 Detik
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); 

        try {
            backendResponse = await fetch(targetUrl, {
              method: "GET",
              headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${serviceToken}`,
              },
              cache: "no-store",
              signal: controller.signal // Pasang pelindung
            });
            
            clearTimeout(timeoutId);
            break; 
        } catch (err: any) {
            clearTimeout(timeoutId);
            console.warn(`[API Proxy Video] Percobaan ${i + 1} gagal (Timeout/ECONNRESET).`);
            
            if (i === retries - 1) {
                return NextResponse.json(
                    { message: "Server Katib sedang tidak merespon (Timeout). Silakan muat ulang halaman." }, 
                    { status: 504 }
                );
            }
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    if (!backendResponse || !backendResponse.ok) {
      const status = backendResponse?.status || 500;
      return NextResponse.json(
        { message: `Katib Error: Data tidak ditemukan atau ditolak (Status ${status})` },
        { status: status }
      );
    }

    try {
      const data = await backendResponse.json();
      return NextResponse.json(data, { status: 200 });
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON format from backend" }, { status: 500 });
    }

  } catch (error: any) {
    console.error("[API Proxy Error] Get List Video:", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}