'use client';

import React, { useState, useEffect } from 'react';
import { useClassroomVideos, VideoData } from '@/hooks/useClassroomVideos'; 

interface ClassroomTabProps {
  courseId?: number; 
  slug?: string;
}

export default function ClassroomTab({ courseId = 1, slug }: ClassroomTabProps) {
  
  const {
    batches,
    selectedBatch,
    isLoadingList,
    isLoadingDetail,
    error, // Ambil state error dari hook
    fetchBatchDetail
  } = useClassroomVideos(courseId);

  const [activeBatchId, setActiveBatchId] = useState<number | ''>('');
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);

  useEffect(() => {
    if (batches.length > 0 && activeBatchId === '') {
      setActiveBatchId(batches[0].batch_id);
    }
  }, [batches, activeBatchId]);

  useEffect(() => {
    if (selectedBatch && selectedBatch.videos && selectedBatch.videos.length > 0) {
      const isVideoInCurrentBatch = selectedBatch.videos.some(v => v.video_id === currentVideo?.video_id);
      
      if (!currentVideo || !isVideoInCurrentBatch) {
        setCurrentVideo(selectedBatch.videos[0]);
      }
    } else if (selectedBatch && selectedBatch.videos?.length === 0) {
      setCurrentVideo(null);
    }
  }, [selectedBatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const batchId = Number(e.target.value);
    setActiveBatchId(batchId);
    fetchBatchDetail(batchId); 
  };

  // ✨ FIX HELPER URL GDrive & YouTube
  const isGDrive = (type?: string) => type?.toLowerCase() === 'gdrive' || type?.toLowerCase() === 'drive';

  const getVideoSrc = (video: VideoData) => {
    const rawId = video.video_url;
    if (!rawId) return '';

    // Jika tipenya GDrive, kita rakit URL preview yang legal
    if (isGDrive(video.platform_type)) {
      return `https://drive.google.com/file/d/${rawId}/preview`;
    }
    
    // Jika YouTube, asumsikan ID tersebut ID Youtube
    return `https://www.youtube.com/embed/${rawId}?autoplay=0&rel=0&modestbranding=1`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* =========================================
          KIRI: VIDEO PLAYER & METADATA
      ========================================= */}
      <div className="lg:col-span-8 space-y-4">
        {/* Frame Video */}
        <div className="aspect-video bg-[#0f111a] rounded-xl overflow-hidden shadow-2xl relative border border-slate-200 dark:border-slate-800">
          
          {/* Tampilkan Peringatan Error Jika API 401/Gagal */}
          {error && !isLoadingList ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500 bg-red-50 dark:bg-red-900/10 p-6 text-center">
              <span className="material-symbols-outlined text-4xl mb-2">error</span>
              <h3 className="font-bold mb-1">Koneksi Server Gagal</h3>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          ) : currentVideo ? (
            <iframe 
              className="w-full h-full" 
              src={getVideoSrc(currentVideo)}
              title={currentVideo.video_title}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              {isLoadingList || isLoadingDetail ? (
                <div className="size-10 border-4 border-slate-200 border-t-[#00BCD4] rounded-full animate-spin mb-4"></div>
              ) : (
                <span className="material-symbols-outlined text-4xl mb-2">movie_off</span>
              )}
              <p className="font-medium">
                {isLoadingList || isLoadingDetail ? 'Memuat Video...' : 'Tidak ada video di batch ini.'}
              </p>
            </div>
          )}
        </div>

        {/* Informasi Video yang Sedang Diputar */}
        {currentVideo && !error && (
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded text-white uppercase tracking-wider ${
                isGDrive(currentVideo.platform_type) ? 'bg-emerald-500' : 'bg-red-500'
              }`}>
                {isGDrive(currentVideo.platform_type) ? 'Google Drive' : 'YouTube'}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                {currentVideo.video_duration}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {currentVideo.video_title}
            </h2>
          </div>
        )}
      </div>

      {/* =========================================
          KANAN: BATCH SELECTOR & PLAYLIST
      ========================================= */}
      <div className="lg:col-span-4 flex flex-col h-125 lg:h-auto">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
          
          {/* Header Dropdown Batch */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">folder_copy</span>
              Pilih Batch Kurikulum
            </label>
            
            {isLoadingList ? (
              <div className="h-10.5 w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"></div>
            ) : error ? (
               <div className="text-xs text-red-500 font-bold p-2 bg-red-50 rounded-lg">Gagal memuat batch.</div>
            ) : (
              <div className="relative group">
                <select 
                  value={activeBatchId} 
                  onChange={handleBatchChange}
                  disabled={isLoadingDetail || batches.length === 0}
                  className="w-full bg-white dark:bg-[#0f111a] border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm font-bold rounded-xl p-3 focus:ring-4 focus:ring-[#00BCD4]/20 focus:border-[#00BCD4] cursor-pointer appearance-none transition-all disabled:opacity-50"
                >
                  {batches.length === 0 && <option value="">Belum ada batch</option>}
                  {batches.map((batch) => (
                    <option key={batch.batch_id} value={batch.batch_id}>
                      {batch.batch_name} — ({batch.batch_period})
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-[#00BCD4] transition-colors">
                  expand_more
                </span>
              </div>
            )}
          </div>

          {/* Daftar Video Terkait */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoadingDetail ? (
              // Skeleton Loading saat fetch get-by-id
              [1, 2, 3].map((i) => (
                <div key={i} className="w-full h-18 bg-slate-100 dark:bg-slate-700/50 rounded-xl animate-pulse"></div>
              ))
            ) : selectedBatch?.videos && selectedBatch.videos.length > 0 ? (
              // Render List Video Asli
              selectedBatch.videos.map((video) => {
                const isActive = currentVideo?.video_id === video.video_id;
                
                return (
                  <button
                    key={video.video_id}
                    onClick={() => setCurrentVideo(video)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all border-2 group ${
                      isActive 
                      ? 'bg-[#00BCD4]/10 border-[#00BCD4] shadow-sm shadow-cyan-500/10' 
                      : 'border-transparent hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-[#00BCD4] text-white shadow-md shadow-cyan-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-[#00BCD4]'
                      }`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {isActive ? 'play_arrow' : 'smart_display'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm leading-tight truncate ${
                           isActive ? 'font-extrabold text-slate-900 dark:text-white' : 'font-semibold text-slate-600 dark:text-slate-300'
                        }`}>
                          {video.video_title}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
                          {video.platform_type}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-1 rounded-md shrink-0 ${
                      isActive ? 'bg-white dark:bg-slate-900 text-[#00BCD4]' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {video.video_duration}
                    </span>
                  </button>
                );
              })
            ) : (
              // Jika kosong
              !isLoadingList && (
                 <div className="flex flex-col items-center justify-center h-40 text-center text-slate-500">
                  <span className="material-symbols-outlined text-3xl mb-2 opacity-50">videocam_off</span>
                  <p className="text-sm font-medium">Video belum tersedia untuk batch ini.</p>
                </div>
              )
            )}
          </div>

        </div>
      </div>

    </div>
  );
}