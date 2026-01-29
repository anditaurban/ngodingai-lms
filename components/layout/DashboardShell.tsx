'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <nav className="fixed top-0 z-50 w-full bg-white dark:bg-[#1b2636] border-b border-slate-200 dark:border-slate-700 h-16 transition-colors">
    <div className="px-4 lg:px-6 h-full flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-slate-500 hover:text-[#00BCD4] transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-[#00BCD4]/10 rounded-lg size-9 flex items-center justify-center text-[#00BCD4]">
            <span className="material-symbols-outlined text-[24px]">token</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hidden sm:block">
            Inovasia <span className="text-[#00BCD4] font-normal">Digital Academy</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:block relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Cari kursus..." 
            className="pl-10 pr-4 py-2 w-64 bg-slate-100 dark:bg-slate-900/50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#00BCD4]/20 text-slate-700 dark:text-slate-200" 
          />
        </div>
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

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Kursus Saya', path: '/my-class', icon: 'school' },
    { label: 'Jadwal', path: '/schedule', icon: 'event_upcoming' },
    { label: 'Tugas', path: '/assignments', icon: 'assignment' },
  ];

  const getLinkClass = (path: string) => {
    // Logic active state yang lebih ketat
    const isActive = pathname === path || pathname.startsWith(`${path}/`);
    return isActive 
      ? 'bg-[#182d4e] shadow-lg border border-white/5 text-white' 
      : 'hover:bg-white/5 text-slate-400 hover:text-white';
  };

  const getIconClass = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(`${path}/`);
    return isActive ? 'text-[#00BCD4]' : 'group-hover:text-[#00BCD4]';
  };

  return (
    <>
      {/* Overlay Mobile */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      ></div>

      <aside className={`
        fixed top-16 bottom-0 left-0 z-50 w-72 bg-[#1b2636] text-white border-r border-slate-800/50 flex flex-col transition-transform duration-300 ease-in-out shadow-xl
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col gap-2 p-4 pt-6 flex-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu Utama</p>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group cursor-pointer ${getLinkClass(item.path)}`}
              >
                <span className={`material-symbols-outlined ${getIconClass(item.path)} transition-colors`}>
                  {item.icon}
                </span>
                <p className="text-sm font-medium">{item.label}</p>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#151e2c]">
          <Link href="/profile" onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl border border-slate-700 hover:border-[#00BCD4] transition-all group cursor-pointer">
            <div className="relative size-9 shrink-0">
               <div className="size-9 rounded-full bg-slate-600 overflow-hidden relative">
                 <img 
                  src="https://ui-avatars.com/api/?name=Alex+Morgan&background=00BCD4&color=fff" 
                  alt="Profil" 
                  className="object-cover w-full h-full"
                 />
               </div>
               <div className="absolute -bottom-0.5 -right-0.5 bg-teal-400 size-2.5 rounded-full border-2 border-[#1b2636]"></div>
            </div>
            <div className="flex flex-col overflow-hidden text-left">
              <p className="text-white text-sm font-bold truncate">Alex Morgan</p>
              <p className="text-slate-400 text-[10px] uppercase font-bold truncate">Siswa PRO</p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};

const Footer = () => (
  <footer className="h-12 bg-white dark:bg-[#1b2636] border-t border-slate-200 dark:border-slate-700 flex items-center justify-center px-6 text-xs text-slate-500 z-30 shrink-0">
    <p>
      © 2025 <strong className="text-slate-900 dark:text-white">Inovasia Digital Academy</strong>
    </p>
  </footer>
);

// --- MAIN SHELL ---

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Tutup sidebar otomatis saat pindah halaman (Mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#0f111a]">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1 pt-16 h-screen overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <main className="flex-1 lg:ml-72 flex flex-col h-full relative w-full overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
             {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}