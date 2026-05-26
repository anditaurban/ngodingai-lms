'use client';

import React from 'react';
import Image from 'next/image';

interface NavbarProps {
  onMenuClick: () => void;
  onCollapseToggle?: () => void;
  isCollapsed?: boolean;
}

export default function Navbar({ onMenuClick, onCollapseToggle, isCollapsed }: NavbarProps) {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white dark:bg-[#1b2636] border-b border-slate-200 dark:border-slate-700 h-16 transition-colors">
      <div className="px-4 lg:px-6 h-full flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          {/* Tombol Menu Mobile (Drawer) */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden text-slate-500 hover:text-[#00BCD4] transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* ✨ FIX: Tombol Menu Desktop (Focus Mode / Collapse Sidebar) */}
          <button 
            onClick={onCollapseToggle}
            className="hidden lg:flex text-slate-500 hover:text-[#00BCD4] transition-colors p-1"
            title={isCollapsed ? "Perlebar Sidebar" : "Mode Fokus"}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isCollapsed ? 'menu' : 'menu_open'}
            </span>
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer">
            {/* ✨ FIX: Menambahkan inisial untuk mobile jika diperlukan, atau sembunyikan sepenuhnya */}
            <div className="size-8 bg-[#00BCD4] rounded-lg flex items-center justify-center text-white font-black text-sm sm:hidden">
              IA
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hidden sm:block">
              Inovasia <span className="text-[#00BCD4] font-normal">Digital Academy</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4 h-8">
            <button className="text-slate-400 hover:text-[#00BCD4] transition-colors relative">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-0.5 right-0.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1b2636]"></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}