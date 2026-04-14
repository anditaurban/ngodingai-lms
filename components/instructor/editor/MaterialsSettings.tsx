import React, { useState, useEffect } from 'react';
import { DM_Sans } from 'next/font/google';

const googleSansAlt = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700', '800'] });

// ✨ FIX: Memperbaiki typo tanda kutip (") pada properti title di m6 ✨
const defaultMaterials = [
  { id: "m1", type: "slide", title: "AI in Web Development", url: "https://drive.google.com/file/d/1IhECdethlLyijelFcFfW2AiAIgeotrG-/preview" },
  { id: "m2", type: "doc", title: "Prompt Engineering Sample", url: "https://drive.google.com/file/d/1WzoSJcjhItd398jyC1XmpnPUvDgocOr1/preview" },
  { id: "m3", type: "slide", title: "Web Development Intro", url: "https://drive.google.com/file/d/1TY2IU1oRVe6Bdhyc5az7y_Ps0w0j2LzC/preview" },
  { id: "m4", type: "slide", title: "Web Development Flow", url: "https://drive.google.com/file/d/179fLaymrUDKeWwwnHLxyv2loaUp_PrYE/preview" },
  { id: "m5", type: "slide", title: "Frontend Development Deep Dive", url: "https://drive.google.com/file/d/1xNHi8nlM0K0Kc4PcwazDSlt5MMOVbZOI/preview" },
  { id: "m6", type: "slide", title: "Backend Development Flow", url: "https://drive.google.com/file/d/1z0vgJGv7U1q5BujNM69Aiv_12dOcEdfl/preview" }
];

export default function MaterialsSettings() {
  const [materials, setMaterials] = useState<any[]>(defaultMaterials);

  useEffect(() => {
    const savedData = localStorage.getItem('db_course_materials');
    if (savedData) setMaterials(JSON.parse(savedData));
  }, []);

  const saveMaterials = (newMats: any[]) => {
    setMaterials(newMats);
    localStorage.setItem('db_course_materials', JSON.stringify(newMats));
  };

  const handleAddMaterial = () => {
    const title = prompt("Masukkan Nama Modul/File:");
    if (!title) return;
    const url = prompt("Masukkan Tautan Dokumen (Google Drive/PDF):");
    if (!url) return;
    const type = prompt("Tipe File? (ketik 'slide' atau 'doc')") || 'doc';
    
    saveMaterials([...materials, { id: `m${Date.now()}`, type, title, url }]);
  };

  const handleDelete = (id: string) => {
    if(confirm("Yakin hapus lampiran ini?")) {
      saveMaterials(materials.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      <div className="flex items-center justify-between bg-white dark:bg-[#111111] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
         <div className="flex items-center gap-4">
             <div className="size-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-xl flex items-center justify-center">
                 <span className="material-symbols-outlined text-[24px]">folder_open</span>
             </div>
             <div>
                 <h3 className={`text-lg font-bold text-slate-900 dark:text-white ${googleSansAlt.className}`}>Lampiran Ekstra</h3>
                 <p className="text-xs text-slate-500">File referensi untuk diunduh siswa.</p>
             </div>
         </div>
         <button onClick={handleAddMaterial} className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span> Tambah File
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {materials.map((mat) => (
            <div key={mat.id} className="bg-white dark:bg-[#111111] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
               <div className="flex items-center gap-3 overflow-hidden">
                  <span className={`material-symbols-outlined text-[28px] ${mat.type === 'slide' ? 'text-orange-500' : 'text-blue-500'}`}>
                     {mat.type === 'slide' ? 'slideshow' : 'description'}
                  </span>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{mat.title}</p>
                     <p className="text-xs text-slate-400 truncate mt-0.5">{mat.url}</p>
                  </div>
               </div>
               <button onClick={() => handleDelete(mat.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                  <span className="material-symbols-outlined text-[20px] block">delete</span>
               </button>
            </div>
         ))}
      </div>
    </div>
  );
}