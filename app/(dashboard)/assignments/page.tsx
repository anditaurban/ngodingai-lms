"use client";

import React, { useState } from "react";
import { useAssignments, AssignmentData } from "@/hooks/useAssignments";
import { useToast } from "@/components/ui/ToastProvider";

// Import komponen-komponen yang sudah kita pecah tadi
import AssignmentTable from "@/components/assignments/AssignmentTable";
import AssignmentFormModal from "@/components/assignments/AssignmentFormModal";
import AssignmentDeleteModal from "@/components/assignments/AssignmentDeleteModal";

export default function AssignmentsPage() {
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

  const { showToast } = useToast();

  // STATE UNTUK MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Partial<AssignmentData>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fungsi Buka Modal Add
  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData({ project_title: "", git_repo: "", deployment_url: "", description: "" });
    setIsModalOpen(true);
  };

  // Fungsi Buka Modal Edit
  const handleOpenEdit = (item: AssignmentData) => {
    setModalMode("edit");
    setFormData({ ...item, git_repo: item.git_repo_url || item.git_repo });
    setIsModalOpen(true);
  };

  // Proses Submit Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_title || !formData.description) {
      showToast("error", "Judul Proyek dan Deskripsi wajib diisi!");
      return;
    }

    const rawResult = await submitAssignment(modalMode, formData);
    const isSuccess = typeof rawResult === "object" ? (rawResult as any).success : rawResult === true;
    const message = typeof rawResult === "object" ? (rawResult as any).message : isSuccess ? "Berhasil disimpan!" : "Gagal menyimpan.";

    if (isSuccess) {
      setIsModalOpen(false);
      showToast("success", message);
    } else {
      showToast("error", message);
    }
  };

  // Proses Confirm Delete
  const confirmDelete = async () => {
    if (!deleteId) return;
    const rawResult = await deleteAssignment(deleteId);
    const isSuccess = typeof rawResult === "object" ? (rawResult as any).success : rawResult === true;
    const message = typeof rawResult === "object" ? (rawResult as any).message : isSuccess ? "Berhasil dihapus!" : "Gagal menghapus.";

    if (isSuccess) {
      setDeleteId(null);
      showToast("success", message);
    } else {
      showToast("error", message);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-350 mx-auto min-h-screen animate-fade-in relative">
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00BCD4] text-[32px]">
              assignment
            </span>
            Manajemen Tugas
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola dan pantau seluruh pengumpulan tugas course Anda di sini.
          </p>
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
            Total:{" "}
            <span className="text-slate-900 dark:text-white px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md">
              {totalRecords}
            </span>{" "}
            Tugas
          </div>
        </div>

        {/* MEMANGGIL KOMPONEN TABEL */}
        <AssignmentTable 
           assignments={assignments}
           loading={loading}
           isSearching={isSearching}
           onEdit={handleOpenEdit}
           onDelete={(id) => setDeleteId(id)}
           currentPage={currentPage}
           totalPages={totalPages}
           setCurrentPage={setCurrentPage}
        />
      </div>

      {/* MEMANGGIL KOMPONEN MODAL FORM */}
      <AssignmentFormModal 
          isOpen={isModalOpen}
          mode={modalMode}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          isProcessing={isProcessing}
      />

      {/* MEMANGGIL KOMPONEN MODAL DELETE */}
      <AssignmentDeleteModal 
          deleteId={deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          isProcessing={isProcessing}
      />
      
    </div>
  );
}