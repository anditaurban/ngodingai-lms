'use client';

import React, { useState, useEffect } from 'react';
import { DM_Sans } from 'next/font/google';
import { useClassroomVideos, VideoData } from '@/hooks/useClassroomVideos'; 

const googleSansAlt = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700', '800'] });

interface VideosTabProps {
  courseId?: number; 
  slug?: string;
}

export default function VideosTab({ courseId = 1, slug }: VideosTabProps) {
  // ✨ UPDATE HEAD TEAM: Ambil customer_id dari session ✨
  const [customerId, setCustomerId] = useState<number | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem('user_profile');
    if (sessionStr) {
      try {
        const user = JSON.parse(sessionStr);
        if (user.customer_id) {
          setCustomerId(user.customer_id);
        }
      } catch (e) {
        console.error("Gagal membaca session:", e);
      }
    }
  }, []);

  // Memanggil Hook API Asli (Production) dengan tambahan parameter customerId
  const {
    batches,
    selectedBatch,
    isLoadingList,
    isLoadingDetail,
    error,
    fetchBatchDetail
  } = useClassroomVideos(courseId, customerId);

  const [activeBatchId, setActiveBatchId] = useState<number | ''>('');
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);

  // Auto-select batch pertama saat data batch berhasil di-load
  useEffect(() => {
    if (batches.length > 0 && activeBatchId === '') {
      setActiveBatchId(batches[0].batch_id);
    }
  }, [batches, activeBatchId]);

  // Auto-select video pertama saat detail batch berhasil di-load
  useEffect(() => {
    if (selectedBatch && selectedBatch.videos && selectedBatch.videos.length > 0) {
      const isVideoInCurrentBatch = selectedBatch.videos.some(v => v.video_id === currentVideo?.video_id);
      if (!currentVideo || !isVideoInCurrentBatch) {
        setCurrentVideo(selectedBatch.videos[0]);
      }
    } else if (selectedBatch && selectedBatch.videos?.length === 0) {
      setCurrentVideo(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBatch]); 

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const batchId = Number(e.target.value);
    setActiveBatchId(batchId);
    fetchBatchDetail(batchId); 
  };

  // Helper Functions dari kode asli Anda
  const isGDrive = (type?: string) => {
    if (!type) return false;
    const t = type.toLowerCase();
    return t.includes('drive') || t === 'gdrive' || t === 'google_drive';
  };

  const getCleanVideoId = (video: VideoData) => {
    const rawInput = video.video_url?.trim();
    if (!rawInput) return '';

    if (isGDrive(video.platform_type)) {
      let driveId = rawInput;
      if (rawInput.includes('drive.google.com') || rawInput.includes('http')) {
        const driveRegex = /(?:id=|file\/d\/|folders\/)([\w-]+)/;
        const match = rawInput.match(driveRegex);
        if (match && match[1]) driveId = match[1];
      }
      return driveId;
    }
    
    let ytId = rawInput;
    if (rawInput.includes('youtube.com') || rawInput.includes('youtu.be') || rawInput.includes('http')) {
      const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const ytMatch = rawInput.match(ytRegex);
      if (ytMatch && ytMatch[1]) ytId = ytMatch[1];
    }
    return ytId;
  };

  const getVideoEmbedUrl = (video: VideoData) => {
    const id = getCleanVideoId(video);
    if (!id) return '';
    if (isGDrive(video.platform_type)) {
      return `https://drive.google.com/file/d/${id}/preview`;
    }
    return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0&modestbranding=1`;
  };

  const getVideoExternalUrl = (video: VideoData) => {
    const id = getCleanVideoId(video);
    if (!id) return '#';
    if (isGDrive(video.platform_type)) {
      return `https://drive.google.com/file/d/${id}/view?usp=sharing`;
    }
    return `https://www.youtube.com/watch?v=${id}`;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* HEADER & BATCH SELECTOR (UI Baru) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-[#111111] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
         <div className="flex items-center gap-3">
            <div className="size-10 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center">
               <span className="material-symbols-outlined text-[20px]">smart_display</span>
            </div>
            <div>
               <h3 className={`text-base font-bold text-slate-900 dark:text-white ${googleSansAlt.className}`}>Rekaman Live Class</h3>
               <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  {isLoadingList ? 'Memuat Angkatan...' : `Tersedia ${batches.length} Angkatan`}
               </p>
            </div>
         </div>
         <div className="relative w-full sm:w-72">
             <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none">expand_more</span>
             <select 
                value={activeBatchId} 
                onChange={handleBatchChange}
                disabled={isLoadingList || batches.length === 0}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-red-500/50 appearance-none shadow-sm disabled:opacity-50"
             >
                {batches.length === 0 && <option value="">Belum ada batch</option>}
                {batches.map((batch) => (
                  <option key={batch.batch_id} value={batch.batch_id} className="font-medium text-slate-700">
                    {batch.batch_name} — ({batch.batch_period})
                  </option>
                ))}
             </select>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         
         {/* KOLOM KIRI: DAFTAR REKAMAN API */}
         <div className="lg:col-span-4 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col lg:sticky lg:top-24">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daftar Sesi</h4>
               <span className="text-xs font-bold bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                  {selectedBatch?.videos?.length || 0} Video
               </span>
            </div>
            
            <div className="p-2 max-h-125 overflow-y-auto custom-scrollbar flex flex-col gap-1.5">
               {isLoadingDetail ? (
                  // Skeleton Loading
                  [1, 2, 3].map((i) => (
                    <div key={i} className="w-full h-20 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>
                  ))
               ) : selectedBatch?.videos && selectedBatch.videos.length > 0 ? (
                  selectedBatch.videos.map(vid => {
                     const isActive = currentVideo?.video_id === vid.video_id;
                     const isDrive = isGDrive(vid.platform_type);
                     return (
                        <button 
                           key={vid.video_id}
                           onClick={() => setCurrentVideo(vid)}
                           className={`w-full flex flex-col text-left p-3.5 rounded-xl transition-all border outline-none ${isActive ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-sm' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                           <span className={`text-sm font-bold mb-1 truncate w-full ${isActive ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                              {vid.video_title}
                           </span>
                           <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              <span className="flex items-center gap-1">
                                 <span className="material-symbols-outlined text-[12px]">schedule</span> {vid.video_duration}
                              </span>
                              <span className="flex items-center gap-1">
                                 <span className={`material-symbols-outlined text-[12px] ${isDrive ? 'text-emerald-500' : 'text-red-500'}`}>play_circle</span> 
                                 {isDrive ? 'GDrive' : 'YouTube'}
                              </span>
                           </div>
                        </button>
                     );
                  })
               ) : (
                  !isLoadingList && (
                     <div className="py-10 text-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">videocam_off</span>
                        <p className="text-sm font-medium">Belum ada rekaman di angkatan ini.</p>
                     </div>
                  )
               )}
            </div>
         </div>

         {/* KOLOM KANAN: PLAYER VIDEO */}
         <div className="lg:col-span-8">
            {error && !isLoadingList ? (
               <div className="flex flex-col items-center justify-center h-full min-h-100 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-900/30 text-center p-8 text-red-500">
                  <span className="material-symbols-outlined text-6xl mb-4">error</span>
                  <p className="font-bold">Koneksi Server Gagal</p>
                  <p className="text-sm mt-1 opacity-80">{error}</p>
               </div>
            ) : currentVideo ? (
               <div className="bg-white dark:bg-[#111111] p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in slide-in-from-bottom-4 duration-500 flex flex-col gap-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                     <h2 className={`text-xl font-bold text-slate-900 dark:text-white ${googleSansAlt.className}`}>{currentVideo.video_title}</h2>
                     <a href={getVideoExternalUrl(currentVideo)} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span> Buka Penuh
                     </a>
                  </div>
                  
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-[#0f111a] shadow-inner group">
                     {/* Overlay GDrive Fallback (Jika Diblokir Google) */}
                     {isGDrive(currentVideo.platform_type) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-0 p-8 text-center bg-[#0f111a]">
                           <span className="material-symbols-outlined text-4xl mb-3 opacity-50">block</span>
                           <p className="text-sm font-medium mb-4">Jika video dibatasi oleh Google Drive, klik tombol di bawah.</p>
                           <a href={getVideoExternalUrl(currentVideo)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#00BCD4] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg hover:bg-[#00acc1] relative z-20">
                              <span className="material-symbols-outlined text-[18px]">play_circle</span> Tonton Eksternal
                           </a>
                        </div>
                     )}

                     <iframe 
                        src={getVideoEmbedUrl(currentVideo)} 
                        className="absolute inset-0 w-full h-full z-10 bg-transparent" 
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     ></iframe>
                  </div>

                  <a href={getVideoExternalUrl(currentVideo)} target="_blank" rel="noreferrer" className="sm:hidden flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 px-4 py-3 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm w-full">
                     <span className="material-symbols-outlined text-[16px]">open_in_new</span> Buka di Tab Baru
                  </a>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full min-h-100 bg-slate-50 dark:bg-[#111111] rounded-3xl border border-slate-200 dark:border-slate-800 text-center p-8">
                  <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">video_library</span>
                  <p className="font-bold text-slate-600 dark:text-slate-400">Pilih rekaman video di menu samping.</p>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">Anda dapat memutar ulang seluruh sesi Live Class yang telah selesai. Pastikan koneksi internet stabil.</p>
               </div>
            )}
         </div>

      </div>
    </div>
  );
}