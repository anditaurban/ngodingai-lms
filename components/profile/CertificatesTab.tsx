'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCertificate } from '../../hooks/useCertificate';
import { Inter, DM_Sans } from 'next/font/google'; 
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const inter = Inter({ subsets: ['latin'] });
const googleSansAlt = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700', '800'] });

export default function CertificatesTab() {
  const { data: certificateData, loading, error } = useCertificate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Refs
  const certificateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [scale, setScale] = useState(1);
  const [sessionName, setSessionName] = useState("Nama Peserta");
  const [assignmentStatus, setAssignmentStatus] = useState<{
     submitted: boolean;
     reviewed: 'yes' | 'no';
  }>({
     submitted: true, 
     reviewed: 'yes', 
  });

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('user_profile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        const fullName = `${parsedProfile.nama || ''} ${parsedProfile.nama_belakang || ''}`.trim();
        setSessionName(fullName || parsedProfile.full_name || parsedProfile.name || "Nama Peserta");
      }
    } catch (err) {
      console.error("Gagal membaca sesi user:", err);
    }
  }, []);

  // ✨ TEKNIK RESIZE OBSERVER (SANGAT ROBUST UNTUK MOBILE/TABLET/DESKTOP) ✨
  // Ini memastikan lebar sertifikat selalu persis 100% mengikuti kotak pembungkusnya.
  useEffect(() => {
      const updateScale = () => {
          if (containerRef.current) {
              const containerWidth = containerRef.current.getBoundingClientRect().width;
              if (containerWidth > 0) {
                  // Lebar A4 aslinya kita set 1000px
                  setScale(containerWidth / 1000);
              }
          }
      };

      // Buat pengamat ukuran layar
      const observer = new ResizeObserver(() => {
          // Delay sedikit (requestAnimationFrame) untuk mencegah ResizeObserver loop error
          window.requestAnimationFrame(updateScale);
      });

      if (containerRef.current) {
          observer.observe(containerRef.current);
      }
      
      // Panggilan pertama
      updateScale();

      return () => observer.disconnect();
  }, [assignmentStatus]);

  const dynamicSampleCert = {
    customer_id: "SMPL-99999",
    full_name: sessionName,
    achievement: "Has been awarded a Certificate of Completion for the comprehensive<br>Fullstack Web Development & AI Bootcamp.",
    issued: "23 February 2026",
    course_url: "https://ngodingai.inovasia.co.id/verify/SMPL-99999"
  };

  const isSample = !certificateData || error !== null;
  const displayData = certificateData || dynamicSampleCert;
  displayData.full_name = sessionName;

  const handleEditProfile = () => {
      window.dispatchEvent(new CustomEvent('triggerEditProfile'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsProcessing(true);

    try {
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 2, 
        cacheBust: true, 
        // ✨ FIX CSP ERROR: Mencegah error "Failed to read cssRules" dari Google Fonts
        skipFonts: true, 
        style: {
           backgroundColor: '#ffffff',
           transform: 'scale(1)', 
           transformOrigin: 'top left'
        }
      });

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const safeName = sessionName.replace(/[^a-z0-9]/gi, '_');
      pdf.save(`Sertifikat_NgodingAI_${safeName}.pdf`);
      
    } catch (err: any) {
      console.warn("Render PDF Error (Bisa diabaikan jika file terunduh):", err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 animate-fade-in">
        <div className="size-8 border-4 border-slate-200 border-t-[#00BCD4] rounded-full animate-spin"></div>
        <p className={`text-slate-500 text-sm font-medium animate-pulse ${inter.className}`}>Menyiapkan data sertifikat...</p>
      </div>
    );
  }

  if (!assignmentStatus.submitted) {
     return (
        <div className={`animate-fade-in flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 ${inter.className}`}>
           <div className="size-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
               <span className="material-symbols-outlined text-4xl">assignment_late</span>
           </div>
           <h3 className={`text-2xl font-bold text-slate-800 dark:text-white mb-2 ${googleSansAlt.className}`}>
               Tugas Belum Dikirim
           </h3>
           <p className="text-slate-500 max-w-md mx-auto mb-8">
               Anda belum menyelesaikan dan mengirimkan Assignment. Sertifikat terkunci.
           </p>
           <button className={`bg-[#00BCD4] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#00acc1] transition-all flex items-center gap-2 ${googleSansAlt.className}`}>
               <span className="material-symbols-outlined text-[20px]">drive_file_rename_outline</span>
               Kerjakan Tugas Sekarang
           </button>
        </div>
     );
  }

  if (assignmentStatus.submitted && assignmentStatus.reviewed === 'no') {
     return (
        <div className={`animate-fade-in flex flex-col items-center justify-center py-16 px-4 text-center bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30 ${inter.className}`}>
           <div className="relative size-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
               <span className="material-symbols-outlined text-4xl animate-pulse">hourglass_top</span>
           </div>
           <h3 className={`text-2xl font-bold text-slate-800 dark:text-white mb-2 ${googleSansAlt.className}`}>
               Mohon Tunggu...
           </h3>
           <p className="text-slate-500 max-w-md mx-auto">
               Tugas sedang <strong className="text-slate-800 dark:text-slate-200">dalam tahap review</strong> oleh Mentor.
           </p>
        </div>
     );
  }

  return (
    <div className={`animate-fade-in relative max-w-5xl mx-auto ${inter.className}`}>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
           <h3 className={`text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 ${googleSansAlt.className}`}>
             Sertifikat Kelulusan
             {isSample && (
                 <span className={`bg-amber-100 text-amber-600 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider border border-amber-200 font-bold ${inter.className}`}>
                     Mode Preview
                 </span>
             )}
           </h3>
        </div>
        <button 
            onClick={handleDownload}
            disabled={isProcessing}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md w-full md:w-auto ${googleSansAlt.className} ${
              isProcessing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#00BCD4] text-white hover:bg-[#00a3b8]'
            }`}
        >
            {isProcessing ? (
               <span className="size-4 border-2 border-slate-300 border-t-white rounded-full animate-spin block"></span>
            ) : (
               <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
            )}
            {isProcessing ? 'Menyiapkan PDF...' : 'Unduh PDF Asli'}
        </button>
      </div>

      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4 flex items-center gap-3 transition-all hover:shadow-md">
          <div className="bg-white p-2 rounded-full text-blue-500 shrink-0">
              <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
          </div>
          <div className="flex-1">
              <p className="text-sm text-slate-600">
                  Nama pada sertifikat menggunakan data profil. <strong className="text-slate-800 ml-1">Kesalahan nama?</strong>
              </p>
          </div>
          <button onClick={handleEditProfile} className={`shrink-0 text-xs font-bold text-[#00BCD4] bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors ${googleSansAlt.className}`}>
              Ubah Profil
          </button>
      </div>
      
      {/* ✨ WADAH RESPONSIF (A4 Landscape = Ratio 1.414 / 1) ✨ */}
      <div 
         ref={containerRef}
         className="relative w-full rounded-xl shadow-2xl border border-slate-200 select-none group overflow-hidden bg-white"
         // Tinggi dinamis mengikuti lebar wadah dikali rasio A4 (0.707)
         style={{ height: `${scale * 707}px` }} 
      >
          {/* ✨ KANVAS SERTIFIKAT (Size Asli) ✨ */}
          <div 
             ref={certificateRef} 
             className="absolute top-0 left-0 bg-white origin-top-left"
             style={{ 
                 width: '1000px', 
                 height: '707px', 
                 transform: `scale(${scale})` // Di-zoom-out otomatis via CSS Transform
             }}
          >
              
              {isSample && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                     <span className={`text-[120px] font-black text-slate-900/3 -rotate-45 select-none tracking-widest uppercase ${googleSansAlt.className}`}>
                         Sample
                     </span>
                 </div>
              )}

              <img 
                src="/assets/certificates/blank-template.jpg"
                alt="Certificate Background"
                className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none" 
              />

              <div className="absolute inset-6 border-[3px] border-double border-[#d4af37]/60 pointer-events-none rounded"></div>
              <div className="absolute inset-8 border border-[#d4af37]/30 pointer-events-none rounded"></div>

              {/* ISI KONTEN FIX SIZE */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center">
                  
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                     <div className="relative h-16 w-48 mb-2">
                         <img 
                            src="/assets/certificates/inovasia.png"
                            alt="Logo Inovasia"
                            className="w-full h-full object-contain"
                         />
                     </div>
                  </div>

                  <div className="-mt-16 z-10">
                     <h1 className={`text-6xl text-[#ffffff] tracking-widest uppercase mb-2 ${googleSansAlt.className} font-bold`}>
                       Certificate
                     </h1>
                     <p className={`text-base text-[#d4af37] tracking-[0.3em] uppercase font-bold ${inter.className}`}>
                       For Participant
                     </p>
                  </div>

                  <p className={`mt-8 text-lg text-slate-500 italic z-10 ${inter.className}`}>
                     This certificate is proudly presented to
                  </p>

                  <h2 className={`mt-3 text-5xl font-bold text-[#ffffff] capitalize border-slate-300 pb-3 px-10 inline-block z-10 ${googleSansAlt.className}`}>
                     {displayData.full_name}
                  </h2>

                  <p 
                    className={`mt-6 max-w-2xl text-base text-slate-400 leading-relaxed z-10 ${inter.className}`}
                    dangerouslySetInnerHTML={{ __html: displayData.achievement }}
                  />

                  <div className="absolute bottom-16 left-16 right-12 flex justify-between items-end z-10">
                      
                      <div className="text-left mb-0">
                         <p className={`text-sm text-slate-500 font-bold uppercase tracking-wider mb-2 ${googleSansAlt.className}`}>
                           Date Issued
                         </p>
                         <p className={`text-xl text-slate-200 border-b border-slate-300 pb-1 mb-2 inline-block font-medium ${inter.className}`}>
                           {displayData.issued}
                         </p>
                         <p className={`text-xs text-slate-400 mt-1 font-medium ${inter.className}`}>
                           <span className="text-[#00BCD4] italic">
                             {displayData.course_url}
                           </span>
                         </p>
                      </div>

                      <div className="flex flex-col items-center mb-0">
                         <div className="relative h-24 w-48 mb-1">
                             <img 
                                src="/assets/certificates/ttd.jpg" 
                                alt="Signature"
                                className="w-full h-full object-contain drop-shadow-md"
                             />
                         </div>
                         <div className="w-56 text-center pt-2">
                            <p className={`text-xl font-bold text-slate-200 leading-tight ${googleSansAlt.className}`}>Andita Permata</p>
                            <p className={`text-sm text-[#00BCD4] font-medium ${inter.className}`}>Instructor</p>
                         </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* HOVER EFEK */}
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
                         <span className="material-symbols-outlined text-6xl text-[#00BCD4]">download_for_offline</span>
                     )}
                     <span className={`text-xl font-bold tracking-wide ${googleSansAlt.className}`}>
                         {isProcessing ? 'Menyiapkan HD PDF...' : 'Unduh Sertifikat PDF Asli'}
                     </span>
                  </button>
              </div>
          ) : (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-50 cursor-not-allowed">
                  <div className="bg-white/90 px-6 py-4 rounded-xl text-center shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span className="material-symbols-outlined text-4xl text-amber-500 mb-2">lock</span>
                      <p className={`font-bold text-slate-800 ${googleSansAlt.className}`}>Sertifikat Belum Terbuka</p>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}