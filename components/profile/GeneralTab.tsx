import React from 'react';
import { UserData } from '@/hooks/useProfileLogic';

export default function GeneralTab({ user }: { user: UserData }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Kolom Kiri: Kontak */}
        <div className="space-y-6">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">
             Personal Info
           </h3>
           
           <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-5">
              <div className="flex items-start gap-4">
                 <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 mb-0.5">WhatsApp Number</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white font-mono tracking-wide">{user.phone}</p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">cake</span>
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 mb-0.5">Date of Birth</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user.birth}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Kolom Kanan: Lokasi */}
        <div className="space-y-6">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">
             Address Info
           </h3>

           <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-5">
              <div className="flex items-start gap-4">
                 <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">home_pin</span>
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 mb-0.5">Street Address</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                      {user.address}
                    </p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">map</span>
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 mb-0.5">Region / Area</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                      {user.region_name}
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* Status Card */}
      <div className="p-6 bg-linear-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 rounded-2xl border border-cyan-100 dark:border-cyan-900/30 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-cyan-800 dark:text-cyan-300 uppercase tracking-wider">Account Status</h3>
            <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">Keaktifan akun pembelajaran</p>
          </div>
          <div className="text-right">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">Active</p>
              <p className="text-xs text-slate-500">Membership</p>
          </div>
      </div>
    </div>
  );
}