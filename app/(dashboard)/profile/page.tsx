"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Import Logic
import { useProfileLogic } from "@/hooks/useProfileLogic";

// Import Tabs UI
import GeneralTab from "@/components/profile/GeneralTab";
import AttendanceTab from "@/components/profile/AttendanceTab";
import CertificatesTab from "@/components/profile/CertificatesTab";
import PortfolioTab from "@/components/profile/PortfolioTab";

export default function ProfilePage() {
  // 1. PANGGIL HOOK DI URUTAN PALING ATAS (WAJIB)
  const {
    user,
    loading,
    handleLogout,
    uploadPhoto,
    isUploadingPhoto,
    setIsEditing,
    updateProfile,
  } = useProfileLogic();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. STATE ACTIVE TAB (HANYA SATU KALI DEKLARASI)
  const [activeTab, setActiveTab] = useState<
    "general" | "attendance" | "certificates" | "portfolio"
  >("general");

  // 3. EFFECT UNTUK EVENT LISTENER TOMBOL UBAH PROFIL
  useEffect(() => {
    const handleTriggerEdit = () => {
      setActiveTab("general"); // Pindah ke tab General
      setIsEditing(true); // Nyalakan mode edit
    };

    window.addEventListener("triggerEditProfile", handleTriggerEdit);

    return () => {
      window.removeEventListener("triggerEditProfile", handleTriggerEdit);
    };
  }, [setIsEditing]);

  // 4. HANDLER FOTO
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhoto(file);
    }
  };

  // 5. RENDER LOADING
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

  // 6. RENDER FALLBACK
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

  // 7. RENDER MAIN UI
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen animate-fade-in">
      {/* Header Halaman */}
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
          onClick={handleLogout}
          className="px-5 py-2.5 bg-white dark:bg-slate-800 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Keluar</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-4xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
        {/* Banner */}
        <div className="h-48 bg-linear-to-r from-[#00BCD4] to-blue-600 relative">
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
          {/* Header Profile Info */}
          <div className="relative size-24 md:size-32 shrink-0 group -mt-12 md:-mt-16 mb-6">
            {/* BINGKAI FOTO */}
            <div
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full ring-4 ring-white dark:ring-slate-800 bg-slate-100 shadow-xl overflow-hidden cursor-pointer group"
              onClick={handleAvatarClick}
              title="Klik untuk mengganti foto profil"
            >
              <Image
                src={
                  user?.photo
                    ? `${user.photo}${user.photo.startsWith("blob:") ? "" : `?v=${new Date().getTime()}`}`
                    : `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=00BCD4&color=fff`
                }
                alt="Profile Picture"
                fill
                sizes="(max-width: 768px) 96px, 128px"
                // Gambar hanya akan sedikit membesar, peredupan (opacity) ditangani oleh div overlay di bawah
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized={true}
                priority
              />

              {/* ✨ OVERLAY ICON KAMERA DI TENGAH ✨ */}
              {/* Layer hitam transparan dan ikon kamera ini awalnya tembus pandang (opacity-0). 
            Saat area foto di-hover (atau ditekan di mobile), opacity-nya naik jadi 100%. */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <span className="material-symbols-outlined text-white text-3xl md:text-4xl drop-shadow-md">
                  photo_camera
                </span>
              </div>

              {/* Loading Spinner Indicator (Muncul saat proses upload, menutupi elemen lain) */}
              {isUploadingPhoto && (
                <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="w-8 h-8 border-4 border-[#00BCD4] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* HIDDEN INPUT FILE */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  uploadPhoto(file);
                  e.target.value = ""; // Reset
                }
              }}
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex items-center gap-2 md:gap-8 border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: "general", label: "General", icon: "person" },
              {
                id: "attendance",
                label: "Attendance",
                icon: "event_available",
              },
              {
                id: "certificates",
                label: "Certificates",
                icon: "workspace_premium",
              },
              { id: "portfolio", label: "Assignments", icon: "folder_open" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-4 px-2 text-sm font-bold transition-all whitespace-nowrap border-b-[3px] rounded-t-lg ${
                  activeTab === tab.id
                    ? "text-[#00BCD4] border-[#00BCD4]"
                    : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT RENDERER */}
          <div className="min-h-7">
            {activeTab === "general" && <GeneralTab />}
            {activeTab === "attendance" && <AttendanceTab />}
            {activeTab === "certificates" && <CertificatesTab />}
            {activeTab === "portfolio" && <PortfolioTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
