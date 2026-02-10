'use client';

import React from 'react';

export default function Footer() {
  // Mengambil tahun saat ini secara otomatis
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-12 bg-white dark:bg-[#1b2636] border-t border-slate-200 dark:border-slate-700 flex items-center justify-center px-6 text-xs text-slate-500 z-30 shrink-0">
      <p>
        &copy; {currentYear} <strong className="text-slate-900 dark:text-white">Inovasia Digital Academy</strong>
      </p>
    </footer>
  );
}