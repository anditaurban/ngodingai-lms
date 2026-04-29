"use client";

import React, { useState, useRef, useEffect } from "react";
import { DM_Sans } from "next/font/google";

const googleSansAlt = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700', '800'] });

interface ProfileHeaderProps {
  user: any;
  // ✨ FIX: Tipe kembalian diubah dari Promise<void> menjadi Promise<boolean> ✨
  uploadPhoto: (file: File) => Promise<boolean>;
  isUploadingPhoto: boolean;
  showToast: (message: string, type: "error" | "success" | "loading") => void;
}

export default function ProfileHeader({ user, uploadPhoto, isUploadingPhoto, showToast }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  const [imageError, setImageError] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);

  useEffect(() => {
    setImageError(false);
  }, [user?.photo, localPhoto]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
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
        const tempUrl = URL.createObjectURL(file);
        setLocalPhoto(tempUrl);

        showToast("Sedang mengunggah foto...", "loading");
        await uploadPhoto(file); 
        showToast("Foto profil berhasil diperbarui!", "success");
      } catch (error: any) {
        setLocalPhoto(null);
        showToast(error.message || "Gagal mengunggah foto.", "error");
      }
    }
    if (e.target) e.target.value = "";
  };

  const handleRotateImage = async () => {
    if (!user || isUploadingPhoto || isRotating) return;
    setIsAvatarMenuOpen(false);

    const currentPhotoUrl = localPhoto || user.photo || user.avatar;
    if (!currentPhotoUrl) {
      return showToast("Tidak ada foto untuk diputar!", "error");
    }

    setIsRotating(true);
    try {
      showToast("Sedang memproses foto...", "loading");
      
      const img = new Image();
      if (currentPhotoUrl.startsWith("data:image") || currentPhotoUrl.startsWith("blob:")) {
        img.src = currentPhotoUrl;
      } else {
        img.crossOrigin = "anonymous";
        let urlToFetch = currentPhotoUrl;
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
            const rotatedFile = new File([rotatedBlob], "rotated_profile.jpg", { type: "image/jpeg" });
            try {
              const tempUrl = URL.createObjectURL(rotatedBlob);
              setLocalPhoto(tempUrl);

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

  const fullName = `${user.nama || ""} ${user.nama_belakang || ""}`.trim() || user.name || "Peserta NgodingAI";
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=00BCD4&color=fff`;
  
  let finalPhotoUrl = localPhoto || user.photo || user.avatar || "";

  if (!localPhoto && finalPhotoUrl.startsWith("http") && finalPhotoUrl.includes(".katib.cloud")) {
    finalPhotoUrl = `/api/proxy-image?url=${encodeURIComponent(finalPhotoUrl)}`;
  }

  const displayPhoto = imageError ? defaultAvatar : finalPhotoUrl || defaultAvatar;

  return (
    <>
      <div className="h-40 md:h-48 bg-linear-to-r from-[#00BCD4] to-blue-600 relative overflow-hidden rounded-t-4xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 2px, transparent 2.5px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      <div className="px-6 md:px-10 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 md:gap-6 -mt-12 md:-mt-16 mb-8 relative z-20">
          <div className="relative size-24 md:size-32 shrink-0" ref={avatarMenuRef}>
            <div
              className="relative w-full h-full rounded-full ring-4 ring-white dark:ring-slate-800 bg-slate-100 shadow-xl overflow-hidden cursor-pointer group"
              onClick={() => !isUploadingPhoto && !isRotating && setIsAvatarMenuOpen(!isAvatarMenuOpen)}
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
                  <span className="material-symbols-outlined text-3xl mb-1">photo_camera</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Ubah</span>
                </div>
              )}
            </div>

            {isAvatarMenuOpen && (
              <div className="absolute top-[105%] left-0 sm:left-1/2 sm:-translate-x-1/2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-fade-in origin-top">
                <div className="py-1">
                  <button onClick={handleMenuUploadClick} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-[#00BCD4]">upload_file</span>
                    Unggah Foto Baru
                  </button>

                  {user.photo && (
                    <button onClick={handleRotateImage} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200">
                      <span className="material-symbols-outlined text-[18px] text-slate-500">rotate_right</span>
                      Putar 90&deg;
                    </button>
                  )}
                </div>
              </div>
            )}

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg, image/webp" className="hidden" />
          </div>

          <div className="flex-1 sm:pb-2">
            <div className="inline-flex flex-col bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 relative -top-4 sm:top-0">
              <h2 className={`text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none ${googleSansAlt.className}`}>
                {fullName}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-[14px]">mail</span>
                <span className="text-[13px] md:text-sm font-medium leading-none">
                  {user.email || "Email tidak tersedia"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}