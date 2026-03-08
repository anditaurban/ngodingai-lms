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
  videos: VideoData[];
}

export const useClassroomVideos = (courseId: number = 1) => {
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<BatchData | null>(null);
  
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. API: MENGAMBIL LIST BATCH (LEWAT PROXY LOKAL)
  const fetchBatchList = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      // ✨ FIX: Sekarang tembak ke Proxy API route kita sendiri
      const response = await fetch(`/api/course-video/list?courseId=${courseId}`);
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Gagal mengambil list (Status ${response.status})`);
      }
      
      const listData = result.listData || [];
      setBatches(listData);

      // Auto-load detail batch pertama jika ada
      if (listData.length > 0) {
        fetchBatchDetail(listData[0].batch_id);
      }
      
    } catch (err: any) {
      console.error('Error fetching batch list:', err);
      setError(err.message);
    } finally {
      setIsLoadingList(false);
    }
  }, [courseId]);

  // 2. API: MENGAMBIL DETAIL VIDEO PER BATCH (LEWAT PROXY LOKAL)
  const fetchBatchDetail = async (batchId: number) => {
    setIsLoadingDetail(true);
    setError(null);
    try {
      // ✨ FIX: Tembak ke Proxy API route kita sendiri
      const response = await fetch(`/api/course-video/detail?batchId=${batchId}`);
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Gagal mengambil detail batch (Status ${response.status})`);
      }
      
      if (result.detail) {
        setSelectedBatch(result.detail);
      }
      
    } catch (err: any) {
      console.error(`Error fetching detail for batch ${batchId}:`, err);
      setError(err.message);
    } finally {
      setIsLoadingDetail(false);
    }
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
    fetchBatchDetail
  };
};