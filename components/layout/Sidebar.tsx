'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState({
    name: 'Loading...',
    role: 'Student',
    avatar: 'https://ui-avatars.com/api/?name=User&background=random'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem('user_profile');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const userName = parsedData.name || 'Student';
          
          setUser({
            name: userName,
            role: 'Student PRO',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=00BCD4&color=fff&bold=true`
          });
        }
      } catch (e) {
        console.error("Gagal load user:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user_profile');
    router.push('/');
  };

  // --- MENU CONFIGURATION ---
  const menuGroups = [
    {
      title: "Learning Center",
      items: [
        { label: 'My Courses', href: '/my-class', icon: 'school' },
        { label: 'Assignments', href: '/assignments', icon: 'assignment', badge: 1 },
      ]
    },
    // Tambahkan grup menu lain di sini jika diperlukan
  ];

  const isActiveLink = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

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
      {/* Mobile Overlay */}
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
        
        {/* Menu Area */}
        <div className="flex flex-col gap-2 p-4 pt-6 flex-1 overflow-y-auto custom-scrollbar">
          <nav className="flex flex-col gap-6">
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

        {/* Footer Profile Section */}
        <div className="p-4 border-t border-slate-800 bg-[#151e2c]">
          <div className="flex items-center justify-between gap-2">
             <Link 
                href="/profile" 
                onClick={onClose} 
                className="flex items-center gap-3 flex-1 overflow-hidden group"
             >
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={user.avatar} 
                    className="size-9 rounded-full border border-slate-600 object-cover bg-slate-700" 
                    alt="Profile" 
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 bg-teal-400 size-2.5 rounded-full border-2 border-[#1b2636]"></div>
                </div>
                
                <div className="flex flex-col overflow-hidden text-left">
                  <p className="text-white text-sm font-bold truncate capitalize group-hover:text-[#00BCD4] transition-colors">
                    {user.name.toLowerCase()}
                  </p>
                  <p className="text-slate-400 text-[10px] uppercase font-bold truncate">
                    {user.role}
                  </p>
                </div>
             </Link>

             {/* Tombol Logout Kecil */}
             <button 
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all"
                title="Keluar"
             >
                <span className="material-symbols-outlined text-[20px]">logout</span>
             </button>
          </div>
        </div>
      </aside>
    </>
  );
}