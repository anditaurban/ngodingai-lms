"use client";

import React from "react";
import { AssignmentData } from "@/hooks/useAssignments";

interface AssignmentFormModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  formData: Partial<AssignmentData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<AssignmentData>>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
}

export default function AssignmentFormModal({
  isOpen,
  mode,
  formData,
  setFormData,
  onClose,
  onSubmit,
  isProcessing,
}: AssignmentFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00BCD4]">
              {mode === "add" ? "library_add" : "edit_document"}
            </span>
            {mode === "add" ? "Tambah Tugas Baru" : "Edit Tugas"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors bg-slate-100 dark:bg-slate-700 rounded-full p-1.5"
          >
            <span className="material-symbols-outlined text-[20px] block">
              close
            </span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                Judul Proyek <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.project_title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, project_title: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none text-sm font-semibold transition-all"
                placeholder="Contoh: Inventory Web App"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                  Git Repository (URL)
                </label>
                <input
                  type="url"
                  value={formData.git_repo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, git_repo: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none text-sm font-semibold transition-all"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                  Deployment (URL Live)
                </label>
                <input
                  type="url"
                  value={formData.deployment_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, deployment_url: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none text-sm font-semibold transition-all"
                  placeholder="https://domain-kamu.com"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                Deskripsi / Catatan Tambahan <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none text-sm font-medium transition-all resize-none"
                placeholder="Ceritakan singkat tentang fitur aplikasi ini..."
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-8 py-3 bg-[#00BCD4] hover:bg-[#00acc1] text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing && (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              {isProcessing ? "Menyimpan..." : "Simpan Tugas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}