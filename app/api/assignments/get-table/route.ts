import { NextResponse } from 'next/server';

// Abaikan SSL strict (Berguna jika endpoint Dev Katib menggunakan SSL mandiri)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const courseId = searchParams.get('courseId'); // ✨ TANGKAP courseId dari frontend
    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') || '';

    if (!customerId) {
        return NextResponse.json({ error: 'Customer ID diperlukan' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud';
    
    // ✨ FIX: Gunakan objek URL agar penyusunan query string lebih dinamis dan aman
    const targetUrl = new URL(`${baseUrl}/table/course_assignment/${customerId}/${page}`);
    
    if (search) {
        targetUrl.searchParams.append('search', search);
    }

    // ✨ FIX: Suntikkan course_id ke backend Katib agar data terfilter spesifik per kelas
    // Catatan: Asumsi backend Katib menerima filter ini via query "?course_id=..."
    if (courseId) {
        targetUrl.searchParams.append('course_id', courseId);
    }

    const finalUrlString = targetUrl.toString();
    const serviceToken = process.env.CUSTOMER_UPDATE_TOKEN;

    // ✨ LOGIC RETRY & ANTI-ECONNRESET DENGAN TIMEOUT ✨
    let backendResponse;
    let retries = 3; 

    for (let i = 0; i < retries; i++) {
        // ✨ PELINDUNG TIMEOUT: Batas 8 Detik per percobaan
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); 

        try {
            backendResponse = await fetch(finalUrlString, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${serviceToken}`
              },
              cache: 'no-store',
              signal: controller.signal // Pasang pelindung
            });
            
            clearTimeout(timeoutId);
            break; // Berhasil! Keluar dari loop
        } catch (err: any) {
            clearTimeout(timeoutId);
            console.warn(`[API Assignments] Percobaan ${i + 1} gagal (Timeout/ECONNRESET). Mencoba lagi...`);
            
            if (i === retries - 1) {
                // Jangan buat server Next.js crash! Kembalikan status 504 dengan anggun
                return NextResponse.json(
                    { error: "Server Katib sedang tidak merespon (Timeout). Silakan muat ulang halaman." }, 
                    { status: 504 }
                );
            }
            
            // Tunggu 1.5 detik sebelum mencoba lagi
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    // Pengecekan standar
    if (!backendResponse || !backendResponse.ok) {
        const status = backendResponse?.status || 500;
        console.error(`[API Assignments] Error Katib: Status ${status}`);
        return NextResponse.json(
            { error: `Gagal mengambil data. Status: ${status}` }, 
            { status: status }
        );
    }

    // Tangkap response sebagai teks terlebih dahulu untuk menghindari crash JSON.parse
    const textData = await backendResponse.text();
    
    // Fallback default jika data dari Katib kosong/error
    let data: any = { tableData: [], totalRecords: 0, totalPages: 1, currentPage: Number(page) };
    
    try {
        if (textData) {
            data = JSON.parse(textData);
            
            // PENGAMANAN EKSTRA: Jika Katib belum mendukung filter course_id, 
            // kita lakukan filter manual di sisi Next.js
            if (courseId && data.tableData && Array.isArray(data.tableData)) {
                data.tableData = data.tableData.filter((item: any) => 
                    String(item.course_id) === String(courseId) || 
                    String(item.course) === String(courseId) // Fallback jika pakai slug
                );
                // Sesuaikan total records setelah difilter manual
                data.totalRecords = data.tableData.length;
            }
        }
    } catch (e) {
        console.error(`[API Assignments] Katib tidak membalas JSON yang valid. Teks:`, textData.substring(0, 100));
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("[API Assignments Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}