import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export interface UserData {
  customer_id: number | string;
  owner_id?: number | string;
  nama?: string;
  nama_belakang?: string;
  email?: string;
  phone?: string;
  tanggal_lahir?: string;
  alamat?: string;
  region_id?: number;
  region_name?: string;
  nik?: string | number | null;
  kategori_id?: number | null;
  role?: string;
  photo?: string; 
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
  kode_pos?: string;
  name?: string; 
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

const broadcastProfileUpdate = (fullDataPayload?: any) => {
  if (typeof window !== 'undefined') {
     window.dispatchEvent(new CustomEvent('ngodingai_profile_updated', { detail: fullDataPayload }));
  }
};

export const useProfileLogic = () => {
  const router = useRouter();
  
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [regionOptions, setRegionOptions] = useState<any[]>([]);
  const [isSearchingRegion, setIsSearchingRegion] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const syncProfileWithServer = async (customerId: string | number, fallbackData?: any) => {
    try {
      const response = await fetch(`/api/profile/get-detail?id=${customerId}&t=${Date.now()}`);
      const result = await response.json();
      const serverData = result.detail; 
      
      const currentSessionString = localStorage.getItem('user_profile');
      const currentSession = currentSessionString ? JSON.parse(currentSessionString) : {};

      // Jika API Sukses dan menemukan user (minimal ada customer_id atau nama dari Katib)
      if (serverData && (serverData.nama || serverData.customer_id)) {
         const localPhoto = currentSession.photo || '';
         const isLocalBase64 = localPhoto.startsWith('data:image');
         const finalSyncPhoto = isLocalBase64 ? localPhoto : (serverData.photo || localPhoto);

         // ✨ JARING PENGAMAN: Jika Katib mengembalikan phone/email kosong, sedot dari memori OTP ✨
         const finalUserData = { 
             ...serverData, 
             photo: finalSyncPhoto,
             phone: serverData.phone || fallbackData?.phone || currentSession.phone || '',
             email: serverData.email || fallbackData?.email || currentSession.email || ''
         };
         
         setUser(finalUserData as UserData);

         const combinedName = `${serverData.nama || ''} ${serverData.nama_belakang || ''}`.trim();
         const cleanSidebarSession = {
            token: currentSession.token, 
            customer_id: serverData.customer_id,
            name: combinedName || currentSession.name, 
            photo: finalSyncPhoto,
         };
         
         localStorage.setItem('user_profile', JSON.stringify(cleanSidebarSession));
         broadcastProfileUpdate(finalUserData);
         
      } 
      // Jika API 404 (Belum didaftarkan ke Database Katib)
      else {
         console.warn("API Get Detail mengembalikan null/404:", result.message);
         
         if (fallbackData) {
            let namaDepan = fallbackData.nama || fallbackData.name || '';
            let namaBelakang = fallbackData.nama_belakang || fallbackData.last_name || '';

            if (!fallbackData.nama && fallbackData.name) {
                const nameParts = fallbackData.name.trim().split(' ');
                namaDepan = nameParts[0] || '';
                namaBelakang = nameParts.slice(1).join(' ') || '';
            }
            
            // ✨ PAKSA EXTRACT NOMOR HP DARI SESI OTP ✨
            const convertedFallback = {
                ...fallbackData,
                nama: namaDepan,
                nama_belakang: namaBelakang,
                phone: fallbackData.phone || currentSession.phone || '', // Nomor HP Wajib Tampil!
                email: fallbackData.email || currentSession.email || '',
                tanggal_lahir: fallbackData.tanggal_lahir || fallbackData.birth || '',
                alamat: fallbackData.alamat || fallbackData.address || '',
                photo: fallbackData.photo || currentSession.photo || ''
            };
            
            setUser(convertedFallback as UserData);
            broadcastProfileUpdate(convertedFallback);
         } else {
             handleLogout();
         }
      }
    } catch (error) {
       console.error("Gagal sinkronisasi:", error);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    const initProfile = () => {
      try {
        const storedProfile = localStorage.getItem('user_profile');
        if (storedProfile) {
          const parsedData = JSON.parse(storedProfile);
          if (parsedData.customer_id) {
             syncProfileWithServer(parsedData.customer_id, parsedData);
          } else {
             router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    };
    initProfile();

    const handleGlobalUpdate = (event: any) => {
       if (event.detail) {
           setUser(prev => prev ? { ...prev, ...event.detail } : event.detail);
       }
       const freshData = localStorage.getItem('user_profile');
       if (freshData) {
           const parsed = JSON.parse(freshData);
           setUser(prev => prev ? { ...prev, name: parsed.name, photo: parsed.photo } as UserData : null);
       }
    };

    window.addEventListener('ngodingai_profile_updated', handleGlobalUpdate);
    return () => window.removeEventListener('ngodingai_profile_updated', handleGlobalUpdate);
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
    // CATATAN: Hapus blok try-catch di sini agar Error bisa "dilempar" (throw) 
    // ke GeneralTab.tsx sehingga UI bisa menampilkan Toast Merah jika gagal.

    // 1. Update State React secara instan
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser as UserData);

    // 2. ✨ PERBAIKAN FATAL: Simpan LocalStorage secara UTUH
    const currentSessionString = localStorage.getItem('user_profile');
    let currentSession = currentSessionString ? JSON.parse(currentSessionString) : {};
    const combinedName = `${formData.nama || ''} ${formData.nama_belakang || ''}`.trim();
    
    // Kita gabungkan (merge) semua data lama dengan data baru yang diubah.
    // Tidak ada lagi data yang "tersunat" atau hilang.
    const updatedSession = { 
        ...currentSession,               // Pertahankan token & data krusial lain
        ...updatedUser,                  // Timpa dengan hasil ketikan form baru
        name: combinedName || currentSession.name, // Khusus sidebar (jika butuh key 'name')
        photo: currentSession.photo || formData.photo
    };
    
    localStorage.setItem('user_profile', JSON.stringify(updatedSession));
    
    // Broadcast perubahan ke komponen lain (seperti Header / Sidebar)
    broadcastProfileUpdate(updatedUser);

    // 3. ✨ BODY REQUEST STRICT KE KATIB API ✨
    const payloadToBackend = {
      customer_id: formData.customer_id,
      owner_id: formData.owner_id || 4409,
      phone: formData.phone || '', 
      nama: formData.nama || '',
      nama_belakang: formData.nama_belakang || '',
      email: formData.email || '',
      tanggal_lahir: formData.tanggal_lahir || '',
      alamat: formData.alamat || '',
      region_id: formData.region_id,
      nik: formData.nik || null,
      kategori_id: formData.kategori_id || null,
    };

    const response = await fetch('/api/profile/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadToBackend),
    });

    if (!response.ok) {
        throw new Error("Gagal menyimpan data ke server database.");
    }
    
    // ALERT DIHAPUS: Kita biarkan Toast di GeneralTab.tsx yang mengambil alih notifikasi sukses.
    // setIsEditing(false) JUGA DIHAPUS DARI SINI: Sudah di-handle oleh handleSubmit di GeneralTab.tsx

    // 4. Background Sync (Penyelaras Server)
    setTimeout(() => {
        if (formData.customer_id) syncProfileWithServer(formData.customer_id, formData);
    }, 1500);

    // Kembalikan nilai true agar handleSubmit di GeneralTab tahu prosesnya sukses
    return true; 
};

  const uploadPhoto = async (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) return alert("Format tidak valid.");
    if (file.size > 5 * 1024 * 1024) return alert("Maksimal ukuran 5MB.");
    if (!user || !user.customer_id) return;

    setIsUploadingPhoto(true);
    try {
      const base64LocalImage = await fileToBase64(file);
      const updatedUser = { ...user, photo: base64LocalImage };
      setUser(updatedUser as UserData);

      const sessionStr = localStorage.getItem('user_profile');
      let currentSession = sessionStr ? JSON.parse(sessionStr) : {};
      localStorage.setItem('user_profile', JSON.stringify({ ...currentSession, photo: base64LocalImage }));
      
      broadcastProfileUpdate(updatedUser);

      const formData = new FormData();
      formData.append('file', file); 
      const response = await fetch(`/api/profile/upload-photo?id=${user.customer_id}`, {
        method: 'POST', body: formData,
      });

      if (!response.ok) throw new Error("Gagal mengunggah ke server.");
      alert("Foto profil berhasil diperbarui.");
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan.");
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