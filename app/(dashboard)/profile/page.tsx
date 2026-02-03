'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data dari Local Storage
    const storedData = localStorage.getItem('user_profile');
    if (storedData) {
      try {
        setUser(JSON.parse(storedData));
      } catch (e) {
        console.error("Data user corrupt", e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user_profile');
    router.push('/');
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Memuat profil...</div>;
  }

  if (!user) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4">Data user tidak ditemukan.</p>
        <button onClick={() => router.push('/')} className="text-[#00BCD4] font-bold">Login Kembali</button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen">
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Profile</h1>
        <button 
           onClick={handleLogout}
           className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-200"
        >
           <span className="material-symbols-outlined text-[18px]">logout</span> Log Out
        </button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
        
        {/* Banner Background */}
        <div className="h-40 bg-linear-to-r from-[#1b2636] to-[#2d4059] relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        </div>
        
        <div className="px-8 pb-10">
          <div className="relative flex flex-col md:flex-row justify-between items-end md:items-end -mt-16 mb-8 gap-4">
             <div className="flex items-end gap-6">
                <div className="relative">
                    <div className="size-32 rounded-full border-[6px] border-white dark:border-slate-800 bg-slate-200 overflow-hidden shadow-lg">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img 
                          src={`https://ui-avatars.com/api/?name=${user.name}&background=00BCD4&color=fff&size=256&bold=true`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                       />
                    </div>
                </div>
                <div className="mb-2">
                   <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white capitalize">{user.name.toLowerCase()}</h2>
                   <p className="text-slate-500 font-medium flex items-center gap-2">
                     <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Student</span>
                     <span>ID: {user.customer_id}</span>
                   </p>
                </div>
             </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Card: Contact Info */}
             <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Contact Info</h3>
                
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">WhatsApp Number</p>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono tracking-wide">{user.phone}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Email</p>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-200">-</p>
                    </div>
                </div>
             </div>

             {/* Card: Location Info */}
             <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Location</h3>
                
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Address</p>
                        <p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-snug">{user.address || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Region / City</p>
                        <p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-snug">{user.region_name || '-'}</p>
                    </div>
                </div>
             </div>

             {/* Card: Account Stats (Opsional/Dummy dulu) */}
             <div className="md:col-span-2 p-6 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex justify-between items-center">
                 <div>
                    <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Learning Progress</h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Status keaktifan akun Anda</p>
                 </div>
                 <div className="flex gap-8 text-center">
                    <div>
                        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">Active</p>
                        <p className="text-xs text-slate-500">Status</p>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">0</p>
                        <p className="text-xs text-slate-500">Certificates</p>
                    </div>
                 </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}