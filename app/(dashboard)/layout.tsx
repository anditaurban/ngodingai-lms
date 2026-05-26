'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar'; 
import Sidebar from '@/components/layout/Sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // ✨ STATE PENGUASA: Kontrol ukuran Sidebar (Focus Mode)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a]">
      
      {/* 1. NAVBAR - Menerima remote control untuk Sidebar */}
      <Navbar 
        onMenuClick={() => setIsMobileMenuOpen(true)} 
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isCollapsed={isSidebarCollapsed}
      />
      
      {/* 2. SIDEBAR - Menerima instruksi ukuran dari state */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        isCollapsed={isSidebarCollapsed} // <-- Lempar prop ini ke Sidebar
      />

      {/* 3. MAIN CONTENT - Merespon ukuran Sidebar secara dinamis */}
      {/* Kita gunakan class Tailwind 'lg:pl-20' (80px) atau 'lg:pl-72' (288px) agar di mobile tetap normal (tanpa padding) */}
      <main className={`transition-all duration-300 ease-in-out pt-16 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
      }`}>
        {children}
      </main>
      
    </div>
  );
}