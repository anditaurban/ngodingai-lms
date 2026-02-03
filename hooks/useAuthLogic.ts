import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useAuthLogic = () => {
  const router = useRouter();

  // --- STATE ---
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

  // --- 1. API: REQUEST OTP ---
  const handleCheckPhone = async () => {
    setErrorMessage('');
    
    if (phoneNumber.length < 9) {
      setErrorMessage('Nomor WhatsApp terlalu pendek');
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const appId = process.env.NEXT_PUBLIC_APP_ID;
      const cleanPhone = formatPhoneNumber(phoneNumber);
      
      console.log("Mengirim OTP ke:", cleanPhone); 

      const response = await fetch(`${baseUrl}/customer_login/${appId}/${cleanPhone}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Gagal mengirim OTP');
      }

      if (responseJson.data?.status === 'success' || response.status === 201) {
        console.log('OTP Sent:', responseJson);
        setLoginState('otp');
      } else {
        throw new Error('Gagal mengirim OTP. Pastikan nomor terdaftar.');
      }

    } catch (error: any) {
      console.error('Error Request OTP:', error);
      setErrorMessage(error.message || 'Terjadi kesalahan koneksi server.');
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
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const cleanPhone = formatPhoneNumber(phoneNumber);

      const payload = {
        phone: cleanPhone, 
        otp: otpCode 
      };

      const response = await fetch(`${baseUrl}/otp/customer_login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kode OTP salah.');
      }

      console.log('Login Success:', data);

      if (typeof window !== 'undefined') {
        localStorage.setItem('user_profile', JSON.stringify(data));
      }

      if (data.customer_id) {
        Cookies.set('token', data.customer_id.toString(), { expires: 7, path: '/' });
      } else {
        Cookies.set('token', 'session_active', { expires: 1, path: '/' });
      }
      
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Error Verify OTP:', error);
      setErrorMessage(error.message || 'Verifikasi gagal. Silakan coba lagi.');
      setOtpValues(['', '', '', '', '', '']); 
    } finally {
      setIsLoading(false);
    }
  };

  // --- HELPER UI: INPUT HANDLING ---
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

  // Reset State (Tombol Ubah)
  const resetLogin = () => {
    setLoginState('phone');
    setErrorMessage('');
    setOtpValues(['', '', '', '', '', '']);
  };

  // Return semua data dan fungsi yang dibutuhkan UI
  return {
    // Data (State)
    loginState,
    phoneNumber,
    otpValues,
    isLoading,
    errorMessage,
    // Fungsi (Actions)
    setPhoneNumber,
    handleCheckPhone,
    handleVerifyLogin,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    resetLogin
  };
};