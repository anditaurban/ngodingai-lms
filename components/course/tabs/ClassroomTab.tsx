'use client';

import React, { useState, useEffect } from 'react';
import { Module, Video, CurriculumData } from '@/types'; 

interface ClassroomTabProps {
  curriculum?: Module[]; // Data dari courses.json (Default)
  legacyCurriculum?: CurriculumData; // Data dari curriculum.json (Prioritas jika ada Batch)
  slug?: string;
}

export default function ClassroomTab({ curriculum, legacyCurriculum, slug }: ClassroomTabProps) {
  
  // 1. Tentukan Batch Aktif Default
  // Kita cek apakah legacyCurriculum ada dan memiliki list batches
  const [activeBatch, setActiveBatch] = useState(() => {
    if (legacyCurriculum && legacyCurriculum.batches && legacyCurriculum.batches.length > 0) {
      // Default pilih batch pertama (biasanya yang terbaru)
      return legacyCurriculum.batches[0].id;
    }
    return '';
  });

  // 2. LOGIKA PRIORITAS DATA (PERBAIKAN UTAMA)
  // Cek apakah ada konten untuk batch yang sedang aktif?
  const batchContent = activeBatch && legacyCurriculum?.content 
    ? legacyCurriculum.content[activeBatch] 
    : null;

  // Jika batchContent ditemukan, GUNAKAN ITU. Jika tidak, fallback ke curriculum default.
  const modulesToRender = batchContent || curriculum || [];

  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  // 3. Effect: Reset video ke yang pertama saat Batch atau Modul berubah
  useEffect(() => {
    if (modulesToRender.length > 0 && modulesToRender[0].videos.length > 0) {
      setCurrentVideo(modulesToRender[0].videos[0]);
    }
  }, [activeBatch, modulesToRender]); 

  // 4. Helper: Generate URL Video (Support GDrive & YouTube)
  const isGDrive = (type?: string) => type === 'gdrive' || type === 'drive';

  const getVideoSrc = (video: Video) => {
    // Ambil ID dari field 'url' atau 'youtube_id'
    const videoId = video.url || video.youtube_id;
    
    if (!videoId) return '';

    if (isGDrive(video.type)) {
      return `https://drive.google.com/file/d/${videoId}/preview`;
    }
    
    // Default YouTube params
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* --- KIRI: VIDEO PLAYER --- */}
      <div className="lg:col-span-8 space-y-4">
        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border border-slate-800">
          {currentVideo ? (
            <iframe 
              className="w-full h-full" 
              src={getVideoSrc(currentVideo)}
              title={currentVideo.title}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-2">movie</span>
              <p>Select a video to start learning</p>
            </div>
          )}
        </div>
        {currentVideo && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-wider ${
                isGDrive(currentVideo.type) ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {isGDrive(currentVideo.type) ? 'Google Drive' : 'YouTube'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentVideo.title}</h2>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              {currentVideo.duration}
            </p>
          </div>
        )}
      </div>

      {/* --- KANAN: PLAYLIST & BATCH SELECTOR --- */}
      <div className="lg:col-span-4 flex flex-col h-150 lg:h-auto">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
          
          {/* Batch Dropdown (Hanya muncul jika ada data Batches) */}
          {legacyCurriculum && legacyCurriculum.batches && legacyCurriculum.batches.length > 0 && (
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Select Batch</label>
              <div className="relative">
                <select 
                  value={activeBatch} 
                  onChange={(e) => setActiveBatch(e.target.value)}
                  className="w-full bg-white dark:bg-[#0f111a] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg p-2.5 pr-8 appearance-none focus:ring-2 focus:ring-[#00BCD4] focus:border-[#00BCD4] cursor-pointer"
                >
                  {legacyCurriculum.batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>{batch.name}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </span>
              </div>
            </div>
          )}

          {/* List Modules & Videos */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
            {modulesToRender.length > 0 ? (
              modulesToRender.map((module, mIdx) => (
                <div key={mIdx} className="animate-fade-in">
                  {/* Sticky Module Header */}
                  <div className="px-2 mb-2 flex items-center gap-2 sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur z-10 py-2 border-b border-transparent">
                     <span className="size-2 rounded-full bg-[#00BCD4] shrink-0"></span>
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate" title={module.title}>
                       {module.title}
                     </h4>
                  </div>
                  
                  {/* Video List */}
                  <div className="space-y-1">
                    {module.videos.map((video) => (
                      <button
                        key={video.id}
                        onClick={() => setCurrentVideo(video)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all group border ${
                          currentVideo?.id === video.id 
                          ? 'bg-[#00BCD4]/10 border-[#00BCD4] text-[#00BCD4]' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700 border-transparent text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${
                          currentVideo?.id === video.id ? 'text-[#00BCD4]' : 'text-slate-400 group-hover:text-slate-600'
                        }`}>
                          {currentVideo?.id === video.id ? 'play_circle' : 'play_arrow'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium leading-tight line-clamp-2 ${
                             currentVideo?.id === video.id ? 'font-bold' : ''
                          }`}>
                            {video.title}
                          </p>
                          <span className="text-[10px] opacity-70 mt-1 inline-block font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                            {video.duration}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center text-slate-500 p-4">
                <span className="material-symbols-outlined text-3xl mb-2 opacity-50">folder_off</span>
                <p className="text-sm">No content available for this batch.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}