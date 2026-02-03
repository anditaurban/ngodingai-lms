import React from 'react';
import Image from 'next/image';

// MOCK IMAGE UNTUK PREVIEW (Hapus di VS Code dan gunakan next/image)
// const Image = (props: any) => <img {...props} alt={props.alt} />;

export default function CertificatesTab() {
  const certificates = [
    {
      id: 1,
      title: "Mastering Generative AI",
      date: "Jan 20, 2026",
      issuer: "Inovasia Academy",
      image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Python for Data Science",
      date: "Dec 15, 2025",
      issuer: "Inovasia Academy",
      image: "https://images.unsplash.com/photo-1589330694653-418b725487c9?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="animate-fade-in">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Earned Certificates</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="relative h-48 bg-slate-100">
                <Image 
                   src={cert.image} 
                   alt={cert.title}
                   fill
                   className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                   unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4">
                   <p className="text-white text-xs font-medium opacity-90">{cert.issuer}</p>
                   <h4 className="text-white font-bold text-lg leading-tight">{cert.title}</h4>
                </div>
             </div>
             
             <div className="p-4 flex justify-between items-center bg-white dark:bg-slate-800">
                <span className="text-xs text-slate-500 font-mono">Issued: {cert.date}</span>
                <button className="flex items-center gap-1 text-xs font-bold text-[#00BCD4] hover:underline">
                   <span className="material-symbols-outlined text-[16px]">download</span> PDF
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}