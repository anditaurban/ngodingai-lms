import React from 'react';
import Image from 'next/image';
import { 
  SiHtml5, 
  SiCss3, 
  SiJavascript, 
  SiTailwindcss, 
  SiNodedotjs, 
  SiGithub, 
  SiVercel 
} from "react-icons/si";

interface OverviewTabProps {
  data: {
    about: string;
    tools: string[];
    audience?: string[];
  };
}

export default function OverviewTab({ data }: OverviewTabProps) {
  
  const stacks = [
    { name: "HTML5", icon: SiHtml5, color: "text-orange-600" },
    { name: "CSS3", icon: SiCss3, color: "text-blue-600" },
    { name: "JavaScript", icon: SiJavascript, color: "text-yellow-500" },
    { name: "TailwindCSS", icon: SiTailwindcss, color: "text-cyan-500" },
    { name: "Node.js", icon: SiNodedotjs, color: "text-green-600" },
    { name: "GitHub", icon: SiGithub, color: "text-gray-800 dark:text-white" },
    { name: "Vercel", icon: SiVercel, color: "text-black dark:text-white" },
  ];

  const instructor = {
    name: "Andita Permata",
    role: "Lecturer & Web Developer",
    bio: "Dosen Ilmu Komputer. Web Developer Praktisi. Spesialis Pengembangan Aplikasi Web & Arsitektur Sistem.",
    avatar: "https://ui-avatars.com/api/?name=Andita+Permata&background=00BCD4&color=fff"
  };

  return (
    <div className="animate-fade-in relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =========================================================
            LEFT COLUMN: MAIN CONTENT (Materi Workshop)
            ========================================================= */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* 1. About Section */}
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00BCD4]">description</span>
              Deskripsi Kelas
            </h3>
            <article className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>{data.about}</p>
            </article>
          </div>

          {/* 2. TIMELINE MATERI */}
          <div>
            <div className="mb-8">
               <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Roadmap Pembelajaran</h2>
               <p className="text-slate-600 dark:text-slate-400">Kurikulum lengkap dari pengenalan hingga hands-on project.</p>
            </div>

            <div className="space-y-8 relative">
                {/* Garis Konektor Vertical (Hanya visual tambahan) */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-700 hidden lg:block"></div>

                {/* --- STEP 1 (CYAN THEME) --- */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-cyan-400 transition-colors z-10">
                    {/* Aksen Warna Kiri */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500"></div>
                    
                    <div className="flex flex-col gap-6">
                        {/* Header dengan Nomor Modern */}
                        <div className="flex items-start gap-4 md:gap-6">
                            {/* Number Box Style */}
                            <div className="shrink-0 size-12 md:size-14 rounded-2xl bg-cyan-500 text-white flex items-center justify-center font-black text-xl md:text-2xl shadow-lg shadow-cyan-500/25">
                                01
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Pengenalan AI dalam Coding</h3>
                                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Memahami dasar-dasar AI untuk programming dan setup tools modern.</p>
                            </div>
                        </div>

                        <div className="pl-0 md:pl-18"> {/* Indentasi konten agar sejajar dengan teks judul */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Materi List */}
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                                    <span className="material-symbols-outlined text-cyan-500 text-lg">menu_book</span> Materi:
                                    </h4>
                                    <ul className="space-y-3">
                                        {[
                                        "Apa itu AI dalam programming?",
                                        "Prompt Engineering 101",
                                        "Instalasi VS Code & Extensions",
                                        "Setup Environment Dasar"
                                        ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                            <span className="material-symbols-outlined text-cyan-500 text-[18px] shrink-0 mt-0.5">check_circle</span>
                                            {item}
                                        </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Tools Stack */}
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
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
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-indigo-400 transition-colors z-10">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                    
                    <div className="flex flex-col gap-6">
                         {/* Header dengan Nomor Modern */}
                         <div className="flex items-start gap-4 md:gap-6">
                            <div className="shrink-0 size-12 md:size-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-black text-xl md:text-2xl shadow-lg shadow-indigo-500/25">
                                02
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Membuat Project dengan AI</h3>
                                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Hands-on membuat website lengkap dengan fitur CRUD dan API.</p>
                            </div>
                        </div>

                        <div className="pl-0 md:pl-18">
                            {/* Project Description */}
                            <div className="bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30 mb-6">
                                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined">laptop_mac</span> 
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

                            {/* Tech Stack Icons */}
                            <div className="flex flex-wrap gap-2">
                                {stacks.map((tech, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg flex items-center gap-2 hover:scale-105 transition-transform">
                                        <tech.icon className={`text-sm ${tech.color}`} />
                                        {tech.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- STEP 3 (EMERALD THEME) --- */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-emerald-400 transition-colors z-10">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                    
                    <div className="flex flex-col gap-6">
                         {/* Header dengan Nomor Modern */}
                         <div className="flex items-start gap-4 md:gap-6">
                            <div className="shrink-0 size-12 md:size-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl md:text-2xl shadow-lg shadow-emerald-500/25">
                                03
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Deployment & Challenge</h3>
                                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Publish project ke internet dan tantangan coding mandiri.</p>
                            </div>
                        </div>

                        <div className="pl-0 md:pl-18">
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl text-center border border-emerald-100 dark:border-emerald-900/30">
                                    <span className="material-symbols-outlined text-green-600 text-2xl"> manage_accounts </span>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Project Pribadi</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Build project impianmu dengan AI</p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl text-center border border-blue-100 dark:border-blue-900/30">
                                    <span className="material-symbols-outlined text-3xl text-blue-600 mb-2">rocket_launch</span>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Deployment</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Hosting ke Vercel / GitHub Pages</p>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl text-center border border-purple-100 dark:border-purple-900/30">
                                    <span className="material-symbols-outlined text-3xl text-purple-600 mb-2">forum</span>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Q & A</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Konsultasi karir & teknik coding</p>
                                </div>
                            </div>

                            {/* Bonus Section */}
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl p-4 flex gap-3 items-start">
                                <span className="material-symbols-outlined text-yellow-600 mt-0.5">lightbulb</span>
                                <div>
                                    <h5 className="font-bold text-yellow-800 dark:text-yellow-500 text-sm">Bonus Materi:</h5>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                                        Akses ke komunitas alumni & modul lanjutan optimasi AI workflow.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          </div>
          
        </div>

        {/* =========================================================
            RIGHT COLUMN: SIDEBAR (Instructor & Extras)
            ========================================================= */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* 1. INSTRUCTOR CARD */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <span className="material-symbols-outlined text-6xl">school</span>
            </div>
            
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Instructor</h4>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="relative size-14 shrink-0">
                <Image 
                  src={instructor.avatar}
                  alt={instructor.name}
                  fill
                  className="rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
                  unoptimized
                />
                <div className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" title="Online"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{instructor.name}</h3>
                <p className="text-xs text-[#00BCD4] font-bold uppercase mt-0.5">{instructor.role}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 border-t border-b border-slate-100 dark:border-slate-700 py-4">
              {instructor.bio}
            </p>

            <button className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity">
                View Profile
            </button>
          </div>

        </aside>

      </div>
      
      <div className="h-12"></div>
    </div>
  );
}