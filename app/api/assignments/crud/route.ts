import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// ==============================================================
// 1. FUNGSI ADD (POST)
// ==============================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 🚨 RADAR DEBUGGER: Cetak apa saja yang masuk dari Frontend
    console.log("🚨 [API POST] Data mentah dari Frontend:", body);

    const serviceToken = process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN;
    if (!serviceToken) {
        return NextResponse.json({ error: "Missing Env Token" }, { status: 500 });
    }

    // Tangkap data
    const customerId = Number(body.customer_id);
    const ownerId = Number(body.owner_id);
    const requestedCourseId = Number(body.course_id) || 1; // Fallback ke 1 jika FE gagal mengirim

    // Format Tanggal (YYYY-MM-DD)
    let formattedDate = body.date; 
    if (formattedDate && formattedDate.includes('/')) {
        const parts = formattedDate.split('/'); 
        formattedDate = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : formattedDate;
    } else if (!formattedDate) {
        formattedDate = new Date().toISOString().split('T')[0]; 
    }

    // ✨ PAYLOAD STRICT 8 KOLOM 
    const payloadKeKatib = {
        owner_id: ownerId,
        course_id: requestedCourseId, 
        customer_id: customerId,
        date: formattedDate, 
        project_title: body.project_title,
        git_repo_url: body.git_repo_url || body.git_repo || "", 
        deployment_url: body.deployment_url || "",
        description: body.description || ""
    };

    const targetUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/add/course_assignment`;
    console.log(`🚀 [API POST] Payload SIAP tembak ke Katib:`, payloadKeKatib);

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
          signal: controller.signal
        });
        clearTimeout(timeoutId);
    } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        return NextResponse.json({ error: "Koneksi ke server terputus." }, { status: 504 });
    }

    const textResponse = await backendResponse.text();
    let data: any = {}; 
    
    try {
        if (textResponse) data = JSON.parse(textResponse);
    } catch (e) {
        console.warn("Response Katib bukan JSON:", textResponse.substring(0, 100));
    }
    
    const isKatibFailed = data?.data?.success === false || data?.success === false;

    if (!backendResponse.ok || isKatibFailed) {
       const errorMsg = data?.data?.message || data?.message || "Ditolak oleh Server Katib";
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
    
    const serviceToken = process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN;
    if (!serviceToken || !assignmentId) return NextResponse.json({ error: "Missing Token or ID" }, { status: 400 });

    const isDeleteAction = body.visibility === 'no';
    let payloadKeKatib: any = {};

    if (isDeleteAction) {
        // Jika Hapus, kirim payload visibilitas saja
        payloadKeKatib = { visibility: 'no' };
    } else {
        // ✨ CELAH 1 DITUTUP: Sanitasi ketat untuk UPDATE (Sama persis seperti Add)
        let formattedDate = body.date; 
        if (formattedDate && formattedDate.includes('/')) {
            const parts = formattedDate.split('/'); 
            formattedDate = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : formattedDate;
        }

        payloadKeKatib = {
            owner_id: Number(body.owner_id),
            course_id: Number(body.course_id),
            customer_id: Number(body.customer_id),
            date: formattedDate, 
            project_title: body.project_title,
            git_repo_url: body.git_repo_url || body.git_repo || "", 
            deployment_url: body.deployment_url || "",
            description: body.description || ""
        };
    }

    const targetUrl = isDeleteAction 
        ? `${baseUrl}/delete/course_assignment/${assignmentId}`
        : `${baseUrl}/update/course_assignment/${assignmentId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const backendResponse = await fetch(targetUrl, {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceToken}` },
        body: JSON.stringify(payloadKeKatib), 
        cache: 'no-store',
        signal: controller.signal
    });
    clearTimeout(timeoutId);

    const textResponse = await backendResponse.text();
    let data: any = {}; 
    try { if (textResponse) data = JSON.parse(textResponse); } catch (e) {}

    if (!backendResponse.ok || data?.data?.success === false || data?.success === false) {
       return NextResponse.json({ error: data?.data?.message || data?.message || "Gagal memproses data" }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}