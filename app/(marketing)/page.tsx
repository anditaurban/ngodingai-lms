'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Import Komponen dengan Alias @/
import HeroSection from '@/components/marketing/HeroSection';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import CurriculumSection from '@/components/marketing/CurriculumSection';
import GallerySection from '@/components/marketing/GallerySection';
import PricingSection from '@/components/marketing/PricingSection';
import LocationSection from '@/components/marketing/LocationSection';
import RegistrationModal from '@/components/marketing/RegistrationModal';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');

  const handleOpenModal = (batchName?: string) => {
    if (batchName) setSelectedBatch(batchName);
    setIsModalOpen(true);
  };

  return (
    <div className="font-sans text-slate-900 bg-white dark:bg-[#0f111a]">
      
      {/* 1. Hero Section (Banner & Jadwal) */}
      <HeroSection onRegister={() => handleOpenModal('General Registration')} />

      {/* 2. Why Choose Us */}
      <FeaturesSection />

      {/* 3. Curriculum (Timeline Materi) */}
      <CurriculumSection />

      {/* 4. Gallery (Slider Foto) */}
      <GallerySection onRegister={() => handleOpenModal('Gallery CTA')} />

      {/* 5. Pricing & Batches (Registration) */}
      <PricingSection onSelectBatch={handleOpenModal} />

      {/* 6. CTA & Location */}
      <LocationSection onRegister={() => handleOpenModal('Location CTA')} />

      {/* 7. Floating WhatsApp */}
      <div className="fixed bottom-6 right-6 z-40">
        <a 
          href="https://link.wa-go.com/2VdqrDedBcEx01BL" 
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:scale-110 transition-transform duration-300 drop-shadow-lg"
        >
          <div className="relative w-14 h-14">
             {/* Pastikan file wa.png ada di folder public/assets/img/ atau gunakan URL eksternal */}
             <Image 
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                alt="Chat WhatsApp" 
                fill
                className="object-contain"
             />
          </div>
        </a>
      </div>

      {/* 8. Modal Form */}
      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultBatch={selectedBatch}
      />

    </div>
  );
}