'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function GallerySection({ onRegister }: { onRegister: () => void }) {
  // Ganti dengan path asset lokal Anda di folder public, misal: '/assets/img/1.webp'
  const images = [
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <section id="gallery" className="py-20 bg-linear-to-br from-red-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Galeri Workshop
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Intip keseruan belajar coding dengan AI bersama kami.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl group aspect-video md:aspect-21/9">
          
          {/* Main Image */}
          <div className="w-full h-full relative">
             <Image 
               src={images[currentIndex]} 
               alt={`Gallery ${currentIndex + 1}`} 
               fill
               className="object-cover transition-all duration-500"
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
               priority={currentIndex === 0}
               unoptimized // Tambahkan jika menggunakan gambar eksternal tanpa konfigurasi domain
             />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none"></div>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all z-10"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all z-10"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center mt-12">
          <div className="bg-linear-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-8 max-w-4xl mx-auto border border-red-100 dark:border-red-900/30">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Bergabung dengan Alumni Sukses!
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Jadilah bagian dari komunitas developer masa depan.
            </p>
            <button 
              onClick={onRegister}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-red-600/30 transition-all flex items-center gap-2 mx-auto"
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              Daftar Sekarang
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}