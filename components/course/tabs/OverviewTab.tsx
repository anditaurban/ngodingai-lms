import React from 'react';
import Image from 'next/image';

interface OverviewTabProps {
  data: {
    about: string;
    tools: string[];
    audience?: string[]; // Optional: Jika ada di JSON nanti
  };
}

export default function OverviewTab({ data }: OverviewTabProps) {
  
  // --- MOCK DATA (Untuk konten statis tambahan) ---
  // Di real app, data ini sebaiknya ada di courses.json
  const learningOutcomes = [
    "Understand the core principles of Generative AI",
    "Build real-world applications using OpenAI API",
    "Master Prompt Engineering techniques",
    "Deploy your AI models to production servers"
  ];

  const requirements = [
    "Basic understanding of Python programming",
    "Familiarity with command line interface",
    "A computer with internet access (Mac/Windows/Linux)"
  ];

  return (
    <div className="animate-fade-in relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =========================================================
            LEFT COLUMN: MAIN DESCRIPTION (Wider)
            ========================================================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. About Section */}
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00BCD4]">description</span>
              About this Class
            </h3>
            <article className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>{data.about}</p>
              <p>
                In this course, we will dive deep into the fundamentals and advanced concepts. 
                Whether you are a beginner looking to start your journey or a professional looking to upskill, 
                this curriculum is designed to be comprehensive and practical.
              </p>
            </article>
          </div>

          {/* 2. What You Will Learn (Standard LMS Feature) */}
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              What You Will Learn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningOutcomes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-500 text-[20px] shrink-0 mt-0.5">check</span>
                  <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Requirements */}
          <div className="bg-transparent p-6 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Requirements</h3>
            <ul className="space-y-2 list-disc list-inside text-sm text-slate-600 dark:text-slate-400">
              {requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

        </div>


        {/* =========================================================
            RIGHT COLUMN: SIDEBAR (Instructor & Info)
            ========================================================= */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* 1. INSTRUCTOR PROFILE CARD */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <span className="material-symbols-outlined text-6xl">school</span>
            </div>
            
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Instructor</h4>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="relative size-14 shrink-0">
                <Image 
                  src="https://ui-avatars.com/api/?name=Sarah+Chen&background=00BCD4&color=fff" // Fallback jika link mati
                  alt="Instructor"
                  fill
                  className="rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
                  unoptimized
                />
                <div className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" title="Online"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">Andita Permata Rahmawati</h3>
                <p className="text-xs text-[#00BCD4] font-bold uppercase mt-0.5">Senior AI Researcher</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 border-t border-b border-slate-100 dark:border-slate-700 py-4">
              PhD in Computer Science from Stanford. Passionate about democratizing AI education. Former lead at Google DeepMind with 10+ years of experience.
            </p>

            <div className="flex gap-3">
              <button className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity">
                View Profile
              </button>
              <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 transition-colors">
                <span className="material-symbols-outlined text-[20px]">chat</span>
              </button>
            </div>
          </div>

          {/* 2. PRO TIP / UPSELL (Gradient Style) */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-[#00BCD4]/10 to-blue-500/10 border border-[#00BCD4]/20 relative overflow-hidden group">
            {/* Decoration */}
            <div className="absolute -right-6 -top-6 size-24 bg-[#00BCD4]/20 rounded-full blur-2xl group-hover:bg-[#00BCD4]/30 transition-colors"></div>
            
            <div className="flex items-center gap-2 mb-3 text-[#00BCD4] relative z-10">
              <span className="material-symbols-outlined">tips_and_updates</span>
              <span className="text-xs font-bold uppercase tracking-wider">Pro Tip</span>
            </div>
            
            <p className="text-sm text-slate-800 dark:text-slate-200 font-medium mb-4 relative z-10 leading-relaxed">
              Having trouble with the local setup? You can try our cloud-based Jupyter environment to skip installation.
            </p>
            
            <a href="#" className="inline-flex items-center gap-1 text-sm font-bold text-[#00BCD4] hover:underline relative z-10">
              Launch Cloud Lab <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>

          {/* 3. TOOLS / TECH STACK */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {data.tools.map((tool, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                >
                  <span className="size-1.5 rounded-full bg-[#00BCD4]"></span>
                  {tool}
                </span>
              ))}
            </div>
          </div>

        </aside>

      </div>
      
      {/* Bottom Spacer */}
      <div className="h-12"></div>
    </div>
  );
}