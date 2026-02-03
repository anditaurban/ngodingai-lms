'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  
  // State UI
  const [loginState, setLoginState] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // --- 1. HANDLE REQUEST OTP (GET) ---
  const handleCheckPhone = async () => {
    setErrorMessage('');
    
    // Validasi sederhana
    if (phoneNumber.length < 9) {
      setErrorMessage('Nomor WhatsApp terlalu pendek');
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = "https://dev.katib.cloud";
      const appId = 4409;
      
      // Bersihkan nomor (hanya angka)
      // Pastikan format sesuai yang diterima API (misal 08xxx)
      let cleanPhone = phoneNumber.replace(/\D/g, ''); 
      if (!cleanPhone.startsWith('0')) {
        cleanPhone = '0' + cleanPhone;
      }

      // Hit API: GET {{baseURL}}/customer_login/162/08xxxxx
      const response = await fetch(`${baseUrl}/customer_login/${appId}/${cleanPhone}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Gagal mengirim OTP');
      }

      // Cek struktur data respons GET (sesuai info sebelumnya: { data: { status: "success" } })
      if (responseJson.data?.status === 'success' || response.status === 201) {
        console.log('OTP Sent:', responseJson);
        setLoginState('otp');
      } else {
        throw new Error('Gagal mengirim OTP, coba cek nomor kembali.');
      }

    } catch (error: any) {
      console.error('Error Request OTP:', error);
      setErrorMessage(error.message || 'Terjadi kesalahan koneksi server.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. HANDLE VERIFY OTP (POST) ---
  const handleVerifyLogin = async () => {
    const otpCode = otpValues.join('');
    
    if (otpCode.length < 6) {
      setErrorMessage('Harap masukkan 6 digit kode OTP');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      // Format ulang nomor hp agar konsisten
      let cleanPhone = phoneNumber.replace(/\D/g, '');
      if (!cleanPhone.startsWith('0')) {
        cleanPhone = '0' + cleanPhone;
      }

      // Payload POST
      // Kita kirim phone + otp untuk memastikan identifikasi user
      const payload = {
        phone: cleanPhone, 
        otp: otpCode 
      };

      // Hit API: POST {{baseURL}}/otp/customer_login
      const response = await fetch(`${baseUrl}/otp/customer_login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kode OTP salah.');
      }

      // --- LOGIN SUKSES ---
      // Struktur Data: { message: "...", customer_id: 32557, name: "Fayyadh", ... }
      console.log('Login Success Data:', data);
      
      // 1. Simpan Data User Lengkap ke LocalStorage
      // Data ini akan dibaca oleh Sidebar untuk menampilkan nama & info user
      localStorage.setItem('user_profile', JSON.stringify(data));

      // 2. Simpan Cookie untuk Middleware
      // Karena tidak ada field "token", kita gunakan customer_id sebagai penanda sesi
      if (data.customer_id) {
        Cookies.set('token', data.customer_id.toString(), { expires: 1, path: '/' });
      }
      
      // 3. Redirect ke Dashboard
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Error Verify OTP:', error);
      setErrorMessage(error.message || 'Verifikasi gagal. Silakan coba lagi.');
      setOtpValues(['', '', '', '', '', '']); // Reset input OTP
    } finally {
      setIsLoading(false);
    }
  };

  // --- HELPER UI ---
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    // Ambil digit terakhir jika user paste banyak angka
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);
    
    // Pindah fokus ke kotak selanjutnya
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
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
    const nextIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${nextIndex}`)?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-white dark:bg-[#0f111a] text-[#121217] dark:text-white font-sans selection:bg-indigo-500 selection:text-white">
       
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
                  <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 flex items-center gap-2 animate-pulse">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold uppercase tracking-wider mb-1">WhatsApp Number</label>
                    <div className={`flex w-full items-center rounded-xl border border-[#eaeaef] dark:border-gray-700 bg-white dark:bg-[#0f111a] h-14 overflow-hidden relative transition-all ${loginState === 'otp' ? 'opacity-70 pointer-events-none bg-gray-50' : 'focus-within:ring-2 focus-within:ring-indigo-500/20'}`}>
                      <div className="pl-4 pr-3 border-r border-transparent font-semibold text-slate-500">+62</div>
                      <input 
                        className="flex-1 w-full bg-transparent border-none focus:ring-0 text-base font-medium h-full px-3"
                        placeholder="8xx xxxx xxxx"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        readOnly={loginState === 'otp'}
                        autoFocus
                      />
                      {loginState === 'otp' && (
                        <button 
                          type="button" 
                          onClick={() => { setLoginState('phone'); setErrorMessage(''); setOtpValues(['','','','','','']); }}
                          className="absolute right-3 px-3 py-1 text-[10px] font-bold bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                          GANTI
                        </button>
                      )}
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
                          onPaste={handleOtpPaste}
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-center text-slate-500">
                      Kode dikirim via WhatsApp ke +62{phoneNumber}
                    </p>
                  </div>
                )}

                <button
                  onClick={loginState === 'phone' ? handleCheckPhone : handleVerifyLogin}
                  disabled={isLoading}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : (loginState === 'phone' ? 'Send Verification Code' : 'Verify & Login')}
                  {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
                </button>
            </form>

         </div>
         <p className="mt-8 text-xs text-slate-400">&copy; 2026 Inovasia Digital Academy.</p>
       </div>
    </div>
  );
}