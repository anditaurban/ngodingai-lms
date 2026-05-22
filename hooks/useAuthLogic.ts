import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useAuthLogic = () => {
  const router = useRouter();

  const [loginState, setLoginState] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // --- HELPER: FORMAT NOMOR HP ---
  const formatPhoneNumber = (raw: string) => {
    let clean = raw.replace(/\D/g, ''); 
    if (clean.startsWith('62')) {
      clean = '0' + clean.substring(2);
    } else if (!clean.startsWith('0')) {
      clean = '0' + clean;
    }
    return clean;
  };

  // --- HELPER: AMAN URL & VALIDASI ENV (PROFESSIONAL STANDARD) ---
  const getApiConfig = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const ownerId = process.env.NEXT_PUBLIC_OWNER_ID;

    // Berlakukan Fail-Fast: Tolak eksekusi jika ENV tidak disetel
    if (!baseUrl || !ownerId) {
      throw new Error('Konfigurasi sistem tidak lengkap (Missing ENV). Hubungi Administrator.');
    }

    return {
      baseUrl: baseUrl.replace(/\/+$/, ''), // Bersihkan trailing slash
      ownerId: ownerId
    };
  };

  // --- 1. API: REQUEST OTP ---
  const handleCheckPhone = async () => {
    setErrorMessage('');
    
    if (phoneNumber.length < 9) {
      setErrorMessage('Nomor WhatsApp terlalu pendek');
      return;
    }

    setIsLoading(true);

    try {
      // Ambil konfigurasi murni dari .env (akan throw Error jika kosong)
      const { baseUrl, ownerId } = getApiConfig();
      const cleanPhone = formatPhoneNumber(phoneNumber);
      
      const endpoint = `${baseUrl}/customer_login/${ownerId}/${cleanPhone}`;
      console.log("🚀 Request OTP:", endpoint);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
      });
      
      let responseJson;
      try {
        responseJson = await response.json();
      } catch (parseError) {
        throw new Error(`Server tidak merespons JSON valid (Status: ${response.status})`);
      }

      if (!response.ok) {
        throw new Error(responseJson?.message || 'Gagal mengirim OTP. Nomor tidak ditemukan.');
      }

      if (responseJson?.data?.status === 'success' || response.status === 201 || response.status === 200) {
        console.log('✅ OTP Sent');
        setLoginState('otp');
      } else {
        throw new Error('Gagal mengirim OTP. Pastikan nomor terdaftar.');
      }

    } catch (error: any) {
      console.error('❌ Error Request OTP:', error);
      if (error.message === 'Failed to fetch') {
        setErrorMessage('Terjadi masalah koneksi atau blokade CORS dari server.');
      } else {
        setErrorMessage(error.message || 'Terjadi kesalahan koneksi server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. API: VERIFY OTP ---
  const handleVerifyLogin = async () => {
    const otpCode = otpValues.join('');
    
    if (otpCode.length < 6) {
      setErrorMessage('Harap masukkan 6 digit kode OTP');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Ambil konfigurasi murni dari .env
      const { baseUrl } = getApiConfig();
      const cleanPhone = formatPhoneNumber(phoneNumber);

      const payload = {
        phone: cleanPhone, 
        otp: otpCode 
      };

      const endpoint = `${baseUrl}/otp/customer_login`;
      console.log("🚀 Verify OTP:", endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error(`Gagal membaca respons server (Status: ${response.status})`);
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Kode OTP salah atau kedaluwarsa.');
      }

      console.log('✅ Login Success');

      if (typeof window !== 'undefined') {
        const userProfileToSave = data.data || data.user || data; 
        localStorage.setItem('user_profile', JSON.stringify(userProfileToSave));
      }

      const activeUserId = data?.customer_id || data?.data?.customer_id || data?.user?.id || 'session_active';

      // Set cookie session standar
      Cookies.set('auth_session', activeUserId.toString(), { 
          expires: 7, path: '/', secure: true, sameSite: 'lax' 
      });
      Cookies.set('token', activeUserId.toString(), { 
          expires: 7, path: '/', secure: true, sameSite: 'lax'
      });
      
      // Hard redirect agar membersihkan memori React
      window.location.href = '/home'; 

    } catch (error: any) {
      console.error('❌ Error Verify OTP:', error);
      setErrorMessage(error.message || 'Verifikasi gagal. Silakan coba lagi.');
      setOtpValues(['', '', '', '', '', '']); 
      document.getElementById('otp-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // --- HELPER UI ---
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);
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
    pastedData.split('').forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtpValues(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${nextIndex}`)?.focus();
  };

  const resetLogin = () => {
    setLoginState('phone');
    setErrorMessage('');
    setOtpValues(['', '', '', '', '', '']);
  };

  return {
    loginState, phoneNumber, otpValues, isLoading, errorMessage,
    setPhoneNumber, handleCheckPhone, handleVerifyLogin,
    handleOtpChange, handleOtpKeyDown, handleOtpPaste, resetLogin
  };
};