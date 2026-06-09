"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { DM_Sans } from "next/font/google";
import Cookies from "js-cookie";
import {
  SiHtml5,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiGithub,
  SiVercel,
} from "react-icons/si";
import { FaCss3Alt } from "react-icons/fa";

const googleSansAlt = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

// --- INTERFACES ---
interface RoadmapItem {
  id: string | number;
  title: string;
  deskripsi: string;
  items: string[];
  step_order: number;
}

interface CourseOverviewData {
  about: string;
  tools: string[];
  audience: string[];
  instructor: string;
  role: string;
  bio: string;
  photo: string;
  roadmap: RoadmapItem[];
}

const fallbackData: CourseOverviewData = {
  about: "Deskripsi kelas sedang dipersiapkan oleh instruktur.",
  tools: [],
  audience: [],
  instructor: "Instruktur Inovasia",
  role: "Mentor",
  bio: "Instruktur ahli di bidangnya yang siap membantu perjalanan belajarmu.",
  photo: "",
  roadmap: [],
};

// Helper tangguh untuk mengonversi items (karena API kadang mengembalikan string, kadang array)
function parseItems(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

interface DynamicOverviewTabProps {
  courseSlug: string; // Di CoursePlayerDynamic kita mengirimkan courseId ke sini
}

export default function DynamicOverviewTab({
  courseSlug,
}: DynamicOverviewTabProps) {
  const [courseData, setCourseData] =
    useState<CourseOverviewData>(fallbackData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // FETCH SEMUA DATA (PARALEL)
  // ==========================================
  const fetchOverviewData = useCallback(async () => {
    setIsLoaded(false);
    setError(null);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL
        process.env.NEXT_PUBLIC_API_URL
      const token =
        Cookies.get("api_token") ||
        process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN ||
        "";
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Tarik 3 Endpoint Sekaligus untuk menghemat waktu loading!
      const [detailRes, instructorRes, roadmapRes] = await Promise.allSettled([
        fetch(`${baseUrl}/detail/course/${courseSlug}`, { headers }),
        fetch(`${baseUrl}/list/course_instructor/${courseSlug}`, { headers }),
        fetch(`${baseUrl}/list/course_roadmap/${courseSlug}`, { headers }),
      ]);

      let newCourseData = { ...fallbackData };

      // 1. Ekstrak Data Kelas (Deskripsi, Tools, Audience)
      if (detailRes.status === "fulfilled" && detailRes.value.ok) {
        const json = await detailRes.value.json();
        const apiData = json.data || json.detail || json;

        newCourseData.about =
          apiData.deskripsi || apiData.about || fallbackData.about;
        newCourseData.tools = parseItems(apiData.tools || apiData.tech_stack);
        newCourseData.audience = parseItems(apiData.target_audience);
      }

      // Menarik data spesifik kelas
      fetch(`${baseUrl}/list/course_instructor/${courseSlug}`);

      // Jika ada data instruktur khusus untuk kelas ini, timpa fallback statisnya!
      if (instructorRes.status === "fulfilled" && instructorRes.value.ok) {
        const json = await instructorRes.value.json();
        if (json.listData && json.listData.length > 0) {
          const inst = json.listData[0];
          newCourseData.instructor = inst.nama; // <-- Dinamis per kelas!
          newCourseData.role = inst.role; // <-- Dinamis per kelas!
          newCourseData.bio = inst.biodata; // <-- Dinamis per kelas!
          newCourseData.photo = inst.photo;
        }
      }

      // 3. Ekstrak Data Roadmap
      if (roadmapRes.status === "fulfilled" && roadmapRes.value.ok) {
        const json = await roadmapRes.value.json();
        if (json.listData && json.listData.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let mappedRoadmap = json.listData.map((item: any) => ({
            id: item.roadmap_id,
            step_order: Number(item.step_order) || 0,
            title: item.title || "Tahap Pembelajaran",
            deskripsi: item.deskripsi || "",
            items: parseItems(item.items),
          }));

          // Urutkan berdasarkan step_order agar rapi
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mappedRoadmap = mappedRoadmap.sort(
            (a: any, b: any) => a.step_order - b.step_order,
          );
          newCourseData.roadmap = mappedRoadmap;
        }
      }

      setCourseData(newCourseData);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoaded(true);
    }
  }, [courseSlug]);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  // ==========================================
  // KONFIGURASI UI
  // ==========================================
  const stacks = [
    { name: "HTML5", icon: SiHtml5, color: "text-orange-600" },
    { name: "CSS", icon: FaCss3Alt, color: "text-blue-600" },
    { name: "JavaScript", icon: SiJavascript, color: "text-yellow-500" },
    { name: "TailwindCSS", icon: SiTailwindcss, color: "text-cyan-500" },
    { name: "Node.js", icon: SiNodedotjs, color: "text-green-600" },
    { name: "GitHub", icon: SiGithub, color: "text-slate-800 dark:text-white" },
    { name: "Vercel", icon: SiVercel, color: "text-black dark:text-white" },
  ];

  const themeColors = [
    {
      borderHover: "hover:border-cyan-400",
      bgSide: "bg-cyan-500",
      numBg: "bg-cyan-500",
      numShadow: "shadow-cyan-500/25",
      iconText: "text-cyan-500",
    },
    {
      borderHover: "hover:border-indigo-400",
      bgSide: "bg-indigo-500",
      numBg: "bg-indigo-500",
      numShadow: "shadow-indigo-500/25",
      iconText: "text-indigo-500",
    },
    {
      borderHover: "hover:border-emerald-400",
      bgSide: "bg-emerald-500",
      numBg: "bg-emerald-500",
      numShadow: "shadow-emerald-500/25",
      iconText: "text-emerald-500",
    },
  ];

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400 gap-4">
        <span className="size-8 border-4 border-slate-200 border-t-[#00BCD4] rounded-full animate-spin"></span>
        <p className="font-bold animate-pulse">Menarik Informasi Kelas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 text-red-500 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
        <p className="font-bold flex items-center gap-2">
          <span className="material-symbols-outlined">error</span> {error}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =========================================================
            LEFT COLUMN: MAIN CONTENT (Deskripsi & Roadmap)
        ========================================================= */}
        <div className="lg:col-span-8 space-y-10">
          {/* 1. About Section */}
          <div className="bg-white dark:bg-[#111111] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00BCD4]"></div>
            <h3
              className={`text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2 ${googleSansAlt.className}`}
            >
              <span className="material-symbols-outlined text-[#00BCD4]">
                description
              </span>
              Deskripsi Kelas
            </h3>

            <article
              className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: courseData.about }}
            />

            {/* Target Audience & Tools Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00BCD4] text-[16px]">
                    group
                  </span>{" "}
                  Siapa yang cocok?
                </h4>
                <div className="flex flex-wrap gap-2">
                  {courseData.audience.length > 0 ? (
                    courseData.audience.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800/50 px-2.5 py-1 rounded-lg text-xs font-bold"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm italic text-slate-400">Umum</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-500 text-[16px]">
                    code
                  </span>{" "}
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {courseData.tools.length > 0 ? (
                    courseData.tools.map((item, idx) => {
                      // Coba cari icon dari list jika cocok namanya
                      const stackMatch = stacks.find(
                        (s) => s.name.toLowerCase() === item.toLowerCase(),
                      );
                      return (
                        <span
                          key={idx}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"
                        >
                          {stackMatch && (
                            <stackMatch.icon className={stackMatch.color} />
                          )}
                          {item}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-sm italic text-slate-400">
                      Belum ada tools spesifik
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. TIMELINE MATERI (ROADMAP) */}
          {courseData.roadmap.length > 0 && (
            <div>
              <div className="mb-8">
                <h2
                  className={`text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 ${googleSansAlt.className}`}
                >
                  Roadmap Pembelajaran
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Tahapan materi yang akan Anda pelajari di kelas ini.
                </p>
              </div>

              <div className="space-y-8 relative">
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-800 hidden lg:block"></div>
                {courseData.roadmap.map((step, idx) => {
                  const theme = themeColors[idx % 3];
                  return (
                    <div
                      key={step.id || idx}
                      className={`bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group ${theme.borderHover} transition-colors z-10`}
                    >
                      <div
                        className={`absolute top-0 left-0 w-1.5 h-full ${theme.bgSide}`}
                      ></div>

                      <div className="flex flex-col gap-6">
                        <div className="flex items-start gap-4 md:gap-6">
                          <div
                            className={`shrink-0 size-12 md:size-14 rounded-2xl ${theme.numBg} text-white flex items-center justify-center font-black text-xl md:text-2xl shadow-lg ${theme.numShadow}`}
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </div>
                          <div className="w-full">
                            <h3
                              className={`text-2xl font-bold text-slate-900 dark:text-white ${googleSansAlt.className}`}
                            >
                              {step.title}
                            </h3>

                            {/* Tiptap HTML Render for Roadmap Description */}
                            <div
                              className="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 mt-2 leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: step.deskripsi,
                              }}
                            />
                          </div>
                        </div>

                        {step.items && step.items.length > 0 && (
                          <div className="pl-0 md:pl-18">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider flex items-center gap-2">
                                <span
                                  className={`material-symbols-outlined ${theme.iconText} text-lg`}
                                >
                                  menu_book
                                </span>{" "}
                                Materi Pembahasan:
                              </h4>
                              <ul className="space-y-3">
                                {step.items.map((item: string, i: number) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
                                  >
                                    <span
                                      className={`material-symbols-outlined ${theme.iconText} text-[18px] shrink-0 mt-0.5`}
                                    >
                                      check_circle
                                    </span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            RIGHT COLUMN: SIDEBAR (Instructor Card)
        ========================================================= */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-6xl">school</span>
            </div>

            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              Instructor
            </h4>

            <div className="flex items-center gap-4 mb-4">
              <div className="relative size-14 shrink-0">
                {courseData.photo ? (
                  <Image
                    src={courseData.photo}
                    alt={courseData.instructor}
                    fill
                    className="rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
                    unoptimized={true}
                  />
                ) : (
                  <div className="size-full bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full font-bold text-xl border-2 border-white dark:border-slate-700 shadow-md">
                    {courseData.instructor.charAt(0).toUpperCase()}
                  </div>
                )}
                <div
                  className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white dark:border-[#111111] rounded-full"
                  title="Online"
                ></div>
              </div>
              <div className="overflow-hidden">
                <h3
                  className={`font-bold text-lg text-slate-900 dark:text-white leading-tight truncate ${googleSansAlt.className}`}
                >
                  {courseData.instructor}
                </h3>
                <p className="text-xs text-[#00BCD4] font-bold uppercase mt-0.5 truncate">
                  {courseData.role}
                </p>
              </div>
            </div>

            <div
              className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 border-t border-b border-slate-100 dark:border-slate-800 py-4"
              dangerouslySetInnerHTML={{ __html: courseData.bio }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
