import React from 'react';

export default function FeaturesSection() {
  const features = [
    { title: "AI-Powered Coding", desc: "Gunakan ChatGPT & Copilot untuk coding super cepat.", icon: "bolt" },
    { title: "Hands-on Practice", desc: "Praktek langsung bikin project nyata.", icon: "code" },
    { title: "Sertifikat Resmi", desc: "Bukti kompetensi yang diakui industri.", icon: "emoji_events" },
    { title: "Mentor Expert", desc: "Dibimbing praktisi berpengalaman.", icon: "group" },
    { title: "Materi Terkini", desc: "Selalu update dengan teknologi terbaru.", icon: "update" },
    { title: "Lifetime Support", desc: "Akses materi & komunitas selamanya.", icon: "verified" },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Mengapa Memilih Kursus Ini?</h2>
          <p className="text-lg text-slate-600">Dapatkan kebebasan dalam coding dengan bantuan AI revolusioner</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div key={idx} className="group p-8 rounded-2xl border-2 border-slate-100 hover:border-red-100 hover:bg-red-50/30 transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}