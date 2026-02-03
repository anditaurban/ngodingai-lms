'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// 1. IMPORT FOOTER DISINI
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer'; // <-- Pastikan import ini ada

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#0f111a]">
      
      {/* 1. Navbar (Header Atas) */}
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1 pt-16 h-screen overflow-hidden">
        
        {/* 2. Sidebar (Menu Kiri) */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        {/* 3. Main Content Area (Kanan) */}
        <main className="flex-1 lg:ml-72 flex flex-col h-full relative w-full overflow-hidden">
          
          {/* A. Konten Halaman (Scrollable) */}
          {/* Gunakan flex-1 agar dia mengisi sisa ruang, dan menekan footer ke bawah */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
             {children}
             
             {/* B. FOOTER (Ditaruh di sini agar ikut ke-scroll di bawah konten) */}
             <div className="mt-auto">
                <Footer /> 
             </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}