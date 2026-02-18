import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
// Kita masih butuh API_CONFIG untuk OwnerID, tapi fetch update pakai internal
import { API_CONFIG } from '@/lib/api'; 

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
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
  kode_pos?: string;
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
            name: parsed.nama || parsed.name || '',
            last_name: parsed.nama_belakang || parsed.last_name || '', 
            phone: parsed.phone || '',
            email: parsed.email || '',
            birth: parsed.tanggal_lahir || parsed.birth || '',
            address: parsed.alamat || parsed.address || '',
            region_id: parsed.region_id || '',
            region_name: parsed.region_name || '',
            kelurahan: parsed.kelurahan || splitRegion[0] || '',
            kecamatan: parsed.kecamatan || splitRegion[1] || '',
            kota: parsed.kota || splitRegion[2] || '',
            provinsi: parsed.provinsi || splitRegion[3] || '',
            kode_pos: parsed.kode_pos || splitRegion[4] || '',
            role: 'Student PRO',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parsed.nama || parsed.name || 'User')}&background=00BCD4&color=fff`
          });
        } catch (e) {
          console.error("Gagal parse user data", e);
        }
      }
      setLoading(false);
    }
  }, []);

  // --- 2. FUNGSI CARI REGION (PROXY) ---
  const searchRegion = async (keyword: string) => {
    if (keyword.length < 3) return; 
    setIsSearchingRegion(true);
    
    try {
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

  // --- 3. FUNGSI UPDATE PROFILE (UPDATE: PAKAI PROXY BARU) ---
  const updateProfile = async (formData: Partial<UserData>) => {
    if (!user) return;
    setLoading(true);

    try {
      // Siapkan Payload untuk Backend
      const payload = {
        customer_id: user.customer_id, // Penting untuk routing di proxy
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

      console.log("Sending Update to Proxy:", payload);

      // PERUBAHAN DISINI: Panggil API Internal Next.js (/api/profile/update)
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal update profile');
      }

      // Update LocalStorage dengan data terbaru
      const updatedUserLocal = { 
        ...user, 
        ...formData,
        // Sync format Indo
        nama: formData.name,
        nama_belakang: formData.last_name,
        alamat: formData.address,
        tanggal_lahir: formData.birth
      };

      localStorage.setItem('user_profile', JSON.stringify(updatedUserLocal));
      setUser(updatedUserLocal as UserData);
      setIsEditing(false);
      
      alert(data.data?.message || "Data berhasil diperbarui!");

    } catch (error: any) {
      console.error("Update Error:", error);
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