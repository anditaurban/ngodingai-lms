'use client';

import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white dark:bg-[#1b2636] border-b border-slate-200 dark:border-slate-700 h-16 transition-colors">
      <div className="px-4 lg:px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          {/* Tombol Menu Mobile */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden text-slate-500 hover:text-primary transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="bg-center bg-no-repeat bg-cover rounded-lg size-9 bg-[#00BCD4]/10 flex items-center justify-center text-[#00BCD4]">
              <span className="material-symbols-outlined text-[24px]">token</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hidden sm:block">
              Inovasia <span className="text-primary font-normal">Digital Academy</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:block relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input type="text" placeholder="Search anything..." className="pl-10 pr-4 py-2 w-64 bg-slate-100 dark:bg-slate-900/50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 transition-all" />
          </div>
          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4 h-8">
            <button className="text-slate-400 hover:text-primary transition-colors relative group" title="Help Center">
              <span className="material-symbols-outlined text-[22px]">help</span>
            </button>
            <button className="text-slate-400 hover:text-primary transition-colors relative group">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-0.5 right-0.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1b2636]"></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}