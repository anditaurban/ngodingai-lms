"use client";

import React from "react";

interface AssignmentDeleteModalProps {
  deleteId: number | null;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export default function AssignmentDeleteModal({
  deleteId,
  onClose,
  onConfirm,
  isProcessing,
}: AssignmentDeleteModalProps) {
  if (deleteId === null) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
        <div className="size-20 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-4xl">
            delete_forever
          </span>
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
          Hapus Tugas Ini?
        </h3>
        <p className="text-slate-500 text-sm mb-8">
          Data yang dihapus tidak akan ditampilkan lagi di daftar tugas Anda.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}