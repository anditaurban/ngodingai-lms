"use client";

import React from "react";
import Image from "next/image";
import { Inter, DM_Sans } from "next/font/google";
import { useAuthLogic } from "../../hooks/useAuthLogic";

const inter = Inter({ subsets: ["latin"] });
const googleSansAlt = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export default function LoginPage() {
  const {
    loginState,
    phoneNumber,
    otpValues,
    isLoading,
    errorMessage,
    setPhoneNumber,
    handleCheckPhone,
    handleVerifyLogin,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    resetLogin,
  } = useAuthLogic();

  const currentYear = new Date().getFullYear();

  const avatarUrls = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=faces",
  ];

  const fallbackAvatar =
    "https://ui-avatars.com/api/?name=User&background=e2e8f0&color=334155&size=100&bold=true";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loginState === "phone") {
      handleCheckPhone();
    } else {
      handleVerifyLogin();
    }
  };

  return (
    <div
      className={`min-h-screen flex w-full bg-[#f8f9fc] dark:bg-[#050505] ${inter.className}`}
    >
      {/* =========================================================
          LEFT SIDE: BRANDING & VISUALS (Hidden on Mobile)
      ========================================================= */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 lg:p-16">
        {/* Background Gradients & Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#00BCD4]/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Subtle Grid Pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        <div className="relative z-10">
          {/* Logo Inovasia di Kiri Atas Desktop */}
          <div className="flex items-center gap-2 mb-16">
            <Image
              src="/assets/inovasia.png"
              alt="Inovasia"
              width={160}
              height={45}
              unoptimized
              priority
            />
          </div>

          <h1
            className={`text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 ${googleSansAlt.className}`}
          >
            Bangun Pengalaman <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00BCD4] to-indigo-400">
              Belajar Kelas Dunia
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-md leading-relaxed font-medium">
            Platform manajemen pembelajaran cerdas yang dirancang khusus untuk
            para kreator, mentor, dan edukator profesional.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md w-max">
          <div className="flex -space-x-3">
            {avatarUrls.map((src, i) => (
              <div
                key={src}
                className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-200 overflow-hidden relative"
              >
                <img
                  src={src}
                  alt={`User ${i + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = fallbackAvatar.replace(
                      "User",
                      `User+${i + 1}`,
                    );
                  }}
                />
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center gap-1 text-amber-400 text-sm mb-0.5">
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>

            <p className="text-xs font-bold text-white">
              Dipercaya 2,000+ Edukator
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          RIGHT SIDE: LOGIN FORM (CARD STYLE)
      ========================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Mobile Logo (Only visible on small screens) */}
        <div className="lg:hidden absolute top-8 left-6 flex items-center gap-2">
          <Image
            src="/assets/inovasia.png"
            alt="Inovasia"
            width={120}
            height={32}
            className="object-contain dark:brightness-200"
            unoptimized
            priority
          />
        </div>

        {/* Card Container */}
        <div className="w-full max-w-md bg-white dark:bg-[#111111] p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-200/80 dark:border-slate-800/80 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-10 lg:mt-0">
          {/* Header Card */}
          <header className="mb-10 text-center flex flex-col items-center">
            {/* Elegant Icon Box */}
            <div className="size-14 bg-linear-to-br from-[#00BCD4] to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <span className="material-symbols-outlined text-white text-[32px] relative z-10 transition-transform duration-300 group-hover:scale-110">
                school
              </span>
            </div>

            {/* Typography Section */}
            <div className="space-y-2.5">
              <h1
                className={`text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white ${googleSansAlt.className}`}
              >
                Digital Academy
              </h1>

              <p className="text-[#666685] dark:text-gray-400 text-sm font-medium px-4 leading-relaxed">
                Log in to continue your learning journey.
              </p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 flex items-center gap-2 animate-pulse">
                <span className="material-symbols-outlined text-[18px]">
                  error
                </span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Input Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                WhatsApp Number
              </label>

              <div
                className={`group flex w-full items-center rounded-xl border border-[#eaeaef] dark:border-gray-700 bg-white dark:bg-zinc-900 transition-all duration-200 h-14 overflow-hidden relative ${
                  loginState === "otp"
                    ? "opacity-75 pointer-events-none bg-gray-50 dark:bg-zinc-800"
                    : "focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10"
                }`}
              >
                <div className="pl-4 flex items-center justify-center text-[#666685] dark:text-gray-500 group-focus-within:text-indigo-600 transition-colors">
                  <span className="material-symbols-outlined text-[24px]">
                    phone
                  </span>
                </div>

                <input
                  className="flex-1 w-full bg-transparent border-none text-[#121217] dark:text-white placeholder:text-[#9999a9] outline-none focus:ring-0 text-base font-medium h-full px-4"
                  placeholder="Contoh: 08123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  readOnly={loginState === "otp"}
                  autoFocus
                />

                {loginState === "otp" && (
                  <button
                    type="button"
                    onClick={resetLogin}
                    className="mr-4 text-xs font-bold text-indigo-600 hover:underline pointer-events-auto z-20"
                  >
                    UBAH
                  </button>
                )}
              </div>
            </div>

            {/* Input OTP */}
            {loginState === "otp" && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-500">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Enter 6-Digit Code
                </label>

                <div className="flex gap-2 justify-between">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      className="h-12 w-full rounded-xl border border-[#eaeaef] dark:border-gray-700 bg-white dark:bg-zinc-900 text-[#121217] dark:text-white text-center font-bold text-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <p className="text-xs text-center text-[#666685] dark:text-gray-500">
                  Kode dikirim ke WhatsApp{" "}
                  <span className="font-bold text-indigo-600">
                    {phoneNumber}
                  </span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold tracking-[0.015em] transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="absolute inset-0 flex items-center justify-center bg-indigo-600">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              ) : (
                <span className="z-10 flex items-center gap-2">
                  <span>
                    {loginState === "phone"
                      ? "Send Verification Code"
                      : "Verify & Login"}
                  </span>

                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </span>
              )}
            </button>
          </form>
        </div>

        <br />

        <footer className="flex justify-center gap-6 pt-2">
          <p className="text-xs text-[#666685] font-medium">
            &copy; {currentYear} Inovasia Digital Academy.
          </p>
        </footer>
      </div>
    </div>
  );
}
