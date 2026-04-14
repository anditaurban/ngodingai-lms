'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import { 
  SiHtml5, 
  SiJavascript, 
  SiTailwindcss, 
  SiNodedotjs, 
  SiGithub, 
  SiVercel,
  SiPython
} from "react-icons/si";
// Menggunakan FontAwesome untuk CSS demi menghindari bug versi SiCss/SiCss3
import { FaCss3Alt } from "react-icons/fa";

const googleSansAlt = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700', '800'] });

const defaultLandingData = {
  about: "Belajar ngoding pakai AI, bangun project website dalam waktu singkat, bebas berkreasi tanpa hambatan coding manual! Kelas ini dirancang khusus untuk pemula hingga profesional yang ingin mempercepat alur kerja pengembangan perangkat lunak mereka menggunakan teknologi Generative AI terbaru.",
  tools: ["VS Code", "Python 3.10+", "OpenAI API Key", "Next.js", "TailwindCSS"],
  audience: ["Web Developer Pemula", "Tech Enthusiast", "Product Manager"],
  instructor: "Andita Permata",
  role: "Lecturer & Web Developer",
  bio: "Dosen Ilmu Komputer sekaligus Web Developer Praktisi. Berpengalaman lebih dari 8 tahun di industri perangkat lunak dengan spesialisasi pada Pengembangan Aplikasi Web & Arsitektur Sistem terintegrasi AI.",
  roadmap: [
    { id: 'r1', title: 'Pengenalan AI dalam Coding', description: 'Memahami dasar-dasar AI untuk programming dan setup tools modern.', items: ['Apa itu AI dalam programming?', 'Prompt Engineering 101', 'Instalasi VS Code'] },
    { id: 'r2', title: 'Membuat Project dengan AI', description: 'Hands-on membuat website lengkap dengan fitur interaktif.', items: ['Wireframe dengan AI', 'Generate HTML & Tailwind', 'Node.js + Express API'] },
    { id: 'r3', title: 'Deployment & Hosting', description: 'Mempublikasikan karya Anda agar bisa diakses oleh seluruh dunia.', items: ['Konfigurasi Vercel', 'Manajemen Domain', 'Optimasi SEO Dasar'] }
  ]
};

const emptyLandingData = {
  about: "Deskripsi kelas belum ditambahkan oleh instruktur.",
  tools: ["Belum ada tools"],
  audience: ["Umum"],
  instructor: "Instruktur",
  role: "Mentor",
  bio: "Bio instruktur belum tersedia.",
  roadmap: []
};

interface OverviewTabProps {
  data?: any;
  courseSlug?: string;
}

