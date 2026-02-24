'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// --- INTERFACES ---
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  name: string;
  role: string;
  avatar: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

// --- MENU CONFIGURATION (Dipindah ke luar agar tidak re-render terus menerus) ---
const menuGroups: MenuGroup[] = [
  {
    title: "Learning Center",
    items: [
      { label: 'My Courses', href: '/my-class', icon: 'school' },
      { label: 'Assignments', href: '/assignments', icon: 'assignment' },
    ]
  },
  // Tambahkan grup menu lain di sini jika diperlukan
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UserProfile>({
    name: 'Loading...',
    role: 'Student',
    avatar: 'https://ui-avatars.com/api/?name=User&background=random'
  });

  // ✨ FUNGSI SINKRONISASI REAL-TIME ✨
  // Menggunakan useCallback agar referensi fungsi stabil
  const loadProfile = useCallback(() => {
    try {
      const storedData = localStorage.getItem('user_profile');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        // 1. Ekstrak Nama Lengkap
        const firstName = parsedData.nama || parsedData.name || '';
        const lastName = parsedData.nama_belakang || parsedData.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Student';
        
        // 2. Ekstrak dan Amankan URL Foto (Bypass Proxy)
        let finalPhotoUrl = parsedData.photo || parsedData.avatar || "";
        if (finalPhotoUrl.startsWith('http') && finalPhotoUrl.includes('dev.katib.cloud')) {
            finalPhotoUrl = `/api/proxy-image?url=${encodeURIComponent(finalPhotoUrl)}`;
        }

        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=00BCD4&color=fff&bold=true`;

        setUser({
          name: fullName,
          role: parsedData.role || 'Student PRO',
          avatar: finalPhotoUrl || defaultAvatar
        });
      }
    } catch (e) {
      console.error("Gagal memuat profil pengguna:", e);
    }
  }, []);

  useEffect(() => {
    // Panggil saat pertama kali load
    loadProfile();

    // ✨ TELINGA GLOBAL ✨
    // Dengarkan sinyal dari Hook Profile setiap kali ada Save/Upload
    window.addEventListener('ngodingai_profile_updated', loadProfile);
    
    // Bersihkan pendengar saat komponen unmount
    return () => {
      window.removeEventListener('ngodingai_profile_updated', loadProfile);
    };
  }, [loadProfile]);

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user_profile');
    router.push('/');
  };

  // --- HELPER FUNCTIONS ---
  const isActiveLink = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  const getLinkClass = (path: string) => {
    const active = isActiveLink(path);
    return active 
      ? 'bg-[#182d4e] shadow-md border-white/10 text-white' 
      : 'hover:bg-white/5 text-slate-400 hover:text-white border-transparent';
  };

  const getIconClass = (path: string) => {
    const active = isActiveLink(path);
    return active ? 'text-[#00BCD4]' : 'text-slate-400 group-hover:text-[#00BCD4]';
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />

      {/* Sidebar Container */}
      <aside className={`
        fixed top-16 bottom-0 left-0 z-50 w-72 bg-[#1b2636] text-white border-r border-slate-800/50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Menu Area */}
        <div className="flex flex-col gap-4 p-4 pt-6 flex-1 overflow-y-auto custom-scrollbar">
          <nav className="flex flex-col gap-6">
            {menuGroups.map((group, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {group.title}
                </p>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border ${getLinkClass(item.href)}`}
                    >
                      <span className={`material-symbols-outlined transition-colors duration-200 ${getIconClass(item.href)}`}>
                        {item.icon}
                      </span>
                      <div className="flex-1 flex justify-between items-center">
                        <p className="text-sm font-medium">{item.label}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Profile Section */}
        <div className="p-4 border-t border-slate-800 bg-[#151e2c]">
          <div className="flex items-center justify-between gap-3">
             <Link 
                href="/profile" 
                onClick={onClose} 
                className="flex items-center gap-3 flex-1 overflow-hidden group hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors"
             >
                <div className="relative shrink-0">
                  <img 
                    src={user.avatar} 
                    className="size-10 rounded-full border border-slate-600 object-cover bg-slate-800" 
                    alt="Profile Avatar" 
                    // ✨ Fallback jika proxy error
                    onError={(e) => {
                       const target = e.target as HTMLImageElement;
                       target.onerror = null;
                       target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00BCD4&color=fff&bold=true`;
                    }}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 bg-teal-400 size-3 rounded-full border-2 border-[#151e2c]"></div>
                </div>
                
                <div className="flex flex-col overflow-hidden text-left">
                  <p className="text-white text-sm font-bold truncate capitalize group-hover:text-[#00BCD4] transition-colors">
                    {user.name.toLowerCase()}
                  </p>
                  <p className="text-slate-400 text-[10px] uppercase font-bold truncate tracking-wide">
                    {user.role}
                  </p>
                </div>
             </Link>

             {/* Tombol Logout Kecil */}
             <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 shrink-0"
                title="Keluar"
                aria-label="Logout"
             >
                <span className="material-symbols-outlined text-[20px]">logout</span>
             </button>
          </div>
        </div>
      </aside>
    </>
  );
}