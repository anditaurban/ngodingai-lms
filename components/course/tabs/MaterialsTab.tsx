'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DM_Sans } from 'next/font/google';

const googleSansAlt = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700', '800'] });

interface Chapter {
  id: string;
  title: string;
  type: 'article' | 'document';
  status: string;
  content?: string;
  url?: string;
}

interface Module {
  id: string;
  section: string;
  chapters: Chapter[];
}

// Data Default: Sudah mencakup "Persiapan Tools" (Menggantikan PreparationTab lama)
const defaultModules: Module[] = [
  {
    id: 'sec-1',
    section: 'Bagian 1: Pengenalan',
    chapters: [
      { id: 'c-1', title: 'Apa itu AI & LLM?', type: 'article', status: 'published', content: '<h2>Selamat Datang!</h2><p>Di era modern ini, AI bukan lagi sekadar fiksi ilmiah. Mari kita pelajari dasar-dasar Large Language Models (LLM) dan bagaimana mereka merevolusi cara kita membuat aplikasi.</p>' },
      { id: 'c-2', title: 'Slide Presentasi Dasar AI', type: 'document', status: 'published', url: 'https://drive.google.com/file/d/1FjvYPdbGL77LunYwFDJk2GktKccDwmRp/preview' }
    ]
  },
  {
    id: 'sec-2',
    section: 'Bagian 2: Persiapan Tools',
    chapters: [
      { id: 'c-3', title: 'Instalasi Python & VS Code', type: 'article', status: 'published', content: '<h2>Setup Environment</h2><p>Pastikan Anda menginstal Python versi 3.10 ke atas. Ikuti panduan langkah demi langkah berikut ini untuk mengatur environment lokal Anda.</p>' },
      { id: 'c-4', title: 'Cheatsheet Git & Terminal (PDF)', type: 'document', status: 'published', url: 'https://drive.google.com/file/d/1avYJwZrnaiRrgEiomyN9biMLhEevG6sc/preview' }
    ]
  }
];

