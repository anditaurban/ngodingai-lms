import { useState, useEffect, useCallback } from 'react';

export interface VideoData {
  video_id: number;
  video_url: string;
  video_title: string;
  platform_type: string;
  video_duration: string;
}

export interface BatchData {
  batch_id: number;
  owner_id: number;
  course_id: number;
  batch_period: string;
  batch_name: string;
  videos: VideoData[]; // Sekarang videos langsung kita ambil dari sini!
}

export const useClassroomVideos = (courseId: number = 1, customerId: number | null = null) => {
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<BatchData | null>(null);
  
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. API: MENGAMBIL LIST BATCH (YANG SEKALIGUS BERISI VIDEOS)
  const fetchBatchList = useCallback(async () => {
    if (!customerId) {
      setIsLoadingList(false);
      return;
    }

    setIsLoadingList(true);
    setError(null);
    try {
      // Pelindung Timeout Frontend (15 detik)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`/api/course-video/list?courseId=${courseId}&customerId=${customerId}`, { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Gagal mengambil list (Status ${response.status})`);
      }
      
      // ✨ SMART EXTRACTOR: Ambil listData yang sudah mengandung array 'videos'
      const listData = result.listData || result.data || [];
      setBatches(listData);

      // Auto-load batch pertama ke dalam player jika datanya ada
      if (listData.length > 0) {
        setSelectedBatch(listData[0]);
      } else {
        setSelectedBatch(null);
      }
      
    } catch (err: any) {
      console.error('Error fetching batch list:', err);
      if (err.name === 'AbortError') {
         setError("Koneksi internet lambat atau server sibuk. Silakan muat ulang.");
      } else {
         setError(err.message || "Gagal memuat daftar video.");
      }
    } finally {
      setIsLoadingList(false);
    }
  }, [courseId, customerId]);

  // 2. FUNGSI GANTI BATCH (✨ SUPER INSTAN, TIDAK NEMBAK API LAGI! ✨)
  const fetchBatchDetail = (batchId: number) => {
    setIsLoadingDetail(true);
    
    // Cari data batch dari memori yang sudah di-download saat awal
    const batch = batches.find(b => b.batch_id === batchId);
    if (batch) {
      setSelectedBatch(batch);
    }
    
    // Setel timeout artifisial super singkat (100ms) sekadar agar UI berkedip cantik
    setTimeout(() => setIsLoadingDetail(false), 100);
  };

  useEffect(() => {
    fetchBatchList();
  }, [fetchBatchList]);

  return {
    batches,
    selectedBatch,
    isLoadingList,
    isLoadingDetail,
    error,
    fetchBatchDetail // Tetap di-export agar komponen UI (ClassroomTab) tidak error
  };
};