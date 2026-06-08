"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";

import { requestJson, buildAuthHeaders } from "@/lib/api"; // Pastikan path ini sesuai dengan project Anda

// ✨ DEFINISI BASE_URL
const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";
const BASE_URL = RAW_BASE_URL.endsWith("/")
  ? RAW_BASE_URL.slice(0, -1)
  : RAW_BASE_URL;

// Helper untuk mereplace judul kelas
const getDisplayTitle = (title: string) => {
  if (title.includes("NgodingAI: Master GenAI & LLMs")) {
    return "NgodingAI: Belajar ngoding pakai AI, bangun project website dalam waktu singkat";
  }
  return title;
};

// Helper URL Thumbnail
const getDynamicThumbnailUrl = (filename: string) => {
  if (!filename) return "";
  const cleanFilename = filename.replace(/^\//, "");
  const rawUrl = cleanFilename.startsWith("http")
    ? cleanFilename
    : `${BASE_URL}/thumbnail/course/${cleanFilename}`;

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

interface CourseCustomer {
  course_customer_id: number;
  customer_id: number;
  course_id: number;
  instructor_id: number;
  course: string;
  instructor: string;
  thumbnail?: string;
}

export default function MyClassPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // STATE: API KELAS SAYA
  const [myCourses, setMyCourses] = useState<CourseCustomer[]>([]);
  const [loadingMyCourses, setLoadingMyCourses] = useState(true);
  const [errorMyCourses, setErrorMyCourses] = useState<string | null>(null);

  // STATE: API KELAS TERBARU
  const [dynamicCourses, setDynamicCourses] = useState<DynamicCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // FETCH DATA: KELAS SAYA
  const fetchMyCourses = useCallback(async () => {
    setLoadingMyCourses(true);
    setErrorMyCourses(null);

    const customerId = Cookies.get("customer_id") || "32455";
    const token =
      process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN ||
      Cookies.get("api_token") ||
      "";

    try {
      const targetUrl = `${BASE_URL}/list/course_customer/${customerId}`;
      const data = await requestJson<any>(targetUrl, {
        method: "GET",
        headers: buildAuthHeaders(token),
      });

      setMyCourses(data.listData || []);
    } catch (err: any) {
      console.error("Gagal mengambil data kelas saya:", err);
      setErrorMyCourses(err.message || "Gagal memuat data kelas saya.");
    } finally {
      setLoadingMyCourses(false);
    }
  }, []);

  // FETCH DATA: API DINAMIS
  const fetchDynamicCourses = useCallback(async (page: number) => {
    setLoadingCourses(true);
    setError(null);

    const ownerId = process.env.NEXT_PUBLIC_OWNER_ID || "4409";
    const token =
      process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN ||
      Cookies.get("api_token") ||
      "";

    try {
      const targetUrl = `${BASE_URL}/table/all_course/${ownerId}/${page}`;
      const data = await requestJson<any>(targetUrl, {
        method: "GET",
        headers: buildAuthHeaders(token),
      });

      setDynamicCourses(data.tableData || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error("Gagal mengambil data kelas terbaru:", err);
      setError(err.message || "Gagal memuat data kelas API.");
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCourses();
    fetchDynamicCourses(currentPage);
  }, [currentPage, fetchDynamicCourses, fetchMyCourses]);

  // LOGIKA FILTERING
  const filteredMyCourses = myCourses.filter((item) => {
    const displayTitle = getDisplayTitle(item.course || "");
    const matchesSearch =
      displayTitle.toLowerCase().includes(search.toLowerCase()) ||
      (item.instructor || "").toLowerCase().includes(search.toLowerCase());

    let category = "All";
    if (
      displayTitle.toLowerCase().includes("ngoding") ||
      displayTitle.toLowerCase().includes("ai")
    ) {
      category = "AI";
    }

    const matchesFilter = filter === "All" || category === filter;
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

      {/* ================= SECTION 1: KELAS SAYA ================= */}
      <div className="mb-14">
        {/* HEADER SECTION & INFO JUMLAH KELAS */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[#00BCD4]">
                library_books
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Kelas Tersimpan
            </h2>
          </div>

          {/* Badge Jumlah Kelas */}
          {!loadingMyCourses && (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Total:{" "}
                <span className="text-[#00BCD4]">
                  {filteredMyCourses.length}
                </span>{" "}
                Kelas
              </span>
            </div>
          )}
        </div>

        {errorMyCourses && (
          <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 dark:border-red-900/30">
            {errorMyCourses}
          </div>
        )}

        {loadingMyCourses ? (
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
        ) : filteredMyCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMyCourses.map((item) => {
              const displayTitle = getDisplayTitle(item.course);
              const thumbUrl = getDynamicThumbnailUrl(item.thumbnail || "");

              return (
                <Link
                  href={`/course/${item.course_id}`}
                  key={item.course_customer_id}
                  className="group bg-white dark:bg-[#151e2c] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-[#00BCD4]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full relative"
                >
                  {/* Badge Label Status */}
                  <div className="absolute top-3 right-3 z-20 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    Tersimpan
                  </div>

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
                      // ✨ Fallback UI yang dipercantik menggunakan gradient
                      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-slate-700 to-slate-900 group-hover:scale-105 transition-transform duration-500">
                        <div className="text-center p-4">
                          <span className="material-symbols-outlined text-slate-500 text-4xl mb-2 opacity-50">
                            image
                          </span>
                          <h4 className="text-xl font-black text-slate-400/80 tracking-widest line-clamp-1">
                            {displayTitle.substring(0, 3).toUpperCase()}
                          </h4>
                        </div>
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

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5">
                          <span className="material-symbols-outlined text-[16px] text-slate-500 dark:text-slate-400">
                            person
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest mb-0.5">
                            Instructor
                          </span>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate max-w-30">
                            {item.instructor}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          // ✨ Empty State yang dipercantik
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-slate-400">
                search_off
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
              Kelas tidak ditemukan
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              Kami tidak dapat menemukan kelas yang sesuai dengan kata kunci
              pencarian Anda. Coba gunakan kata kunci lain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
