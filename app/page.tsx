'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loginState, setLoginState] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckPhone = () => {
    setErrorMessage('');
    if (phoneNumber.length < 9) {
      setErrorMessage('Nomor HP terlalu pendek');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setLoginState('otp');
      setIsLoading(false);
    }, 800);
  };

  const handleVerifyLogin = () => {
    const otpCode = otpValues.join('');
    if (otpCode.length < 6) {
      setErrorMessage('Lengkapi kode 6 digit');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      if (otpCode === '123456') {
        router.push('/dashboard');
      } else {
        setErrorMessage('Kode OTP salah! Gunakan 123456');
        setOtpValues(['', '', '', '', '', '']); 
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otpValues];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtpValues(newOtp);
    
    const focusIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${focusIndex}`)?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background-light dark:bg-background-dark text-[#121217] dark:text-white font-display">
      <div className="absolute inset-0 z-0 mesh-gradient opacity-90"></div>
      
      <div className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-1 flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
        
        <div className="w-full max-w-120 glass-panel rounded-2xl sm:rounded-4xl shadow-soft border border-white/50 dark:border-white/10 p-8 sm:p-10 flex flex-col gap-8 transition-all duration-300">

          <header className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">token</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#121217] dark:text-white">Inovasia</span>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#121217] dark:text-white leading-[1.1]">
                Digital Academy
              </h1>
              <p className="text-[#666685] dark:text-gray-400 text-base font-medium leading-normal">
                Log in to continue your learning journey.
              </p>
            </div>
          </header>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-[#121217] dark:text-gray-200 text-sm font-bold uppercase tracking-wider mb-1">
                WhatsApp Number
              </label>
              <div className={`group flex w-full items-center rounded-xl border border-[#eaeaef] dark:border-gray-700 bg-white dark:bg-surface-dark focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200 h-14 overflow-hidden relative ${loginState === 'otp' ? 'opacity-75 pointer-events-none bg-gray-50' : ''}`}>
                <div className="pl-4 flex items-center justify-center text-[#666685] dark:text-gray-500 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
                </div>
                <div className="flex items-center justify-center pl-3 pr-2 border-r border-transparent">
                  <span className="text-[#121217] dark:text-white font-semibold text-base">+62</span>
                </div>

                <input 
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loginState === 'phone' && handleCheckPhone()}
                  className="flex-1 w-full bg-transparent border-none text-[#121217] dark:text-white placeholder:text-[#9999a9] dark:placeholder:text-gray-600 focus:ring-0 text-base font-medium h-full px-3"
                  placeholder="812 3456 7890"
                  readOnly={loginState === 'otp'}
                />
                
                {loginState === 'otp' && (
                  <button 
                    type="button" 
                    onClick={() => { setLoginState('phone'); setErrorMessage(''); setOtpValues(['','','','','','']); }}
                    className="mr-4 text-xs font-bold text-primary hover:underline pointer-events-auto z-20"
                  >
                    CHANGE
                  </button>
                )}
              </div>
            </div>

            {loginState === 'otp' && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="otp-0" className="text-[#121217] dark:text-gray-200 text-sm font-bold uppercase tracking-wider">
                    Enter 6-Digit Code
                  </label>
                </div>
                
                <div className="flex gap-2 justify-between">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      name={`otp-${idx}`} 
                      autoComplete="one-time-code"
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="h-12 sm:h-14 w-full rounded-xl border border-[#eaeaef] dark:border-gray-700 bg-white dark:bg-surface-dark text-[#121217] dark:text-white text-xl sm:text-2xl font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-center"
                    />
                  ))}
                </div>
                
                <p className="text-xs text-[#666685] dark:text-gray-500 text-center mt-1">
                  Use dummy OTP: <span className="font-bold text-primary">123456</span>
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={loginState === 'phone' ? handleCheckPhone : handleVerifyLogin}
              disabled={isLoading}
              className="relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-primary hover:bg-primary-dark text-white text-base font-bold tracking-[0.015em] transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="absolute inset-0 flex items-center justify-center bg-primary">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className="z-10 flex items-center gap-2">
                  <span>{loginState === 'phone' ? 'Send Verification Code' : 'Verify & Login'}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </span>
              )}
            </button>

          </form>

          <footer className="flex justify-center gap-6 pt-2">
            <a href="#" className="text-sm font-semibold text-[#666685] hover:text-primary transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">help</span> Help Center
            </a>
            <a href="#" className="text-sm font-semibold text-[#666685] hover:text-primary transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">lock</span> Privacy Policy
            </a>
          </footer>
        </div>
        
        <div className="mt-8 text-center relative z-10 opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-xs font-medium text-[#666685] dark:text-gray-500">
            © 2026 Inovasia Digital Academy.
          </p>
        </div>
      </div>
    </div>
  );
}