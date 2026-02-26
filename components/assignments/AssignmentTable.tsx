"use client";

import React from "react";
import { AssignmentData } from "@/hooks/useAssignments";

interface AssignmentTableProps {
  assignments: AssignmentData[];
  loading: boolean;
  isSearching: boolean;
  onEdit: (item: AssignmentData) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function AssignmentTable({
  assignments,
  loading,
  isSearching,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  setCurrentPage,
}: AssignmentTableProps) {
  
  // Renderer Lencana Status
  const renderStatusBadge = (reviewed: string) => {
    if (reviewed === "yes") {
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
    <>
      {/* ✨ FIX: Tambahkan overflow-y-auto dan max-h agar tabel bisa di-scroll mandiri */}
      <div className="overflow-x-auto overflow-y-auto max-h-[65vh] min-h-100 relative">
        <table className="w-full text-left border-collapse">
          {/* ✨ FIX: Sticky Header (Menempel di atas saat di-scroll) */}
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
              {/* Tambahkan sticky dan background color di setiap TH agar tidak transparan */}
              <th className="sticky top-0 bg-slate-100 dark:bg-slate-900 p-5 font-bold border-b border-r border-slate-200 dark:border-slate-700">
                Tugas & Proyek
              </th>
              <th className="sticky top-0 bg-slate-100 dark:bg-slate-900 p-5 font-bold border-b border-r border-slate-200 dark:border-slate-700">
                Tautan & Deskripsi
              </th>
              <th className="sticky top-0 bg-slate-100 dark:bg-slate-900 p-5 font-bold border-b border-r border-slate-200 dark:border-slate-700 text-center">
                Skor Evaluasi
              </th>
              <th className="sticky top-0 bg-slate-100 dark:bg-slate-900 p-5 font-bold border-b border-r border-slate-200 dark:border-slate-700">
                Status & Komentar
              </th>
              <th className="sticky top-0 bg-slate-100 dark:bg-slate-900 p-5 font-bold border-b border-slate-200 dark:border-slate-700 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {loading && !isSearching ? (
              <tr>
                <td colSpan={5} className="p-10 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-8 border-4 border-slate-200 border-t-[#00BCD4] rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-500 font-medium">
                      Memuat data tugas...
                    </p>
                  </div>
                </td>
              </tr>
            ) : assignments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-16 text-center">
                  <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <span className="material-symbols-outlined text-4xl">
                      folder_off
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tidak ada data ditemukan
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Coba ubah kata kunci pencarian atau tambah tugas baru.
                  </p>
                </td>
              </tr>
            ) : (
              assignments.map((item) => {
                const displayReviewed = item.reviewed === "yes" ? "yes" : "no";

                // ✨ FIX LOGIC: Jika sudah direview, mutlak nilai 10. Jika belum, strip (-).
                const displayScore = displayReviewed === "yes" ? 10 : "-";

                const displayComment = item.comment || "";

                return (
                  <tr
                    key={item.assignment_id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* TD 1: Tugas & Proyek */}
                    <td className="p-5 align-top border-r border-slate-200 dark:border-slate-700/50">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded w-fit uppercase">
                          {item.course || "Project"}
                        </span>
                        <p className="font-extrabold text-slate-900 dark:text-white text-base">
                          {item.project_title}
                        </p>
                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">
                            calendar_month
                          </span>
                          {item.date}
                        </p>
                      </div>
                    </td>

                    {/* TD 2: Tautan & Deskripsi */}
                    <td className="p-5 align-top max-w-62.5 border-r border-slate-200 dark:border-slate-700/50">
                      <div className="flex flex-col gap-2">
                        <p
                          className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2"
                          title={item.description}
                        >
                          {item.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {(item.git_repo_url || item.git_repo) && (
                            <a
                              href={item.git_repo_url || item.git_repo}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-[#00BCD4] transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[12px]">
                                code
                              </span>{" "}
                              Repo
                            </a>
                          )}
                          {item.deployment_url && (
                            <a
                              href={item.deployment_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-blue-500 transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[12px]">
                                public
                              </span>{" "}
                              Live App
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* TD 3: Skor Evaluasi (Visual Konsisten) */}
                    <td className="p-5 align-top text-center border-r border-slate-200 dark:border-slate-700/50">
                      <div
                        className={`inline-flex flex-col items-center justify-center size-14 rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                          displayReviewed === "yes"
                            ? "bg-linear-to-br from-amber-400 to-orange-500 shadow-orange-500/20 text-white border-white dark:border-slate-800"
                            : "bg-slate-100 dark:bg-slate-800 shadow-slate-200/20 dark:shadow-none text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <span className="text-xl font-black leading-none">
                          {displayScore}
                        </span>
                        <span className="text-[9px] font-bold opacity-80 leading-none mt-0.5">
                          / 10
                        </span>
                      </div>
                    </td>

                    {/* TD 4: Status & Komentar (Murni Data Asli) */}
                    <td className="p-5 align-top max-w-50 border-r border-slate-200 dark:border-slate-700/50">
                      <div className="flex flex-col items-start gap-2">
                        {renderStatusBadge(displayReviewed)}
                        {displayComment && (
                          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-2.5 rounded-lg w-full relative mt-1">
                            <span className="absolute -top-2 left-3 bg-white dark:bg-slate-800 text-[9px] font-bold text-blue-500 px-1 uppercase tracking-wider">
                              Mentor
                            </span>
                            <p
                              className="text-xs text-slate-600 dark:text-slate-300 font-medium italic line-clamp-2"
                              title={displayComment}
                            >
                              "{displayComment}"
                            </p>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* TD 5: Aksi (Edit & Delete) */}
                    <td className="p-5 align-top text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="size-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-[#00BCD4] hover:bg-cyan-50 dark:hover:bg-cyan-900/30 flex items-center justify-center transition-colors"
                          title="Edit Tugas"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => onDelete(item.assignment_id)}
                          className="size-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors"
                          title="Hapus Tugas"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-500">
            Halaman{" "}
            <strong className="text-slate-900 dark:text-white">
              {currentPage}
            </strong>{" "}
            dari{" "}
            <strong className="text-slate-900 dark:text-white">
              {totalPages}
            </strong>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>{" "}
              Prev
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              Next{" "}
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}