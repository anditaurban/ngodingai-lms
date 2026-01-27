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
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-white dark:bg-[#0f111a] text-[#121217] dark:text-white font-sans">
       <div className="absolute inset-0 z-0 mesh-gradient opacity-90"></div>
       <div className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

       <div className="relative z-10 flex flex-1 flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
         <div className="w-full max-w-lg bg-white/95 dark:bg-[#1b2636]/95 backdrop-blur-xl rounded-2xl sm:rounded-4xl shadow-xl border border-white/50 dark:border-white/10 p-8 sm:p-10 flex flex-col gap-8">
            
            <header className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <span className="material-symbols-outlined text-[24px]">token</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-[#121217] dark:text-white">Inovasia</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight">Digital Academy</h1>
                <p className="text-[#666685] dark:text-gray-400 font-medium">Log in to continue your learning journey.</p>
              </div>
            </header>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold uppercase tracking-wider mb-1">WhatsApp Number</label>
                    <div className={`flex w-full items-center rounded-xl border border-[#eaeaef] dark:border-gray-700 bg-white dark:bg-[#0f111a] h-14 overflow-hidden relative ${loginState === 'otp' ? 'opacity-75 pointer-events-none bg-gray-50' : ''}`}>
                      <div className="pl-4 pr-3 border-r border-transparent font-semibold">+62</div>
                      <input 
                        className="flex-1 w-full bg-transparent border-none focus:ring-0 text-base font-medium h-full px-3"
                        placeholder="812 3456 7890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        readOnly={loginState === 'otp'}
                      />
                    </div>
                </div>

                {loginState === 'otp' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <label className="text-sm font-bold uppercase tracking-wider">Enter 6-Digit Code</label>
                    <div className="flex gap-2 justify-between">
                      {otpValues.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          className="h-12 w-full rounded-xl border border-[#eaeaef] dark:border-gray-700 bg-white dark:bg-[#0f111a] text-center font-bold text-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-center text-slate-500">Dummy OTP: <span className="font-bold text-indigo-600">123456</span></p>
                  </div>
                )}

                <button
                  onClick={loginState === 'phone' ? handleCheckPhone : handleVerifyLogin}
                  disabled={isLoading}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Loading...' : (loginState === 'phone' ? 'Send Verification Code' : 'Verify & Login')}
                  {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
                </button>
            </form>

         </div>
       </div>
    </div>
  );
}