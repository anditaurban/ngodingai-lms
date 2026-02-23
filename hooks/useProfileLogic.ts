import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export interface UserData {
  customer_id: number | string;
  owner_id?: number | string;
  name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  birth?: string;
  address?: string;
  region_id?: number;
  region_name?: string;
  nama?: string;
  nama_belakang?: string;
  tanggal_lahir?: string;
  alamat?: string;
  nik?: string | number | null;
  kategori_id?: number | null;
  role?: string;
  avatar?: string;
  photo?: string; 
  [key: string]: any;
}

export const useProfileLogic = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [regionOptions, setRegionOptions] = useState<any[]>([]);
  const [isSearchingRegion, setIsSearchingRegion] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // ✨ FUNGSI SWR (STALE-WHILE-REVALIDATE) ✨
  // Menarik data paling segar dari Katib secara diam-diam (Background Sync)
  const syncProfileWithServer = async (customerId: string | number) => {
    try {
      const response = await fetch(`/api/profile/get-detail?id=${customerId}`);
      if (!response.ok) return;

      const result = await response.json();
      const serverData = result.detail; // Mengambil object "detail" dari Katib
      
      if (serverData) {
        const currentSessionString = localStorage.getItem('user_profile');
        const currentSession = currentSessionString ? JSON.parse(currentSessionString) : {};

        // Timpa data lokal dengan data fresh Katib
        // Termasuk field "photo" yang sudah berisi URL lengkap!
        const updatedSession = {
          ...currentSession,
          ...serverData,
          name: serverData.nama || currentSession.name,
          last_name: serverData.nama_belakang || currentSession.last_name,
        };

        localStorage.setItem('user_profile', JSON.stringify(updatedSession));
        setUser(updatedSession as UserData);
      }
    } catch (error) {
      console.error("Auto-sync background gagal:", error);
    }
  };

  useEffect(() => {
    const checkSession = () => {
      try {
        const storedProfile = localStorage.getItem('user_profile');
        if (storedProfile) {
          const parsedData = JSON.parse(storedProfile);
          
          // 1. Tampilkan UI seketika pakai data lokal (Loading = 0 detik)
          setUser(parsedData); 
          
          // 2. Tarik update terbaru dari Katib di background
          if (parsedData.customer_id) {
             syncProfileWithServer(parsedData.customer_id);
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user_profile');
    Cookies.remove('auth_session');
    router.push('/login');
  };

  const searchRegion = async (keyword: string) => {
    setIsSearchingRegion(true);
    try {
      const response = await fetch(`/api/region?keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) throw new Error("Gagal mengambil region");
      const result = await response.json();
      if (Array.isArray(result)) setRegionOptions(result);
      else if (result?.tableData && Array.isArray(result.tableData)) setRegionOptions(result.tableData);
      else if (result?.data && Array.isArray(result.data)) setRegionOptions(result.data);
      else setRegionOptions([]);
    } catch (error) {
      setRegionOptions([]);
    } finally {
      setIsSearchingRegion(false);
    }
  };

  const updateProfile = async (formData: Partial<UserData>) => {
    try {
      const payloadToBackend = {
        customer_id: formData.customer_id,
        owner_id: formData.owner_id || 4409,
        phone: formData.phone || '',
        nama: formData.name || formData.nama || '',
        nama_belakang: formData.last_name || formData.nama_belakang || '',
        email: formData.email || '',
        tanggal_lahir: formData.birth || formData.tanggal_lahir || '',
        alamat: formData.address || formData.alamat || '',
        region_id: formData.region_id,
        nik: formData.nik || null,
        kategori_id: formData.kategori_id || null,
      };

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToBackend),
      });

      if (!response.ok) throw new Error("Gagal menyimpan ke Katib");

      // Sinkronisasi ulang data setelah berhasil update teks
      if (formData.customer_id) await syncProfileWithServer(formData.customer_id);
      
      setIsEditing(false);
      alert("Hebat! Profile Anda berhasil diupdate.");
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan saat menyimpan data.");
    }
  };

  const uploadPhoto = async (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) return alert("Gunakan format PNG, JPG, atau JPEG.");
    if (file.size > 5 * 1024 * 1024) return alert("Maksimal ukuran 5MB.");
    if (!user || !user.customer_id) return alert("Sesi tidak valid.");

    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('file', file); // Pasti sukses karena key 'file' sudah dikonfirmasi Head Team

      const response = await fetch(`/api/profile/upload-photo?id=${user.customer_id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Gagal mengunggah foto.");
      }

      // ✨ OPTIMISTIC UI: LANGSUNG UBAH FOTO DI LAYAR ✨
      const instantLocalUrl = URL.createObjectURL(file);
      const currentSessionString = localStorage.getItem('user_profile');
      let currentSession = currentSessionString ? JSON.parse(currentSessionString) : {};
      
      const updatedSession = { ...currentSession, photo: instantLocalUrl };
      localStorage.setItem('user_profile', JSON.stringify(updatedSession));
      setUser(updatedSession as UserData);
      
      alert("Hebat! Foto profil berhasil diperbarui.");

      // 🔥 AUTO-SYNC: 2 detik setelah upload, tarik URL asli dari Katib secara diam-diam
      setTimeout(() => {
        if (user && user.customer_id) {
          syncProfileWithServer(user.customer_id);
        }
      }, 2000);

    } catch (error: any) {
      console.error("Upload Error:", error);
      alert(error.message || "Terjadi kesalahan saat mengunggah.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return {
    user, setUser, loading, handleLogout,
    isEditing, setIsEditing, updateProfile,
    regionOptions, isSearchingRegion, searchRegion,
    uploadPhoto, isUploadingPhoto
  };
};