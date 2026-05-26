'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar'; 
import Sidebar from '@/components/layout/Sidebar'; 

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State untuk Drawer Mobile (HP)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // ✨ FIX: State untuk Focus Mode Desktop (Pastikan namanya isSidebarCollapsed)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a]">
      
      {/* 1. NAVBAR - Melempar fungsi ubah state */}
      <Navbar 
        onMenuClick={() => setIsMobileMenuOpen(true)} 
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isCollapsed={isSidebarCollapsed}
      />
      
      {/* 2. SIDEBAR - Menerima perintah sembunyi/muncul */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        isCollapsed={isSidebarCollapsed} 
      />

      {/* 3. MAIN CONTENT - Padding 0 jika Collapsed (Sembunyi Penuh), Padding 72 jika Muncul */}
      <main className={`transition-all duration-300 ease-in-out pt-16 w-full ${
        isSidebarCollapsed ? 'lg:pl-0' : 'lg:pl-72'
      }`}>
        {children}
      </main>
      
    </div>
  );
}