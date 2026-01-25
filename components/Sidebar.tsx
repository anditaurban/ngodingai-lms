'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || pathname?.startsWith(`${path}/`);
    return isActive 
      ? 'bg-[#182d4e] shadow-lg border border-white/5 text-white' 
      : 'hover:bg-white/5 text-slate-400 hover:text-white';
  };

  const getIconClass = (path: string) => {
    const isActive = pathname === path || pathname?.startsWith(`${path}/`);
    return isActive ? 'text-teal-400' : 'group-hover:text-teal-400';
  };

  return (
    <>
      {/* Mobile Overlay (Backdrop) */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity animate-fade-in"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-16 bottom-0 left-0 z-40 w-72 bg-[#1b2636] text-white border-r border-slate-800/50 flex flex-col transition-transform duration-300 ease-in-out shadow-xl
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col gap-2 p-4 pt-6 flex-1 overflow-y-auto custom-scrollbar">
          <nav className="flex flex-col gap-2">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
            
            <Link 
              href="/dashboard" 
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${getLinkClass('/dashboard')}`}
            >
              <span className={`material-symbols-outlined ${getIconClass('/dashboard')}`}>dashboard</span>
              <p className="text-sm font-medium">Dashboard</p>
            </Link>

            <Link 
              href="/my-class" 
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${getLinkClass('/my-class')}`}
            >
              <span className={`material-symbols-outlined group-hover:text-teal-400 transition-colors`}>school</span>
              <p className="text-sm font-medium">My Courses</p>
            </Link>
            
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Academic</p>

            <Link href="/schedule" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white group`}>
              <span className="material-symbols-outlined group-hover:text-teal-400 transition-colors">event_upcoming</span>
              <p className="text-sm font-medium">Schedule</p>
            </Link>

            <Link href="/assignments" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white group`}>
              <span className="material-symbols-outlined group-hover:text-teal-400 transition-colors">assignment</span>
              <div className="flex-1 flex justify-between items-center">
                <p className="text-sm font-medium">Assignments</p>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">2</span>
              </div>
            </Link>
             <Link href="/community" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white group`}>
                <span className="material-symbols-outlined group-hover:text-teal-400 transition-colors">group</span>
                <p className="text-sm font-medium">Community</p>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#151e2c]">
          <Link href="/profile" onClick={onClose} className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${getLinkClass('/profile')}`}>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://ui-avatars.com/api/?name=Alex+Morgan&background=0D8ABC&color=fff" className="size-9 rounded-full border border-slate-600" alt="Profile" />
              <div className="absolute -bottom-0.5 -right-0.5 bg-teal-400 size-2.5 rounded-full border-2 border-[#1b2636]"></div>
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-white text-sm font-bold truncate">Alex Morgan</p>
              <p className="text-slate-400 text-[10px] uppercase font-bold truncate">Student PRO</p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}