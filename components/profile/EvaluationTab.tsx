"use client";

import React, { useState } from "react";
import { DM_Sans } from "next/font/google";

const googleSansAlt = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700', '800'] });

interface EvaluationTabProps {
  showToast: (message: string, type: "error" | "success" | "loading") => void;
}

export default function EvaluationTab({ showToast }: EvaluationTabProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRating(true);
    
    // Simulasi pengiriman API
    setTimeout(() => {
        setIsSubmittingRating(false);
        showToast('Terima kasih! Evaluasi dan rating Anda berhasil dikirim.', 'success');
        setRating(0);
        setFeedback("");
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto pt-4">
      <div className="relative overflow-hidden bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-6 rounded-2xl mb-8">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
        <h3 className={`text-lg font-bold text-amber-600 dark:text-amber-400 mb-1 ${googleSansAlt.className}`}>
          Berikan Penilaian Anda
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Masukan dan rating Anda sangat berarti bagi instruktur untuk meningkatkan kualitas kelas di masa depan.
        </p>
      </div>

      <form onSubmit={handleSubmitEvaluation} className="space-y-8">
        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-6">Seberapa puas Anda dengan kelas ini?</p>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110 active:scale-95 outline-none"
              >
                <span className={`material-symbols-outlined text-[48px] md:text-[56px] transition-colors ${
                  (hoveredRating || rating) >= star 
                  ? 'text-amber-400 drop-shadow-sm' 
                  : 'text-slate-200 dark:text-slate-700' 
                }`} style={{ fontVariationSettings: `'FILL' ${(hoveredRating || rating) >= star ? 1 : 0}` }}>
                  star
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs font-extrabold text-amber-500 mt-4 uppercase tracking-wider h-4">
            {rating === 1 && "Sangat Kurang 😞"}
            {rating === 2 && "Kurang Baik 😕"}
            {rating === 3 && "Cukup Baik 😐"}
            {rating === 4 && "Sangat Baik 🙂"}
            {rating === 5 && "Luar Biasa Memuaskan! 🤩"}
            {rating === 0 && "Pilih Bintang"}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Komentar & Masukan (Opsional)</label>
          <textarea 
            rows={4} 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Ceritakan pengalaman Anda..." 
            className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500/50 outline-none resize-none transition-all shadow-sm" 
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            disabled={rating === 0 || isSubmittingRating} 
            className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 w-full md:w-auto ${rating > 0 ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'} ${googleSansAlt.className}`}
          >
            {isSubmittingRating ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin block"></span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">send</span>
            )}
            {isSubmittingRating ? 'Mengirim...' : 'Kirim Evaluasi'}
          </button>
        </div>
      </form>
    </div>
  );
}