'use client';

import React from 'react';
// Fix: Import tipe dari folder types yang benar
import { UserProfile } from '@/types';

export default function CertificatesTab({ user }: { user: UserProfile }) {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.certificates.map((cert) => (
          <div key={cert.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-4 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cert.image} className="w-24 h-16 object-cover rounded border border-slate-200 shadow-sm" alt="Certificate" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{cert.title}</h4>
              <p className="text-xs text-slate-500 mb-2">Issued: {cert.date}</p>
              <button className="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">download</span> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}