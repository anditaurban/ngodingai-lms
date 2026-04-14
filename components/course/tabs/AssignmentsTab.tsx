"use client";

import React, { useState, useRef } from "react";
import { useAssignments, AssignmentData } from "@/hooks/useAssignments";

// Import komponen-komponen yang sudah terpecah
import AssignmentTable from "@/components/assignments/AssignmentTable";
import AssignmentFormModal from "@/components/assignments/AssignmentFormModal";
import AssignmentDeleteModal from "@/components/assignments/AssignmentDeleteModal";

export default function AssignmentsTab() {
  const {
    assignments,
    loading,
    isProcessing,
    currentPage,
    setCurrentPage,
    totalPages,
    totalRecords, 
    searchQuery,
    setSearchQuery,
    isSearching,
    submitAssignment,
    deleteAssignment,
  } = useAssignments();

  // STATE UNTUK MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Partial<AssignmentData>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // STATE TOAST MODERN
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "loading" } | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: "error" | "success" | "loading" = "error") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    if (type !== "loading") {
      toastTimer.current = setTimeout(() => setToast(null), 3500);
    }
  };

  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData({ project_title: "", git_repo: "", deployment_url: "", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AssignmentData) => {
    setModalMode("edit");
    // Penyesuaian mapping URL repo (tergantung key yang dikembalikan API Anda)
    setFormData({ ...item, git_repo: item.git_repo_url || item.git_repo });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_title || !formData.description) {
      showToast("Judul Proyek dan Deskripsi wajib diisi!", "error");
      return;
    }

    showToast(modalMode === "add" ? "Menyimpan tugas..." : "Memperbarui tugas...", "loading");

    const rawResult: any = await submitAssignment(modalMode, formData);
    const isSuccess = typeof rawResult === "object" ? rawResult.success : rawResult === true;
    const message = typeof rawResult === "object" ? rawResult.message : isSuccess ? "Berhasil disimpan!" : "Gagal menyimpan.";

    if (isSuccess) {
      setIsModalOpen(false);
      showToast(message, "success"); 
    } else {
      showToast(message, "error"); 
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    showToast("Menghapus tugas...", "loading");

    const rawResult: any = await deleteAssignment(deleteId);
    const isSuccess = typeof rawResult === "object" ? rawResult.success : rawResult === true;
    const message = typeof rawResult === "object" ? rawResult.message : isSuccess ? "Berhasil dihapus!" : "Gagal menghapus.";

    if (isSuccess) {
      setDeleteId(null);
      showToast(message, "success");
    } else {
      showToast(message, "error");
    }
  };

  return (
    <div className="animate-fade-in relative pb-10">
      
      {/* MODERN TOAST UI DENGAN Z-INDEX DEWA */}
      <div
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-9999 transition-all duration-500 ease-out flex items-center gap-3.5 px-6 py-4 rounded-[25px] shadow-2xl border backdrop-blur-xl ${
          toast
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-12 scale-95 pointer-events-none"
        } ${
          toast?.type === "success"
            ? "bg-emerald-600/80 border-emerald-400/30 text-white shadow-emerald-500/20"
            : toast?.type === "error"
            ? "bg-red-600/80 border-red-400/30 text-white shadow-red-500/20"
            : "bg-slate-800/80 dark:bg-slate-700/80 border-slate-500/30 text-white shadow-slate-900/30"
        }`}
      >
        <span className={`material-symbols-outlined text-[24px] ${toast?.type === 'loading' ? 'animate-spin text-slate-300' : ''}`}>
          {toast?.type === "success" ? "check_circle" : toast?.type === "error" ? "error" : "sync"}
        </span>
        <span className="text-[15px] font-bold tracking-wide">
          {toast?.message}
        </span>
      </div>

      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00BCD4] text-[32px]">
              assignment
            </span>
            Kumpulkan Tugas Praktik
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola dan pantau seluruh pengumpulan tugas praktik Anda di sini.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#00BCD4] hover:bg-[#00acc1] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 active:scale-95 whitespace-nowrap shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add_box</span>
          Kumpulkan Tugas Baru
        </button>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* TOOLBAR */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00BCD4] transition-colors material-symbols-outlined text-[22px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul proyek secara live..."
              className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none transition-all font-semibold text-sm placeholder:font-normal text-slate-700 dark:text-white"
            />
            {isSearching && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 size-5 border-2 border-slate-300 border-t-[#00BCD4] rounded-full animate-spin"></span>
            )}
          </div>
        </div>

        {/* KOMPONEN TABEL */}
        <AssignmentTable 
           assignments={assignments}
           loading={loading}
           isSearching={isSearching}
           onEdit={handleOpenEdit}
           onDelete={(id: number) => setDeleteId(id)}
           currentPage={currentPage}
           totalPages={totalPages}
           totalRecords={totalRecords}
           setCurrentPage={setCurrentPage}
        />
      </div>

      {/* MODAL FORM & DELETE */}
      <AssignmentFormModal 
         isOpen={isModalOpen}
         mode={modalMode}
         formData={formData}
         setFormData={setFormData}
         onClose={() => setIsModalOpen(false)}
         onSubmit={handleFormSubmit}
         isProcessing={isProcessing}
      />

      <AssignmentDeleteModal 
         deleteId={deleteId}
         onClose={() => setDeleteId(null)}
         onConfirm={confirmDelete}
         isProcessing={isProcessing}
      />
      
    </div>
  );
}