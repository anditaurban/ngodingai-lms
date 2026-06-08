'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DM_Sans } from 'next/font/google';
import Cookies from 'js-cookie';

const googleSansAlt = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700', '800'] });

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL.slice(0, -1) : RAW_BASE_URL;

interface Chapter {
  id: string;
  title: string;
  type: 'article' | 'document' | 'video' | 'quiz';
  status: string;
  content?: string;
  url?: string;
}

interface Module {
  id: string;
  section: string;
  chapters: Chapter[];
}

export default function DynamicMaterialsTab({ courseSlug }: { courseSlug: string }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // State untuk menyimpan ID materi yang sudah diselesaikan
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>([]);

  // 1. Load progress dari localStorage saat awal komponen di-render
  useEffect(() => {
    const savedProgress = localStorage.getItem(`progress_${courseSlug}`);
    if (savedProgress) {
      try {
        setCompletedChapterIds(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Gagal memuat data progres lokal:", e);
      }
    }
  }, [courseSlug]);

  const fetchCurriculum = useCallback(async () => {
    setIsLoaded(false);
    
    try {
      if (!BASE_URL) return;
      
      const token = Cookies.get('api_token') || process.env.NEXT_PUBLIC_CUSTOMER_UPDATE_TOKEN || '';

      const response = await fetch(`${BASE_URL}/detail/course_curriculum/${courseSlug}`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      let resJson: any = {};
      try {
        resJson = await response.json();
      } catch (e) {
        console.warn("API tidak mengembalikan format JSON yang valid.");
      }

      if (response.ok && resJson.status === 'success' && resJson.detail?.curriculum) {
        const mappedModules: Module[] = resJson.detail.curriculum.map((sec: any, index: number) => ({
          id: String(sec.section_id || `sec-${index}`), // Hindari Math.random() agar tidak re-render bermasalah
          section: sec.title,
          chapters: (sec.materials || [])
            .filter((mat: any) => mat.content_html || mat.file_url)
            .map((mat: any) => ({
              id: String(mat.material_id),
              title: mat.title,
              type: mat.type || 'article',
              status: 'published',
              content: mat.content_html || '',
              url: mat.file_url || ''
            }))
        })).filter((mod: Module) => mod.chapters.length > 0); 

        setModules(mappedModules);

        if (mappedModules.length > 0 && mappedModules[0].chapters.length > 0) {
          // UX FIX: Awal buka halaman, semua bagian menutup (array kosong)
          setExpandedSections([]); 
          setActiveChapterId(mappedModules[0].chapters[0].id);
        }
      } else {
        console.warn(`[API Info] Kurikulum tidak ditemukan atau kosong. Status: ${response.status}`);
        setModules([]);
      }
    } catch (err) {
      console.error("[Fetch Error] Gagal memuat kurikulum:", err);
      setModules([]);
    } finally {
      setIsLoaded(true);
    }
  }, [courseSlug]);

  useEffect(() => {
    fetchCurriculum();
  }, [fetchCurriculum]);

  const flatChapters = useMemo(() => {
    return modules.flatMap(sec => sec.chapters);
  }, [modules]);

  // 2. LOGIC HITUNGAN PERSENAN PROGRESS
  const progressPercentage = useMemo(() => {
    if (flatChapters.length === 0) return 0;
    // Hitung berapa banyak materi unik dari flatChapters yang ada di list completed
    const completedCount = flatChapters.filter(c => completedChapterIds.includes(c.id)).length;
    return Math.round((completedCount / flatChapters.length) * 100);
  }, [flatChapters, completedChapterIds]);

  // 3. LOGIC CHECK APAKAH MATERI TERKUNCI (1 by 1)
  const isChapterUnlocked = useCallback((chapterId: string) => {
    const index = flatChapters.findIndex(c => c.id === chapterId);
    if (index <= 0) return true; // Materi pertama di urutan paling awal selalu terbuka
    
    // Materi ke-N terbuka hanya jika materi sebelumnya (N-1) sudah diselesaikan
    const prevChapter = flatChapters[index - 1];
    return completedChapterIds.includes(prevChapter.id);
  }, [flatChapters, completedChapterIds]);

  const currentIndex = flatChapters.findIndex(c => c.id === activeChapterId);
  const activeChapter = currentIndex !== -1 ? flatChapters[currentIndex] : null;
  
  const prevChapter = currentIndex > 0 ? flatChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex !== -1 && currentIndex < flatChapters.length - 1 ? flatChapters[currentIndex + 1] : null;

  // UX FIX: Hanya dapat membuka 1 bagian saja (Accordion mode)
  const toggleSection = (secId: string) => {
    setExpandedSections(prev => prev.includes(secId) ? [] : [secId]);
  };

  const handleNavigate = (chapterId: string, sectionId: string) => {
    setActiveChapterId(chapterId);
    // Saat navigasi lewat tombol prev/next, pastikan section-nya terbuka secara eksklusif
    setExpandedSections([sectionId]);
    window.scrollTo({ top: 100, behavior: 'smooth' }); 
  };

  // Fungsi pembantu saat user klik tombol "Materi Selanjutnya" / "Selesai"
  const markCurrentChapterAsComplete = () => {
    if (activeChapter && !completedChapterIds.includes(activeChapter.id)) {
      const updatedProgress = [...completedChapterIds, activeChapter.id];
      setCompletedChapterIds(updatedProgress);
      localStorage.setItem(`progress_${courseSlug}`, JSON.stringify(updatedProgress));
    }
  };

  const handleNextNavigation = () => {
    markCurrentChapterAsComplete(); // Simpan progres materi saat ini
    if (nextChapter) {
      handleNavigate(nextChapter.id, findSectionByChapter(nextChapter.id));
    }
  };

  const handleFinishCourse = () => {
    markCurrentChapterAsComplete();
    alert("Selamat! Anda telah menyelesaikan seluruh rangkaian materi kelas ini.");
  };

  const findSectionByChapter = (chapId: string) => {
      return modules.find(sec => sec.chapters.some(c => c.id === chapId))?.id || '';
  };

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
              <p className="font-bold animate-pulse">Menyiapkan Materi...</p>
          </div>
      );
  }

  const safeUrl = activeChapter?.type === 'document' ? getSafeDriveUrl(activeChapter.url) : activeChapter?.url;

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in pb-16 items-start">
      
      {/* SIDEBAR */}
      <aside className="w-full lg:w-80 shrink-0 bg-white dark:bg-[#111111] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden lg:sticky lg:top-24 flex flex-col lg:h-[calc(100vh-7rem)]">
         <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3">
            <h3 className={`text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 ${googleSansAlt.className}`}>
               <span className="material-symbols-outlined text-[#00BCD4]">menu_book</span> Daftar Materi
            </h3>
            
            {/* UI PROGRESS PERSENAN */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Progres Belajar</span>
                <span className="text-[#00BCD4]">{progressPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00BCD4] transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
         </div>
         
         <div className="p-3 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-2">
            {modules.length === 0 ? (
               <p className="text-center text-slate-400 text-sm py-8">Materi belum tersedia.</p>
            ) : modules.map((mod) => {
               const isExpanded = expandedSections.includes(mod.id);
               return (
                 <div key={mod.id} className="bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <button onClick={() => toggleSection(mod.id)} className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left outline-none">
                       <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{mod.section}</span>
                       <span className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-125 opacity-100 p-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                       <div className="space-y-1">
                          {mod.chapters.map(chapter => {
                             const isActive = activeChapterId === chapter.id;
                             const isUnlocked = isChapterUnlocked(chapter.id);
                             const isCompleted = completedChapterIds.includes(chapter.id);
                             
                             return (
                               <button 
                                 key={chapter.id} 
                                 disabled={!isUnlocked}
                                 onClick={() => isUnlocked && handleNavigate(chapter.id, mod.id)}
                                 className={`w-full text-left flex items-center justify-between gap-3 p-2.5 rounded-xl transition-all text-sm font-medium outline-none 
                                   ${isActive 
                                     ? 'bg-cyan-50 text-[#00BCD4] dark:bg-cyan-900/20 dark:text-cyan-400 font-bold border border-cyan-100 dark:border-cyan-800' 
                                     : !isUnlocked
                                       ? 'text-slate-300 dark:text-slate-600 opacity-60 cursor-not-allowed border border-transparent'
                                       : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                                   }`}
                               >
                                  <div className="flex items-center gap-2 overflow-hidden">
                                      <span className={`material-symbols-outlined text-[18px] shrink-0 ${isActive ? 'text-[#00BCD4]' : !isUnlocked ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400'}`}>
                                          {!isUnlocked ? 'lock' : chapter.type === 'article' ? 'article' : chapter.type === 'video' ? 'play_circle' : 'picture_as_pdf'}
                                      </span>
                                      <span className="truncate">{chapter.title}</span>
                                  </div>
                                  
                                  {/* Indikator Checklist Selesai */}
                                  {isCompleted && !isActive && (
                                    <span className="material-symbols-outlined text-[16px] text-emerald-500 shrink-0">check_circle</span>
                                  )}
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

      {/* AREA KONTEN */}
      <div className="flex-1 w-full flex flex-col gap-6">
         {activeChapter ? (
           <>
             <div className="bg-white dark:bg-[#111111] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden min-h-125 flex flex-col">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00BCD4]"></div>
                
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
                   <div>
                       <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                          <span className="material-symbols-outlined text-[16px] text-[#00BCD4]">
                             {activeChapter.type === 'article' ? 'menu_book' : activeChapter.type === 'video' ? 'play_circle' : 'picture_as_pdf'}
                          </span>
                          {activeChapter.type === 'article' ? 'Modul Bacaan' : activeChapter.type === 'video' ? 'Materi Video' : 'Dokumen Lampiran'}
                       </div>
                       <h2 className={`text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug ${googleSansAlt.className}`}>
                          {activeChapter.title}
                       </h2>
                   </div>

                   {activeChapter.type === 'document' && safeUrl && (
                      <a href={safeUrl.replace('/preview', '/view')} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1.5 bg-cyan-50 dark:bg-cyan-900/20 text-[#00BCD4] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#00BCD4] hover:text-white transition-all shadow-sm shrink-0">
                         <span className="material-symbols-outlined text-[18px]">open_in_new</span> Buka Penuh
                      </a>
                   )}
                </div>
                
                {activeChapter.type === 'article' && (
                   <div 
                     className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-[#00BCD4] prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 flex-1"
                     dangerouslySetInnerHTML={{ __html: activeChapter.content || '<p class="italic text-slate-400">Konten materi kosong.</p>' }}
                   />
                )}

                {(activeChapter.type === 'document' || activeChapter.type === 'video') && (
                   <div className="flex flex-col gap-4 flex-1">
                      <div className="relative w-full flex-1 aspect-4/3 md:aspect-16/10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f111a] shadow-inner group">
                         {safeUrl ? (
                            <>
                               <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-0 bg-slate-50 dark:bg-[#0f111a]">
                                  <span className="size-8 border-4 border-slate-200 dark:border-slate-800 border-t-[#00BCD4] rounded-full animate-spin mb-3"></span>
                                  <p className="text-sm font-medium animate-pulse">Memuat media...</p>
                               </div>
                               <iframe src={safeUrl} className="absolute inset-0 w-full h-full z-10 bg-transparent" allowFullScreen></iframe>
                            </>
                         ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center relative z-10">
                               <span className="material-symbols-outlined text-5xl mb-2">broken_image</span>
                               <p className="font-bold">Media belum dilampirkan.</p>
                            </div>
                         )}
                      </div>

                      {safeUrl && activeChapter.type === 'document' && (
                        <a href={safeUrl.replace('/preview', '/view')} target="_blank" rel="noreferrer" className="sm:hidden flex items-center justify-center gap-1.5 bg-cyan-50 dark:bg-cyan-900/20 text-[#00BCD4] px-4 py-3 rounded-xl text-xs font-bold hover:bg-[#00BCD4] hover:text-white transition-all shadow-sm w-full">
                            <span className="material-symbols-outlined text-[16px]">open_in_new</span> Buka di Tab Baru
                        </a>
                      )}
                   </div>
                )}
             </div>

             <div className="flex items-center justify-between mt-2">
                {prevChapter ? (
                   <button 
                     onClick={() => handleNavigate(prevChapter.id, findSectionByChapter(prevChapter.id))} 
                     className={`flex items-center gap-2 px-5 py-3 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 hover:border-[#00BCD4] hover:text-[#00BCD4] text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-bold transition-all shadow-sm active:scale-95 ${googleSansAlt.className}`}
                   >
                     <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                     <span className="hidden sm:inline">Materi Sebelumnya</span>
                     <span className="sm:hidden">Kembali</span>
                   </button>
                ) : <div></div>}

                {nextChapter ? (
                   <button 
                     onClick={handleNextNavigation} 
                     className={`flex items-center gap-2 px-6 py-3 bg-[#00BCD4] hover:bg-[#00acc1] text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95 ${googleSansAlt.className}`}
                   >
                     <span className="hidden sm:inline">Materi Selanjutnya</span>
                     <span className="sm:hidden">Lanjut</span>
                     <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                   </button>
                ) : (
                   <button 
                     onClick={handleFinishCourse}
                     className={`flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/20 active:scale-95 ${googleSansAlt.className}`}
                   >
                     <span className="material-symbols-outlined text-[18px]">check_circle</span> Selesaikan Modul
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