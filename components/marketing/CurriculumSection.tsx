import React from 'react';

export default function CurriculumSection() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Kurikulum Lengkap</h2>
          <p className="text-lg text-slate-600">Dari pemula hingga bisa bikin website sendiri.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative pl-12 md:pl-16">
            <div className="absolute left-0 top-8 w-10 md:w-14 h-10 md:h-14 bg-red-600 rounded-r-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">1</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Pengenalan AI dalam Coding</h3>
            <p className="text-slate-600 mb-4">Fundamental AI, Prompt Engineering, dan Setup Tools.</p>
            <div className="flex flex-wrap gap-2">
              {['ChatGPT', 'Copilot', 'V0.dev', 'Blackbox'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">{tag}</span>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-l-blue-600 border-y border-r border-slate-200 relative pl-8 md:pl-12 transform scale-105 z-10">
            <div className="absolute -left-5 top-8 w-10 md:w-14 h-10 md:h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white">2</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Build Project dengan AI</h3>
            <p className="text-slate-600 mb-4">Hands-on membuat Dashboard Admin / Landing Page lengkap dengan database.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
               <div className="bg-blue-50 p-4 rounded-xl">
                 <h4 className="font-bold text-blue-900 text-sm mb-1">Frontend</h4>
                 <p className="text-xs text-blue-700">Generate UI HTML/Tailwind, Responsive Design.</p>
               </div>
               <div className="bg-blue-50 p-4 rounded-xl">
                 <h4 className="font-bold text-blue-900 text-sm mb-1">Backend</h4>
                 <p className="text-xs text-blue-700">Node.js API, Database Connection, Debugging.</p>
               </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative pl-12 md:pl-16">
            <div className="absolute left-0 top-8 w-10 md:w-14 h-10 md:h-14 bg-green-600 rounded-r-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">3</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Deployment & Showcase</h3>
            <p className="text-slate-600 mb-4">Online-kan website kamu ke Vercel/Railway dan presentasi project.</p>
            <div className="flex flex-wrap gap-2">
              {['Vercel', 'Github Pages', 'Railway', 'Domain Config'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">{tag}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}