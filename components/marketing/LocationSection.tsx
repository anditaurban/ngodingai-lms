'use client';

import React from 'react';

export default function LocationSection({ onRegister }: { onRegister: () => void }) {
  return (
    <section id="location" className="py-20 bg-slate-50 dark:bg-[#13131f]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Lokasi Workshop
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Strategis di pusat kota Bogor, mudah dijangkau.
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-white dark:bg-[#1a1a24] rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="grid lg:grid-cols-2">
            
            {/* Map Iframe */}
            <div className="h-100 lg:h-auto bg-slate-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.1438627681196!2d106.7945517!3d-6.503466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c3257f661999%3A0x674c9939db33174b!2sToko%20ATK%20DKiDS%20Media!5e0!3m2!1sid!2sid!4v1741588263871!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="filter grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>

            {/* Info Lokasi */}
            <div className="p-10 lg:p-14 flex flex-col justify-center space-y-8">
              
              <div className="flex gap-4">
                <div className="size-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">Alamat Lengkap</h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Ruko Pesona Darussalam Blok A3/1 Lt.2,<br/>
                    Waringin Jaya, Bojonggede,<br/>
                    Kabupaten Bogor, Jawa Barat 16920
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <span className="material-symbols-outlined text-2xl">directions_car</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">Fasilitas</h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    Parkir Luas • Ruang AC • Musholla • Free WiFi
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                <a 
                  href="https://maps.google.com/?q=Ruko+Pesona+Darussalam+Blok+A3/1+Lt.2,+Waringin+Jaya,+Bojonggede,+Bogor" 
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">map</span>
                  Buka Google Maps
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-20">
          <div className="inline-block p-1 rounded-2xl bg-linear-to-r from-red-500 via-yellow-500 to-blue-500">
            <div className="bg-white dark:bg-[#0f111a] rounded-xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                Siap Menguasai AI Coding?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                Dapatkan skill yang akan mengubah karir programming Anda selamanya.
              </p>
              <button 
                onClick={onRegister}
                className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-red-600/40 transition-all flex items-center gap-2 mx-auto"
              >
                Daftar Sekarang <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="mt-4 text-sm text-slate-500">
                Diskon 50% berakhir segera!
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}