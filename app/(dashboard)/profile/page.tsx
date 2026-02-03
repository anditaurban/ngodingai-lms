'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Import Logic
import { useProfileLogic } from '@/hooks/useProfileLogic';

// Import Tabs UI (Direct from components/profile)
import GeneralTab from '@/components/profile/GeneralTab';
import AttendanceTab from '@/components/profile/AttendanceTab';
import CertificatesTab from '@/components/profile/CertificatesTab';
import PortfolioTab from '@/components/profile/PortfolioTab';

export default function ProfilePage() {
  const { user, loading, handleLogout } = useProfileLogic();
  const [activeTab, setActiveTab] = useState<'general' | 'attendance' | 'certificates' | 'portfolio'>('general');

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#00BCD4]"></div>
            <p className="text-slate-500 text-sm font-medium animate-pulse">Memuat data profil...</p>
        </div>
    );
  }

  // Jika user null (Fallback)
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <h2 className="text-xl font-bold mb-2">Profil Tidak Ditemukan</h2>
        <button onClick={handleLogout} className="text-[#00BCD4] font-bold">Login Kembali</button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen animate-fade-in">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Profile</h1>
           <p className="text-slate-500 text-sm mt-1">Kelola informasi akun dan aktivitas belajar Anda.</p>
        </div>
        <button 
           onClick={handleLogout}
           className="px-5 py-2.5 bg-white dark:bg-slate-800 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
           <span className="material-symbols-outlined text-[20px]">logout</span> 
           <span>Keluar</span>
        </button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-4xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
        
        {/* Banner */}
        <div className="h-48 bg-linear-to-r from-[#00BCD4] to-blue-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize: '24px 24px' }}></div>
        </div>
        
        <div className="px-6 md:px-10 pb-10">
          
          {/* Header Profile Info */}
          <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-20 mb-10 gap-6 text-center md:text-left">
             <div className="relative group">
                <div className="size-36 md:size-40 rounded-full border-[6px] border-white dark:border-slate-800 bg-white shadow-2xl overflow-hidden relative">
                   <Image 
                      src={user.avatar} 
                      alt="Profile" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 160px"
                      priority
                      unoptimized
                   />
                </div>
                <div className="absolute bottom-4 right-4 size-5 bg-green-500 border-4 border-white dark:border-slate-800 rounded-full"></div>
             </div>
             
             <div className="flex-1 mb-2">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white capitalize tracking-tight">
                    {user.name.toLowerCase()}
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-3">
                     <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs px-3 py-1.5 rounded-lg uppercase font-bold tracking-wider border border-blue-100 dark:border-blue-800">
                        {user.role}
                     </span>
                     <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 hidden md:block"></div>
                     <span className="text-slate-500 dark:text-slate-400 text-sm font-mono flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                        {user.customer_id}
                     </span>
                </div>
             </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex items-center gap-2 md:gap-8 border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto no-scrollbar pb-1">
             {[
                { id: 'general', label: 'General', icon: 'person' },
                { id: 'attendance', label: 'Attendance', icon: 'event_available' },
                { id: 'certificates', label: 'Certificates', icon: 'workspace_premium' },
                { id: 'portfolio', label: 'Portfolio', icon: 'folder_open' },
             ].map((tab) => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex items-center gap-2 pb-4 px-2 text-sm font-bold transition-all whitespace-nowrap border-b-[3px] rounded-t-lg ${
                       activeTab === tab.id 
                       ? 'text-[#00BCD4] border-[#00BCD4]' 
                       : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                   }`}
                >
                   <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                   {tab.label}
                </button>
             ))}
          </div>

          {/* TAB CONTENT RENDERER */}
          <div className="min-h-7">
             {activeTab === 'general' && <GeneralTab user={user} />}
             {activeTab === 'attendance' && <AttendanceTab />}
             {activeTab === 'certificates' && <CertificatesTab />}
             {activeTab === 'portfolio' && <PortfolioTab />}
          </div>

        </div>
      </div>
    </div>
  );
}