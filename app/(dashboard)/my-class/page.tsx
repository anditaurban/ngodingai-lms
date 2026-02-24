"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import coursesData from "@/data/courses.json";

// Helper untuk mereplace judul kelas (Sama seperti di halaman detail)
const getDisplayTitle = (title: string) => {
  if (title.includes("NgodingAI: Master GenAI & LLMs")) {
    return "NgodingAI: Belajar ngoding pakai AI, bangun project website dalam waktu singkat";
  }
  return title;
};

export default function MyClassPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredCourses = coursesData.filter((course) => {
    // 1. Dapatkan judul yang sudah di-replace untuk pencarian yang akurat
    const displayTitle = getDisplayTitle(course.title);
    
    // 2. Cocokkan pencarian dengan judul baru atau nama instruktur
    const matchesSearch =
      displayTitle.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase());

    let category = "All";
    if (course.slug.includes("ngoding") || course.slug.includes("ai"))
      category = "AI";
    // if(course.slug.includes('esp32') || course.slug.includes('iot')) category = 'IoT';
    // if(course.slug.includes('n8n') || course.slug.includes('auto')) category = 'Automation';

    const matchesFilter = filter === "All" || category === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 md:p-10 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            My Courses
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Lanjutkan perjalanan belajarmu di Inovasia Digital Academy.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kelas atau instruktur..."
            className="pl-10 pr-4 py-3 w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-[#00BCD4]/10 shadow-sm text-sm outline-none transition-all focus:border-[#00BCD4]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const displayTitle = getDisplayTitle(course.title);

          return (
            <Link
              href={`/course/${course.slug}`}
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
                  {/* Efek tombol play yang muncul saat di-hover (Meningkatkan UX affordance) */}
                  <div className="size-12 rounded-full bg-[#00BCD4] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    <span className="material-symbols-outlined text-[24px] ml-1">play_arrow</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#00BCD4] transition-colors mb-4 line-clamp-2">
                  {displayTitle}
                </h3>

                {/* Bagian Instruktur - Dikunci di bawah menggunakan mt-auto */}
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
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-full mb-6 border border-slate-100 dark:border-white/5">
            <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">
              search_off
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Kelas Tidak Ditemukan
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 text-sm">
            Kami tidak dapat menemukan kelas yang cocok dengan kata kunci &quot;<span className="font-bold text-slate-700 dark:text-slate-300">{search}</span>&quot;.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
            className="text-[#00BCD4] font-bold hover:underline flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Bersihkan Pencarian
          </button>
        </div>
      )}
    </div>
  );
}