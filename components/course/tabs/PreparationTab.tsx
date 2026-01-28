'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import Style React Quill New
import 'react-quill-new/dist/quill.snow.css';

// Dynamic Import Editor (Client Side Only)
// Menggunakan 'as any' untuk menghindari masalah tipe data strict pada library eksternal
const ReactQuill = dynamic(() => import('react-quill-new'), {
  loading: () => <div className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>,
  ssr: false
}) as any;

interface Step {
  title: string;
  content: string;
}

interface PreparationTabProps {
  data: {
    content_html: string;
    slides_id?: string;
    steps?: Step[];
  };
}

export default function PreparationTab({ data }: PreparationTabProps) {
  
  // --- DEFAULT DATA GENERATOR ---
  // Jika data.steps kosong (data lama), kita buat dummy steps agar fitur terlihat
  const defaultSteps: Step[] = [
    { 
      title: '1. Introduction', 
      content: data.content_html || '<p>Welcome to the preparation phase.</p>' 
    },
    { 
      title: '2. Installing Node.js', 
      content: '<h2>Installing Node.js</h2><p>Download Node.js from <a href="https://nodejs.org">nodejs.org</a>.</p><pre>node -v</pre>' 
    },
    { 
      title: '3. Git Configuration', 
      content: '<h2>Git Config</h2><p>Set up your git identity.</p><pre>git config --global user.name "Your Name"</pre>' 
    }
  ];

  const steps: Step[] = (data.steps && data.steps.length > 0) ? data.steps : defaultSteps;

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State konten lokal
  const [currentContent, setCurrentContent] = useState(steps[0].content);

  // Update content saat step berubah
  useEffect(() => {
    setCurrentContent(steps[activeStepIndex].content);
    setIsEditing(false);
    // Scroll ke atas artikel setiap ganti step
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStepIndex, steps]);

  const handleStepChange = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setActiveStepIndex(index);
    }
  };

  // Konfigurasi Toolbar Editor
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [2, 3, false] }],
      ['bold', 'italic', 'underline', 'blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  }), []);

  // Hitung Progress
  const progressPercentage = Math.round(((activeStepIndex + 1) / steps.length) * 100);

  return (
    <div className="animate-fade-in relative">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =========================================================
            LEFT COLUMN: ARTICLE CONTENT (Utama)
            ========================================================= */}
        <main className="lg:col-span-9 order-1">
          
          <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative min-h-150">
              
              {/* Header Artikel */}
              <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100 dark:border-slate-700">
                 <div>
                    <span className="text-[#00BCD4] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="size-2 rounded-full bg-[#00BCD4] animate-pulse"></span>
                      Step {activeStepIndex + 1}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                      {steps[activeStepIndex].title}
                    </h1>
                 </div>
                 
                 <button 
                    onClick={() => setIsEditing(!isEditing)} 
                    className={`shrink-0 p-2.5 rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${
                      isEditing 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                      : 'bg-slate-50 text-slate-600 hover:bg-[#00BCD4] hover:text-white hover:border-[#00BCD4] dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{isEditing ? 'close' : 'edit_note'}</span>
                    <span className="hidden sm:inline">{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
              </div>

              {/* Konten Artikel / Editor */}
              {isEditing ? (
                <div className="animate-fade-in flex flex-col gap-6">
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-600 focus-within:ring-2 ring-[#00BCD4]/50 transition-all">
                    <ReactQuill 
                      theme="snow" 
                      value={currentContent} 
                      onChange={setCurrentContent}
                      modules={modules}
                      className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-100"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => { setIsEditing(false); alert("Changes saved locally for demo!"); }} 
                      className="px-8 py-3 bg-[#00BCD4] hover:bg-[#00acc1] text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">save</span> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <article className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                  prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                  prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300
                  prose-a:text-[#00BCD4] prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-700
                  prose-pre:bg-[#1e293b] prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:shadow-inner
                  prose-code:text-[#00BCD4] prose-code:bg-slate-100 dark:prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none"
                >
                  <div dangerouslySetInnerHTML={{ __html: currentContent }} />
                </article>
              )}

              {/* Navigasi Bawah (Next/Prev) */}
              <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                 
                 {/* Prev Button */}
                 <button 
                   disabled={activeStepIndex === 0}
                   onClick={() => handleStepChange(activeStepIndex - 1)}
                   className={`w-full sm:w-auto group px-6 py-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center sm:justify-start gap-3 ${
                     activeStepIndex === 0
                     ? 'opacity-0 pointer-events-none' 
                     : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-900 hover:shadow-md dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'
                   }`}
                 >
                   <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span> 
                   <div className="text-left hidden sm:block">
                      <span className="block text-[10px] text-slate-400 uppercase font-normal">Previous</span>
                      <span>{steps[activeStepIndex - 1]?.title}</span>
                   </div>
                   <span className="sm:hidden">Prev</span>
                 </button>
                 
                 {/* Next Button */}
                 <button 
                   disabled={activeStepIndex === steps.length - 1}
                   onClick={() => handleStepChange(activeStepIndex + 1)}
                   className={`w-full sm:w-auto group px-6 py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center sm:justify-end gap-3 ${
                     activeStepIndex === steps.length - 1
                     ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                     : 'bg-[#1b2636] text-white hover:bg-[#263548] shadow-lg hover:shadow-xl dark:bg-white dark:text-[#1b2636]'
                   }`}
                 >
                   <span className="sm:hidden">Next</span>
                   <div className="text-right hidden sm:block">
                      <span className="block text-[10px] opacity-60 uppercase font-normal">Next Step</span>
                      <span>{steps[activeStepIndex + 1]?.title || 'Finish'}</span>
                   </div>
                   <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                 </button>
              </div>

          </div>
        </main>

        {/* =========================================================
            RIGHT COLUMN: SIDEBAR (Navigasi & File)
            ========================================================= */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-6 order-2">
           
           {/* 1. PROGRESS TRACKER */}
           <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Article Progress</span>
                <span className="text-xl font-extrabold text-[#00BCD4]">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#00BCD4] h-full rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Reading step {activeStepIndex + 1} of {steps.length}
              </p>
           </div>

           {/* 2. TABLE OF CONTENTS */}
           <div className="space-y-1">
             <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Table of Contents</p>
             {steps.map((step, idx) => (
               <button
                 key={idx}
                 onClick={() => handleStepChange(idx)}
                 className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all flex items-start gap-3 border group ${
                   activeStepIndex === idx
                   ? 'bg-[#00BCD4]/10 border-[#00BCD4] text-[#00BCD4] shadow-sm'
                   : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-200'
                 }`}
               >
                 <span className={`flex items-center justify-center size-5 rounded-full text-[10px] font-bold shrink-0 mt-0.5 ${
                   activeStepIndex === idx ? 'bg-[#00BCD4] text-white' : 'bg-slate-200 dark:bg-slate-600'
                 }`}>
                   {idx + 1}
                 </span>
                 <span className="line-clamp-2 leading-snug group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                   {step.title}
                 </span>
               </button>
             ))}
           </div>

        </aside>

      </div>
    </div>
  );
}