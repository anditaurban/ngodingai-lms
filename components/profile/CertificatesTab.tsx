'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCertificate } from '@/hooks/useCertificate';
import { Inter } from 'next/font/google';

// IMPORT LIBRARY MODERN (Pengganti html2canvas)
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const inter = Inter({ subsets: ['latin'] });

export default function CertificatesTab() {
  const { data: certificateData, loading, error } = useCertificate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const certificateRef = useRef<HTMLDivElement>(null);

  const [sessionName, setSessionName] = useState("Nama Peserta");

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('user_profile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        const name = parsedProfile.customer_name || parsedProfile.full_name || parsedProfile.name;
        if (name) setSessionName(name);
      }
    } catch (err) {
      console.error("Gagal membaca sesi user:", err);
    }
  }, []);

  const dynamicSampleCert = {
    customer_id: "SMPL-99999",
    full_name: sessionName,
    achievement: "Has been awarded a Certificate of Completion for the comprehensive<br>Fullstack Web Development & AI Bootcamp.",
    issued: "21 February 2026",
    course_url: "https://ngodingai.inovasia.co.id/verify/SMPL-99999"
  };

  const isSample = !certificateData || error !== null;
  const displayData = certificateData || dynamicSampleCert;

  // ====================================================================
  // MESIN DOWNLOAD MODERN: html-to-image + jsPDF
  // ====================================================================
  const handleDownload = async () => {
    if (isSample) {
        alert("Ini hanya sertifikat contoh. Selesaikan kursus Anda untuk mendapatkan sertifikat asli!");
        return;
    }
    
    if (!certificateRef.current) return;
    setIsProcessing(true);

    try {
      // 1. Potret Elemen menggunakan HTML-TO-IMAGE 
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 3, // Kualitas HD/Retina
        cacheBust: true, // Mencegah error cache gambar
        fontEmbedCSS: '', // <-- ✨ KODE SAKTI: Bypass SecurityError CORS Font ✨
        style: {
           backgroundColor: '#ffffff' // Pastikan background solid
        }
      });

      // 2. Buat Kertas PDF A4 Landscape
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 3. Tempel Foto UI ke Kertas PDF
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // 4. Unduh!
      const safeName = displayData.full_name.replace(/[^a-z0-9]/gi, '_');
      pdf.save(`Sertifikat_NgodingAI_${safeName}.pdf`);
      
    } catch (err: any) {
      console.error("DETAIL ERROR HTML-TO-IMAGE:", err);
      alert(`Terjadi kesalahan saat membuat file PDF. Cek Console F12.`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 animate-fade-in">
        <div className="size-8 border-4 border-slate-200 border-t-[#00BCD4] rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">Menyiapkan sertifikat eksklusif Anda...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative max-w-5xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
             Sertifikat Pencapaian
             {isSample && (
                 <span className="bg-amber-100 text-amber-600 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                     Mode Preview
                 </span>
             )}
           </h3>
           <p className="text-sm text-slate-500 mt-1">
             {isSample 
                ? "Selesaikan program untuk membuka kunci dan mengunduh sertifikat resmi Anda." 
                : "Bukti kelulusan resmi Anda dari program NgodingAI by Inovasia."}
           </p>
        </div>
        
        {!isSample && (
          <button 
              onClick={handleDownload}
              disabled={isProcessing}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md w-full md:w-auto ${
                isProcessing
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#00BCD4] text-white hover:bg-[#00a3b8] hover:shadow-lg hover:-translate-y-0.5'
              }`}
          >
              {isProcessing ? (
                 <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin block"></span>
              ) : (
                 <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              )}
              {isProcessing ? 'Menyiapkan HD PDF...' : 'Unduh PDF Asli'}
          </button>
        )}
      </div>

      {isSample && (
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-4">
            <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100 text-slate-400">
                <span className="material-symbols-outlined">info</span>
            </div>
            <div>
                <h4 className="font-bold text-slate-700 text-sm">Sertifikat Belum Tersedia</h4>
                <p className="text-sm text-slate-500 mt-0.5">
                    Data sertifikat Anda belum diterbitkan oleh sistem atau Anda belum menyelesaikan kursus. Berikut adalah <strong className="text-slate-700">pratinjau (contoh)</strong> desain sertifikat yang akan Anda terima nanti.
                </p>
            </div>
        </div>
      )}
      
      {/* ====================================================================
          TAMPILAN SERTIFIKAT HTML
          ==================================================================== */}
      <div className="relative w-full aspect-[1.414/1] bg-white rounded-xl shadow-2xl border border-slate-200 select-none group overflow-hidden">
          
          {/* AREA YANG AKAN DIPOTRET (Di dalam ref) */}
          <div ref={certificateRef} className="absolute inset-0 w-full h-full bg-white overflow-hidden">
              
              {isSample && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-hidden">
                     <span className="text-[150px] md:text-[200px] font-black text-slate-900/3 -rotate-45 select-none tracking-widest uppercase">
                         Sample
                     </span>
                 </div>
              )}

              {/* 1. BACKGROUND GAMBAR (Native <img>) */}
              <img 
                src="/assets/certificates/blank-template.jpg"
                alt="Certificate Background"
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none" 
              />

              {/* 2. BINGKAI ORNAMEN EMAS */}
              <div className="absolute inset-4 border-[3px] border-double border-[#d4af37]/60 pointer-events-none rounded"></div>
              <div className="absolute inset-6 border border-[#d4af37]/30 pointer-events-none rounded"></div>

              {/* 3. ISI KONTEN SERTIFIKAT (100% Desain Anda) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 text-center">
                  
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                     <div className="relative h-12 w-32 md:h-16 md:w-40 mb-2">
                         <img 
                            src="/assets/certificates/inovasia.png"
                            alt="Logo Inovasia"
                            crossOrigin="anonymous"
                            className="w-full h-full object-contain"
                         />
                     </div>
                  </div>

                  <div className="-mt-6 md:-mt-12 z-10">
                     <h1 className={`text-4xl md:text-5xl lg:text-6xl font-serif text-[#ffffff] tracking-widest uppercase mb-2 ${inter.className}`}>
                       Certificate
                     </h1>
                     <p className="text-sm md:text-base text-[#d4af37] tracking-[0.3em] uppercase font-bold">
                       For Participant
                     </p>
                  </div>

                  <p className="mt-4 md:mt-6 text-sm md:text-base text-slate-500 italic z-10">
                     This certificate is proudly presented to
                  </p>

                  <h2 className={`mt-2 text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#ffffff] capitalize border-slate-300 pb-2 px-8 inline-block z-10 ${inter.className}`}>
                     {displayData.full_name}
                  </h2>

                  <p 
                    className="mt-2 md:mt-4 max-w-xl text-[10px] md:text-xs lg:text-sm text-slate-400 leading-relaxed font-sans z-10"
                    dangerouslySetInnerHTML={{ __html: displayData.achievement }}
                  />

                  <div className="absolute bottom-12 left-12 right-4 md:right-6 flex justify-between items-end z-10">
                      
                      <div className="text-left mb-0">
                         <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">
                           Date Issued
                         </p>
                         <p className={`text-sm md:text-base text-slate-200 font-serif border-b border-slate-300 pb-1 mb-1 inline-block ${inter.className}`}>
                           {displayData.issued}
                         </p>
                         <p className="text-[10px] md:text-xs text-slate-400 mt-1">
                           <span className="text-[#00BCD4] italic">
                             {displayData.course_url}
                           </span>
                         </p>
                      </div>

                      <div className="flex flex-col items-center mb-0">
                         <div className="relative h-16 w-32 md:h-20 md:w-40 mb-0">
                             <img 
                                src="/assets/certificates/ttd.jpg" 
                                alt="Signature"
                                crossOrigin="anonymous"
                                className="w-full h-full object-contain drop-shadow-md"
                             />
                         </div>
                         <div className="w-48 text-center pt-1">
                            <p className="text-sm md:text-base font-bold text-slate-200 leading-tight">Andita Permata</p>
                            <p className="text-xs text-[#00BCD4]">Instructor</p>
                         </div>
                      </div>
                  </div>
              </div>
          </div>
          {/* AKHIR AREA POTRET */}

          {/* Hover Effect: Klik untuk Download */}
          {!isSample ? (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm cursor-pointer z-50">
                  <button 
                    onClick={handleDownload}
                    disabled={isProcessing}
                    className="flex flex-col items-center justify-center text-white gap-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                     {isProcessing ? (
                         <span className="size-16 border-4 border-white/30 border-t-[#00BCD4] rounded-full animate-spin"></span>
                     ) : (
                         <span className="material-symbols-outlined text-6xl text-[#00BCD4] drop-shadow-[0_0_15px_rgba(0,188,212,0.5)]">download_for_offline</span>
                     )}
                     <span className="text-xl font-bold tracking-wide">
                         {isProcessing ? 'Menyiapkan HD PDF...' : 'Unduh Sertifikat PDF Asli'}
                     </span>
                     <span className="text-sm text-slate-300">Format A4 High Resolution (Siap Cetak)</span>
                  </button>
              </div>
          ) : (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-50 cursor-not-allowed">
                  <div className="bg-white/90 px-6 py-4 rounded-xl text-center shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span className="material-symbols-outlined text-4xl text-amber-500 mb-2">lock</span>
                      <p className="font-bold text-slate-800">Sertifikat Belum Terbuka</p>
                      <p className="text-xs text-slate-500 mt-1">Selesaikan program untuk mengunduh</p>
                  </div>
              </div>
          )}
      </div>

    </div>
  );
}