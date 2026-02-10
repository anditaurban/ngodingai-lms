'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
// Import Guard Baru
import SessionGuard from './SessionGuard';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#0f111a]">
      
      {/* --- PASANG SESSION GUARD DISINI --- */}
      {/* Ini akan aktif menjaga tombol Back browser */}
      <SessionGuard />

      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1 pt-16 h-screen overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <main className="flex-1 lg:ml-72 flex flex-col h-full relative w-full overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
             {children}
             <div className="mt-auto">
                <Footer /> 
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}