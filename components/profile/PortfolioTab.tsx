import React from 'react';
import Image from 'next/image';

// MOCK IMAGE UNTUK PREVIEW (Hapus di VS Code dan gunakan next/image)
// const Image = (props: any) => <img {...props} alt={props.alt} />;

export default function PortfolioTab() {
  const projects = [
    {
      id: 1,
      title: "AI Chatbot Assistant",
      desc: "Chatbot customer service using OpenAI API & LangChain.",
      tags: ["Python", "React", "OpenAI"],
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Smart Home Dashboard",
      desc: "IoT Dashboard for monitoring ESP32 sensors via MQTT.",
      tags: ["IoT", "Next.js", "Tailwind"],
      image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="animate-fade-in">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Featured Projects</h3>
          <button className="px-4 py-2 bg-[#1b2636] text-white rounded-lg text-xs font-bold hover:bg-[#263548] transition-colors flex items-center gap-2">
             <span className="material-symbols-outlined text-[16px]">add</span> Upload Project
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-[#00BCD4] transition-colors">
               <div className="flex p-4 gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                     <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized={true}
                     />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                     <div>
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-[#00BCD4] transition-colors">{project.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{project.desc}</p>
                     </div>
                     <div className="flex flex-wrap gap-2 mt-3">
                        {project.tags.map((tag, i) => (
                           <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md font-medium">
                             {tag}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}