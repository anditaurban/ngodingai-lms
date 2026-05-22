'use client';

import React, { useState, useEffect } from 'react';
import { MaterialItem } from '@/types';

interface MaterialsTabProps {
  materials?: MaterialItem[];
  courseId?: string;
}

type SlideProgressMap = Record<string, boolean>;

export default function MaterialsTab({ materials = [], courseId = 'default-course' }: MaterialsTabProps) {
  const [selectedFile, setSelectedFile] = useState<MaterialItem | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [slideProgress, setSlideProgress] = useState<SlideProgressMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem(`course_progress_${courseId}`);
    const savedSlideProgress = localStorage.getItem(`course_slide_progress_${courseId}`);

    let parsedProgress: string[] = [];
    let parsedSlideProgress: SlideProgressMap = {};

    if (savedProgress) {
      parsedProgress = JSON.parse(savedProgress);
      setCompletedIds(parsedProgress);
    }

    if (savedSlideProgress) {
      parsedSlideProgress = JSON.parse(savedSlideProgress);
      setSlideProgress(parsedSlideProgress);
    }

    if (materials.length > 0) {
      const firstUnfinishedIndex = materials.findIndex(m => !parsedProgress.includes(m.id.toString()));
      setSelectedFile(firstUnfinishedIndex !== -1 ? materials[firstUnfinishedIndex] : materials[0]);
    }

    setIsLoaded(true);
  }, [courseId, materials]);

  const getSafeDriveUrl = (url?: string) => {
    if (!url) return '';
    const match = url.match(/(?:file\/d\/|id=)([\w-]+)/);
    if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    return url;
  };

  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevItemId = materials[index - 1].id.toString();
    return completedIds.includes(prevItemId);
  };

  /**
   * Catatan penting:
   * Google Drive iframe TIDAK memberi event resmi seperti "user sudah sampai slide terakhir".
   * Jadi tombol ini idealnya dipanggil dari viewer buatan sendiri, misalnya PDF.js, PPTX viewer custom,
   * atau data slide yang memang di-render satu per satu oleh aplikasi.
   */
  const handleSlideFinished = (materialId: string) => {
    const newProgress = {
      ...slideProgress,
      [materialId]: true,
    };

    setSlideProgress(newProgress);
    localStorage.setItem(`course_slide_progress_${courseId}`, JSON.stringify(newProgress));
  };

  const canCompleteCurrentMaterial = () => {
    if (!selectedFile) return false;

    const currentId = selectedFile.id.toString();

    // Untuk slide, wajib sampai slide terakhir dulu.
    if (selectedFile.type === 'slide') {
      return slideProgress[currentId] === true;
    }

    // Untuk document biasa, masih boleh ditandai selesai manual.
    return true;
  };

  const handleMarkAsDone = () => {
    if (!selectedFile) return;
    if (!canCompleteCurrentMaterial()) return;

    const currentIdStr = selectedFile.id.toString();
    let newCompleted = [...completedIds];

    if (!newCompleted.includes(currentIdStr)) {
      newCompleted.push(currentIdStr);
      setCompletedIds(newCompleted);
      localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(newCompleted));
    }

    const currentIndex = materials.findIndex(m => m.id === selectedFile.id);
    if (currentIndex < materials.length - 1) {
      setSelectedFile(materials[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isLoaded) {
    return <div className="p-10 text-center animate-pulse text-slate-400">Memuat progres belajar...</div>;
  }

  if (!materials || materials.length === 0) {
    return (
      <div className="p-10 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">folder_open</span>
        <p className="text-slate-500">Belum ada materi yang dilampirkan untuk kelas ini.</p>
      </div>
    );
  }

  const safeIframeUrl = selectedFile ? getSafeDriveUrl(selectedFile.url) : '';
  const currentSelectedIndex = materials.findIndex(m => m.id === selectedFile?.id);
  const isCurrentCompleted = selectedFile ? completedIds.includes(selectedFile.id.toString()) : false;
  const isLastMaterial = currentSelectedIndex === materials.length - 1;
  const canMarkDone = canCompleteCurrentMaterial();
  const currentSlideIsFinished = selectedFile ? slideProgress[selectedFile.id.toString()] === true : false;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 flex flex-col gap-4 order-2 lg:order-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm sticky top-24">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">
                  Daftar Materi
                </h3>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                  {completedIds.length} / {materials.length} Selesai
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-1 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(completedIds.length / materials.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 space-y-1">
              {materials.map((item, index) => {
                const isSelected = selectedFile?.id === item.id;
                const isItemCompleted = completedIds.includes(item.id.toString());
                const unlocked = isUnlocked(index);

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (unlocked) setSelectedFile(item);
                    }}
                    disabled={!unlocked}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all border outline-none relative overflow-hidden ${
                      !unlocked
                        ? 'bg-slate-50/50 dark:bg-[#0a0a0a] border-transparent opacity-60 cursor-not-allowed'
                        : isSelected
                          ? 'bg-[#00BCD4]/10 border-[#00BCD4] shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className={`size-10 rounded-lg flex items-center justify-center transition-colors ${
                        !unlocked ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' :
                          isSelected ? 'bg-[#00BCD4] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        <span className="material-symbols-outlined text-[20px]">
                          {item.type === 'slide' ? 'slideshow' : item.type === 'doc' ? 'article' : 'description'}
                        </span>
                      </div>

                      {isItemCompleted && (
                        <span className="material-symbols-outlined absolute -bottom-1 -right-1 text-[16px] text-white bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800">
                          check_circle
                        </span>
                      )}
                      {!unlocked && !isItemCompleted && (
                        <span className="material-symbols-outlined absolute -bottom-1 -right-1 text-[16px] text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full border-2 border-white dark:border-slate-800">
                          lock
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-bold truncate leading-tight ${
                        !unlocked ? 'text-slate-500 dark:text-slate-600' :
                          isSelected ? 'text-[#00BCD4]' : 'text-slate-700 dark:text-slate-200'
                      }`}>
                        {item.title}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-1">
                        {!unlocked && <span className="material-symbols-outlined text-[12px]">lock</span>}
                        {unlocked ? `${item.type} Document` : 'Terkunci'}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="material-symbols-outlined text-[18px] self-center animate-pulse text-[#00BCD4]">chevron_right</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 order-1 lg:order-2">
          {selectedFile ? (
            <div className="flex flex-col gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{selectedFile.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {isCurrentCompleted ? (
                      <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> Selesai dibaca
                      </p>
                    ) : selectedFile.type === 'slide' && !currentSlideIsFinished ? (
                      <p className="text-xs font-medium text-amber-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">pending</span> Selesaikan sampai slide terakhir
                      </p>
                    ) : (
                      <p className="text-xs font-medium text-amber-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">pending</span> Belum selesai
                      </p>
                    )}
                  </div>
                </div>

                {safeIframeUrl && (
                  <a
                    href={safeIframeUrl.replace('/preview', '/view')}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-950 transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    Buka Penuh
                  </a>
                )}
              </div>

              <div className="bg-[#0f111a] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner relative aspect-4/3 lg:aspect-16/10 group">
                {safeIframeUrl ? (
                  <iframe
                    src={safeIframeUrl}
                    title={selectedFile.title}
                    className="absolute inset-0 w-full h-full z-10 bg-transparent"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2">broken_image</span>
                    <p className="text-sm font-medium">URL dokumen tidak valid</p>
                  </div>
                )}
              </div>

              {/* Simulasi sementara: tombol ini menggantikan event "sampai slide terakhir" dari viewer custom. */}
              {selectedFile.type === 'slide' && !currentSlideIsFinished && !isCurrentCompleted && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSlideFinished(selectedFile.id.toString())}
                    className="px-4 py-2.5 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-amber-200 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">slideshow</span>
                    Simulasi: Saya sudah sampai slide terakhir
                  </button>
                </div>
              )}

              <div className="flex justify-end mt-2">
                {!isCurrentCompleted ? (
                  <button
                    onClick={handleMarkAsDone}
                    disabled={!canMarkDone}
                    className={`px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg active:scale-95 ${
                      canMarkDone
                        ? 'bg-[#00BCD4] text-white hover:bg-[#00acc1] shadow-cyan-500/20'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    {selectedFile.type === 'slide' && !canMarkDone
                      ? 'Selesaikan Slide Terakhir Dulu'
                      : 'Tandai Selesai & Lanjut'}
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400">Materi ini sudah selesai.</span>
                    {!isLastMaterial && (
                      <button
                        onClick={() => setSelectedFile(materials[currentSelectedIndex + 1])}
                        className="px-6 py-3.5 bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95"
                      >
                        Materi Selanjutnya <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-125 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-4 opacity-50">description</span>
              <p className="font-medium">Pilih materi di daftar samping untuk melihat preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
