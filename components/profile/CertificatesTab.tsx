'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCertificate } from '@/hooks/useCertificate';
import { generateCertificatePDF } from '@/lib/certificateGenerator';

export default function CertificatesTab() {
  const { data: certificateData, loading, error } = useCertificate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownload = async () => {
    if (!certificateData) return;
    setIsProcessing(true);
    const doc = await generateCertificatePDF(certificateData);
    if (doc) {
      const safeName = certificateData.full_name.replace(/[^a-z0-9]/gi, '_');
      doc.save(`Sertifikat_NgodingAI_${safeName}.pdf`);
    } else {
      alert("Gagal mengunduh sertifikat.");
    }
    setIsProcessing(false);
  };

  // State UI: Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 animate-fade-in">
        <div className="size-8 border-4 border-slate-200 border-t-[#00BCD4] rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">Menyiapkan sertifikat eksklusif Anda...</p>
      </div>
    );
  }

  // State UI: Error / Data Kosong
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 animate-fade-in text-center">
        <div className="size-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-2">
            <span className="material-symbols-outlined text-2xl">error</span>
        </div>
        <p className="text-slate-700 font-medium">Sertifikat Belum Tersedia</p>
        <p className="text-slate-500 text-sm max-w-md">{error}</p>
      </div>
    );
  }

  // State UI: Data Ditemukan
  return (
    <div className="animate-fade-in relative max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="text-lg font-bold text-slate-800 dark:text-white">
             Sertifikat Pencapaian
           </h3>
           <p className="text-sm text-slate-500 mt-1">
             Bukti kelulusan resmi Anda dari program Inovasia.
           </p>
        </div>
        
        {/* Tombol Download di Atas */}
        {certificateData && (
          <button 
              onClick={handleDownload}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
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
              {isProcessing ? 'Memproses...' : 'Unduh PDF Asli'}
          </button>
        )}
      </div>
      
      {certificateData && (
        /* ====================================================================
           TAMPILAN SERTIFIKAT HTML (PREVIEW)
           Menggunakan aspect-ratio standar kertas A4 Landscape (1.414 / 1)
           ==================================================================== */
        <div className="relative w-full aspect-[1.414/1] bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-200 select-none group">
            
            {/* 1. BACKGROUND GAMBAR (Template) */}
            <Image 
              src="/assets/certificates/blank-template.jpg"
              alt="Certificate Background"
              fill
              className="object-cover opacity-30 pointer-events-none" 
              unoptimized
            />
            {/* Overlay Putih Halus untuk memastikan teks selalu terbaca meski background gelap */}
            <div className="absolute inset-0 bg-white/70 pointer-events-none"></div> 

            {/* 2. BINGKAI ORNAMEN EMAS (Simulasi CSS) */}
            <div className="absolute inset-4 border-[3px] border-double border-[#d4af37]/60 pointer-events-none rounded"></div>
            <div className="absolute inset-6 border border-[#d4af37]/30 pointer-events-none rounded"></div>

            {/* 3. ISI KONTEN SERTIFIKAT (Absolute Positioning) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 text-center">
                
                {/* Logo Perusahaan (Atas Tengah) */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                   <div className="relative h-12 w-32 md:h-16 md:w-40 mb-2">
                       <Image 
                          src="/assets/inovasia.jpg"
                          alt="Logo Inovasia"
                          fill
                          className="object-contain"
                          unoptimized
                       />
                   </div>
                </div>

                {/* Judul Sertifikat */}
                <div className="mt-16 md:mt-20">
                   <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#1e293b] tracking-widest uppercase mb-2">
                     Certificate
                   </h1>
                   <p className="text-sm md:text-base text-[#d4af37] tracking-[0.3em] uppercase font-bold">
                     of Completion
                   </p>
                </div>

                {/* Tulisan 'Diberikan kepada' */}
                <p className="mt-8 md:mt-12 text-sm md:text-base text-slate-500 italic">
                   This certificate is proudly presented to
                </p>

                {/* Nama Peserta (API) */}
                <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#0f172a] capitalize drop-shadow-sm border-b-2 border-slate-300 pb-2 px-8 inline-block">
                   {certificateData.full_name}
                </h2>

                {/* Teks Pencapaian / Achievement (API) */}
                {/* Kita menggunakan dangerouslySetInnerHTML karena API mengirimkan tag <br> */}
                <p 
                  className="mt-6 md:mt-8 max-w-2xl text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: certificateData.achievement }}
                />

                {/* Area Tanda Tangan & Info Bawah */}
                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                    
                    {/* Kiri: Tanggal & URL */}
                    <div className="text-left">
                       <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">
                         Date Issued
                       </p>
                       <p className="text-sm md:text-base text-slate-800 font-serif border-b border-slate-300 pb-1 mb-4 inline-block">
                         {certificateData.issued}
                       </p>
                       
                       <p className="text-[10px] md:text-xs text-slate-400 mt-2">
                         Verify Authenticity:<br/>
                         <a href={certificateData.course_url} target="_blank" rel="noreferrer" className="text-[#00BCD4] hover:underline">
                           {certificateData.course_url}
                         </a>
                       </p>
                    </div>

                    {/* Kanan: Tanda Tangan */}
                    <div className="flex flex-col items-center">
                       <div className="relative h-16 w-32 md:h-20 md:w-40 mb-1">
                           <Image 
                              src="/assets/certificates/ttd.png" 
                              alt="Signature"
                              fill
                              className="object-contain drop-shadow-md"
                              unoptimized
                           />
                       </div>
                       <div className="w-48 border-t border-slate-400 pt-2 text-center">
                          <p className="text-sm md:text-base font-bold text-slate-800">Lead Instructor</p>
                          <p className="text-xs text-slate-500">NgodingAI by Inovasia</p>
                       </div>
                    </div>
                </div>

            </div>

            {/* Hover Effect: Klik untuk Download */}
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
                       {isProcessing ? 'Menyiapkan PDF...' : 'Unduh Sertifikat PDF Asli'}
                   </span>
                   <span className="text-sm text-slate-300">Format A4 High Resolution (Siap Cetak)</span>
                </button>
            </div>
        </div>
      )}

    </div>
  );
}