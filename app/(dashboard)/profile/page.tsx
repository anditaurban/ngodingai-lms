"use client";

import React, { useState, useRef, useEffect } from "react";
import { useProfileLogic } from "@/hooks/useProfileLogic";
import GeneralTab from "@/components/profile/GeneralTab";
import PortfolioTab from "@/components/profile/PortfolioTab";
import CertificatesTab from "@/components/profile/CertificatesTab";

export default function ProfilePage() {
  const {
    user,
    loading,
    handleLogout,
    uploadPhoto,
    isUploadingPhoto,
    setIsEditing,
  } = useProfileLogic();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<
    "general" | "portfolio" | "certificates"
  >("general");

  const [imageError, setImageError] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  // ✨ STATE BARU: OPTIMISTIC UI (Bypass lambatnya server Katib)
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);

  // STATE TOAST DIPERBARUI: Tambah tipe 'loading'
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "loading" } | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  // FUNGSI TOAST LEBIH PINTAR
  const showToast = (message: string, type: "error" | "success" | "loading" = "error") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    if (type !== "loading") {
      toastTimer.current = setTimeout(() => setToast(null), 3500);
    }
  };

  useEffect(() => {
    setImageError(false);
  }, [user?.photo, localPhoto]);

  const handleLogoutClick = () => {
    window.history.back();
  };

  useEffect(() => {
    const handleTriggerEdit = () => {
      setActiveTab("general");
      setIsEditing(true);
    };
    window.addEventListener("triggerEditProfile", handleTriggerEdit);
    return () =>
      window.removeEventListener("triggerEditProfile", handleTriggerEdit);
  }, [setIsEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target as Node)
      ) {
        setIsAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuUploadClick = () => {
    setIsAvatarMenuOpen(false);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // ✨ 1. UPDATE VISUAL INSTAN SEBELUM SERVER SELESAI
        const tempUrl = URL.createObjectURL(file);
        setLocalPhoto(tempUrl);

        // 2. JALANKAN PROSES SERVER (Bisa makan 13 detik)
        showToast("Sedang mengunggah foto...", "loading");
        await uploadPhoto(file); 
        showToast("Foto profil berhasil diperbarui!", "success");
      } catch (error: any) {
        // ✨ JIKA GAGAL (Maks 5MB / Error), KEMBALIKAN KE FOTO LAMA
        setLocalPhoto(null);
        showToast(error.message || "Gagal mengunggah foto.", "error");
      }
    }
    if (e.target) e.target.value = "";
  };

  const handleRotateImage = async () => {
    if (!user || isUploadingPhoto || isRotating) return;
    setIsAvatarMenuOpen(false);

    // ✨ GUNAKAN FOTO TERBARU (Local) JIKA ADA
    const currentPhotoUrl = localPhoto || user.photo || user.avatar;
    if (!currentPhotoUrl) {
      return showToast("Tidak ada foto untuk diputar!", "error");
    }

    setIsRotating(true);
    try {
      showToast("Sedang memproses foto...", "loading");
      
      const img = new Image();
      
      // ✨ MENCEGAH ERROR CORS JIKA FOTO DARI LOCAL BLOB
      if (currentPhotoUrl.startsWith("data:image") || currentPhotoUrl.startsWith("blob:")) {
        img.src = currentPhotoUrl;
      } else {
        img.crossOrigin = "anonymous";
        let urlToFetch = currentPhotoUrl;
        // Gunakan wildcard .katib.cloud agar aman di Dev/Prod
        if (urlToFetch.startsWith("http") && urlToFetch.includes(".katib.cloud")) {
          urlToFetch = `/api/proxy-image?url=${encodeURIComponent(urlToFetch)}`;
        }
        img.src = urlToFetch;
      }

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Gagal memuat gambar"));
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.height;
      canvas.height = img.width;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas API tidak didukung");

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      canvas.toBlob(
        async (rotatedBlob) => {
          if (rotatedBlob) {
            const rotatedFile = new File([rotatedBlob], "rotated_profile.jpg", {
              type: "image/jpeg",
            });
            try {
              // ✨ 1. UPDATE VISUAL INSTAN SEBELUM SERVER SELESAI
              const tempUrl = URL.createObjectURL(rotatedBlob);
              setLocalPhoto(tempUrl);

              // 2. JALANKAN PROSES SERVER
              await uploadPhoto(rotatedFile);
              showToast("Foto berhasil diputar!", "success");
            } catch (err: any) {
              setLocalPhoto(null);
              showToast(err.message || "Gagal memutar foto", "error");
            }
          }
          setIsRotating(false);
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("Gagal memutar gambar:", error);
      showToast("Terjadi kesalahan saat mencoba memutar gambar.", "error");
      setIsRotating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#00BCD4]"></div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">
          Memuat data profil...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <h2 className="text-xl font-bold mb-2">Profil Tidak Ditemukan</h2>
        <button
          onClick={handleLogout}
          className="text-[#00BCD4] font-bold hover:underline"
        >
          Login Kembali
        </button>
      </div>
    );
  }

  const fullName =
    `${user.nama || ""} ${user.nama_belakang || ""}`.trim() ||
    user.name ||
    "Peserta NgodingAI";

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=00BCD4&color=fff`;
  
  // ✨ TAMPILKAN FOTO LOCAL JIKA ADA, BYPASS SERVER CACHE
  let finalPhotoUrl = localPhoto || user.photo || user.avatar || "";

  if (
    !localPhoto &&
    finalPhotoUrl.startsWith("http") &&
    finalPhotoUrl.includes(".katib.cloud")
  ) {
    finalPhotoUrl = `/api/proxy-image?url=${encodeURIComponent(finalPhotoUrl)}`;
  }

  const displayPhoto = imageError
    ? defaultAvatar
    : finalPhotoUrl || defaultAvatar;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen animate-fade-in relative">
      
      {/* =========================================
          ✨ MODERN TOAST UI (GLASSMORPHISM + ROUNDED 25px)
      ========================================= */}
      <div
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-100 transition-all duration-500 ease-out flex items-center gap-3.5 px-6 py-4 rounded-[25px] shadow-2xl border backdrop-blur-xl ${
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
      {/* ========================================= */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola informasi akun dan aktivitas belajar Anda.
          </p>
        </div>
        <button
          onClick={handleLogoutClick}
          className="px-5 py-2.5 bg-white dark:bg-slate-800 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Keluar</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-4xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-visible relative">
        <div className="h-40 md:h-48 bg-linear-to-r from-[#00BCD4] to-blue-600 relative overflow-hidden rounded-t-4xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 2px, transparent 2.5px)",
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        <div className="px-6 md:px-10 pb-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 md:gap-6 -mt-12 md:-mt-16 mb-8 relative z-20">
            <div
              className="relative size-24 md:size-32 shrink-0"
              ref={avatarMenuRef}
            >
              <div
                className="relative w-full h-full rounded-full ring-4 ring-white dark:ring-slate-800 bg-slate-100 shadow-xl overflow-hidden cursor-pointer group"
                onClick={() =>
                  !isUploadingPhoto &&
                  !isRotating &&
                  setIsAvatarMenuOpen(!isAvatarMenuOpen)
                }
              >
                <img
                  src={displayPhoto}
                  alt="Profile Picture"
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isUploadingPhoto || isRotating ? "opacity-50 blur-sm" : ""}`}
                  onError={() => setImageError(true)}
                />

                {(isUploadingPhoto || isRotating) && (
                  <div className="absolute inset-0 bg-black/40 z-20 flex flex-col items-center justify-center backdrop-blur-[1px]">
                    <span className="size-8 border-4 border-white/30 border-t-[#00BCD4] rounded-full animate-spin"></span>
                  </div>
                )}

                {!isUploadingPhoto && !isRotating && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white z-10">
                    <span className="material-symbols-outlined text-3xl mb-1">
                      photo_camera
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Ubah
                    </span>
                  </div>
                )}
              </div>

              {isAvatarMenuOpen && (
                <div className="absolute top-[105%] left-0 sm:left-1/2 sm:-translate-x-1/2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-fade-in origin-top">
                  <div className="py-1">
                    <button
                      onClick={handleMenuUploadClick}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#00BCD4]">
                        upload_file
                      </span>
                      Unggah Foto Baru
                    </button>

                    {user.photo && (
                      <button
                        onClick={handleRotateImage}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
                      >
                        <span className="material-symbols-outlined text-[18px] text-slate-500">
                          rotate_right
                        </span>{" "}
                        Putar 90&deg;
                      </button>
                    )}
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />
            </div>

            <div className="flex-1 sm:pb-2">
              <div className="inline-flex flex-col bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 relative -top-4 sm:top-0">
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                  {fullName}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[14px]">
                    mail
                  </span>
                  <span className="text-[13px] md:text-sm font-medium leading-none">
                    {user.email || "Email tidak tersedia"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-8 border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: "general", label: "General", icon: "person" },
              { id: "portfolio", label: "Assignments", icon: "folder_open" },
              {
                id: "certificates",
                label: "Certificates",
                icon: "workspace_premium",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-4 px-2 text-sm font-bold transition-all whitespace-nowrap border-b-[3px] rounded-t-lg ${
                  activeTab === tab.id
                    ? "text-[#00BCD4] border-[#00BCD4]"
                    : "text-slate-500 border-transparent hover:text-slate-800"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-7">
            {activeTab === "general" && <GeneralTab />}
            {activeTab === "portfolio" && <PortfolioTab />}
            {activeTab === "certificates" && <CertificatesTab />}
          </div>
        </div>
      </div>
    </div>
  );
}