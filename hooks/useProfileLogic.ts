import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { apiCall, API_CONFIG } from '@/lib/api';

// Update Tipe Data Lengkap
export interface UserData {
  customer_id: number | string;
  owner_id: number | string;
  name: string;      
  last_name: string; 
  phone: string;
  email: string;     
  birth: string;
  address: string;
  region_id: number | string; 
  region_name: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
  avatar: string;
  role: string;
}

export const useProfileLogic = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [regionOptions, setRegionOptions] = useState<any[]>([]);
  const [isSearchingRegion, setIsSearchingRegion] = useState(false);

  // --- 1. LOAD USER DATA ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('user_profile');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          const splitRegion = parsed.region_name ? parsed.region_name.split(', ') : [];

          setUser({
            customer_id: parsed.customer_id,
            owner_id: parsed.owner_id || API_CONFIG.ownerId,
            name: parsed.name || '',
            last_name: parsed.nama_belakang || '',
            phone: parsed.phone || '',
            email: parsed.email || '',
            birth: parsed.birth || parsed.tanggal_lahir || '',
            address: parsed.address || parsed.alamat || '',
            region_id: parsed.region_id || '',
            region_name: parsed.region_name || '',
            kelurahan: parsed.kelurahan || splitRegion[0] || '',
            kecamatan: parsed.kecamatan || splitRegion[1] || '',
            kota: parsed.kota || splitRegion[2] || '',
            provinsi: parsed.provinsi || splitRegion[3] || '',
            kode_pos: parsed.kode_pos || splitRegion[4] || '',
            role: 'Student PRO',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parsed.name)}&background=00BCD4&color=fff`
          });
        } catch (e) {
          console.error("Gagal parse user data", e);
        }
      }
      setLoading(false);
    }
  }, []);

  // --- 2. FUNGSI CARI REGION (UPDATE: PAKE PROXY AMAN) ---
  const searchRegion = async (keyword: string) => {
    if (keyword.length < 3) return; 
    setIsSearchingRegion(true);
    
    try {
      // Panggil API Internal Next.js (Proxy)
      // Tidak perlu kirim token di sini, karena server yang akan menyisipkannya
      const response = await fetch(`/api/region?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      
      if (data && data.tableData) {
        setRegionOptions(data.tableData);
      } else {
        setRegionOptions([]);
      }
    } catch (error) {
      console.error("Gagal cari region:", error);
      setRegionOptions([]);
    } finally {
      setIsSearchingRegion(false);
    }
  };

  // --- 3. FUNGSI UPDATE PROFILE ---
  const updateProfile = async (formData: Partial<UserData>) => {
    if (!user) return;
    setLoading(true);

    try {
      const payload = {
        owner_id: user.owner_id,
        phone: formData.phone,
        nik: 0, 
        tanggal_lahir: formData.birth,
        kategori_id: 4,
        region_id: formData.region_id,
        nama: formData.name,
        nama_belakang: formData.last_name,
        email: formData.email,
        alamat: formData.address,
      };

      const response = await apiCall(`update/customer/${user.customer_id}`, {
        method: 'POST',
        body: payload,
        service: 'main'
      });

      const updatedUserLocal = { ...user, ...formData };
      localStorage.setItem('user_profile', JSON.stringify(updatedUserLocal));
      
      setUser(updatedUserLocal as UserData);
      setIsEditing(false);
      alert(response.data?.message || "Data berhasil diperbarui!");

    } catch (error: any) {
      alert("Gagal update: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user_profile');
    router.push('/');
  };

  return {
    user,
    loading,
    isEditing,
    setIsEditing,
    regionOptions,
    isSearchingRegion,
    searchRegion,
    updateProfile,
    handleLogout
  };
};