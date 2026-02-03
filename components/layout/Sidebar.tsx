'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // --- 1. STATE USER PROFILE ---
  const [user, setUser] = useState({
    name: 'Guest User',
    role: 'Student',
    avatar: ''
  });

  // --- 2. LOAD DATA DARI LOCAL STORAGE ---
  useEffect(() => {
    // Cek apakah kode berjalan di browser
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('user_profile');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setUser({
            // Ambil nama dari API, atau default
            name: parsedData.name || 'Student', 
            role: 'Student PRO', 
            // Generate avatar berdasarkan nama jika API tidak menyediakan gambar
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedData.name || 'User')}&background=00BCD4&color=fff`
          });
        } catch (e) {
          console.error("Gagal memuat data user:", e);
        }
      }
    }
  }, []);

  // --- 3. MENU CONFIGURATION ---
  const menuGroups = [
    {
      title: "Main Menu",
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        { label: 'My Courses', href: '/my-class', icon: 'school' },
      ]
    },
    {
      title: "Academic",
      items: [
        { label: 'Schedule', href: '/schedule', icon: 'event_upcoming' },
        { label: 'Assignments', href: '/assignments', icon: 'assignment', badge: 2 },
      ]
    }
  ];

  // --- 4. HELPERS ---
  const isActiveLink = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const getLinkClass = (path: string) => {
    const active = isActiveLink(path);
    return active 
      ? 'bg-[#182d4e] shadow-lg border border-white/5 text-white' 
      : 'hover:bg-white/5 text-slate-400 hover:text-white border-transparent';
  };

  const getIconClass = (path: string) => {
    const active = isActiveLink(path);
    return active ? 'text-[#00BCD4]' : 'group-hover:text-[#00BCD4]';
  };

  return (
    <>
      {/* Mobile Overlay (Backdrop) */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      ></div>

      {/* Sidebar Container */}
      <aside className={`
        fixed top-16 bottom-0 left-0 z-50 w-72 bg-[#1b2636] text-white border-r border-slate-800/50 flex flex-col transition-transform duration-300 ease-in-out shadow-xl
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Scrollable Menu Area */}
        <div className="flex flex-col gap-2 p-4 pt-6 flex-1 overflow-y-auto custom-scrollbar">
          <nav className="flex flex-col gap-6">
            
            {/* Mapping Menu Groups */}
            {menuGroups.map((group, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {group.title}
                </p>
                
                {group.items.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group border ${getLinkClass(item.href)}`}
                  >
                    <span className={`material-symbols-outlined transition-colors ${getIconClass(item.href)}`}>
                      {item.icon}
                    </span>
                    
                    <div className="flex-1 flex justify-between items-center">
                      <p className="text-sm font-medium">{item.label}</p>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ))}

          </nav>
        </div>

        {/* Footer Profile Section (Dynamic Data) */}
        <div className="p-4 border-t border-slate-800 bg-[#151e2c]">
          <Link 
            href="/profile" 
            onClick={onClose} 
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${getLinkClass('/profile')}`}
          >
            <div className="relative shrink-0">
              {/* Menggunakan tag img standar agar aman dari isu domain config Next.js */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={user.avatar || "https://ui-avatars.com/api/?name=Guest&background=random"} 
                className="size-9 rounded-full border border-slate-600 object-cover" 
                alt="Profile" 
              />
              <div className="absolute -bottom-0.5 -right-0.5 bg-teal-400 size-2.5 rounded-full border-2 border-[#1b2636]"></div>
            </div>
            
            <div className="flex flex-col overflow-hidden text-left">
              {/* Nama User Dinamis */}
              <p className="text-white text-sm font-bold truncate capitalize">
                {user.name.toLowerCase()}
              </p>
              <p className="text-slate-400 text-[10px] uppercase font-bold truncate">
                {user.role}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}