"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// 1. IMPORT HOOK DAN HELPER API ANDA
import { useProfileLogic } from "@/hooks/useProfileLogic";
import { requestJson, BASE_URL, buildAuthHeaders } from "@/lib/api";

interface Course {
  course_id: number;
  category_name: string;
  title: string;
  author_name: string;
  author_photo: string;
  level: string;
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

// Pembungkus Gambar dengan unoptimized untuk mencegah proxy error Next.js
const SafeImage = ({ src, fallbackSrc, alt, className, sizes, fill }: any) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  return (
    <Image
      src={imgSrc}
      // ✨ PERBAIKAN: Berikan fallback string 'Thumbnail' jika alt dari API kosong
      alt={alt || "Thumbnail"}
      fill={fill}
      sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
      className={className}
      unoptimized // Mencegah 401/400 dari Next.js Image Optimizer
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

// Helper untuk merakit URL Thumbnail
const getThumbnailUrl = (filename: string) => {
  if (!filename) return "";

  // Bersihkan karakter '/' di awal jika tidak sengaja terbawa dari API
  const cleanFilename = filename.replace(/^\//, "");

  // Rakit URL asli persis seperti arahan Anda
  const rawUrl = cleanFilename.startsWith("http")
    ? cleanFilename
    : `${BASE_URL}/thumbnail/course/${cleanFilename}`;

  // PENTING: Karena server Katib mereturn 401 (butuh token),
  // kita wajib melewatkan URL ini ke file proxy Anda agar token disematkan di backend.
  return `/api/proxy-image?url=${encodeURIComponent(rawUrl)}`;
};

export default function CatalogPage() {
  // 2. KONSUMSI DATA PROFILE
  const { user, loading: isProfileLoading } = useProfileLogic();
  const userName =
    user?.nama || (user?.name ? user.name.split(" ")[0] : "Pelajar");

  // 3. STATE KURSUS
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // 4. FETCH KURSUS (Langsung ke Katib Backend pakai helper lib/api.ts)
  const fetchCourses = useCallback(async (page: number) => {
    setLoadingCourses(true);
    setError(null);

    const ownerId = process.env.NEXT_PUBLIC_OWNER_ID || "4409";
    const token = process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN || "";

    try {
      const targetUrl = `${BASE_URL}/table/all_course/${ownerId}/${page}`;

      // Menggunakan Helper requestJson yang sudah matang
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
  }, []);

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage, fetchCourses]);

  const handleAddCourse = (courseId: number, courseTitle: string) => {
    alert(`UI Berhasil: Kelas "${courseTitle}" dipilih untuk ditambahkan!`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Greeting Section (Diperbarui dengan Shape Card) */}
      <div className="mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {isProfileLoading ? (
            <div className="animate-pulse h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2"></div>
          ) : (
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              Halo, {userName}! <span className="wave-animation">👋</span>
            </h2>
          )}
          <p className="text-slate-500 text-sm mt-1">
            Siap untuk mempelajari hal baru hari ini?
          </p>
        </div>

        {/* Ikon Dekoratif di sebelah kanan (Sembunyi di mobile super kecil) */}
        <div className="hidden sm:flex items-center justify-center p-4 bg-primary/10 rounded-full text-primary">
          <span className="material-symbols-outlined text-3xl">school</span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Eksplorasi Kelas
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Temukan {totalRecords > 0 ? totalRecords : ""} kelas terbaik untuk
          tingkatkan keahlianmu.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Grid Kelas */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {loadingCourses ? (
          // Skeleton Loader
          Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl h-80 animate-pulse border border-slate-200 dark:border-slate-700"
            ></div>
          ))
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.course_id}
              className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              {/* Thumbnail Area */}
              <Link
                href={`/course/${course.course_id}`}
                className="relative w-full h-48 bg-slate-100 block"
              >
                <SafeImage
                  // ✨ PERBAIKAN: Gunakan fungsi getThumbnailUrl di sini
                  src={getThumbnailUrl(course.thumbnail)}
                  fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=e2e8f0`}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {course.discount_percent > 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-md shadow-sm">
                    {course.discount_percent}% OFF
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">
                    signal_cellular_alt
                  </span>{" "}
                  {course.level || "All Levels"}
                </div>
              </Link>

              <div className="p-5 flex flex-col grow">
                <Link
                  href={`/course/${course.course_id}`}
                  className="block mb-4"
                >
                  <div className="mb-2 inline-block">
                    {/* Sebelum: className="text-[10px]..." */}
                    <span className="text-[9px] sm:text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-1 sm:px-2 rounded uppercase mb-2 inline-block truncate max-w-full">
                      {course.category_name || "General"}
                    </span>
                  </div>
                  {/* Sebelum: className="text-lg font-bold..." */}
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                    {course.title}
                  </h3>
                </Link>

                <div className="grow"></div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <SafeImage
                      src={course.author_photo}
                      fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.author_name || "A")}&background=random`}
                      alt={course.author_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Instructor
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {course.author_name || "Anonymous"}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-3">
                  <div className="flex flex-col">
                    {course.price > course.total_price && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatRupiah(course.price)}
                      </span>
                    )}
                    {/* Sebelum: className="text-xl font-extrabold..." */}
                    <span className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      {course.total_price === 0
                        ? "GRATIS"
                        : formatRupiah(course.total_price)}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleAddCourse(course.course_id, course.title)
                    }
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add_circle
                    </span>{" "}
                    Pilih Kelas
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500">
            Tidak ada kelas yang tersedia saat ini.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loadingCourses && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border disabled:opacity-50 flex items-center"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="text-sm font-medium">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border disabled:opacity-50 flex items-center"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
