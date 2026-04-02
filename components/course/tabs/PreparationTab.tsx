'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DM_Sans, Inter } from 'next/font/google';
import { useToast } from '@/components/ui/ToastProvider';

const inter = Inter({ subsets: ['latin'] });
const googleSansAlt = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700', '800'] });

interface Step {
  id: string;
  section: string;
  title: string;
  type: 'article' | 'video' | 'quiz';
  content?: string;
  url?: string;
  questions?: any[];
}

interface PreparationTabProps {
  data?: any;
  courseSlug?: string;
}

export default function PreparationTab({ courseSlug = 'ngodingai' }: PreparationTabProps) {
  const { showToast } = useToast();
  const [steps, setSteps] = useState<Step[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isSyncing, setIsSyncing] = useState(true);
  
  // State Interaktif untuk Siswa (Kuis)
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // ✨ STATE BARU: Untuk mengontrol Accordion Sidebar ✨
  const [expandedSection, setExpandedSection] = useState<string>('');

  // SINKRONISASI DATABASE LOKAL
  useEffect(() => {
      const fetchFromDatabase = () => {
          setIsSyncing(true);
          const dbCurriculum = localStorage.getItem(`db_curriculum_${courseSlug}`);
          let dynamicSteps: Step[] = [];

          if (dbCurriculum) {
              const parsedModules = JSON.parse(dbCurriculum);
              
              parsedModules.forEach((mod: any) => {
                  mod.chapters.forEach((chap: any) => {
                      if (chap.status === 'published') {
                          const contentData = localStorage.getItem(`db_content_${courseSlug}_${chap.id}`);
                          let payload: any = {};
                          if (contentData) payload = JSON.parse(contentData);
                          
                          dynamicSteps.push({
                              id: chap.id,
                              section: mod.section,
                              title: chap.title,
                              type: chap.type,
                              content: payload.content || '<p class="italic text-slate-400">Konten artikel sedang dipersiapkan.</p>',
                              url: payload.url || '',
                              questions: payload.questions || []
                          });
                      }
                  });
              });
          }

          if (dynamicSteps.length === 0) {
              dynamicSteps = [{ id: 'dummy-1', section: 'Materi Pengantar', title: 'Belum Ada Materi', type: 'article', content: '<p>Instruktur belum mempublikasikan materi.</p>' }];
          }

          setSteps(dynamicSteps);
          if (activeStepIndex >= dynamicSteps.length) setActiveStepIndex(0);
          setIsSyncing(false);
      };

      fetchFromDatabase();
      window.addEventListener('storage', fetchFromDatabase);
      return () => window.removeEventListener('storage', fetchFromDatabase);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug]);

  // ✨ LOGIKA PENGELOMPOKAN OTOMATIS (GROUPING) UNTUK SIDEBAR ✨
  const groupedModules = useMemo(() => {
    const groups: { section: string; chapters: { step: Step; globalIndex: number }[] }[] = [];
    
    steps.forEach((step, index) => {
      let group = groups.find(g => g.section === step.section);
      if (!group) {
        group = { section: step.section, chapters: [] };
        groups.push(group);
      }
      group.chapters.push({ step, globalIndex: index });
    });
    
    return groups;
  }, [steps]);

  // Auto-expand Accordion menyesuaikan bab yang sedang dibaca
  useEffect(() => {
    if (steps.length > 0 && steps[activeStepIndex]) {
      setExpandedSection(steps[activeStepIndex].section);
    }
  }, [activeStepIndex, steps]);


  const handleStepChange = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setActiveStepIndex(index);
      setQuizAnswers({});
      setQuizSubmitted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Opsional: Scroll ke atas saat ganti bab
    }
  };

  const submitQuiz = () => {
     const currentQuestions = steps[activeStepIndex].questions || [];
     let correct = 0;
     currentQuestions.forEach((q, idx) => {
        if (quizAnswers[idx] === q.correctIndex) correct++;
     });
     setQuizScore(Math.round((correct / currentQuestions.length) * 100));
     setQuizSubmitted(true);
     showToast('success', 'Kuis berhasil disubmit!');
  };

  const progressPercentage = steps.length > 0 ? Math.round(((activeStepIndex + 1) / steps.length) * 100) : 0;
  const activeStep = steps[activeStepIndex];

  if (isSyncing) return (
    <div className="h-125 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
       <span className="size-8 border-4 border-slate-200 border-t-[#00BCD4] rounded-full animate-spin"></span>
       <span className="text-slate-500 font-medium animate-pulse">Menyinkronkan kurikulum terbaru...</span>
    </div>
  );

  return (
    <div className={`animate-fade-in relative ${inter.className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =========================================================
            KONTEN UTAMA (KIRI)
        ========================================================= */}
        <main className="lg:col-span-9 order-1">
          <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative min-h-125 flex flex-col">
              
              {/* Header Konten Aktif */}
              <div className="flex flex-col mb-8 pb-6 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                     <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${activeStep?.type === 'video' ? 'text-blue-500' : activeStep?.type === 'quiz' ? 'text-amber-500' : 'text-[#00BCD4]'}`}>
                       <span className={`material-symbols-outlined text-[18px]`}>{activeStep?.type === 'video' ? 'play_circle' : activeStep?.type === 'quiz' ? 'quiz' : 'article'}</span>
                       {activeStep?.section || 'Modul'}
                     </span>
                  </div>
                  <h1 className={`text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight ${googleSansAlt.className}`}>
                    {activeStep?.title}
                  </h1>
              </div>

              {/* DYNAMIC CONTENT RENDERER */}
              <div className="flex-1">
                  
                  {activeStep?.type === 'article' && (
                    <article className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                      prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                      prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300
                      prose-a:text-[#00BCD4] prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-700
                      prose-pre:bg-slate-900 prose-pre:text-emerald-400 prose-pre:rounded-xl prose-pre:shadow-inner prose-pre:p-5
                      prose-code:text-[#00BCD4] prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                      prose-blockquote:border-l-4 prose-blockquote:border-[#00BCD4] prose-blockquote:bg-cyan-50 dark:prose-blockquote:bg-cyan-900/10 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300"
                    >
                      <div dangerouslySetInnerHTML={{ __html: activeStep.content || '' }} />
                    </article>
                  )}

                  {activeStep?.type === 'video' && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl bg-slate-900">
                       {activeStep.url ? (
                         <iframe 
                           src={`https://www.youtube.com/embed/${activeStep.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2]}`} 
                           className="absolute inset-0 w-full h-full" 
                           allowFullScreen>
                         </iframe>
                       ) : (
                         <div className="flex items-center justify-center h-full text-slate-500">Video belum tersedia.</div>
                       )}
                    </div>
                  )}

                  {activeStep?.type === 'quiz' && (
                    <div className="space-y-8">
                       {quizSubmitted && (
                         <div className={`p-6 rounded-2xl border ${quizScore >= 80 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800'} text-center`}>
                            <h3 className={`text-2xl font-bold mb-2 ${googleSansAlt.className}`}>Nilai Anda: {quizScore}</h3>
                            <p className="text-sm">{quizScore >= 80 ? 'Luar biasa! Anda telah memahami materi dengan baik.' : 'Terus semangat! Anda bisa mengulang materi jika diperlukan.'}</p>
                         </div>
                       )}

                       {activeStep.questions?.map((q, qIndex) => (
                         <div key={qIndex} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <p className="font-bold text-slate-800 dark:text-white mb-4 leading-relaxed">{qIndex + 1}. {q.text}</p>
                            <div className="space-y-3">
                               {q.options.map((opt: string, i: number) => (
                                 <label key={i} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${quizAnswers[qIndex] === i ? 'bg-amber-100 border-amber-400 dark:bg-amber-900/30' : 'bg-white border-slate-200 hover:border-amber-300 dark:bg-slate-800 dark:border-slate-700'}`}>
                                    <input type="radio" name={`q-${qIndex}`} className="size-4 text-amber-500 focus:ring-amber-500" disabled={quizSubmitted} checked={quizAnswers[qIndex] === i} onChange={() => setQuizAnswers({...quizAnswers, [qIndex]: i})} />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{opt}</span>
                                    {quizSubmitted && q.correctIndex === i && <span className="ml-auto material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>}
                                    {quizSubmitted && quizAnswers[qIndex] === i && q.correctIndex !== i && <span className="ml-auto material-symbols-outlined text-red-500 text-[18px]">cancel</span>}
                                 </label>
                               ))}
                            </div>
                         </div>
                       ))}

                       {!quizSubmitted && (
                         <button onClick={submitQuiz} className={`w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-amber-500/20 active:scale-95 transition-all ${googleSansAlt.className}`}>
                           Kumpulkan Jawaban
                         </button>
                       )}
                    </div>
                  )}
              </div>

              {/* Navigasi Bawah (Previous / Next) */}
              <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <button disabled={activeStepIndex === 0} onClick={() => handleStepChange(activeStepIndex - 1)} className={`w-full sm:w-auto group px-6 py-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center sm:justify-start gap-3 ${activeStepIndex === 0 ? 'opacity-0 pointer-events-none' : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-900 hover:shadow-md dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'}`}>
                   <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span> 
                   <div className="text-left hidden sm:block">
                      <span className="block text-[10px] text-slate-400 uppercase font-normal">Sebelumnya</span>
                      <span className="truncate max-w-37.5 block">{steps[activeStepIndex - 1]?.title}</span>
                   </div>
                   <span className="sm:hidden">Prev</span>
                 </button>
                 <button disabled={activeStepIndex === steps.length - 1} onClick={() => handleStepChange(activeStepIndex + 1)} className={`w-full sm:w-auto group px-6 py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center sm:justify-end gap-3 ${activeStepIndex === steps.length - 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800/50 dark:border dark:border-slate-700' : 'bg-[#1b2636] text-white hover:bg-[#263548] shadow-lg hover:shadow-xl dark:bg-white dark:text-[#1b2636]'}`}>
                   <span className="sm:hidden">Next</span>
                   <div className="text-right hidden sm:block">
                      <span className="block text-[10px] opacity-60 uppercase font-normal">Selanjutnya</span>
                      <span className="truncate max-w-37.5 block">{steps[activeStepIndex + 1]?.title || 'Selesai'}</span>
                   </div>
                   <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                 </button>
              </div>

          </div>
        </main>

        {/* =========================================================
            SIDEBAR DAFTAR ISI SISWA (ACCORDION)
        ========================================================= */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-6 order-2">
           
           {/* Progress Tracker */}
           <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</span>
                <span className="text-xl font-extrabold text-[#00BCD4]">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-[#00BCD4] h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
              </div>
           </div>

           {/* ✨ NEW: Auto-Grouped Accordion Curriculum ✨ */}
           <div className="space-y-3">
             <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Daftar Isi</p>
             
             {groupedModules.map((group, groupIdx) => {
               const isExpanded = expandedSection === group.section;
               
               return (
                 <div key={groupIdx} className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
                   
                   {/* Header Accordion */}
                   <button 
                     onClick={() => setExpandedSection(isExpanded ? '' : group.section)}
                     className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors outline-none"
                   >
                     <p className={`text-xs font-bold uppercase tracking-wider truncate mr-2 ${isExpanded ? 'text-[#00BCD4]' : 'text-slate-600 dark:text-slate-400'}`}>
                       {group.section}
                     </p>
                     <span className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180 text-[#00BCD4]' : ''}`}>
                       expand_more
                     </span>
                   </button>

                   {/* Body Accordion (Daftar Bab di dalam Bagian ini) */}
                   <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-200 opacity-100 pb-3 px-3' : 'max-h-0 opacity-0'}`}>
                     <div className="space-y-1 mt-1 border-t border-slate-100 dark:border-slate-800 pt-2">
                       {group.chapters.map((ch) => {
                         const isActive = activeStepIndex === ch.globalIndex;
                         return (
                           <button
                             key={ch.step.id}
                             onClick={() => handleStepChange(ch.globalIndex)}
                             className={`w-full text-left flex items-center justify-between gap-3 p-2.5 rounded-xl transition-all group ${isActive ? 'bg-[#00BCD4]/10 dark:bg-cyan-900/20 shadow-sm border border-[#00BCD4]/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'}`}
                           >
                             <div className="flex items-center gap-2.5 overflow-hidden">
                               <span className={`material-symbols-outlined text-[18px] shrink-0 transition-colors ${isActive ? (ch.step.type === 'video' ? 'text-blue-500' : ch.step.type === 'quiz' ? 'text-amber-500' : 'text-[#00BCD4]') : 'text-slate-400 group-hover:text-slate-500'}`}>
                                 {ch.step.type === 'video' ? 'play_circle' : ch.step.type === 'quiz' ? 'quiz' : 'article'}
                               </span>
                               <span className={`text-xs font-medium truncate transition-colors ${isActive ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                 {ch.step.title}
                               </span>
                             </div>
                             
                             {/* Indikator "Sedang Dibaca" (Dot) */}
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

      </div>
    </div>
  );
}