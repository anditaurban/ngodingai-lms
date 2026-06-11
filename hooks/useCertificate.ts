import { useState, useEffect } from 'react';

export interface CertificateAPI {
  customer_id: string;
  full_name: string;
  achievement: string;
  issued: string;
  course_url: string;
}

// ✨ Tambahkan parameter courseId
export function useCertificate(courseId: number | string) {
  const [data, setData] = useState<CertificateAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificateData = async () => {
      // ✨ FIX: Jika courseId kosong/0, hentikan loading agar tidak muter selamanya
      if (!courseId || courseId === 0) {
        setLoading(false);
        // setError("ID Kelas tidak ditemukan."); // Opsional
        return;
      }

      try {
        const storedProfile = localStorage.getItem('user_profile');
        if (!storedProfile) {
          throw new Error("Sesi pengguna tidak ditemukan. Silakan login kembali.");
        }

        const { customer_id } = JSON.parse(storedProfile);

        // ✨ Kirim courseId & customerId sebagai Query Parameters
        const response = await fetch(`/api/certificate?courseId=${courseId}&customerId=${customer_id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `Error API Katib: ${response.status}`);
        }

        // Struktur respon Katib: result.detail.data
        if (result.detail && result.detail.data) {
          setData(result.detail.data);
        } else if (result.detail) {
          setData(result.detail);
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
  }, [courseId]); // ✨ Re-fetch otomatis jika ID kelas berubah

  return { data, loading, error };
}