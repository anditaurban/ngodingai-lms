"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCertificate } from "@/hooks/useCertificate";
import { useAssignments } from "@/hooks/useAssignments"; // ✨ Integrasi hook portfolio
import { Inter, DM_Sans } from "next/font/google";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import Link from "next/link"; // Untuk fallback routing

const inter = Inter({ subsets: ["latin"] });
const googleSansAlt = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export default function CertificatesTab() {
  // ✨ STATE: Seleksi Kursus (0 = Mode Grid/Resume, >0 = Mode Preview Sertifikat)
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0);
  const [selectedCourseName, setSelectedCourseName] = useState<string>("");

  // ✨ FETCH DATA
  const { assignments, loading: loadingAssignments } = useAssignments();
  const {
    data: certificateData,
    loading: loadingCert,
    error: certError,
  } = useCertificate(selectedCourseId);

  const [isProcessing, setIsProcessing] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [sessionName, setSessionName] = useState("Nama Peserta");

  // ✨ TOAST STATE
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "loading";
  } | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const showToast = (
    message: string,
    type: "error" | "success" | "loading" = "error",
  ) => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    if (type !== "loading") {
      toastTimer.current = setTimeout(() => setToast(null), 3500);
    }
  };

  // Set Nama dari Local Storage
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("user_profile");
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        const fullName =
          `${parsedProfile.nama || ""} ${parsedProfile.nama_belakang || ""}`.trim();
        setSessionName(
          fullName ||
            parsedProfile.full_name ||
            parsedProfile.name ||
            "Nama Peserta",
        );
      }
    } catch (err) {
      console.error("Gagal membaca sesi user:", err);
    }
  }, []);

  // Resize Observer untuk Canvas Sertifikat
  useEffect(() => {
    const container = containerRef.current;
    if (!container || selectedCourseId === 0 || loadingCert) return;

    const updateScale = () => {
      window.requestAnimationFrame(() => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          if (containerWidth > 0) {
            setScale(containerWidth / 1000);
          }
        }
      });
    };

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    updateScale();

    return () => observer.disconnect();
  }, [loadingCert, selectedCourseId]);

  const handleEditProfile = () => {
    window.dispatchEvent(new CustomEvent("triggerEditProfile"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsProcessing(true);
    showToast("Sedang menyiapkan PDF resolusi tinggi...", "loading");

    try {
      await document.fonts.ready;
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
        style: {
          backgroundColor: "#ffffff",
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

      const safeName = sessionName.replace(/[^a-z0-9]/gi, "_");
      pdf.save(`Sertifikat_NgodingAI_${safeName}.pdf`);
      showToast("Sertifikat berhasil diunduh!", "success");
    } catch (err: any) {
      console.warn("Render PDF Error:", err.message);
      showToast("Gagal mengunduh sertifikat. Silakan coba lagi.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ========================================================================
  // VIEW 1: LOADING PORTFOLIO
  // ========================================================================
  if (loadingAssignments) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 animate-fade-in">
        <div className="size-8 border-4 border-slate-200 border-t-[#00BCD4] rounded-full animate-spin"></div>
        <p
          className={`text-slate-500 text-sm font-medium animate-pulse ${inter.className}`}
        >
          Menyinkronkan resume sertifikat...
        </p>
      </div>
    );
  }

  // ========================================================================
  // VIEW 2: DAFTAR KELAS (GRID RESUME)
  // ========================================================================
  if (selectedCourseId === 0) {
    return (
      <div className="space-y-6 animate-fade-in pb-10">
        <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00BCD4]">
              workspace_premium
            </span>
            Daftar Sertifikat Resmi
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Sertifikat akan otomatis terbuka setelah tugas praktik Anda
            disetujui.
          </p>
        </div>

        {assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="size-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl">
                sentiment_dissatisfied
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
              Belum Ada Riwayat Kelas
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
              Silakan kerjakan tugas di kelas Anda terlebih dahulu untuk
              mencetak sertifikat.
            </p>
            <Link
              href="/assignments"
              className="bg-[#00BCD4] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#00acc1] transition-all flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">
                add_task
              </span>
              Mulai Kerjakan Tugas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assignments.map((item) => {
              const isUnlocked = item.reviewed === "yes";
              const isPending = item.reviewed === "no" && item.assignment_id;

              return (
                <div
                  key={item.assignment_id || Math.random()}
                  className={`group relative bg-white dark:bg-slate-800 rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                    isUnlocked
                      ? "border-slate-200 dark:border-slate-700 hover:border-[#00BCD4]/50 hover:shadow-xl hover:-translate-y-1"
                      : "border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div
                        className={`size-12 rounded-2xl flex items-center justify-center shadow-inner ${
                          isUnlocked
                            ? "bg-cyan-50 text-[#00BCD4] dark:bg-cyan-900/30"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[24px]">
                          {isUnlocked ? "workspace_premium" : "lock"}
                        </span>
                      </div>

                      {isUnlocked ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 uppercase tracking-widest">
                          Tersedia
                        </span>
                      ) : isPending ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 uppercase tracking-widest animate-pulse">
                          Review
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700 uppercase tracking-widest">
                          Terkunci
                        </span>
                      )}
                    </div>

                    <h4
                      className={`font-extrabold text-lg line-clamp-2 ${isUnlocked ? "text-slate-900 dark:text-white group-hover:text-[#00BCD4] transition-colors" : "text-slate-500"}`}
                    >
                      {item.course || "Kelas Mandiri"}
                    </h4>
                    <p className="text-xs font-medium text-slate-400 mt-1.5 line-clamp-1">
                      {isUnlocked
                        ? `Skor Kelulusan: ${item.evaluation_score}`
                        : "Selesaikan tugas akhir untuk membuka sertifikat."}
                    </p>
                  </div>

                  <div className="mt-6 relative z-10">
                    {isUnlocked ? (
                      // 1. JIKA LULUS -> Tombol Nyala & Bisa Diklik
                      <button
                        onClick={() => {
                          setSelectedCourseId(Number(item.course_id));
                          setSelectedCourseName(item.course);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-[#00BCD4] dark:hover:bg-[#00BCD4] dark:hover:text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        Lihat Sertifikat
                      </button>
                    ) : isPending ? (
                      // 2. JIKA PENDING -> Tombol Mati (Hanya Label)
                      <button
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                      >
                        <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                        Menunggu Review Mentor
                      </button>
                    ) : (
                      // 3. JIKA BELUM ADA TUGAS -> Arahkan ke Portfolio
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent("switchTab", { detail: "portfolio" }));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">drive_file_rename_outline</span>
                        Kumpulkan Tugas
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ========================================================================
  // VIEW 3: DETAIL SERTIFIKAT KELAS YANG DIPILIH
  // ========================================================================
  // ✨ 1. Satukan casting 'any' di satu variabel mentah
  const rawCertData = certificateData as any;

  // ✨ 2. Kembalikan jalur penggalian data yang fleksibel dan mendalam
  const displayData: any = rawCertData?.detail?.data || rawCertData?.data || rawCertData || {};

  // CARI STATUS TUGAS DARI KELAS YANG SEDANG DIBUKA
  const currentAssignment = assignments.find((a) => Number(a.course_id) === selectedCourseId);
  const isReviewedNo = currentAssignment?.reviewed === "no";
  const isReviewedYes = currentAssignment?.reviewed === "yes";

  return (
    <div
      className={`animate-fade-in relative max-w-5xl mx-auto pb-10 ${inter.className}`}
    >
      {/* TOAST UI */}
      <div
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-100 transition-all duration-500 flex items-center gap-3.5 px-6 py-4 rounded-[25px] shadow-2xl border backdrop-blur-xl ${
          toast
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-12 scale-95 pointer-events-none"
        } ${
          toast?.type === "success"
            ? "bg-emerald-600/80 border-emerald-400/30 text-white"
            : toast?.type === "error"
              ? "bg-red-600/80 border-red-400/30 text-white"
              : "bg-slate-800/80 border-slate-500/30 text-white"
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] ${toast?.type === "loading" ? "animate-spin" : ""}`}
        >
          {toast?.type === "success"
            ? "check_circle"
            : toast?.type === "error"
              ? "error"
              : "sync"}
        </span>
        <span className="text-[15px] font-bold tracking-wide">
          {toast?.message}
        </span>
      </div>

      {/* TOOLBAR KEMBALI & UNDUH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <button
          onClick={() => {
            setSelectedCourseId(0);
            setSelectedCourseName("");
          }}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Kembali ke Daftar
        </button>

        <button
          onClick={handleDownload}
          // ✨ Hapus validasi success dari Katib, biarkan peserta selalu bisa mengunduh!
          disabled={isProcessing || loadingCert || !!certError}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md w-full sm:w-auto ${googleSansAlt.className} ${
            isProcessing || loadingCert || !!certError
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              : "bg-[#00BCD4] text-white hover:bg-[#00a3b8]"
          }`}
        >
          {isProcessing ? (
            <span className="size-4 border-2 border-slate-300 border-t-white rounded-full animate-spin"></span>
          ) : (
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
          )}
          {isProcessing ? "Menyiapkan PDF..." : "Unduh PDF Asli"}
        </button>
      </div>

      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 md:p-4 flex items-center gap-3">
        <div className="bg-white dark:bg-slate-800 p-2 rounded-full text-blue-500 shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">
            manage_accounts
          </span>
        </div>
        <div className="flex-1">
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
            Nama sertifikat menggunakan data profil.{" "}
            <strong className="text-slate-800 dark:text-white ml-1">
              Kesalahan nama?
            </strong>
          </p>
        </div>
        <button
          onClick={handleEditProfile}
          className={`shrink-0 text-xs font-bold text-[#00BCD4] bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-sm ${googleSansAlt.className}`}
        >
          Ubah Profil
        </button>
      </div>

      {/* ✨ RENDER CANVAS (PAKSA TAMPIL KARENA GRID SUDAH JADI PATOKAN) */}
      {loadingCert ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="size-8 border-4 border-slate-200 border-t-[#00BCD4] rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">
            Menarik data dari server...
          </p>
        </div>
      ) : certError ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30 text-center px-4">
          <span className="material-symbols-outlined text-4xl text-red-400 mb-2">
            error
          </span>
          <p className="text-sm font-bold text-red-600 dark:text-red-400">
            Gagal memuat sertifikat.
          </p>
          <p className="text-xs text-red-500/70">{certError}</p>
        </div>
      ) : (
        // ✨ LOGIKA 3: CANVAS SERTIFIKAT LANGSUNG TAMPIL!
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 select-none overflow-hidden bg-white"
          style={{ aspectRatio: "1000 / 707" }}
        >
          <div
            ref={certificateRef}
            className="absolute top-0 left-0 bg-white origin-top-left"
            style={{
              width: "1000px",
              height: "707px",
              transform: `scale(${scale})`,
            }}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
      .cert-font-sans { font-family: ${googleSansAlt.style.fontFamily}, sans-serif !important; }
      .cert-font-inter { font-family: ${inter.style.fontFamily}, sans-serif !important; }
    `,
              }}
            />

            <img
              src="/assets/certificates/blank-template.jpg"
              alt="Certificate Background"
              className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
            />

            <div className="absolute inset-6 border-[3px] border-double border-[#d4af37]/60 pointer-events-none rounded"></div>
            <div className="absolute inset-8 border border-[#d4af37]/30 pointer-events-none rounded"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center">
              <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                <div className="relative h-16 w-48 mb-2">
                  <img
                    src="/assets/certificates/inovasia.png"
                    alt="Logo Inovasia"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="-mt-16 z-10">
                <h1 className="text-6xl text-[#ffffff] tracking-widest uppercase mb-2 cert-font-sans font-bold">
                  Certificate
                </h1>
                <p className="text-base text-[#d4af37] tracking-[0.3em] uppercase font-bold cert-font-inter">
                  For Participant
                </p>
              </div>

              <p className="mt-8 text-lg text-slate-500 italic z-10 cert-font-inter">
                This certificate is proudly presented to
              </p>

              <h2 className="mt-3 text-5xl font-bold text-[#ffffff] capitalize border-slate-300 pb-3 px-10 inline-block z-10 cert-font-sans">
                {displayData.full_name || sessionName}
              </h2>

              <p
                className="mt-6 max-w-2xl text-base text-slate-400 leading-relaxed z-10 cert-font-inter"
                dangerouslySetInnerHTML={{
                  __html:
                    displayData.achievement ||
                    `Has been awarded a Certificate of Completion for <strong>${selectedCourseName}</strong>.`,
                }}
              />

              <div className="absolute bottom-16 left-16 right-12 flex justify-between items-end z-10">
                <div className="text-left mb-0">
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2 cert-font-sans">
                    Date Issued
                  </p>
                  
                  {/* ✨ KITA KEMBALIKAN FALLBACK YANG AMAN & DINAMIS */}
                  <p className="text-xl text-slate-200 border-b border-slate-300 pb-1 mb-2 inline-block font-medium cert-font-inter">
                    {displayData?.issued || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  
                  <p className="text-xs text-slate-400 mt-1 font-medium cert-font-inter">
                    <span className="text-[#00BCD4] italic">
                      {displayData?.course_url || "https://ngodingai.inovasia.co.id"}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col items-center mb-0">
                  <div className="relative h-24 w-48 mb-1">
                    <img
                      src="/assets/certificates/ttd.jpg"
                      alt="Signature"
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                  <div className="w-56 text-center pt-2">
                    <p className="text-xl font-bold text-slate-200 leading-tight cert-font-sans">
                      Andita Permata
                    </p>
                    <p className="text-sm text-[#00BCD4] font-medium cert-font-inter">
                      Instructor
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
