import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud';

// ==============================================================
// 1. FUNGSI ADD (POST)
// ==============================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN;

    if (!serviceToken) {
        return NextResponse.json({ error: "Missing Env Token" }, { status: 500 });
    }

    // ✨ SANITASI PAYLOAD: Pastikan tidak ada "undefined" yang bikin server Katib meledak
    const payloadKeKatib = {
        owner_id: body.owner_id,
        customer_id: body.customer_id,
        date: body.date,
        course: body.course || "Ngoding AI", // Wajib ada untuk Katib
        project_title: body.project_title,
        git_repo_url: body.git_repo_url || body.git_repo || "", // Fallback yang aman
        deployment_url: body.deployment_url || "",
        description: body.description || "",
        evaluation_score: body.evaluation_score || 0,
        comment: body.comment || "",
        reviewed: body.reviewed || "no"
    };

    const targetUrl = `${baseUrl}/add/course_assignment`;
    console.log(`[API POST] Payload dikirim ke Katib:`, payloadKeKatib);

    // ✨ PELINDUNG TIMEOUT: Batas 12 detik, mencegah "fetch failed" (ECONNRESET)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); 

    let backendResponse;
    try {
        backendResponse = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceToken}`
          },
          body: JSON.stringify(payloadKeKatib), 
          cache: 'no-store',
          signal: controller.signal // Pasang pelindung
        });
        clearTimeout(timeoutId);
    } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        console.error(`[API POST] Fetch gagal (Timeout/ECONNRESET):`, fetchErr.message);
        return NextResponse.json({ error: "Koneksi ke server pusat terputus (Timeout). Silakan coba lagi." }, { status: 504 });
    }

    const textResponse = await backendResponse.text();
    let data: any = {}; 
    
    try {
        if (textResponse) data = JSON.parse(textResponse);
    } catch (e) {
        console.warn("Katib POST Response is not JSON:", textResponse.substring(0, 100));
    }
    
    console.log(`[API POST] Balasan Asli Katib:`, JSON.stringify(data, null, 2));

    const isKatibFailed = data?.data?.success === false || data?.success === false;

    if (!backendResponse.ok || isKatibFailed) {
       const errorMsg = data?.data?.message || data?.message || "Ditolak oleh server Katib";
       return NextResponse.json({ error: errorMsg }, { status: 400 }); 
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("🔥 Error di POST API:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ==============================================================
// 2. FUNGSI UPDATE & DELETE (PUT)
// ==============================================================
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('id');
    const body = await request.json();
    
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN;

    if (!serviceToken || !assignmentId) {
        return NextResponse.json({ error: "Missing Token or ID" }, { status: 400 });
    }

    // SANITASI PAYLOAD PUT
    const payloadKeKatib = {
        ...body,
        git_repo_url: body.git_repo_url || body.git_repo || "", 
    };
    delete payloadKeKatib.git_repo;

    const isDeleteAction = body.visibility === 'no';
    const targetUrl = isDeleteAction 
        ? `${baseUrl}/delete/course_assignment/${assignmentId}`
        : `${baseUrl}/update/course_assignment/${assignmentId}`;

    console.log(`[API PUT] Aksi: ${isDeleteAction ? 'DELETE' : 'UPDATE'} | Menembak: ${targetUrl}`);

    // ✨ PELINDUNG TIMEOUT 12 DETIK
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let backendResponse;
    try {
        backendResponse = await fetch(targetUrl, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceToken}`
          },
          body: JSON.stringify(payloadKeKatib), 
          cache: 'no-store',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
    } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        console.error(`[API PUT] Fetch gagal (Timeout/ECONNRESET):`, fetchErr.message);
        return NextResponse.json({ error: "Koneksi ke server pusat terputus (Timeout). Silakan coba lagi." }, { status: 504 });
    }

    const textResponse = await backendResponse.text();
    let data: any = {};
    
    try {
        if (textResponse) {
            data = JSON.parse(textResponse);
        }
    } catch (e) {
        console.warn("Katib PUT Response is not JSON. Output:", textResponse.substring(0, 150));
    }

    console.log(`[API PUT] Balasan Asli Katib:`, JSON.stringify(data, null, 2));

    const isKatibFailed = data?.data?.success === false || data?.success === false;

    if (!backendResponse.ok || isKatibFailed) {
       const errorMsg = data?.data?.message || data?.message || `Gagal memproses data`;
       return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("🔥 Error kritis di PUT API:", error);
    return NextResponse.json({ error: "Internal Server Error", detail: error.message }, { status: 500 });
  }
}