'use client';

import React from 'react';

// Data Jadwal (Bisa dipindah ke JSON jika mau dinamis)
const schedules = [
  { batch: 8, dates: "9, 11, 13 Februari 2026", time: "19:30 - 21:30 WIB", status: "Tersedia" },
  { batch: 7, dates: "12, 14, 16 Januari 2026", time: "19:30 - 21:30 WIB", status: "Habis" },
  { batch: 6, dates: "15, 17, 19 Desember 2025", time: "19:00 - 21:00 WIB", status: "Habis" },
];

export default function HeroSection({ onRegister }: { onRegister: () => void }) {
  return (
    <section className="relative py-20 overflow-hidden bg-linear-to-br from-red-900 to-slate-900 min-h-[90vh] flex items-center">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute inset-0 bg-[url('/assets/img/coding-bg.jpg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copywriting */}
          <div className="space-y-8 text-white">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm font-medium">
              <span className="text-yellow-400">★</span>
              <span>Kursus Eksklusif</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-yellow-500">Ngoding Pakai AI</span> <br />
              Ngoding Tanpa Batas!
            </h1>
            
            <p className="text-xl text-slate-200 leading-relaxed max-w-lg">
              Belajar ngoding pakai AI, bangun project website dalam waktu singkat, bebas berkreasi tanpa hambatan coding manual!
            </p>

            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                <i className="fas fa-clock text-yellow-400"></i> 3 Malam Intensif
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                <i className="fas fa-video text-yellow-400"></i> Kelas Online
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={onRegister}
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-red-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center gap-2"
              >
                <i className="fas fa-rocket"></i> Daftar Sekarang!
              </button>
              <button className="px-8 py-4 border-2 border-white/30 hover:bg-white/10 text-white font-bold rounded-xl transition-all">
                Lihat Detail
              </button>
            </div>
          </div>

          {/* Right: Schedule Card */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6 text-white">
                <h3 className="text-2xl font-bold">Jadwal Kursus</h3>
                <i className="fas fa-calendar-alt text-2xl opacity-50"></i>
              </div>

              <div className="space-y-4 max-h-100 overflow-y-auto custom-scrollbar pr-2">
                {schedules.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-l-4 ${item.status === 'Tersedia' ? 'bg-yellow-500/10 border-yellow-400' : 'bg-white/5 border-slate-500'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold ${item.status === 'Tersedia' ? 'text-yellow-400' : 'text-slate-400'}`}>
                        Batch {item.batch}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-bold ${item.status === 'Tersedia' ? 'bg-yellow-400 text-black' : 'bg-slate-700 text-slate-400'}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium">{item.dates}</p>
                    <p className="text-slate-400 text-xs">{item.time}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-white/70 text-sm">💻 Via: Zoom Meeting</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}