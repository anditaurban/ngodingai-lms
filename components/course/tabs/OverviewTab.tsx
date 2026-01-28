import React from 'react';
import Image from 'next/image';

interface OverviewTabProps {
  data: {
    about: string;
    tools: string[];
    audience?: string[];
  };
}

export default function OverviewTab({ data }: OverviewTabProps) {
  
  // --- MOCK DATA INSTRUCTOR (Bisa dipindah ke JSON nanti) ---
  const instructor = {
    name: "Andita Permata Rahmawati",
    role: "Senior AI Researcher",
    bio: "PhD in Computer Science from Stanford. Former lead at Google DeepMind. Expert in LLM Fine-tuning & RAG Systems.",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=00BCD4&color=fff"
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

          {/* 2. TIMELINE MATERI (Konten Baru dari Anda) */}
          <div>
            <div className="mb-8">
               <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Roadmap Pembelajaran</h2>
               <p className="text-slate-600 dark:text-slate-400">Kurikulum lengkap dari pengenalan hingga hands-on project.</p>
            </div>

            <div className="space-y-8 relative">
                {/* Garis Konektor Vertical */}
                <div className="absolute left-[22px] top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

                {/* --- STEP 1 --- */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-cyan-400 transition-colors">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500"></div>
                    
                    {/* Badge Number */}
                    <div className="hidden md:flex absolute -left-12 top-8 size-12 bg-cyan-500 rounded-full items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-[#f8fafc] dark:ring-[#0f111a] z-10">
                        1
                    </div>
                    
                    <div className="flex flex-col gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Pengenalan AI dalam Coding</h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">Memahami dasar-dasar AI, LLM, dan setup tools development.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Materi List */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                                  <span className="material-symbols-outlined text-cyan-500 text-lg">menu_book</span> Materi
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                      "Apa itu AI & LLM dalam programming?",
                                      "AI-assisted vs AI-generated coding",
                                      "Prompt Engineering 101",
                                      "Instalasi Python & VS Code"
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
                                  <span className="material-symbols-outlined text-cyan-500 text-lg">build</span> Tools
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {["ChatGPT", "GitHub Copilot", "Blackbox AI", "V0.dev", "DeepSeek", "Gemini"].map((tool, i) => (
                                      <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        {tool}
                                      </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- STEP 2 --- */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-indigo-400 transition-colors">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                    
                    <div className="hidden md:flex absolute -left-12 top-8 size-12 bg-indigo-500 rounded-full items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-[#f8fafc] dark:ring-[#0f111a] z-10">
                        2
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Build Project dengan Bantuan AI</h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">Hands-on membuat website lengkap (Dashboard / Landing Page) dengan fitur CRUD.</p>
                        </div>

                        {/* Project Description */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30">
                            <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">laptop_mac</span> 
                                Project: Admin Dashboard Web App
                            </h4>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h5 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">Frontend (UI/UX)</h5>
                                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                        <li className="flex gap-2"><span className="material-symbols-outlined text-indigo-500 text-[18px]">arrow_right_alt</span> Generate Wireframe UI</li>
                                        <li className="flex gap-2"><span className="material-symbols-outlined text-indigo-500 text-[18px]">arrow_right_alt</span> HTML5 + Tailwind CSS</li>
                                        <li className="flex gap-2"><span className="material-symbols-outlined text-indigo-500 text-[18px]">arrow_right_alt</span> Responsive Layout</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">Backend (Logic)</h5>
                                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                        <li className="flex gap-2"><span className="material-symbols-outlined text-indigo-500 text-[18px]">arrow_right_alt</span> Node.js / Express API</li>
                                        <li className="flex gap-2"><span className="material-symbols-outlined text-indigo-500 text-[18px]">arrow_right_alt</span> Database Integration</li>
                                        <li className="flex gap-2"><span className="material-symbols-outlined text-indigo-500 text-[18px]">arrow_right_alt</span> Debugging with AI</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2">
                            {["HTML5", "CSS3", "JavaScript", "TailwindCSS", "Node.js", "GitHub", "Vercel"].map((tech, i) => (
                                <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-indigo-500"></span> {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- STEP 3 --- */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-emerald-400 transition-colors">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                    
                    <div className="hidden md:flex absolute -left-12 top-8 size-12 bg-emerald-500 rounded-full items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-[#f8fafc] dark:ring-[#0f111a] z-10">
                        3
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Deployment & Showcase</h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">Online-kan websitemu, challenge mandiri, dan sesi tanya jawab expert.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                             <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl text-center border border-emerald-100 dark:border-emerald-900/30">
                                 <span className="material-symbols-outlined text-3xl text-emerald-600 mb-2">rocket_launch</span>
                                 <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Deployment</h4>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">Upload ke GitHub & Vercel/Railway</p>
                             </div>
                             <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl text-center border border-blue-100 dark:border-blue-900/30">
                                 <span className="material-symbols-outlined text-3xl text-blue-600 mb-2">bug_report</span>
                                 <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Live Debugging</h4>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">Fix error real-time dibantu Mentor</p>
                             </div>
                             <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl text-center border border-purple-100 dark:border-purple-900/30">
                                 <span className="material-symbols-outlined text-3xl text-purple-600 mb-2">forum</span>
                                 <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Q & A</h4>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">Sharing best practice & tips karir</p>
                             </div>
                        </div>

                        {/* Bonus Section */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl p-4 flex gap-3 items-start">
                            <span className="material-symbols-outlined text-yellow-600 mt-0.5">lightbulb</span>
                            <div>
                                <h5 className="font-bold text-yellow-800 dark:text-yellow-500 text-sm">Bonus Materi:</h5>
                                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                                    Tips mengoptimalkan workflow developer, akses komunitas alumni, dan rekaman sesi live selamanya.
                                </p>
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

          {/* 2. PRO TIP CARD (Gradient) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#00BCD4]/10 to-blue-500/10 border border-[#00BCD4]/20 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 size-24 bg-[#00BCD4]/20 rounded-full blur-2xl group-hover:bg-[#00BCD4]/30 transition-colors"></div>
            
            <div className="flex items-center gap-2 mb-3 text-[#00BCD4] relative z-10">
              <span className="material-symbols-outlined">tips_and_updates</span>
              <span className="text-xs font-bold uppercase tracking-wider">Pro Tip</span>
            </div>
            
            <p className="text-sm text-slate-800 dark:text-slate-200 font-medium mb-4 relative z-10 leading-relaxed">
              Kesulitan setup lokal? Gunakan <strong>Google Colab</strong> atau <strong>GitHub Codespaces</strong> untuk langsung coding di browser tanpa instalasi berat.
            </p>
            
            <a href="#" className="inline-flex items-center gap-1 text-sm font-bold text-[#00BCD4] hover:underline relative z-10">
              Coba Cloud Environment <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>

        </aside>

      </div>
      
      <div className="h-12"></div>
    </div>
  );
}