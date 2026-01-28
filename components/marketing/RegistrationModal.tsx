'use client';

import React from 'react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBatch: string;
}

export default function RegistrationModal({ isOpen, onClose, defaultBatch }: RegistrationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-900">Form Pendaftaran</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            Anda mendaftar untuk: <strong>{defaultBatch || 'Batch Online'}</strong>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Integrasi pembayaran nanti disini'); }}>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Lengkap</label>
              <input type="text" className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" placeholder="Masukkan nama Anda" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">WhatsApp</label>
              <input type="tel" className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none" placeholder="08xxxxxxxx" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
              <input type="email" className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none" placeholder="email@contoh.com" required />
            </div>
            
            <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg mt-4 transition-all">
              Lanjut Pembayaran
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}