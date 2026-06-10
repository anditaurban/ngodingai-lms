import { NextResponse } from 'next/server';

// Abaikan SSL strict (Berguna jika endpoint Dev Katib menggunakan SSL mandiri)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const courseId = searchParams.get('courseId'); // Tangkap courseId dari frontend
    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') || '';

    if (!customerId) {
        return NextResponse.json({ error: 'Customer ID diperlukan' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // FORMAT API KATIB: /table/course_assignment/{customer_id}/{page}
    const targetUrl = new URL(`${baseUrl}/table/course_assignment/${customerId}/${page}`);
    
    if (search) {
        targetUrl.searchParams.append('search', search);
    }

    // Suntikkan course_id ke Katib (Sebagai langkah antisipatif jika Katib support query param)
    if (courseId) {
        targetUrl.searchParams.append('course_id', courseId);
    }

    const finalUrlString = targetUrl.toString();
    const serviceToken = process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN;

    // ✨ LOGIC RETRY & ANTI-ECONNRESET DENGAN TIMEOUT
    let backendResponse;
    let retries = 3; 

    for (let i = 0; i < retries; i++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 Detik Timeout

        try {
            backendResponse = await fetch(finalUrlString, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${serviceToken}`
              },
              cache: 'no-store',
              signal: controller.signal 
            });
            
            clearTimeout(timeoutId);
            break; // Berhasil fetch!
        } catch (err: any) {
            clearTimeout(timeoutId);
            console.warn(`[API Assignments] Percobaan ${i + 1} gagal (Timeout). Mencoba lagi...`);
            
            if (i === retries - 1) {
                return NextResponse.json(
                    { error: "Server sedang tidak merespon (Timeout). Silakan muat ulang halaman." }, 
                    { status: 504 }
                );
            }
            
            // Tunggu 1.5 detik sebelum mencoba lagi
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    if (!backendResponse || !backendResponse.ok) {
        const status = backendResponse?.status || 500;
        console.error(`[API Assignments] Error Katib: Status ${status}`);
        return NextResponse.json(
            { error: `Gagal mengambil data. Status: ${status}` }, 
            { status: status }
        );
    }

    const textData = await backendResponse.text();
    let data: any = { tableData: [], totalRecords: 0, totalPages: 1, currentPage: Number(page) };
    
    try {
        if (textData) {
            data = JSON.parse(textData);
            
            // PENGAMANAN EKSTRA: Filter spesifik kelas di sisi Next.js
            if (courseId && data.tableData && Array.isArray(data.tableData)) {
                data.tableData = data.tableData.filter((item: any) => 
                    String(item.course_id) === String(courseId)
                );
                
                // Sesuaikan paginasi UI setelah data difilter manual
                data.totalRecords = data.tableData.length;
                // Asumsi 10 item per halaman untuk memperbaiki UI paginasi
                data.totalPages = Math.max(1, Math.ceil(data.totalRecords / 10)); 
            }
        }
    } catch (e) {
        console.error(`[API Assignments] Katib tidak membalas JSON yang valid.`);
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("[API Assignments Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}