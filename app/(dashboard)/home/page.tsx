"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans } from "next/font/google";

import { useProfileLogic } from "@/hooks/useProfileLogic";
import { requestJson, buildAuthHeaders } from "@/lib/api";

const googleSansAlt = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";
const BASE_URL = RAW_BASE_URL.endsWith("/") ? RAW_BASE_URL.slice(0, -1) : RAW_BASE_URL;

// ✨ FIX 1: Definisikan Interface CourseLevel agar TypeScript tenang
interface CourseLevel {
  level_id: number;
  level_name: string;
}

interface Course {
  course_id: number;
  category_name: string;
  title: string;
  author_name: string;
  author_photo: string;
  level?: string | number;
  level_id?: string | number;
  level_name?: string;
  price: number;
  total_price: number;
  discount_percent: number;
  thumbnail: string;
}

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
};

const getThumbnailUrl = (filename: string) => {
  if (!filename) return "";
  const cleanFilename = filename.replace(/^\//, "");
  const rawUrl = cleanFilename.startsWith("http")
    ? cleanFilename
    : `${BASE_URL}/thumbnail/course/${cleanFilename}`;
  return `/api/proxy-image?url=${encodeURIComponent(rawUrl)}`;
};

export default function CatalogPage() {
  const { user, loading: isProfileLoading } = useProfileLogic();
  const userName = user?.nama || (user?.name ? user.name.split(" ")[0] : "Pelajar");

  const ownerId = process.env.NEXT_PUBLIC_OWNER_ID || "4409";
  const token = process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN || "";

  // ✨ FIX 2: State Lokal untuk Master Data Level
  const [levels, setLevels] = useState<CourseLevel[]>([]);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [levelFilter, setLevelFilter] = useState("");

  // ✨ FIX 3: Tarik data Master Level langsung saat halaman dimuat
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await requestJson<any>(`${BASE_URL}/table/course_level/${ownerId}/1`, {
          method: "GET",
          headers: buildAuthHeaders(token),
        });
        if (data && data.tableData) {
          setLevels(data.tableData);
        }
      } catch (err) {
        console.error("Gagal memuat master level:", err);
      }
    };
    fetchLevels();
  }, [ownerId, token]);

  const fetchCourses = useCallback(async (page: number, selectedLevel: string = "") => {
    setLoadingCourses(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (selectedLevel) {
        params.append("level_id", selectedLevel); 
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const targetUrl = `${BASE_URL}/table/all_course/${ownerId}/${page}${queryString}`;

      const data = await requestJson<any>(targetUrl, {
        method: "GET",
        headers: buildAuthHeaders(token),
      });

      setCourses(data.tableData || []);
      setTotalPages(data.totalPages || 1);
      setTotalRecords(data.totalRecords || 0);
    } catch (err: any) {
      setError(err.message || "Gagal memuat katalog kelas.");
    } finally {
      setLoadingCourses(false);
    }
  }, [ownerId, token]);

  useEffect(() => {
    fetchCourses(currentPage, levelFilter);
  }, [currentPage, levelFilter, fetchCourses]);

  const handleAddCourse = (courseId: number, courseTitle: string) => {
    alert(`UI Berhasil: Kelas "${courseTitle}" dipilih untuk ditambahkan!`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Greeting Section */}
      <div className="mb-8 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {isProfileLoading ? (
            <div className="animate-pulse h-8 bg-slate-200 dark:bg-slate-800 rounded w-48 mb-2"></div>
          ) : (
            <h2 className={`text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2 ${googleSansAlt.className}`}>
              Halo, {userName}! <span className="wave-animation">👋</span>
            </h2>
          )}
          <p className="text-slate-500 text-sm mt-1">
            Siap untuk mempelajari hal baru hari ini?
          </p>
        </div>
        <div className="hidden sm:flex items-center justify-center p-4 bg-[#00BCD4]/10 rounded-full text-[#00BCD4]">
          <span className="material-symbols-outlined text-3xl">school</span>
        </div>
      </div>

      {/* Header & Filter Area */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight ${googleSansAlt.className}`}>
            Eksplorasi Kelas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Temukan {totalRecords > 0 ? totalRecords : ""} kelas terbaik untuk tingkatkan keahlianmu.
          </p>
        </div>
        
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 dark:border-red-900/30">
          {error}
        </div>
      )}

      {/* Grid Kelas */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {loadingCourses ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="bg-slate-100 dark:bg-[#161616] rounded-2xl h-80 animate-pulse border border-slate-200 dark:border-slate-800"></div>
          ))
        ) : courses.length > 0 ? (
          courses.map((course) => {
            
            // ✨ FIX: Logika Sapu Jagat (Tangkap level_id, atau level, lalu cari namanya)
            const rawLevelId = course.level_id ?? course.level;
            
            // 1. Coba cari nama level dari data master berdasarkan ID
            const matchedLevel = levels.find(l => String(l.level_id) === String(rawLevelId));
            
            // 2. Jika ketemu, pakai namanya. Jika tidak, pakai level_name dari API. Jika tidak ada juga, tampilkan aslinya.
            const displayLevel = matchedLevel?.level_name 
              || course.level_name 
              || (typeof rawLevelId === 'string' && isNaN(Number(rawLevelId)) ? rawLevelId : null)
              || "Beginner"; // Fallback akhir jika benar-benar kosong

            return (
              <div
                key={course.course_id}
                className="group bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Thumbnail Area */}
                <Link href={`/course/${course.course_id}`} className="relative w-full h-48 bg-slate-100 dark:bg-slate-800 block overflow-hidden">
                  {course.thumbnail ? (
                    <Image
                      src={getThumbnailUrl(course.thumbnail)}
                      alt={course.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#00BCD4]/10 to-[#00BCD4]/30 dark:from-cyan-900/40 dark:to-cyan-800/40 group-hover:scale-105 transition-transform duration-500">
                      <span className={`text-4xl font-black text-[#00BCD4] dark:text-cyan-400 uppercase tracking-widest ${googleSansAlt.className}`}>
                        {course.title ? (course.title.split(' ').length > 1 ? course.title.split(' ')[0][0] + course.title.split(' ')[1][0] : course.title.substring(0, 2)).toUpperCase() : 'C'}
                      </span>
                    </div>
                  )}

                  {course.discount_percent > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-md shadow-sm">
                      {course.discount_percent}% OFF
                    </div>
                  )}
                  
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    
                    {displayLevel}
                  </div>
                </Link>

                <div className="p-5 flex flex-col grow">
                  <Link href={`/course/${course.course_id}`} className="block mb-4">
                    <div className="mb-2 inline-block">
                      <span className="text-[9px] sm:text-[10px] font-bold text-[#00BCD4] bg-[#00BCD4]/10 px-1.5 py-1 sm:px-2 rounded uppercase mb-2 inline-block truncate max-w-full">
                        {course.category_name || "General"}
                      </span>
                    </div>
                    <h3 className={`text-sm sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 ${googleSansAlt.className}`}>
                      {course.title}
                    </h3>
                  </Link>

                  <div className="grow"></div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                      {course.author_photo ? (
                        <Image src={course.author_photo} alt={course.author_name} fill className="object-cover" unoptimized />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          {course.author_name ? course.author_name.charAt(0).toUpperCase() : "A"}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Instructor</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                        {course.author_name || "Anonymous"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                    <div className="flex flex-col">
                      {course.price > course.total_price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatRupiah(course.price)}
                        </span>
                      )}
                      <span className={`text-base sm:text-xl font-extrabold ${course.total_price === 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                        {course.total_price === 0 ? "GRATIS" : formatRupiah(course.total_price)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddCourse(course.course_id, course.title)}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_circle</span>
                      Pilih Kelas
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500">
            Tidak ada kelas yang sesuai dengan filter Anda.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loadingCourses && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-50 flex items-center hover:bg-slate-50 dark:hover:bg-[#161616] text-slate-700 dark:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Halaman <span className="font-bold">{currentPage}</span> dari <span className="font-bold">{totalPages}</span>
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-50 flex items-center hover:bg-slate-50 dark:hover:bg-[#161616] text-slate-700 dark:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}