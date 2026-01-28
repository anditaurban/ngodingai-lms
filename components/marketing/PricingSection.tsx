'use client';

import React from 'react';

const batches = [
  { id: 8, dates: "9, 11, 13 Feb", status: "open" },
  { id: 7, dates: "12, 14, 16 Jan", status: "closed" },
  { id: 6, dates: "15, 17, 19 Dec", status: "closed" },
];

export default function PricingSection({ onSelectBatch }: { onSelectBatch: (name: string) => void }) {
  return (
    <section id="registration" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Pilih Jadwal Anda</h2>
          <p className="text-lg text-slate-600">Investasi terbaik untuk karir masa depan.</p>
        </div>

        <div className="flex flex-nowrap overflow-x-auto gap-6 pb-8 snap-x justify-start md:justify-center">
          {batches.map((batch) => (
            <div 
              key={batch.id} 
              className={`min-w-70 p-8 rounded-3xl border-2 transition-all snap-center ${
                batch.status === 'open' 
                ? 'bg-white border-yellow-400 shadow-xl scale-105 z-10' 
                : 'bg-slate-50 border-slate-200 opacity-60 grayscale'
              }`}
            >
              <div className="text-center">
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  batch.status === 'open' ? 'bg-yellow-400 text-black' : 'bg-slate-200 text-slate-500'
                }`}>
                  Batch {batch.id}
                </span>
                
                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-2">{batch.dates}</h3>
                <p className="text-slate-500 text-sm mb-6">19:30 - 21:30 WIB</p>

                <div className="mb-6">
                  <span className="text-slate-400 line-through text-sm">Rp 399.000</span>
                  <div className="text-3xl font-extrabold text-red-600">Rp 178.450</div>
                </div>

                <button
                  disabled={batch.status !== 'open'}
                  onClick={() => onSelectBatch(`Batch ${batch.id} Online`)}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    batch.status === 'open'
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-600/30'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {batch.status === 'open' ? 'Pilih Batch Ini' : 'Kuota Penuh'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}