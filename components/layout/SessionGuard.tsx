'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function SessionGuard() {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    // 1. Masukkan state palsu ke history browser saat komponen dimuat
    // Ini membuat seolah-olah ada halaman baru, padahal user masih di halaman yang sama.
    // Tujuannya: Agar saat user klik "Back", mereka tidak keluar, tapi hanya membatalkan state palsu ini.
    history.pushState(null, '', window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      // 2. Saat tombol Back ditekan, browser akan memicu event ini
      // Kita cegah user pergi, dan tampilkan Modal
      event.preventDefault();
      setShowExitModal(true);
      
      // Kembalikan state palsu agar jika user cancel, tombol back tetap terproteksi lagi
      history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogout = () => {
    // Hapus sesi
    Cookies.remove('token');
    localStorage.removeItem('user_profile');
    // Paksa pindah ke login
    router.push('/');
  };

  const handleStay = () => {
    setShowExitModal(false);
  };

  if (!showExitModal) return null;

  // --- UI MODAL MODERN ---
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* 1. Backdrop Blur & Darken */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleStay} // Klik luar untuk batal
      ></div>

      {/* 2. Bubble Card (Focus) */}
      <div className="bg-white dark:bg-[#1b2636] w-full max-w-sm rounded-3xl shadow-2xl border border-white/20 relative z-10 transform scale-100 transition-all animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Dekorasi Header */}
        <div className="h-2 w-full bg-linear-to-r from-red-500 via-orange-500 to-yellow-500"></div>

        <div className="p-8 text-center">
          {/* Icon Bubble */}
          <div className="mx-auto mb-5 size-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center animate-bounce-slow">
            <span className="material-symbols-outlined text-3xl text-red-500">logout</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Ingin Keluar?
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Sesi Anda masih aktif. Jika Anda keluar sekarang, Anda perlu login ulang nanti.
          </p>

          <div className="flex gap-3">
            <button 
              onClick={handleLogout}
              className="flex-1 px-4 py-3 bg-white border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
            >
              Ya, Keluar
            </button>
            <button 
              onClick={handleStay}
              className="flex-1 px-4 py-3 bg-[#1b2636] dark:bg-white text-white dark:text-[#1b2636] font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-sm"
            >
              Tetap Disini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}