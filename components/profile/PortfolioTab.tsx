import React from 'react';
import Link from 'next/link';
import { useAssignments } from '../../hooks/useAssignments';

export default function PortfolioTab() {
    // Perbaikan: Tambahkan totalRecords dan hapus fetchAssignments karena 
    // hook useAssignments sudah otomatis melakukan fetch di awal render.
    const { assignments, loading, totalRecords } = useAssignments();

    // Fungsi Render Skor Visual
    const renderScoreBadge = (reviewed: string, score: number | string) => {
        if (reviewed === 'yes') {
            return (
                <div className="flex flex-col items-center justify-center size-12 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 shadow-md text-white border-2 border-white dark:border-slate-800 shrink-0 transform rotate-3 hover:rotate-0 transition-transform cursor-default" title="Skor Akhir">
                    <span className="text-lg font-black leading-none">{score}</span>
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center size-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-600 shrink-0 cursor-default" title="Menunggu Review">
                <span className="material-symbols-outlined text-[20px] animate-pulse">hourglass_top</span>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* HEADER PORTFOLIO */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
                <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#00BCD4]">folder_special</span>
                        Etalase Portofolio
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Ringkasan proyek terbaik yang telah Anda selesaikan.
                    </p>
                </div>
                <Link 
                    href="/assignments" 
                    className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#00BCD4] hover:text-white dark:hover:bg-[#00BCD4]"
                >
                    Kelola Semua Tugas
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
            </div>

            {/* KONTEN GRID CARD */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 animate-pulse"></div>
                    ))}
                </div>
            ) : assignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <div className="size-20 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <span className="material-symbols-outlined text-4xl">inventory_2</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Belum Ada Portofolio</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6 text-sm">
                        Anda belum mengumpulkan tugas apapun. Segera kerjakan *course* Anda dan bangun portofolio di sini!
                    </p>
                    <Link href="/assignments" className="bg-[#00BCD4] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-[#00acc1] transition-all flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-[18px]">add_task</span>
                        Mulai Kerjakan Tugas
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Kita batasi hanya menampilkan max 4 data terbaru sebagai "Etalase" */}
                    {assignments.slice(0, 4).map((item) => (
                        <div key={item.assignment_id} className="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-[#00BCD4]/30 transition-all duration-300 relative overflow-hidden">
                            
                            {/* Dekorasi Background */}
                            <div className="absolute top-0 right-0 p-16 bg-linear-to-bl from-cyan-50 to-transparent dark:from-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none"></div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-500 uppercase tracking-wider mb-3 border border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-[12px] text-[#00BCD4]">school</span>
                                        {item.course || 'Project'}
                                    </span>
                                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-[#00BCD4] transition-colors">
                                        {item.project_title}
                                    </h4>
                                    <p className="text-xs font-medium text-slate-400 mt-1">Disubmit pada {item.date}</p>
                                </div>
                                
                                {/* SKOR BADGE */}
                                {renderScoreBadge(item.reviewed, item.evaluation_score)}
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 relative z-10 h-10" title={item.description}>
                                {item.description}
                            </p>

                            {/* FOOTER CARD: Links & Mentor Feedback */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                                
                                {/* Tombol Links */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {(item.git_repo_url || item.git_repo) && (
                                        <a href={item.git_repo_url || item.git_repo} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
                                            <span className="material-symbols-outlined text-[14px]">code</span>
                                            Repo
                                        </a>
                                    )}
                                    {item.deployment_url && (
                                        <a href={item.deployment_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors">
                                            <span className="material-symbols-outlined text-[14px]">public</span>
                                            Live App
                                        </a>
                                    )}
                                </div>

                                {/* Status / Komentar Singkat */}
                                <div className="text-right flex-1 w-full sm:w-auto">
                                    {item.reviewed === 'yes' ? (
                                        item.comment ? (
                                            <div className="flex items-center sm:justify-end gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400" title={item.comment}>
                                                <span className="material-symbols-outlined text-[14px]">reviews</span>
                                                <span className="truncate max-w-[120px] italic">"{item.comment}"</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-bold text-emerald-500 flex items-center sm:justify-end gap-1">
                                                <span className="material-symbols-outlined text-[14px]">verified</span> Approved
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-xs font-bold text-amber-500 flex items-center sm:justify-end gap-1">
                                            <span className="material-symbols-outlined text-[14px]">pending</span> Reviewing...
                                        </span>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Jika tugas lebih dari 4, tunjukkan info tambahan */}
            {assignments.length > 4 && (
                <div className="text-center pt-4">
                    <p className="text-sm text-slate-500 font-medium">
                        Menampilkan 4 proyek terbaru. <Link href="/assignments" className="text-[#00BCD4] hover:underline font-bold">Lihat semua {totalRecords} proyek Anda</Link>.
                    </p>
                </div>
            )}
        </div>
    );
}