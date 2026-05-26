"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";

import coursesData from "@/data/courses.json";
import { requestJson, buildAuthHeaders } from "@/lib/api"; // Pastikan path ini sesuai dengan project Anda

// ✨ DEFINISI BASE_URL
const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";
const BASE_URL = RAW_BASE_URL.endsWith("/")
  ? RAW_BASE_URL.slice(0, -1)
  : RAW_BASE_URL;


// Helper untuk mereplace judul kelas (Statis)
const getDisplayTitle = (title: string) => {
  if (title.includes("NgodingAI: Master GenAI & LLMs")) {
    return "NgodingAI: Belajar ngoding pakai AI, bangun project website dalam waktu singkat";
  }
  return title;
};

// Helper URL Thumbnail (Sesuai dengan proxy Anda)
const getDynamicThumbnailUrl = (filename: string) => {
  if (!filename) return "";
  const cleanFilename = filename.replace(/^\//, "");
  const rawUrl = cleanFilename.startsWith("http")
    ? cleanFilename
    : `${BASE_URL}/thumbnail/course/${cleanFilename}`;

  // Menggunakan proxy image sesuai arahan kode Anda
  return `/api/proxy-image?url=${encodeURIComponent(rawUrl)}`;
};

interface DynamicCourse {
  course_id: number;
  title: string;
  author_name: string;
  author: string;
  thumbnail: string;
  slug?: string;
}

export default function MyClassPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // State untuk API Dinamis
  const [dynamicCourses, setDynamicCourses] = useState<DynamicCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ==========================================
  // FETCH DATA API DINAMIS
  // ==========================================
  const fetchDynamicCourses = useCallback(async (page: number) => {
    setLoadingCourses(true);
    setError(null);

    const ownerId = process.env.NEXT_PUBLIC_OWNER_ID || "4409";
    // Gunakan CUSTOMER_UPDATE_TOKEN dari env, jika tidak ada fallback ke api_token biasa
    const token =
      process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN ||
      Cookies.get("api_token") ||
      "";

    try {
      // Menggunakan endpoint all_course sesuai referensi Anda
      const targetUrl = `${BASE_URL}/table/all_course/${ownerId}/${page}`;

      const data = await requestJson<any>(targetUrl, {
        method: "GET",
        headers: buildAuthHeaders(token),
      });

      setDynamicCourses(data.tableData || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error("Gagal mengambil data kelas dinamis:", err);
      setError(err.message || "Gagal memuat data kelas API.");
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    fetchDynamicCourses(currentPage);
  }, [currentPage, fetchDynamicCourses]);

  // ==========================================
  // LOGIKA FILTERING (STATIS & DINAMIS)
  // ==========================================
  const filteredStaticCourses = coursesData.filter((course) => {
    const displayTitle = getDisplayTitle(course.title);
    const matchesSearch =
      displayTitle.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase());

    let category = "All";
    if (course.slug.includes("ngoding") || course.slug.includes("ai"))
      category = "AI";

    const matchesFilter = filter === "All" || category === filter;
    return matchesSearch && matchesFilter;
  });

  const filteredDynamicCourses = dynamicCourses.filter((course) => {
    const matchesSearch =
      (course.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (course.author_name || course.author || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    // Asumsi sementara untuk API: Loloskan jika filter All atau AI
    const matchesFilter = filter === "All" || filter === "AI";

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 md:p-10 min-h-screen">
      {/* ================= HEADER & SEARCH ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            My Courses
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Lanjutkan perjalanan belajarmu di Inovasia Digital Academy.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Tombol Filter Kategori */}
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
            <button
              onClick={() => setFilter("All")}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                filter === "All"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter("AI")}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                filter === "AI"
                  ? "bg-white dark:bg-slate-700 text-[#00BCD4] dark:text-cyan-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              AI & Tech
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kelas atau instruktur..."
              className="pl-10 pr-4 py-2.5 w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#00BCD4]/20 shadow-sm text-sm outline-none transition-all focus:border-[#00BCD4]"
            />
          </div>
        </div>
      </div>

      {/* ================= SECTION 1: KELAS STATIS (JSON) ================= */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="material-symbols-outlined text-[#00BCD4]">
            folder
          </span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Kelas Tersimpan (Statis)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStaticCourses.map((course) => {
            const displayTitle = getDisplayTitle(course.title);
            return (
              <Link
                href={`/${course.slug}`}
                key={course.slug}
                className="group bg-white dark:bg-[#151e2c] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-[#00BCD4]/5 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full"
              >
                <div className="aspect-video w-full relative bg-slate-800 overflow-hidden">
                  <Image
                    src={course.thumbnail}
                    alt={displayTitle}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300 z-10 flex items-center justify-center">
                    <div className="size-12 rounded-full bg-[#00BCD4] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                      <span className="material-symbols-outlined text-[24px] ml-1">
                        play_arrow
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#00BCD4] transition-colors mb-4 line-clamp-2">
                    {displayTitle}
                  </h3>

                  <div className="mt-auto flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className="size-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5">
                      <span className="material-symbols-outlined text-[16px] text-slate-500 dark:text-slate-400">
                        person
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest mb-0.5">
                        Instructor
                      </span>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                        {course.instructor}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {filteredStaticCourses.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-400 text-sm">
              Tidak ada kelas statis yang cocok.
            </div>
          )}
        </div>
      </div>

      {/* ================= SECTION 2: KELAS DINAMIS (API KATIB) ================= */}
      <div>
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="material-symbols-outlined text-emerald-500">
            cloud_download
          </span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Kelas Terbaru (API Integrasi)
            <span className="bg-emerald-100 text-emerald-600 text-[10px] uppercase font-black px-2 py-0.5 rounded animate-pulse">
              Testing
            </span>
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        {loadingCourses ? (
          // SKELETON LOADING UI UNTUK API
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-[#151e2c] rounded-2xl border border-slate-200 dark:border-white/5 h-80 animate-pulse overflow-hidden flex flex-col"
              >
                <div className="h-48 bg-slate-200 dark:bg-slate-800/50 w-full" />
                <div className="p-5 space-y-4 flex-1">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800/50 w-3/4 rounded" />
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
                    <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800/50 shrink-0" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800/50 w-1/2 rounded self-center" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDynamicCourses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDynamicCourses.map((course) => {
                const displayTitle = course.title || "Kelas Tanpa Judul";
                const authorName =
                  course.author_name || course.author || "Instruktur NgodingAI";
                const thumbUrl = getDynamicThumbnailUrl(course.thumbnail);

                return (
                  <Link
                    href={`/course/${course.course_id}`}
                    key={course.course_id}
                    className="group bg-white dark:bg-[#151e2c] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-[#00BCD4]/5 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full"
                  >
                    <div className="aspect-video w-full relative bg-slate-800 overflow-hidden">
                      {thumbUrl ? (
                        <Image
                          src={thumbUrl}
                          alt={displayTitle}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={true}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-800 group-hover:scale-105 transition-transform duration-500">
                          <span className="text-4xl font-black text-slate-400">
                            {displayTitle.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300 z-10 flex items-center justify-center">
                        <div className="size-12 rounded-full bg-[#00BCD4] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                          <span className="material-symbols-outlined text-[24px] ml-1">
                            play_arrow
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#00BCD4] transition-colors mb-4 line-clamp-2">
                        {displayTitle}
                      </h3>

                      <div className="mt-auto flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                        <div className="size-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5">
                          <span className="material-symbols-outlined text-[16px] text-slate-500 dark:text-slate-400">
                            person
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest mb-0.5">
                            Instructor
                          </span>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                            {authorName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls untuk API */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-50 flex items-center hover:bg-slate-50 dark:hover:bg-[#161616] text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Halaman <span className="font-bold">{currentPage}</span> dari{" "}
                  <span className="font-bold">{totalPages}</span>
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-50 flex items-center hover:bg-slate-50 dark:hover:bg-[#161616] text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
              cloud_off
            </span>
            <p className="text-slate-500 text-sm">
              Belum ada kelas dari API yang berhasil dimuat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
