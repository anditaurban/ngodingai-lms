"use client";

import React from "react";
import Image from "next/image";
// Pastikan path import ini sesuai (naik 2 level ke folder hooks)
import { useAuthLogic } from "../../hooks/useAuthLogic";

export default function LoginPage() {
  // 1. Panggil Logic dari Custom Hook
  // (Semua fungsi router.push dan fetch API ada di dalam hook ini)
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

  // 2. Definisi Tahun Copyright secara lokal di UI
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-white dark:bg-[#0f111a] text-[#121217] dark:text-white font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 mesh-gradient opacity-90"></div>
      <div className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-1 flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg glass-panel rounded-2xl sm:rounded-4xl shadow-soft border border-white/50 dark:border-white/10 p-8 sm:p-10 flex flex-col gap-8 transition-all duration-300">
          <header className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              {/* LOGO */}
              <div className="relative w-10 h-10 shadow-sm rounded-lg overflow-hidden bg-white">
                <Image
                  src="/logongodingai.png"
                  alt="Logo"
                  fill
                  className="object-contain p-1"
                  priority
                  unoptimized={true}
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#121217] dark:text-white">
                NgodingAI
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Digital Academy
              </h1>
              <p className="text-[#666685] dark:text-gray-400 font-medium">
                Log in to continue your learning journey.
              </p>
            </div>
          </header>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-6"
          >
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
                className={`group flex w-full items-center rounded-xl border border-[#eaeaef] dark:border-gray-700 bg-white dark:bg-surface-dark transition-all duration-200 h-14 overflow-hidden relative ${loginState === "otp" ? "opacity-75 pointer-events-none bg-gray-50" : "focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10"}`}
              >
                <div className="pl-4 flex items-center justify-center text-[#666685] dark:text-gray-500 group-focus-within:text-indigo-600 transition-colors">
                  <span className="material-symbols-outlined text-[24px]">
                    chat_bubble
                  </span>
                </div>

                <input
                  className="flex-1 w-full bg-transparent border-none text-[#121217] dark:text-white placeholder:text-[#9999a9] focus:ring-0 text-base font-medium h-full px-4"
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
              <div className="flex flex-col gap-4 animate-fade-in">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Enter 6-Digit Code
                </label>
                <div className="flex gap-2 justify-between">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      className="h-12 w-full rounded-xl border border-[#eaeaef] dark:border-gray-700 bg-white dark:bg-surface-dark text-[#121217] dark:text-white text-center font-bold text-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
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

            <button
              onClick={
                loginState === "phone" ? handleCheckPhone : handleVerifyLogin
              }
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

          <footer className="flex justify-center gap-6 pt-2">
            <p className="text-xs text-[#666685] font-medium">
              &copy; {currentYear} Inovasia Digital Academy.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
