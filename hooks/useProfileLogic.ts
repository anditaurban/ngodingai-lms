import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export interface UserData {
  name: string;
  customer_id: number | string;
  phone: string;
  birth: string; // Tambahan field Birthday
  address: string;
  region_name: string;
  avatar: string;
  role: string;
}

export const useProfileLogic = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem('user_profile');
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          
          // Format Tanggal Lahir (Jika 0000-00-00, ubah jadi strip)
          let formattedBirth = parsedData.birth;
          if (formattedBirth === '0000-00-00' || !formattedBirth) {
            formattedBirth = '-';
          }

          // Mapping Data API ke State
          setUser({
            name: parsedData.name || 'Student Name',
            customer_id: parsedData.customer_id || 'ID-000',
            phone: parsedData.phone || '-',
            birth: formattedBirth,
            address: parsedData.address || '-',
            region_name: parsedData.region_name || '-', // Mengambil data region_name lengkap
            
            // Atribut Visual Tambahan
            role: 'Student PRO',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedData.name || 'User')}&background=00BCD4&color=fff&size=256&bold=true`
          });
        } else {
          // Fallback Dummy Data (Untuk Preview/Dev)
          setUser({
            name: 'Guest Developer',
            customer_id: 'GUEST-001',
            phone: '0812-3456-7890',
            birth: '1998-05-20',
            address: 'Jalan Teknologi No. 1',
            region_name: 'Jakarta Selatan, DKI Jakarta',
            role: 'Guest User',
            avatar: 'https://ui-avatars.com/api/?name=Guest&background=e2e8f0&color=333&bold=true'
          });
        }
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user_profile');
    router.push('/');
  };

  return {
    user,
    loading,
    handleLogout
  };
};