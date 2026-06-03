import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import CoursePlayerDynamic from '@/components/course/CoursePlayerDynamic';
import AppLayout from '@/components/layout/AppLayout';
import { CourseData } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

const mapApiToCourseData = (apiData: any): CourseData => {
  return {
    slug: String(apiData.course_id || apiData.id || "0"),
    title: apiData.title || apiData.batch_name || "Kelas Tanpa Judul",
    description: apiData.description || "Deskripsi kelas belum tersedia.",
    instructor: apiData.author_name || apiData.author || "Instruktur",
    thumbnail: apiData.thumbnail || "",
    modules: apiData.modules || apiData.videos || [], 
    progress: 0, 
    tabs: ['Overview', 'Curriculum', 'Instructor', 'Reviews'] 
    
  } as unknown as CourseData;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";
    const BASE_URL = RAW_BASE_URL.endsWith("/") ? RAW_BASE_URL.slice(0, -1) : RAW_BASE_URL;
    
    // ✨ FIX: Ambil cookie token agar API tidak menolak request (401/403)
    const cookieStore = await cookies();
    const token = cookieStore.get('api_token')?.value || process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN || '';
    
    const res = await fetch(`${BASE_URL}/detail/course/${id}`, { 
      cache: 'no-store',
      // ✨ FIX: Masukkan Headers persis seperti komponen utama
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });

    if (res.ok) {
      const json = await res.json();
      const courseData = json.data || json.detail || json; 
      const mappedCourse = mapApiToCourseData(courseData);

      return {
        // Saya rapikan titlenya agar lebih cantik untuk SEO
        title: `${mappedCourse.title} | Inovasia Digital Academy`, 
        description: mappedCourse.description,
      };
    }
  } catch (e) {
    console.error("Gagal fetch metadata API:", e);
  }
  
  return { title: 'Course Not Found' };
}

export default async function DynamicCourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  let course: CourseData | null = null;
  
  const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";
  const BASE_URL = RAW_BASE_URL.endsWith("/") ? RAW_BASE_URL.slice(0, -1) : RAW_BASE_URL;
  const targetUrl = `${BASE_URL}/detail/course/${id}`; 

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('api_token')?.value || process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN || '';

    console.log(`[SSR Fetch] Mencoba memuat detail kelas: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const apiJson = await response.json();
      const rawData = apiJson.data || apiJson.detail || apiJson;
      course = mapApiToCourseData(rawData);
    } else {
      console.error(`[API Error] URL: ${targetUrl} | Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`[Fatal Fetch Error] URL: ${targetUrl} | Pesan:`, error);
  }

  // ====================================================
  // 1. TANGANI JIKA ERROR / DATA KOSONG (Mencegah Blank)
  // ====================================================
  if (!course) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center w-full min-h-[80vh] text-center p-6">
          <span className="material-symbols-outlined text-[80px] text-slate-300 dark:text-slate-700 mb-4">
            cloud_off
          </span>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">
            Kelas Tidak Ditemukan atau API Bermasalah
          </h2>
          <p className="text-slate-500 max-w-md mb-8">
            Kami gagal mengambil data dari server. Hal ini bisa terjadi karena server sedang sibuk, ID kelas tidak valid, atau sesi Anda telah berakhir.
          </p>
          <Link 
            href="/my-class" 
            className="px-6 py-3 bg-[#00BCD4] text-white rounded-xl font-bold hover:bg-[#00acc1] transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            Kembali ke Daftar Kelas
          </Link>
        </div>
      </AppLayout>
    );
  }

  // ====================================================
  // 2. JIKA SUKSES, RENDER UI KELAS NORMAL
  // ====================================================
  return (
    <AppLayout>
      <div className="flex flex-col w-full min-h-screen">
        
        {/* --- HEADER DENGAN MODERN GAMING GRADIENT & BREADCRUMB --- */}
        <div className="relative bg-linear-to-r from-[#1e40af] via-[#1b2636] to-[#1b2636] text-white p-5 md:p-6 border-b border-white/10 shrink-0 overflow-hidden shadow-md">
          
          <div className="absolute top-0 left-0 w-1/2 h-full bg-linear-to-br from-blue-400/10 to-transparent pointer-events-none blur-xl" />

          <div className="relative flex items-center gap-2 text-[11px] font-bold text-slate-100 uppercase tracking-wider z-10">
            <Link href="/my-class" className="hover:text-[#00BCD4] transition-colors duration-200">
              My Courses
            </Link>
            <span className="material-symbols-outlined text-[14px] opacity-70">chevron_right</span>
            
            {/* ✨ Penambahan tanda tanya (course?.title) untuk menenangkan strict mode TypeScript */}
            <span className="text-[#00BCD4] drop-shadow-[0_0_8px_rgba(0,188,212,0.3)] line-clamp-1 max-w-62.5 sm:max-w-md md:max-w-lg truncate block">
              {course?.title}
            </span>

            {/* Badge Penanda bahwa ini adalah Rute API */}
            <span className="ml-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-2 py-0.5 rounded text-[9px] hidden sm:inline-block">
              API MODE
            </span>
          </div>
        </div>

        {/* Komponen Player murni disuntik dengan data yang sudah di-mapping */}
        <CoursePlayerDynamic courseId={id} courseData={course} />

      </div>
    </AppLayout>
  );
}