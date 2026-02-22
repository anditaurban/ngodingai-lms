import { useState, useEffect } from 'react';

export interface CertificateAPI {
  customer_id: string;
  full_name: string;
  achievement: string;
  issued: string;
  course_url: string;
}

export function useCertificate() {
  const [data, setData] = useState<CertificateAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const storedProfile = localStorage.getItem('user_profile');
        if (!storedProfile) {
            throw new Error("Sesi pengguna tidak ditemukan. Silakan login kembali.");
        }
        
        // --- PRODUCTION MODE: BACA ID DINAMIS DARI USER YANG SEDANG LOGIN ---
        const { customer_id } = JSON.parse(storedProfile);

        // Menembak ke Proxy Lokal yang sudah kita buat sebelumnya
        const response = await fetch(`/api/certificate/${customer_id}`);
        const result = await response.json();

        // Tangani jika respons dari server adalah error (misal: 401, 404, 500)
        if (!response.ok) {
           throw new Error(result.error || `Error API Katib: ${response.status}`);
        }
        
        // Pastikan struktur data dari Katib benar (memiliki property 'detail')
        if (result.detail) {
           setData(result.detail);
        } else {
           throw new Error("Format data dari API Katib tidak sesuai.");
        }

      } catch (err: any) {
        // Jika terjadi error (koneksi mati, user belum lulus, sesi hilang, dll),
        // catat di console dan set state error agar UI beralih ke Mode Preview.
        console.warn("Info Sertifikat:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, []);

  return { data, loading, error };
}