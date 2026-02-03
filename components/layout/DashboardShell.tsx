'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// IMPORT KOMPONEN (Pastikan path import ini benar!)
import Navbar from './Navbar';
import Sidebar from './Sidebar'; // <-- Ini memanggil file Sidebar.tsx di atas

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Tutup sidebar otomatis saat pindah halaman (Mobile UX)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#0f111a]">
      
      {/* 1. NAVBAR (Header) */}
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1 pt-16 h-screen overflow-hidden">
        
        {/* 2. SIDEBAR (Menu Kiri) */}
        {/* Kita oper state isOpen ke Sidebar agar dia tau kapan harus muncul (mobile) */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        {/* 3. MAIN CONTENT (Isi Halaman) */}
        <main className="flex-1 lg:ml-72 flex flex-col h-full relative w-full overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
             {/* Di sinilah halaman Dashboard, My Class, Profile, dll akan muncul */}
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}