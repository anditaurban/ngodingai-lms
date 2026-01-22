'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => (
  <nav className="fixed top-0 z-50 w-full bg-white dark:bg-[#1b2636] border-b border-slate-200 dark:border-slate-700 h-16 transition-colors">
    <div className="px-4 lg:px-6 h-full flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-slate-500 hover:text-[#00BCD4] transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
          <div className="bg-[#00BCD4]/10 rounded-lg size-9 flex items-center justify-center text-[#00BCD4]">
            <span className="material-symbols-outlined text-[24px]">token</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hidden sm:block">
            Inovasia <span className="text-[#00BCD4] font-normal">Digital Academy</span>
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:block relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-64 bg-slate-100 dark:bg-slate-900/50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#00BCD4]/20 text-slate-700 dark:text-slate-200" />
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

const Sidebar = ({ pathname }: { pathname: string }) => {
  const router = useRouter(); 

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true;
    if (path !== '/dashboard' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.clear();
    }

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });

    router.replace('/'); 
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-[#1b2636] text-white border-r border-slate-800/50 hidden lg:flex flex-col z-20 overflow-y-auto no-scrollbar shadow-xl transition-all">
      <div className="flex flex-col gap-2 p-4 pt-6 flex-1">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
        <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group ${isActive('/dashboard') ? 'bg-[#182d4e] shadow-lg border border-white/5 text-white' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}>
            <span className={`material-symbols-outlined ${isActive('/dashboard') ? 'text-[#00BCD4]' : 'group-hover:text-[#00BCD4]'}`}>dashboard</span>
            <p className="text-sm font-medium">Dashboard</p>
        </Link>
        <Link href="/my-class" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group ${isActive('/my-class') || pathname.startsWith('/course/') ? 'bg-[#182d4e] shadow-lg border border-white/5 text-white' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}>
            <span className={`material-symbols-outlined ${isActive('/my-class') || pathname.startsWith('/course/') ? 'text-[#00BCD4]' : 'group-hover:text-[#00BCD4]'}`}>school</span>
            <p className="text-sm font-medium">My Courses</p>
        </Link>
        
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Academic</p>
        <Link href="/schedule" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white group">
            <span className="material-symbols-outlined group-hover:text-[#00BCD4] transition-colors">event_upcoming</span>
            <p className="text-sm font-medium">Schedule</p>
        </Link>
        <Link href="/assignments" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white group">
            <span className="material-symbols-outlined group-hover:text-[#00BCD4] transition-colors">assignment</span>
            <div className="flex-1 flex justify-between items-center">
                <p className="text-sm font-medium">Assignments</p>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">2</span>
            </div>
        </Link>
        <Link href="/community" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white group">
             <span className="material-symbols-outlined group-hover:text-[#00BCD4] transition-colors">group</span>
             <p className="text-sm font-medium">Community</p>
        </Link>
      </div>
      
      <div className="p-4 border-t border-slate-800 bg-[#151e2c]">
        <Link href="/profile" className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${isActive('/profile') ? 'bg-[#182d4e] border-white/10' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
            <div className="relative size-9 shrink-0">
                <Image src="https://ui-avatars.com/api/?name=Alex+Morgan&background=00BCD4&color=fff" className="rounded-full border border-slate-600 object-cover" alt="Profil" fill sizes="36px"/>
                <div className="absolute -bottom-0.5 -right-0.5 bg-teal-400 size-2.5 rounded-full border-2 border-[#1b2636] z-10"></div>
            </div>
            <div className="flex flex-col overflow-hidden text-left">
                <p className="text-white text-sm font-bold truncate">Alex Morgan</p>
                <p className="text-slate-400 text-[10px] uppercase font-bold truncate">Student PRO</p>
            </div>
        </Link>
      </div>
    </aside>
  );
};

// ... (Footer dan AppShell Export TETAP SAMA) ...
const Footer = () => (
  <footer className="h-12 bg-white dark:bg-[#1b2636] border-t border-slate-200 dark:border-slate-700 flex items-center justify-center px-6 text-xs text-slate-500 z-30 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
    <p>
      Dibuat oleh <strong className="text-slate-900 dark:text-white">KATiB.id</strong> © 2026 <strong className="text-slate-900 dark:text-white">DKiDSmedia</strong>
    </p>
  </footer>
);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/dashboard';
  const isLoginPage = pathname === '/';

  if (isLoginPage) return <main className="min-h-screen bg-white">{children}</main>;

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      <div className="flex flex-1 pt-16 h-screen overflow-hidden">
        <Sidebar pathname={pathname} />
        <main className="flex-1 lg:ml-72 flex flex-col h-full relative w-full bg-[#f8fafc] dark:bg-[#0f111a]">
          <div className="flex-1 overflow-y-auto custom-scrollbar relative scroll-smooth">
             {children}
          </div>
          <Footer />
        </main>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}