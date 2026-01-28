'use client';

import React, { useState } from 'react';
import { MaterialItem } from '@/types';

interface MaterialsTabProps {
  materials?: MaterialItem[];
}

export default function MaterialsTab({ materials = [] }: MaterialsTabProps) {
  // State untuk file yang sedang dipilih
  const [selectedFile, setSelectedFile] = useState<MaterialItem | null>(
    materials.length > 0 ? materials[0] : null
  );

  if (!materials || materials.length === 0) {
    return (
      <div className="p-10 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">folder_open</span>
        <p className="text-slate-500">No materials available for this course.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* --- LEFT SIDEBAR: FILE LIST --- */}
        <div className="lg:col-span-4 flex flex-col gap-4 order-2 lg:order-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm sticky top-24">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">
                Course Materials
              </h3>
              <span className="text-xs text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                {materials.length} Files
              </span>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-2 space-y-1">
              {materials.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedFile(item)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all border ${
                    selectedFile?.id === item.id
                    ? 'bg-[#00BCD4]/10 border-[#00BCD4] text-[#00BCD4] shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className={`shrink-0 size-10 rounded-lg flex items-center justify-center ${
                    selectedFile?.id === item.id ? 'bg-[#00BCD4] text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {item.type === 'slide' ? 'slideshow' : item.type === 'doc' ? 'article' : 'description'}
                    </span>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold truncate leading-tight ${
                       selectedFile?.id === item.id ? 'text-[#00BCD4]' : 'text-slate-700 dark:text-slate-200'
                    }`}>
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 capitalize">{item.type} Document</p>
                  </div>

                  {selectedFile?.id === item.id && (
                    <span className="material-symbols-outlined text-[18px] self-center animate-pulse">chevron_right</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT CONTENT: PREVIEWER --- */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          {selectedFile ? (
            <div className="flex flex-col gap-4">
              
              {/* Header Viewer */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{selectedFile.title}</h2>
                  <p className="text-xs text-slate-500">Preview Mode</p>
                </div>
                <a 
                  href={selectedFile.url.replace('/preview', '/view')} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  Open Full
                </a>
              </div>

              {/* Iframe Viewer */}
              <div className="bg-slate-200 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner relative aspect-[4/3] lg:aspect-[16/10]">
                <iframe
                  src={selectedFile.url}
                  title={selectedFile.title}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-4 opacity-50">description</span>
              <p>Select a file to preview</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}