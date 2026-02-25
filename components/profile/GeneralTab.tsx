import React, { useState, useEffect, useRef } from "react";
import { useProfileLogic, UserData } from "../../hooks/useProfileLogic";
// ✨ IMPORT TOAST HOOK
import { useToast } from "@/components/ui/ToastProvider";

const InputField = ({ label, icon, type = "text", value, onChange, placeholder, disabled = false, className = "" }: any) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    <div className={`relative group flex items-center bg-white dark:bg-slate-900 rounded-xl border-2 transition-all duration-200 overflow-hidden ${disabled ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed" : "border-slate-200 dark:border-slate-700 focus-within:border-[#00BCD4] focus-within:ring-4 focus-within:ring-[#00BCD4]/10"}`}>
      <div className={`pl-4 pr-3 flex items-center justify-center transition-colors ${disabled ? "text-slate-400" : "text-slate-400 group-focus-within:text-[#00BCD4]"}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <input type={type} value={value || ""} onChange={onChange} placeholder={placeholder} disabled={disabled} className={`flex-1 bg-transparent border-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 h-12 px-0 ${disabled ? "cursor-not-allowed text-slate-500" : ""}`} />
      {disabled && <div className="pr-4 text-slate-400"><span className="material-symbols-outlined text-[16px]">lock</span></div>}
    </div>
  </div>
);

const ReadOnlyField = ({ label, value }: any) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center h-full">
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">{label}</span>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate" title={value || "-"}>{value || "-"}</span>
  </div>
);

const InfoRow = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
    <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-[#00BCD4] shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm">
      <span className="material-symbols-outlined text-[24px]">{icon}</span>
    </div>
    <div>
      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">{label}</p>
      <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">{value || "-"}</p>
    </div>
  </div>
);

const parseRegionData = (regionString: string) => {
  if (!regionString) return { kelurahan: "", kecamatan: "", kota: "", provinsi: "", kode_pos: "" };
  const postalCodeMatch = regionString.match(/\b\d{5}\b/);
  const kode_pos = postalCodeMatch ? postalCodeMatch[0] : "";
  let cleanString = regionString.replace(kode_pos, "").trim();
  cleanString = cleanString.replace(/,\s*$/, ""); 
  const parts = cleanString.split(",").map((s) => s.trim()).filter(Boolean);

  return {
    kelurahan: parts[0] || "",
    kecamatan: parts[1] || "",
    kota: parts[2] || "",
    provinsi: parts[3] || "",
    kode_pos: kode_pos,
  };
};

export default function GeneralTab() {
  const { user, isEditing, setIsEditing, regionOptions, isSearchingRegion, searchRegion, updateProfile } = useProfileLogic();
  
  // ✨ PANGGIL FUNGSI TOAST
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // ✨ State loading khusus untuk tombol simpan
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const parsedRegion = parseRegionData(user.region_name || "");
      setFormData({
         ...user,
         kelurahan: user.kelurahan || parsedRegion.kelurahan,
         kecamatan: user.kecamatan || parsedRegion.kecamatan,
         kota: user.kota || parsedRegion.kota,
         provinsi: user.provinsi || parsedRegion.provinsi,
         kode_pos: user.kode_pos || parsedRegion.kode_pos,
      });
      setSearchQuery(user.region_name || "");
    }
  }, [user, isEditing]);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) return;
    if (formData.region_name && searchQuery === formData.region_name) return;
    const delayDebounceFn = setTimeout(() => searchRegion(searchQuery), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, formData.region_name]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✨ UPDATE FUNGSI SUBMIT DENGAN TOAST
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana
    if (!formData.nama) {
        showToast('error', 'Nama depan tidak boleh kosong!');
        return;
    }

    setIsSaving(true);
    try {
        // Karena di hook Anda updateProfile sepertinya async, kita await
        await updateProfile(formData); 
        
        // Panggil Toast Sukses
        showToast('success', 'Data profil Anda berhasil diperbarui!');
        
        // Matikan mode edit setelah berhasil disimpan
        setIsEditing(false);
    } catch (error: any) {
        // Panggil Toast Error jika gagal
        showToast('error', error.message || 'Gagal memperbarui profil.');
    } finally {
        setIsSaving(false);
    }
  };

  if (!user) return null;

  const viewRegionData = parseRegionData(user.region_name || "");

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Informasi Pribadi</h3>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${isEditing ? "bg-white text-red-500 border border-red-200 hover:bg-red-50 dark:bg-slate-800 dark:border-red-900/50" : "bg-[#1b2636] text-white hover:bg-[#263548] dark:bg-white dark:text-[#1b2636]"}`}
        >
          <span className="material-symbols-outlined text-[18px]">{isEditing ? "close" : "edit_square"}</span>
          {isEditing ? "Batal Edit" : "Edit Data"}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h4 className="text-sm font-bold text-[#00BCD4] uppercase mb-5 flex items-center gap-2">
              <span className="p-1.5 bg-[#00BCD4]/10 rounded-lg"><span className="material-symbols-outlined text-[18px]">person</span></span>
              Data Identitas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <InputField
                label="Nama" icon="badge"
                value={formData.nama || ""}
                onChange={(e: any) => setFormData({ ...formData, nama: e.target.value })}
              />
              
              <InputField
                label="Nama Belakang" icon="badge"
                value={formData.nama_belakang || ""}
                onChange={(e: any) => setFormData({ ...formData, nama_belakang: e.target.value })}
              />
              
              <InputField
                label="Email" icon="mail" type="email"
                value={formData.email || ""}
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
              />
              
              <InputField
                label="Tanggal Lahir" icon="calendar_month" type="date"
                value={formData.tanggal_lahir || ""}
                onChange={(e: any) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
              />
              
              <div className="md:col-span-2">
                <InputField
                  label="Nomor WhatsApp" icon="call" type="tel" disabled={true}
                  placeholder="Contoh: 081234567890"
                  value={formData.phone || ""}
                  onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                />
                 <p className="text-[11px] text-slate-400 mt-1 ml-1 font-medium">Nomor WhatsApp tidak dapat diubah karena terhubung dengan akses login.</p>
              </div>

            </div>
          </section>

          <section className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-[#00BCD4] uppercase mb-5 flex items-center gap-2">
              <span className="p-1.5 bg-[#00BCD4]/10 rounded-lg"><span className="material-symbols-outlined text-[18px]">location_on</span></span>
              Alamat Domisili
            </h4>
            <div className="space-y-5">
              <div className="relative z-20" ref={searchContainerRef}>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Cari Kelurahan / Kecamatan</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00BCD4] material-symbols-outlined text-[22px]">search</span>
                  <input
                    type="text" value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Ketik minimal 3 huruf..."
                    className="w-full pl-12 pr-10 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none transition-all font-semibold text-sm"
                  />
                  {isSearchingRegion && <span className="absolute right-4 top-1/2 -translate-y-1/2 size-5 border-2 border-slate-300 border-t-[#00BCD4] rounded-full animate-spin"></span>}
                </div>

                {showDropdown && regionOptions.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl mt-2 max-h-72 overflow-y-auto ring-4 ring-black/5 animate-in slide-in-from-top-2">
                    {regionOptions.map((region: any, index: number) => {
                      const parsed = parseRegionData(region.region_name || "");
                      return (
                        <div key={index} onClick={() => {
                            setFormData({ ...formData, region_id: region.region_id, region_name: region.region_name, kelurahan: parsed.kelurahan, kecamatan: parsed.kecamatan, kota: parsed.kota, provinsi: parsed.provinsi, kode_pos: parsed.kode_pos });
                            setSearchQuery(region.region_name); setShowDropdown(false);
                          }}
                          className="p-4 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 cursor-pointer border-b border-slate-100 dark:border-slate-700 transition-colors"
                        >
                          <p className="font-bold text-slate-800 dark:text-white text-sm">{parsed.kelurahan}, {parsed.kecamatan}</p>
                          <p className="text-xs text-slate-500 mt-1">{parsed.kode_pos && <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono mr-1">{parsed.kode_pos}</span>}{parsed.kota}, {parsed.provinsi}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <ReadOnlyField label="Kelurahan" value={formData.kelurahan} />
                <ReadOnlyField label="Kecamatan" value={formData.kecamatan} />
                <ReadOnlyField label="Kota / Kab" value={formData.kota} />
                <ReadOnlyField label="Provinsi" value={formData.provinsi} />
                <div className="col-span-2 md:col-span-4">
                  <ReadOnlyField label="Kode Pos" value={formData.kode_pos} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Alamat Lengkap</label>
                <textarea rows={2} value={formData.alamat || ""} onChange={(e: any) => setFormData({ ...formData, alamat: e.target.value })} className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none transition-all text-sm font-medium resize-none" />
              </div>
            </div>
          </section>

          {/* ✨ UPDATE TOMBOL SUBMIT DENGAN LOADING STATE */}
          <div className="pt-4 flex justify-end">
            <button 
                type="submit" 
                disabled={isSaving}
                className="w-full md:w-auto px-10 py-4 bg-[#00BCD4] hover:bg-[#00acc1] text-white font-bold rounded-xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving && <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>

      ) : (

        /* ==================== VIEW MODE ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">DATA DIRI</h4>
            
            <InfoRow icon="badge" label="Nama" value={user.nama} />
            <InfoRow icon="badge" label="Nama Belakang" value={user.nama_belakang} />
            <InfoRow icon="cake" label="Tanggal Lahir" value={user.tanggal_lahir} />
            <InfoRow icon="mail" label="Email" value={user.email} />
            <InfoRow icon="call" label="WhatsApp" value={user.phone} />
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">DOMISILI</h4>
            
            <InfoRow icon="home_pin" label="Alamat" value={user.alamat} />
            <InfoRow icon="location_city" label="Wilayah" value={`${viewRegionData.kelurahan ? viewRegionData.kelurahan + ", " : ""}${viewRegionData.kecamatan ? viewRegionData.kecamatan + ", " : ""}${viewRegionData.kota || user.region_name}`} />
            <InfoRow icon="flag" label="Provinsi" value={user.provinsi || viewRegionData.provinsi} />
            <InfoRow icon="local_post_office" label="Kode Pos" value={user.kode_pos || viewRegionData.kode_pos} />
          </div>
          
        </div>
      )}
    </div>
  );
}