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

        const { customer_id } = JSON.parse(storedProfile);

        // Menembak ke Proxy Lokal
        const response = await fetch(`/api/certificate/${customer_id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `Error API Katib: ${response.status}`);
        }

        // ✨ PERBAIKAN STRUKTUR DATA: Mengambil dari result.detail.data ✨
        if (result.detail && result.detail.data) {
          setData(result.detail.data);
        } else if (result.detail) {
          setData(result.detail); // Jaga-jaga jika Katib merubah struktur di masa depan
        } else {
          throw new Error("Format data dari API Katib tidak sesuai.");
        }

      } catch (err: any) {
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