export default function MaterialsTab({ courseSlug = 'ngodingai' }: { courseSlug?: string, materials?: any }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadCurriculum = () => {
      const savedCurriculum = localStorage.getItem(`db_curriculum_${courseSlug}`);
      let loadedModules: Module[] = [];

      if (savedCurriculum && savedCurriculum.includes('c-1')) {
        const parsed = JSON.parse(savedCurriculum) as Module[];
        
        loadedModules = parsed.map(mod => ({
          ...mod,
          chapters: mod.chapters
            .filter(c => c.status === 'published')
            .map(c => {
              const contentData = localStorage.getItem(`db_content_${courseSlug}_${c.id}`);
              let extraContent = {};
              if (contentData) extraContent = JSON.parse(contentData);
              return { ...c, ...extraContent };
            })
        })).filter(mod => mod.chapters.length > 0); 
      }

      if (loadedModules.length === 0) {
        loadedModules = defaultModules;
      }

      setModules(loadedModules);
      
      if (loadedModules.length > 0 && loadedModules[0].chapters.length > 0) {
         setExpandedSections(prev => prev.length === 0 ? [loadedModules[0].id] : prev);
         setActiveChapterId(prev => prev === '' ? loadedModules[0].chapters[0].id : prev);
      }
      setIsLoaded(true);
    };

    loadCurriculum();
    
    // Menangkap sinyal Auto-Sync dari Tiptap Workspace
    window.addEventListener('storage', loadCurriculum);
    return () => window.removeEventListener('storage', loadCurriculum);
  }, [courseSlug]);

  const flatChapters = useMemo(() => {
    return modules.flatMap(sec => sec.chapters);
  }, [modules]);

  useEffect(() => {
    if (flatChapters.length > 0 && !flatChapters.some(c => c.id === activeChapterId)) {
       setActiveChapterId(flatChapters[0].id);
       const parentSec = modules.find(m => m.chapters.some(c => c.id === flatChapters[0].id));
       if (parentSec && !expandedSections.includes(parentSec.id)) {
          setExpandedSections(prev => [...prev, parentSec.id]);
       }
    }
  }, [flatChapters, activeChapterId, modules, expandedSections]);

  const currentIndex = flatChapters.findIndex(c => c.id === activeChapterId);
  const activeChapter = currentIndex !== -1 ? flatChapters[currentIndex] : null;
  
  const prevChapter = currentIndex > 0 ? flatChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex !== -1 && currentIndex < flatChapters.length - 1 ? flatChapters[currentIndex + 1] : null;

  const toggleSection = (secId: string) => {
    setExpandedSections(prev => 
      prev.includes(secId) ? prev.filter(id => id !== secId) : [...prev, secId]
    );
  };

  const handleNavigate = (chapterId: string, sectionId: string) => {
    setActiveChapterId(chapterId);
    if (!expandedSections.includes(sectionId)) {
       setExpandedSections(prev => [...prev, sectionId]);
    }
    window.scrollTo({ top: 100, behavior: 'smooth' }); 
  };

  const findSectionByChapter = (chapId: string) => {
     return modules.find(sec => sec.chapters.some(c => c.id === chapId))?.id || '';
  };

  // ✨ Helper untuk memastikan URL Google Drive aman & menjadi mode /preview
  const getSafeDriveUrl = (url?: string) => {
    if (!url) return '';
    const match = url.match(/(?:file\/d\/|id=)([\w-]+)/);
    if (match) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  if (!isLoaded) {
      return (
          <div className="flex flex-col items-center justify-center h-125 text-slate-400 gap-4">
              <span className="size-8 border-4 border-slate-200 border-t-[#00BCD4] rounded-full animate-spin"></span>
              <p className="font-bold animate-pulse">Menyinkronkan Materi...</p>
          </div>
      );
  }

  const safeUrl = activeChapter?.type === 'document' ? getSafeDriveUrl(activeChapter.url) : '';

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in pb-16 items-start">
      
      <aside className="w-full lg:w-80 shrink-0 bg-white dark:bg-[#111111] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden lg:sticky lg:top-24">
         <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <h3 className={`text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 ${googleSansAlt.className}`}>
               <span className="material-symbols-outlined text-[#00BCD4]">menu_book</span> Daftar Materi
            </h3>
         </div>
         <div className="p-3 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-2">
            {modules.map((mod) => {
               const isExpanded = expandedSections.includes(mod.id);
               return (
                 <div key={mod.id} className="bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <button onClick={() => toggleSection(mod.id)} className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left outline-none">
                       <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{mod.section}</span>
                       <span className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 p-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                       <div className="space-y-1">
                          {mod.chapters.map(chapter => {
                             const isActive = activeChapterId === chapter.id;
                             return (
                               <button 
                                 key={chapter.id} 
                                 onClick={() => handleNavigate(chapter.id, mod.id)}
                                 className={`w-full text-left flex items-center justify-between gap-3 p-2.5 rounded-xl transition-all text-sm font-medium outline-none ${isActive ? 'bg-cyan-50 text-[#00BCD4] dark:bg-cyan-900/20 dark:text-cyan-400 font-bold border border-cyan-100 dark:border-cyan-800' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'}`}
                               >
                                  <div className="flex items-center gap-2 overflow-hidden">
                                      <span className={`material-symbols-outlined text-[18px] shrink-0 ${isActive ? 'text-[#00BCD4]' : 'text-slate-400'}`}>
                                         {chapter.type === 'article' ? 'article' : 'picture_as_pdf'}
                                      </span>
                                      <span className="truncate">{chapter.title}</span>
                                  </div>
                                  {isActive && <span className="size-1.5 rounded-full bg-[#00BCD4] shrink-0 animate-pulse"></span>}
                               </button>
                             );
                          })}
                       </div>
                    </div>
                 </div>
               );
            })}
         </div>
      </aside>

      <div className="flex-1 w-full flex flex-col gap-6">
         {activeChapter ? (
           <>
             <div className="bg-white dark:bg-[#111111] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden min-h-125 flex flex-col">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00BCD4]"></div>
                
                {/* Header Konten Materi */}
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
                   <div>
                       <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                          <span className="material-symbols-outlined text-[16px] text-[#00BCD4]">{activeChapter.type === 'article' ? 'menu_book' : 'picture_as_pdf'}</span>
                          {activeChapter.type === 'article' ? 'Modul Bacaan' : 'Dokumen Lampiran'}
                       </div>
                       <h2 className={`text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug ${googleSansAlt.className}`}>
                          {activeChapter.title}
                       </h2>
                   </div>

                   {/* Tombol Fallback untuk Dokumen */}
                   {activeChapter.type === 'document' && safeUrl && (
                      <a href={safeUrl.replace('/preview', '/view')} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1.5 bg-cyan-50 dark:bg-cyan-900/20 text-[#00BCD4] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#00BCD4] hover:text-white transition-all shadow-sm shrink-0">
                         <span className="material-symbols-outlined text-[18px]">open_in_new</span> Buka Penuh
                      </a>
                   )}
                </div>
                
                {/* Render Artikel Tiptap */}
                {activeChapter.type === 'article' && (
                   <div 
                     className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-[#00BCD4] prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 flex-1"
                     dangerouslySetInnerHTML={{ __html: activeChapter.content || '<p class="italic text-slate-400">Konten materi sedang dipersiapkan...</p>' }}
                   />
                )}

                {/* Render Iframe Dokumen */}
                {activeChapter.type === 'document' && (
                   <div className="flex flex-col gap-4 flex-1">
                      <div className="relative w-full flex-1 aspect-4/3 md:aspect-16/10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-[#0f111a] shadow-inner group">
                         {safeUrl ? (
                            <>
                                {/* Overlay GDrive (Jika diblokir) */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-0 p-8 text-center bg-[#0f111a]">
                                   <span className="material-symbols-outlined text-4xl mb-3 opacity-50">block</span>
                                   <p className="text-sm font-medium mb-4">Jika dokumen dibatasi oleh Google, klik tombol di bawah.</p>
                                   <a href={safeUrl.replace('/preview', '/view')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#00BCD4] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg hover:bg-[#00acc1] relative z-20">
                                      <span className="material-symbols-outlined text-[18px]">open_in_new</span> Buka di Google Drive
                                   </a>
                                </div>
                                <iframe src={safeUrl} className="absolute inset-0 w-full h-full z-10 bg-transparent" allowFullScreen></iframe>
                            </>
                         ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center relative z-10">
                               <span className="material-symbols-outlined text-5xl mb-2">broken_image</span>
                               <p className="font-bold">Dokumen belum dilampirkan.</p>
                            </div>
                         )}
                      </div>

                      {/* Tombol Fallback Mobile */}
                      {safeUrl && (
                        <a href={safeUrl.replace('/preview', '/view')} target="_blank" rel="noreferrer" className="sm:hidden flex items-center justify-center gap-1.5 bg-cyan-50 dark:bg-cyan-900/20 text-[#00BCD4] px-4 py-3 rounded-xl text-xs font-bold hover:bg-[#00BCD4] hover:text-white transition-all shadow-sm w-full">
                           <span className="material-symbols-outlined text-[16px]">open_in_new</span> Buka di Tab Baru
                        </a>
                      )}
                   </div>
                )}
             </div>

             {/* Navigasi Prev / Next */}
             <div className="flex items-center justify-between mt-2">
                {prevChapter ? (
                   <button 
                     onClick={() => handleNavigate(prevChapter.id, findSectionByChapter(prevChapter.id))} 
                     className={`flex items-center gap-2 px-5 py-3 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 hover:border-[#00BCD4] hover:text-[#00BCD4] text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-bold transition-all shadow-sm active:scale-95 ${googleSansAlt.className}`}
                   >
                     <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                     <span className="hidden sm:inline truncate max-w-37.5">{prevChapter.title}</span>
                     <span className="sm:hidden">Kembali</span>
                   </button>
                ) : <div></div>}

                {nextChapter ? (
                   <button 
                     onClick={() => handleNavigate(nextChapter.id, findSectionByChapter(nextChapter.id))} 
                     className={`flex items-center gap-2 px-6 py-3 bg-[#00BCD4] hover:bg-[#00acc1] text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95 ${googleSansAlt.className}`}
                   >
                     <span className="hidden sm:inline truncate max-w-37.5">{nextChapter.title}</span>
                     <span className="sm:hidden">Lanjut</span>
                     <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                   </button>
                ) : (
                   <button className={`flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/20 cursor-default ${googleSansAlt.className}`}>
                     <span className="material-symbols-outlined text-[18px]">check_circle</span> Modul Selesai
                   </button>
                )}
             </div>
           </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#111111] rounded-3xl border border-slate-200 dark:border-slate-800 h-125">
               <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">menu_book</span>
               <p className="text-slate-500 font-medium">Pilih materi di menu samping untuk mulai belajar.</p>
            </div>
         )}
      </div>
    </div>
  );
}