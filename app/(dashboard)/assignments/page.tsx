"use client";

import React, { useState } from 'react';
import { useAssignments, AssignmentData } from '@/hooks/useAssignments';

export default function AssignmentsPage() {
    const {
        assignments, loading, isProcessing,
        currentPage, setCurrentPage,
        totalPages, totalRecords,
        searchQuery, setSearchQuery, isSearching,
        submitAssignment, deleteAssignment
    } = useAssignments();

    // STATE UNTUK MODAL ADD/EDIT
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [formData, setFormData] = useState<Partial<AssignmentData>>({});

    // STATE UNTUK MODAL DELETE
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Buka Modal Add
    const handleOpenAdd = () => {
        setModalMode('add');
        setFormData({ project_title: '', git_repo: '', deployment_url: '', description: '' });
        setIsModalOpen(true);
    };

    // Buka Modal Edit
    const handleOpenEdit = (item: AssignmentData) => {
        setModalMode('edit');
        setFormData({ 
            ...item, 
            git_repo: item.git_repo_url || item.git_repo 
        });
        setIsModalOpen(true);
    };

    // Simpan Data
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.project_title || !formData.description) return alert("Judul Proyek dan Deskripsi wajib diisi!");
        
        const success = await submitAssignment(modalMode, formData);
        if (success) setIsModalOpen(false);
    };

    // Proses Delete
    const confirmDelete = async () => {
        if (!deleteId) return;
        const success = await deleteAssignment(deleteId);
        if (success) setDeleteId(null);
    };

    // Renderer Lencana Status
    const renderStatusBadge = (reviewed: string) => {
        if (reviewed === 'yes') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                    Selesai Direview
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Menunggu Review
            </span>
        );
    };

    return (
        <div className="p-6 md:p-10 max-w-350 mx-auto min-h-screen animate-fade-in relative">
            
            {/* ==============================================================
                BAGIAN 1: HEADER & TOOLBAR
            ============================================================== */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#00BCD4] text-[32px]">assignment</span>
                        Manajemen Tugas
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola dan pantau seluruh pengumpulan tugas course Anda di sini.</p>
                </div>
                <button 
                    onClick={handleOpenAdd}
                    className="px-5 py-2.5 bg-[#00BCD4] hover:bg-[#00acc1] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 active:scale-95"
                >
                    <span className="material-symbols-outlined text-[20px]">add_box</span>
                    Tambah Tugas Baru
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                
                {/* TOOLBAR */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96 group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00BCD4] transition-colors material-symbols-outlined text-[22px]">
                            search
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari judul proyek secara live..."
                            className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none transition-all font-semibold text-sm placeholder:font-normal"
                        />
                        {isSearching && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 size-5 border-2 border-slate-300 border-t-[#00BCD4] rounded-full animate-spin"></span>
                        )}
                    </div>
                    <div className="text-sm font-bold text-slate-500">
                        Total: <span className="text-slate-900 dark:text-white px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md">{totalRecords || 0}</span> Tugas
                    </div>
                </div>

                {/* ==============================================================
                    BAGIAN 2: TABLE KONTEN
                ============================================================== */}
                <div className="overflow-x-auto min-h-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            {/* ✨ UPDATE: Menambahkan border-r untuk pemisah vertikal antar kolom */}
                            <tr className="bg-slate-100 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                                <th className="p-5 font-bold border-b border-r border-slate-200 dark:border-slate-700">Tugas & Proyek</th>
                                <th className="p-5 font-bold border-b border-r border-slate-200 dark:border-slate-700">Tautan & Deskripsi</th>
                                <th className="p-5 font-bold border-b border-r border-slate-200 dark:border-slate-700 text-center">Skor Evaluasi</th>
                                <th className="p-5 font-bold border-b border-r border-slate-200 dark:border-slate-700">Status & Komentar</th>
                                <th className="p-5 font-bold border-b border-slate-200 dark:border-slate-700 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            
                            {loading && !isSearching ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="size-8 border-4 border-slate-200 border-t-[#00BCD4] rounded-full animate-spin"></div>
                                            <p className="text-sm text-slate-500 font-medium">Memuat data tugas...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (!assignments || assignments.length === 0) ? (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center">
                                        <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                            <span className="material-symbols-outlined text-4xl">folder_off</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">Tidak ada data ditemukan</h3>
                                        <p className="text-slate-500 text-sm">Coba ubah kata kunci pencarian atau tambah tugas baru.</p>
                                    </td>
                                </tr>
                            ) : (
                                assignments.map((item) => (
                                    <tr key={item.assignment_id || Math.random()} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                        
                                        {/* ✨ UPDATE: Menambahkan border-r di setiap td */}
                                        <td className="p-5 align-top border-r border-slate-200 dark:border-slate-700/50">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded w-fit uppercase">
                                                    {item.course || 'Project'}
                                                </span>
                                                <p className="font-extrabold text-slate-900 dark:text-white text-base">
                                                    {item.project_title}
                                                </p>
                                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                                                    <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                                                    {item.date}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="p-5 align-top max-w-62.5 border-r border-slate-200 dark:border-slate-700/50">
                                            <div className="flex flex-col gap-2">
                                                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2" title={item.description}>
                                                    {item.description}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    {(item.git_repo_url || item.git_repo) && (
                                                        <a href={item.git_repo_url || item.git_repo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-[#00BCD4] transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded shadow-sm">
                                                            <span className="material-symbols-outlined text-[12px]">code</span> Repo
                                                        </a>
                                                    )}
                                                    {item.deployment_url && (
                                                        <a href={item.deployment_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-blue-500 transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded shadow-sm">
                                                            <span className="material-symbols-outlined text-[12px]">public</span> Live App
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-5 align-top text-center border-r border-slate-200 dark:border-slate-700/50">
                                            {item.reviewed === 'yes' ? (
                                                <div className="inline-flex flex-col items-center justify-center size-14 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20 text-white border-2 border-white dark:border-slate-800">
                                                    <span className="text-xl font-black leading-none">{item.evaluation_score}</span>
                                                    <span className="text-[9px] font-bold opacity-80 leading-none mt-0.5">/ 10</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 dark:text-slate-600 font-medium text-xl">-</span>
                                            )}
                                        </td>

                                        <td className="p-5 align-top max-w-50 border-r border-slate-200 dark:border-slate-700/50">
                                            <div className="flex flex-col items-start gap-2">
                                                {renderStatusBadge(item.reviewed)}
                                                {item.comment && (
                                                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-2.5 rounded-lg w-full relative mt-1">
                                                        <span className="absolute -top-2 left-3 bg-white dark:bg-slate-800 text-[9px] font-bold text-blue-500 px-1 uppercase tracking-wider">
                                                            Mentor
                                                        </span>
                                                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium italic line-clamp-2" title={item.comment}>
                                                            "{item.comment}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* ✨ UPDATE: Tombol Aksi dibuat selalu muncul (opacity-100) */}
                                        <td className="p-5 align-top text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="size-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-[#00BCD4] hover:bg-cyan-50 dark:hover:bg-cyan-900/30 flex items-center justify-center transition-colors" title="Edit Tugas"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button 
                                                    onClick={() => setDeleteId(item.assignment_id)}
                                                    className="size-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors" title="Hapus Tugas"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {!loading && totalPages > 1 && (
                    <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm font-medium text-slate-500">
                            Halaman <strong className="text-slate-900 dark:text-white">{currentPage}</strong> dari <strong className="text-slate-900 dark:text-white">{totalPages}</strong>
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span> Prev
                            </button>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1"
                            >
                                Next <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ==============================================================
                BAGIAN 3: MODAL POP-UP (ADD & EDIT) ... (TIDAK ADA PERUBAHAN)
            ============================================================== */}
            {isModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#00BCD4]">
                                    {modalMode === 'add' ? 'library_add' : 'edit_document'}
                                </span>
                                {modalMode === 'add' ? 'Tambah Tugas Baru' : 'Edit Tugas'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-100 dark:bg-slate-700 rounded-full p-1.5">
                                <span className="material-symbols-outlined text-[20px] block">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">Judul Proyek <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" required
                                        value={formData.project_title || ''}
                                        onChange={e => setFormData({...formData, project_title: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none text-sm font-semibold transition-all"
                                        placeholder="Contoh: Inventory Web App"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">Git Repository (URL)</label>
                                        <input 
                                            type="url" 
                                            value={formData.git_repo || ''}
                                            onChange={e => setFormData({...formData, git_repo: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none text-sm font-semibold transition-all"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">Deployment (URL Live)</label>
                                        <input 
                                            type="url" 
                                            value={formData.deployment_url || ''}
                                            onChange={e => setFormData({...formData, deployment_url: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none text-sm font-semibold transition-all"
                                            placeholder="https://domain-kamu.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">Deskripsi / Catatan Tambahan <span className="text-red-500">*</span></label>
                                    <textarea 
                                        required rows={3}
                                        value={formData.description || ''}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none text-sm font-medium transition-all resize-none"
                                        placeholder="Ceritakan singkat tentang fitur aplikasi ini..."
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={isProcessing} className="px-8 py-3 bg-[#00BCD4] hover:bg-[#00acc1] text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50">
                                    {isProcessing && <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                                    {isProcessing ? 'Menyimpan...' : 'Simpan Tugas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ==============================================================
                BAGIAN 4: MODAL KONFIRMASI DELETE ... (TIDAK ADA PERUBAHAN)
            ============================================================== */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-110 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteId(null)}></div>
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="size-20 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl">delete_forever</span>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Hapus Tugas Ini?</h3>
                        <p className="text-slate-500 text-sm mb-8">Data yang dihapus tidak akan ditampilkan lagi di daftar tugas Anda.</p>
                        
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} disabled={isProcessing} className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-colors">
                                Batal
                            </button>
                            <button onClick={confirmDelete} disabled={isProcessing} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2">
                                {isProcessing ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}