'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { jsPDF } from 'jspdf'; 

// Import Data
import dummyCertificates from '@/data/certificates.json';

interface Certificate {
  id: string;
  title: string;
  course_name: string;
  issue_date: string;
  instructor: string;
  course_thumbnail: string; // Gambar Cover Kelas (Unsplash)
  certificate_image: string; // Gambar Fisik Sertifikat (Local/URL)
}

export default function CertificatesTab() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 1. SIMULASI LOAD DATA
  useEffect(() => {
    const timer = setTimeout(() => {
      setCertificates(dummyCertificates);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // 2. LOGIC DOWNLOAD PDF (Dari Gambar Sertifikat Asli)
  const handleDownloadPDF = async (cert: Certificate) => {
    setDownloadingId(cert.id);

    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Load Gambar Sertifikat ASLI (Bukan Thumbnail)
      const img = document.createElement('img');
      img.src = cert.certificate_image;
      img.crossOrigin = 'Anonymous'; 

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Render Full Page
      doc.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight);
      
      const safeTitle = cert.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      doc.save(`Sertifikat_${safeTitle}.pdf`);

    } catch (error) {
      console.error("Gagal generate PDF:", error);
      alert("Gagal mengunduh. Pastikan file sertifikat tersedia.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 animate-fade-in">
        <div className="size-8 border-4 border-slate-200 border-t-[#00BCD4] rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">Memuat data sertifikat...</p>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 animate-fade-in">
        <div className="size-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
           <span className="material-symbols-outlined text-3xl text-slate-400">workspace_premium</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Belum Ada Sertifikat</h3>
        <p className="text-slate-500 text-center max-w-sm mb-6">
          Selesaikan kelas dan tugas akhir untuk mendapatkan sertifikat kompetensi resmi dari NgodingAI.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          Sertifikat Saya
        </h3>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          Total: {certificates.length}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-[#00BCD4] transition-all duration-300 flex flex-col">
              
              {/* --- CARD COVER: MENGGUNAKAN COURSE THUMBNAIL (Gambar Kelas) --- */}
              <div 
                className="relative h-48 bg-slate-200 overflow-hidden cursor-pointer" 
                onClick={() => setPreviewImage(cert.certificate_image)} // Klik buka sertifikat asli
              >
                  <Image 
                    src={cert.course_thumbnail} // Tampilkan Thumbnail Kelas di Card
                    alt={cert.title}
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    unoptimized
                  />
                  
                  {/* Overlay Hover Effect */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                     <span className="flex items-center gap-2 text-white font-bold bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-md hover:bg-white/30 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">visibility</span> Lihat Sertifikat
                     </span>
                  </div>
              </div>
              
              {/* --- INFO AREA --- */}
              <div className="p-5 flex flex-col flex-1">
                  <div className="mb-4">
                     <p className="text-[10px] font-bold text-[#00BCD4] uppercase mb-1 tracking-wide">{cert.course_name}</p>
                     <h4 className="text-slate-900 dark:text-white font-bold text-lg leading-snug line-clamp-2">{cert.title}</h4>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Terbit</span>
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{cert.issue_date}</span>
                      </div>

                      <div className="flex gap-2">
                        {/* Tombol Preview Kecil */}
                        <button 
                            onClick={() => setPreviewImage(cert.certificate_image)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                            title="Lihat Sertifikat"
                        >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>

                        {/* Tombol Download PDF */}
                        <button 
                            onClick={() => handleDownloadPDF(cert)}
                            disabled={downloadingId === cert.id}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            downloadingId === cert.id
                            ? 'bg-slate-100 text-slate-400 cursor-wait'
                            : 'bg-[#00BCD4]/10 text-[#00BCD4] hover:bg-[#00BCD4] hover:text-white hover:shadow-lg'
                            }`}
                        >
                            {downloadingId === cert.id ? (
                            <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                            <>
                                <span className="material-symbols-outlined text-[16px]">download</span>
                                PDF
                            </>
                            )}
                        </button>
                      </div>
                  </div>
              </div>
          </div>
        ))}
      </div>

      {/* --- MODAL PREVIEW (Menampilkan SERTIFIKAT ASLI, Bukan Thumbnail) --- */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button 
             onClick={() => setPreviewImage(null)}
             className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
          >
             <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          
          {/* Container Sertifikat Landscape */}
          <div 
            className="relative w-full max-w-6xl aspect-[1.414/1] bg-white rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} 
          >
             <Image 
                src={previewImage} 
                alt="Certificate Preview"
                fill
                className="object-contain w-full h-full"
                unoptimized
             />
          </div>
        </div>
      )}

    </div>
  );
}