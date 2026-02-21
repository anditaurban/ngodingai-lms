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
        if (!storedProfile) throw new Error("Sesi pengguna tidak ditemukan");
        
        const { customer_id } = JSON.parse(storedProfile);

        // Menembak ke Proxy Lokal yang sudah kita buat sebelumnya
        const response = await fetch(`/api/certificate/${customer_id}`);
        const result = await response.json();

        if (!response.ok) {
           throw new Error(result.error || `Error: ${response.status}`);
        }
        
        if (result.detail) {
           setData(result.detail);
        }

      } catch (err: any) {
        console.error("Gagal fetch data sertifikat:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, []);

  return { data, loading, error };
}