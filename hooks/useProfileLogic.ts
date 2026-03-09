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

// ============================================================================
// ✨ REM CAKRAM GLOBAL (Global Cache) ✨
// ============================================================================
let globalProfileSyncDone = false;
let globalCachedUser: UserData | null = null;

export const useProfileLogic = () => {
  const router = useRouter();
  
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [regionOptions, setRegionOptions] = useState<any[]>([]);
  const [isSearchingRegion, setIsSearchingRegion] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const syncProfileWithServer = async (customerId: string | number, fallbackData?: any, forceSync: boolean = false) => {
    try {
      if (globalProfileSyncDone && globalCachedUser && !forceSync) {
          setUser(globalCachedUser);
          setLoading(false);
          return;
      }

      const response = await fetch(`/api/profile/get-detail?id=${customerId}&t=${Date.now()}`);
      const result = await response.json();
      const serverData = result.detail; 
      
      const currentSessionString = localStorage.getItem('user_profile');
      const currentSession = currentSessionString ? JSON.parse(currentSessionString) : {};

      if (serverData && (serverData.nama || serverData.customer_id)) {
         const localPhoto = currentSession.photo || '';
         const isLocalBase64 = localPhoto.startsWith('data:image');
         const finalSyncPhoto = isLocalBase64 ? localPhoto : (serverData.photo || localPhoto);

         const finalUserData = { 
             ...serverData, 
             photo: finalSyncPhoto,
             phone: serverData.phone || fallbackData?.phone || currentSession.phone || '',
             email: serverData.email || fallbackData?.email || currentSession.email || ''
         };
         
         setUser(finalUserData as UserData);

         globalCachedUser = finalUserData;
         globalProfileSyncDone = true;

         const combinedName = `${serverData.nama || ''} ${serverData.nama_belakang || ''}`.trim();
         const cleanSidebarSession = {
            token: currentSession.token, 
            customer_id: serverData.customer_id,
            name: combinedName || currentSession.name, 
            photo: finalSyncPhoto,
         };
         
         // Pencegahan Error Quota Exceeded
         try {
             localStorage.setItem('user_profile', JSON.stringify(cleanSidebarSession));
         } catch (e) {
             console.warn("Storage penuh saat sinkronisasi!");
         }
         
         broadcastProfileUpdate(finalUserData);
         
      } else {
         console.warn("API Get Detail mengembalikan null/404 (Ini Wajar Untuk User Baru):", result.message);
         
         if (fallbackData) {
            let namaDepan = fallbackData.nama || fallbackData.name || '';
            let namaBelakang = fallbackData.nama_belakang || fallbackData.last_name || '';

            if (!fallbackData.nama && fallbackData.name) {
                const nameParts = fallbackData.name.trim().split(' ');
                namaDepan = nameParts[0] || '';
                namaBelakang = nameParts.slice(1).join(' ') || '';
            }
            
            const convertedFallback = {
                ...fallbackData,
                nama: namaDepan,
                nama_belakang: namaBelakang,
                phone: fallbackData.phone || currentSession.phone || '', 
                email: fallbackData.email || currentSession.email || '',
                tanggal_lahir: fallbackData.tanggal_lahir || fallbackData.birth || '',
                alamat: fallbackData.alamat || fallbackData.address || '',
                photo: fallbackData.photo || currentSession.photo || ''
            };
            
            setUser(convertedFallback as UserData);
            globalCachedUser = convertedFallback;
            globalProfileSyncDone = true; 
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
           globalCachedUser = { ...globalCachedUser, ...event.detail } as UserData;
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
    globalProfileSyncDone = false;
    globalCachedUser = null;
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
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser as UserData);

    const currentSessionString = localStorage.getItem('user_profile');
    let currentSession = currentSessionString ? JSON.parse(currentSessionString) : {};
    const combinedName = `${formData.nama || ''} ${formData.nama_belakang || ''}`.trim();
    
    const updatedSession = { 
        ...currentSession, 
        ...updatedUser, 
        name: combinedName || currentSession.name, 
        photo: currentSession.photo || formData.photo
    };
    
    try {
      localStorage.setItem('user_profile', JSON.stringify(updatedSession));
    } catch (e) {
      console.warn("Storage penuh saat update profil.");
    }

    broadcastProfileUpdate(updatedUser);

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
    
    setTimeout(() => {
        if (formData.customer_id) syncProfileWithServer(formData.customer_id, formData, true);
    }, 1500);

    return true; 
  };

  // ✨ PERBAIKAN FATAL: MENGHAPUS SEMUA ALERT & MENANGANI QUOTA EXCEEDED
  const uploadPhoto = async (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    // Ganti Alert dengan Lempar Error ke UI
    if (!validTypes.includes(file.type)) throw new Error("Format tidak valid. Gunakan JPG/PNG.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Maksimal ukuran foto adalah 5MB.");
    if (!user || !user.customer_id) throw new Error("Sesi pengguna tidak ditemukan.");

    setIsUploadingPhoto(true);
    try {
      const base64LocalImage = await fileToBase64(file);
      const updatedUser = { ...user, photo: base64LocalImage };
      setUser(updatedUser as UserData);

      const sessionStr = localStorage.getItem('user_profile');
      let currentSession = sessionStr ? JSON.parse(sessionStr) : {};
      
      // ✨ SOLUSI ANTI CRASH (QUOTA EXCEEDED) ✨
      try {
        localStorage.setItem('user_profile', JSON.stringify({ ...currentSession, photo: base64LocalImage }));
      } catch (storageError) {
        console.warn("Storage melebihi kuota 5MB! Base64 diabaikan, menunggu URL asli dari Server...");
        // Tetap simpan namanya saja, fotonya kita tunggu dari respon API nanti
        localStorage.setItem('user_profile', JSON.stringify({ ...currentSession }));
      }
      
      broadcastProfileUpdate(updatedUser);

      const formData = new FormData();
      formData.append('file', file); 
      const response = await fetch(`/api/profile/upload-photo?id=${user.customer_id}`, {
        method: 'POST', body: formData,
      });

      if (!response.ok) throw new Error("Gagal mengunggah foto ke server backend.");
      
      // ✨ FORCE SYNC: Ambil URL foto resmi (yang kecil) dari server Katib agar storage tidak penuh
      setTimeout(() => {
        syncProfileWithServer(user.customer_id as string, updatedUser, true);
      }, 1500);

      return true; // Sukses!
    } catch (error: any) {
      throw error; // Lempar ke UI agar ditangkap oleh Toast
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