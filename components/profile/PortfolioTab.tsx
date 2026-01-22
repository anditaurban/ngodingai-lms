'use client';

import React from 'react';
// Fix: Import tipe dari folder types yang benar
import { UserProfile } from '@/types';

export default function PortfolioTab({ user }: { user: UserProfile }) {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">My Projects</h3>
        <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Upload Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.projects.map((project) => (
          <div key={project.id} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="h-40 bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url('${project.image}')` }}></div>
            <div className="p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded">{project.category}</span>
              <h4 className="font-bold text-lg mt-2 text-slate-900 dark:text-white">{project.title}</h4>
              <p className="text-sm text-slate-500 mt-1">{project.description}</p>
              <div className="mt-4 flex gap-2">
                <button className="text-xs font-bold text-slate-500 hover:text-primary">Edit</button>
                <button className="text-xs font-bold text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty Slot Style */}
        {/* Fix: Menggunakan canonical class min-h-50 pengganti min-h-[200px] */}
        <button className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center h-full min-h-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
          <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-slate-400">cloud_upload</span>
          </div>
          <span className="text-sm font-bold text-slate-500">Upload New Project</span>
        </button>
      </div>
    </div>
  );
}