export default function OverviewTab({ data, courseSlug = 'ngodingai' }: OverviewTabProps) {
  const [courseData, setCourseData] = useState(defaultLandingData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchLandingData = () => {
       if (courseSlug.toLowerCase() === 'ngodingai') {
           setCourseData(defaultLandingData);
           setIsLoaded(true);
           return;
       }

       const savedData = localStorage.getItem(`db_course_landing_${courseSlug}`);
       if (savedData) {
           setCourseData({ ...emptyLandingData, ...JSON.parse(savedData) });
       } else {
           setCourseData(emptyLandingData);
       }
       setIsLoaded(true);
    };

    fetchLandingData();
    window.addEventListener('storage', fetchLandingData);
    return () => window.removeEventListener('storage', fetchLandingData);
  }, [courseSlug]);

  const stacks = [
    { name: "HTML5", icon: SiHtml5, color: "text-orange-600" },
    { name: "CSS", icon: FaCss3Alt, color: "text-blue-600" }, // Icon CSS yang lebih aman
    { name: "JavaScript", icon: SiJavascript, color: "text-yellow-500" },
    { name: "TailwindCSS", icon: SiTailwindcss, color: "text-cyan-500" },
    { name: "Node.js", icon: SiNodedotjs, color: "text-green-600" },
    { name: "GitHub", icon: SiGithub, color: "text-slate-800 dark:text-white" },
    { name: "Vercel", icon: SiVercel, color: "text-black dark:text-white" },
  ];

  // Tema warna dinamis untuk kelas selain ngodingai
  const themeColors = [
      { borderHover: 'hover:border-cyan-400', bgSide: 'bg-cyan-500', numBg: 'bg-cyan-500', numShadow: 'shadow-cyan-500/25', iconText: 'text-cyan-500' },
      { borderHover: 'hover:border-indigo-400', bgSide: 'bg-indigo-500', numBg: 'bg-indigo-500', numShadow: 'shadow-indigo-500/25', iconText: 'text-indigo-500' },
      { borderHover: 'hover:border-emerald-400', bgSide: 'bg-emerald-500', numBg: 'bg-emerald-500', numShadow: 'shadow-emerald-500/25', iconText: 'text-emerald-500' },
  ];

  if (!isLoaded) {
    return <div className="animate-pulse h-96 bg-slate-100 dark:bg-slate-800/50 rounded-3xl"></div>;
  }

  const isNgodingAi = courseSlug.toLowerCase() === 'ngodingai';

  return (
    <div className="animate-fade-in relative pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =========================================================
            LEFT COLUMN: MAIN CONTENT (Materi Workshop)
        ========================================================= */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* 1. About Section */}
          <div className="bg-white dark:bg-[#111111] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00BCD4]"></div>
            <h3 className={`text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2 ${googleSansAlt.className}`}>
              <span className="material-symbols-outlined text-[#00BCD4]">description</span>
              Deskripsi Kelas
            </h3>
            <article className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>{courseData.about}</p>
            </article>

            {/* Target Audience & Tools Info (Khusus ditambahkan agar data dinamis tidak hilang) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00BCD4] text-[16px]">group</span> Siapa yang cocok?
                  </h4>
                  <div className="flex flex-wrap gap-2">
                     {courseData.audience.map((item, idx) => (
                       <span key={idx} className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800/50 px-2.5 py-1 rounded-lg text-xs font-bold">
                          {item}
                       </span>
                     ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-500 text-[16px]">code</span> Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                     {courseData.tools.map((item, idx) => (
                       <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                          {item}
                       </span>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* 2. TIMELINE MATERI */}
          <div>
            <div className="mb-8">
               <h2 className={`text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 ${googleSansAlt.className}`}>Roadmap Pembelajaran</h2>
               <p className="text-slate-600 dark:text-slate-400">Kurikulum lengkap dari pengenalan hingga hands-on project.</p>
            </div>

            <div className="space-y-8 relative">
                {/* Garis Konektor Vertical */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-800 hidden lg:block"></div>

                {isNgodingAi ? (
                  /* =========================================================
                     HARDCODED UI: KHUSUS UNTUK KELAS "NGODINGAI"
                  ========================================================= */
                  <>
                    {/* --- STEP 1 (CYAN THEME) --- */}
                    <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group hover:border-cyan-400 dark:hover:border-cyan-600 transition-colors z-10">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500"></div>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4 md:gap-6">
                                <div className="shrink-0 size-12 md:size-14 rounded-2xl bg-cyan-500 text-white flex items-center justify-center font-black text-xl md:text-2xl shadow-lg shadow-cyan-500/25">01</div>
                                <div>
                                    <h3 className={`text-2xl font-bold text-slate-900 dark:text-white ${googleSansAlt.className}`}>Pengenalan AI dalam Coding</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed text-sm md:text-base">Memahami dasar-dasar AI untuk programming dan setup tools modern.</p>
                                </div>
                            </div>
                            <div className="pl-0 md:pl-18">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider flex items-center gap-2">
                                           <span className="material-symbols-outlined text-cyan-500 text-lg">menu_book</span> Materi:
                                        </h4>
                                        <ul className="space-y-3">
                                            {["Apa itu AI dalam programming?", "Prompt Engineering 101", "Instalasi VS Code & Extensions", "Setup Environment Dasar"].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                                <span className="material-symbols-outlined text-cyan-500 text-[18px] shrink-0 mt-0.5">check_circle</span>
                                                {item}
                                            </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider flex items-center gap-2">
                                           <span className="material-symbols-outlined text-cyan-500 text-lg">build</span> Tools AI:
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {["ChatGPT", "GitHub Copilot", "Blackbox AI", "V0", "DeepSeek", "Gemini"].map((tool, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                {tool}
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 2 (INDIGO THEME) --- */}
                    <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors z-10">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                        <div className="flex flex-col gap-6">
                             <div className="flex items-start gap-4 md:gap-6">
                                <div className="shrink-0 size-12 md:size-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-black text-xl md:text-2xl shadow-lg shadow-indigo-500/25">02</div>
                                <div>
                                    <h3 className={`text-2xl font-bold text-slate-900 dark:text-white ${googleSansAlt.className}`}>Membuat Project dengan AI</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed text-sm md:text-base">Hands-on membuat website lengkap dengan fitur CRUD dan API.</p>
                                </div>
                            </div>
                            <div className="pl-0 md:pl-18">
                                <div className="bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30 mb-6">
                                    <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-indigo-500">laptop_mac</span> 
                                        Project: Dashboard Admin Web App
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h5 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">Frontend Development:</h5>
                                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                                <li className="flex gap-2"><span className="material-symbols-outlined text-indigo-500 text-[18px]">arrow_right_alt</span> Wireframe dengan AI</li>
                                                <li className="flex gap-2"><span className="material-symbols-outlined text-indigo-500 text-[18px]">arrow_right_alt</span> Generate HTML & Tailwind</li>
                                                <li className="flex gap-2"><span className="material-symbols-outlined text-indigo-500 text-[18px]">arrow_right_alt</span> Implementasi CRUD Logic</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">Backend Development:</h5>
                                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                                <li className="flex gap-2"><span className="material-symbols-outlined text-indigo-500 text-[18px]">arrow_right_alt</span> Node.js + Express API</li>
                                                <li className="flex gap-2"><span className="material-symbols-outlined text-indigo-500 text-[18px]">arrow_right_alt</span> AI Debugging Techniques</li>
                                                <li className="flex gap-2"><span className="material-symbols-outlined text-indigo-500 text-[18px]">arrow_right_alt</span> Testing & Optimasi</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {stacks.map((tech, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg flex items-center gap-2 hover:scale-105 transition-transform border border-slate-200 dark:border-slate-700">
                                            <tech.icon className={`text-sm ${tech.color}`} />
                                            {tech.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 3 (EMERALD THEME) --- */}
                    <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors z-10">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                        <div className="flex flex-col gap-6">
                             <div className="flex items-start gap-4 md:gap-6">
                                <div className="shrink-0 size-12 md:size-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl md:text-2xl shadow-lg shadow-emerald-500/25">03</div>
                                <div>
                                    <h3 className={`text-2xl font-bold text-slate-900 dark:text-white ${googleSansAlt.className}`}>Deployment & Challenge</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed text-sm md:text-base">Publish project ke internet dan tantangan coding mandiri.</p>
                                </div>
                            </div>
                            <div className="pl-0 md:pl-18">
                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl text-center border border-emerald-100 dark:border-emerald-900/30">
                                        <span className="material-symbols-outlined text-emerald-600 text-2xl mb-1"> manage_accounts </span>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Project Pribadi</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Build project impianmu dengan AI</p>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl text-center border border-blue-100 dark:border-blue-900/30">
                                        <span className="material-symbols-outlined text-3xl text-blue-600 mb-1">rocket_launch</span>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Deployment</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Hosting ke Vercel / GitHub Pages</p>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl text-center border border-purple-100 dark:border-purple-900/30">
                                        <span className="material-symbols-outlined text-3xl text-purple-600 mb-1">forum</span>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Q & A</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Konsultasi karir & teknik coding</p>
                                    </div>
                                </div>
                                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl p-4 flex gap-3 items-start">
                                    <span className="material-symbols-outlined text-yellow-600 mt-0.5">lightbulb</span>
                                    <div>
                                        <h5 className="font-bold text-yellow-800 dark:text-yellow-500 text-sm">Bonus Materi:</h5>
                                        <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">Akses ke komunitas alumni & modul lanjutan optimasi AI workflow.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </>
                ) : (
                  /* =========================================================
                     DYNAMIC UI: UNTUK KELAS LAIN (MENGGUNAKAN DESAIN YANG SAMA)
                  ========================================================= */
                  courseData.roadmap.length === 0 ? (
                    <p className="text-slate-400 italic">Roadmap belum tersedia untuk kelas ini.</p>
                  ) : (
                    courseData.roadmap.map((step: any, idx: number) => {
                       const theme = themeColors[idx % 3];
                       return (
                          <div key={step.id || idx} className={`bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group ${theme.borderHover} transition-colors z-10`}>
                              <div className={`absolute top-0 left-0 w-1.5 h-full ${theme.bgSide}`}></div>
                              
                              <div className="flex flex-col gap-6">
                                  <div className="flex items-start gap-4 md:gap-6">
                                      <div className={`shrink-0 size-12 md:size-14 rounded-2xl ${theme.numBg} text-white flex items-center justify-center font-black text-xl md:text-2xl shadow-lg ${theme.numShadow}`}>
                                          {String(idx + 1).padStart(2, '0')}
                                      </div>
                                      <div>
                                          <h3 className={`text-2xl font-bold text-slate-900 dark:text-white ${googleSansAlt.className}`}>{step.title}</h3>
                                          <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed text-sm md:text-base">{step.description}</p>
                                      </div>
                                  </div>
                                  
                                  {step.items && step.items.length > 0 && (
                                    <div className="pl-0 md:pl-18">
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider flex items-center gap-2">
                                              <span className={`material-symbols-outlined ${theme.iconText} text-lg`}>menu_book</span> Materi Pembahasan:
                                            </h4>
                                            <ul className="space-y-3">
                                                {step.items.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                                    <span className={`material-symbols-outlined ${theme.iconText} text-[18px] shrink-0 mt-0.5`}>check_circle</span>
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
                    })
                  )
                )}
            </div>
          </div>
          
        </div>

        {/* =========================================================
            RIGHT COLUMN: SIDEBAR (Instructor & Extras)
        ========================================================= */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* 1. INSTRUCTOR CARD */}
          <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
               <span className="material-symbols-outlined text-6xl">school</span>
            </div>
            
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Instructor</h4>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="relative size-14 shrink-0">
                <Image 
                  // Gunakan avatar UI fallback jika tidak ada gambar khusus
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(courseData.instructor)}&background=00BCD4&color=fff&size=256`}
                  alt={courseData.instructor}
                  fill
                  className="rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
                  unoptimized={true}
                />
                <div className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white dark:border-[#111111] rounded-full" title="Online"></div>
              </div>
              <div>
                <h3 className={`font-bold text-lg text-slate-900 dark:text-white leading-tight ${googleSansAlt.className}`}>{courseData.instructor}</h3>
                <p className="text-xs text-[#00BCD4] font-bold uppercase mt-0.5">{courseData.role}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 border-t border-b border-slate-100 dark:border-slate-800 py-4">
              {courseData.bio}
            </p>
          </div>

        </aside>

      </div>
    </div>
  );
}