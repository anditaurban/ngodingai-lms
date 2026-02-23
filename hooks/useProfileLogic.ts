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

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const useProfileLogic = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [regionOptions, setRegionOptions] = useState<any[]>([]);
  const [isSearchingRegion, setIsSearchingRegion] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const syncProfileWithServer = async (customerId: string | number) => {
    try {
      const response = await fetch(`/api/profile/get-detail?id=${customerId}`);
      if (!response.ok) return;

      const result = await response.json();
      const serverData = result.detail; 
      if (!serverData) return;

      const currentSessionString = localStorage.getItem('user_profile');
      const currentSession = currentSessionString ? JSON.parse(currentSessionString) : {};

      const localPhoto = currentSession.photo || '';
      const isLocalBase64 = localPhoto.startsWith('data:image');

      // ✨ FIX: Jangan biarkan GET API Katib yang lambat menimpa Base64 segar kita!
      const finalSyncPhoto = isLocalBase64 ? localPhoto : (serverData.photo || localPhoto);

      const updatedSession = {
        ...currentSession,
        ...serverData,
        photo: finalSyncPhoto, 
        name: serverData.nama || currentSession.name,
        last_name: serverData.nama_belakang || currentSession.last_name,
      };

      localStorage.setItem('user_profile', JSON.stringify(updatedSession));
      setUser(updatedSession as UserData);
    } catch (error) {
       // silent
    }
  };

  useEffect(() => {
    const checkSession = () => {
      try {
        const storedProfile = localStorage.getItem('user_profile');
        if (storedProfile) {
          let parsedData = JSON.parse(storedProfile);
          if (parsedData.photo && parsedData.photo.startsWith('blob:')) {
              parsedData.photo = null; 
          }
          setUser(parsedData); 
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
      // 1. Ubah ke Base64 (Super Aman) dan simpan seketika di LocalStorage agar sinkron
      const base64LocalImage = await fileToBase64(file);
      
      const sessionStr = localStorage.getItem('user_profile');
      let currentSession = sessionStr ? JSON.parse(sessionStr) : {};
      
      const optimisticSession = { ...currentSession, photo: base64LocalImage };
      localStorage.setItem('user_profile', JSON.stringify(optimisticSession));
      setUser(optimisticSession as UserData);

      // 2. Kirim ke Katib
      const formData = new FormData();
      formData.append('file', file); 

      const response = await fetch(`/api/profile/upload-photo?id=${user.customer_id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal mengunggah foto ke server.");
      }

      alert("Foto profil berhasil diperbarui.");

      // ✨ FIX: KITA TIDAK MEMANGGIL `syncProfileWithServer` DI SINI! ✨
      // Memanggil GET API Katib sesaat setelah upload adalah penyebab foto Anda
      // kembali menjadi foto lama (karena database Katib lambat update). 
      // Kita percayakan 100% pada Base64 lokal kita untuk sesi saat ini!

    } catch (error: any) {
      console.error("Upload Error:", error);
      alert(error.message || "Terjadi kesalahan saat mengunggah.");
      
      // Kembalikan ke foto awal jika upload error
      if (user && user.customer_id) syncProfileWithServer(user.customer_id);
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