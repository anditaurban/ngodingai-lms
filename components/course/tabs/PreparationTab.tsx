'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Import Style React Quill New
import 'react-quill-new/dist/quill.snow.css'; 

// Import Dynamic untuk Editor (Client Side Only)
const ReactQuill = dynamic(() => import('react-quill-new'), {
  loading: () => <div className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>,
  ssr: false
});

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
  // Logic: Gunakan data 'steps' jika ada, fallback ke 'content_html'
  const steps: Step[] = data.steps || [
    { title: 'Introduction & Setup', content: data.content_html }
  ];

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State konten lokal untuk editor
  const [currentContent, setCurrentContent] = useState(steps[activeStepIndex].content);

  // Handle perpindahan step
  const handleStepChange = (index: number) => {
    setActiveStepIndex(index);
    setCurrentContent(steps[index].content);
    setIsEditing(false); 
  };

  // Konfigurasi Toolbar Editor
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
  }), []);

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* HEADER SECTION: Slides Button & Progress Bar */}
      <div className="flex flex-col md:flex-row gap-6">
        {data.slides_id && (
          <div 
            onClick={() => setShowSlideModal(true)}
            className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 cursor-pointer hover:border-[#00BCD4] transition-colors group"
          >
            <div className="size-12 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 border border-orange-100 dark:border-orange-800">
              <span className="material-symbols-outlined text-2xl">slideshow</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-[#00BCD4] transition-colors">Lecture Slides</h4>
              <p className="text-xs text-slate-500">Google Slides • View Only</p>
            </div>
            <span className="material-symbols-outlined ml-auto text-slate-300 group-hover:text-[#00BCD4]">open_in_new</span>
          </div>
        )}
        
        {/* Step Progress Indicator */}
        <div className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center gap-2">
           <div className="flex justify-between items-center">
             <h4 className="font-bold text-slate-900 dark:text-white text-sm">Article Progress</h4>
             <span className="text-xs text-slate-500 font-mono">Step {activeStepIndex + 1}/{steps.length}</span>
           </div>
           <div className="flex gap-1.5 h-2">
             {steps.map((_, idx) => (
               <div 
                 key={idx} 
                 className={`flex-1 rounded-full transition-all duration-300 ${
                   idx <= activeStepIndex ? 'bg-[#00BCD4]' : 'bg-slate-100 dark:bg-slate-700'
                 }`}
               />
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR: Step Navigation */}
        <div className="lg:col-span-3 space-y-2 sticky top-24">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Table of Contents</p>
           {steps.map((step, idx) => (
             <button
               key={idx}
               onClick={() => handleStepChange(idx)}
               className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 border ${
                 activeStepIndex === idx
                 ? 'bg-[#00BCD4] text-white border-[#00BCD4] shadow-md transform scale-105'
                 : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
               }`}
             >
               <span className={`flex items-center justify-center size-6 rounded-full text-xs font-bold shrink-0 ${
                 activeStepIndex === idx ? 'bg-white text-[#00BCD4]' : 'bg-slate-200 dark:bg-slate-600'
               }`}>
                 {idx + 1}
               </span>
               <span className="line-clamp-2 leading-tight">{step.title}</span>
             </button>
           ))}
        </div>

        {/* RIGHT CONTENT: Article Viewer / Editor */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-800 p-6 md:p-10 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative min-h-125">
            
            {/* Tombol Edit */}
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className={`absolute top-6 right-6 p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${
                isEditing 
                ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                : 'bg-slate-50 text-slate-500 hover:bg-[#00BCD4] hover:text-white dark:bg-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{isEditing ? 'close' : 'edit_note'}</span>
              {isEditing ? 'Cancel Edit' : 'Edit Article'}
            </button>

            {/* Judul Artikel */}
            <div className="mb-8 pb-6 border-b border-slate-100 dark:border-slate-700 pr-24">
               <span className="text-[#00BCD4] text-xs font-bold uppercase tracking-wider mb-2 block">
                 Step {activeStepIndex + 1}: Knowledge Base
               </span>
               <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                 {steps[activeStepIndex].title}
               </h2>
            </div>

            {/* MODE EDIT vs BACA */}
            {isEditing ? (
              <div className="animate-fade-in flex flex-col gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  {/* React Quill Editor */}
                  {/* @ts-ignore - Ignore type error sementara jika props library belum sinkron */}
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
                    onClick={() => { setIsEditing(false); alert("Changes saved locally!"); }} 
                    className="px-6 py-2.5 bg-[#00BCD4] hover:bg-[#00acc1] text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">save</span> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-[#00BCD4] prose-img:rounded-xl prose-pre:bg-[#1e293b] prose-pre:text-white">
                <div dangerouslySetInnerHTML={{ __html: currentContent }} />
              </article>
            )}

            {/* Navigasi Footer */}
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
               <button 
                 disabled={activeStepIndex === 0}
                 onClick={() => handleStepChange(activeStepIndex - 1)}
                 className="group px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
               >
                 <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span> 
                 Previous Step
               </button>
               
               <button 
                 disabled={activeStepIndex === steps.length - 1}
                 onClick={() => handleStepChange(activeStepIndex + 1)}
                 className="group px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:shadow-lg disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2 transition-all"
               >
                 Next Step 
                 <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
               </button>
            </div>
        </div>

      </div>

      {/* MODAL SLIDES */}
      {showSlideModal && data.slides_id && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-7xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative border border-slate-700">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500">slideshow</span> Lecture Presentation
              </h3>
              <button onClick={() => setShowSlideModal(false)} className="size-9 rounded-full bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-500 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex-1 bg-black relative">
              <iframe 
                src={`https://docs.google.com/presentation/d/${data.slides_id}/embed?start=false&loop=false&delayms=3000`} 
                frameBorder="0" width="100%" height="100%" allowFullScreen 
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}