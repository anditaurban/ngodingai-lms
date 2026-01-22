'use client';

import React from 'react';
import { UserProfile } from '@/types';

export default function GeneralTab({ user }: { user: UserProfile }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-6 pb-8 border-b border-slate-200 dark:border-slate-700">
        <div className="relative group">
          <img src={user.avatar} className="size-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg" alt="Avatar" />
          <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary-dark transition-colors" title="Change Photo">
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
          <p className="text-slate-500 dark:text-slate-400">{user.role}</p>
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); alert('Profile Updated (Simulation)'); }}>
        
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bio / About Me</label>
          <textarea defaultValue={user.bio} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary" rows={3}></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
          <input type="text" defaultValue={user.name} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number (Read Only)</label>
          <input type="text" defaultValue={user.phone} readOnly className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
          <input type="text" defaultValue={user.location} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">LinkedIn URL</label>
          <input type="text" defaultValue={user.socials.linkedin} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-primary focus:border-primary" />
        </div>

        <div className="md:col-span-2 flex justify-end pt-4">
          <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}