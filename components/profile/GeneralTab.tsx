import React, { useState, useEffect, useRef } from "react";
import { useProfileLogic, UserData } from "@/hooks/useProfileLogic";

// ============================================================================
// 1. REUSABLE UI COMPONENTS (Tampilan Visual Murni)
// ============================================================================

const InputField = ({ label, icon, type = "text", value, onChange, placeholder, disabled = false, className = "" }: any) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className={`relative group flex items-center bg-white dark:bg-slate-900 rounded-xl border-2 transition-all duration-200 overflow-hidden ${disabled ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed" : "border-slate-200 dark:border-slate-700 focus-within:border-[#00BCD4] focus-within:ring-4 focus-within:ring-[#00BCD4]/10"}`}>
      <div className={`pl-4 pr-3 flex items-center justify-center transition-colors ${disabled ? "text-slate-400" : "text-slate-400 group-focus-within:text-[#00BCD4]"}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`flex-1 bg-transparent border-none text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 h-12 px-0 ${disabled ? "cursor-not-allowed text-slate-500" : ""}`}
      />
      {disabled && (
        <div className="pr-4 text-slate-400">
          <span className="material-symbols-outlined text-[16px]">lock</span>
        </div>
      )}
    </div>
  </div>
);

const ReadOnlyField = ({ label, value }: any) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center h-full">
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">{label}</span>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate" title={value || "-"}>
      {value || "-"}
    </span>
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

// ============================================================================
// 2. HELPER FUNCTIONS (Logika Pemrosesan Data)
// ============================================================================

/**
 * ✨ FUNGSI BEDAH STRING REGION ✨
 * Katib sering menggabungkan Provinsi & Kode Pos ke dalam string region_name.
 * Fungsi ini membedah string tersebut agar kolom Provinsi & Kode pos tidak kosong (-).
 */
const parseRegionData = (regionString: string) => {
  if (!regionString) return { kelurahan: "", kecamatan: "", kota: "", provinsi: "", kode_pos: "" };

  const postalCodeMatch = regionString.match(/\b\d{5}\b/);
  const kode_pos = postalCodeMatch ? postalCodeMatch[0] : "";

  let cleanString = regionString.replace(kode_pos, "").trim();
  cleanString = cleanString.replace(/,\s*$/, ""); // Buang koma di akhir

  const parts = cleanString.split(",").map((s) => s.trim()).filter(Boolean);

  return {
    kelurahan: parts[0] || "",
    kecamatan: parts[1] || "",
    kota: parts[2] || "",
    provinsi: parts[3] || "",
    kode_pos: kode_pos,
  };
};


// ============================================================================
// 3. MAIN COMPONENT (Logika Bisnis & Render)
// ============================================================================

export default function GeneralTab() {
  const {
    user,
    isEditing,
    setIsEditing,
    regionOptions,
    isSearchingRegion,
    searchRegion,
    updateProfile,
  } = useProfileLogic();

  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // --- EFFECT: Inisialisasi Data & Ekstrak Wilayah ---
  useEffect(() => {
    if (user) {
      // Bedah region_name menjadi pecahan detail agar terisi di UI
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

  // --- EFFECT: Debounce Anti-Spam API ---
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) return;
    if (formData.region_name && searchQuery === formData.region_name) return;

    const delayDebounceFn = setTimeout(() => {
      searchRegion(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, formData.region_name]);

  // --- EFFECT: Click Outside Listener untuk Dropdown ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  if (!user) return null;

  // Variabel untuk View Mode (Memastikan data selalu diekstrak jika kosong)
  const viewRegionData = parseRegionData(user.region_name || "");

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Informasi Pribadi</h3>
          <p className="text-sm text-slate-500 mt-1">Pastikan data Anda valid untuk keperluan sertifikat & pengiriman.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${
            isEditing
              ? "bg-white text-red-500 border border-red-200 hover:bg-red-50 dark:bg-slate-800 dark:border-red-900/50"
              : "bg-[#1b2636] text-white hover:bg-[#263548] dark:bg-white dark:text-[#1b2636]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isEditing ? "close" : "edit_square"}
          </span>
          {isEditing ? "Batal Edit" : "Edit Data"}
        </button>
      </div>

      {isEditing ? (
        /* ==================== EDIT MODE ==================== */
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* GROUP 1: DATA IDENTITAS */}
          <section>
            <h4 className="text-sm font-bold text-[#00BCD4] uppercase mb-5 flex items-center gap-2">
              <span className="p-1.5 bg-[#00BCD4]/10 rounded-lg">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </span>
              Data Identitas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Nama Depan" icon="badge"
                value={formData.name || formData.nama || ""}
                onChange={(e: any) => setFormData({ ...formData, name: e.target.value, nama: e.target.value })}
              />
              <InputField
                label="Nama Belakang" icon="badge"
                value={formData.last_name || formData.nama_belakang || ""}
                onChange={(e: any) => setFormData({ ...formData, last_name: e.target.value, nama_belakang: e.target.value })}
              />
              <InputField
                label="Email" icon="mail" type="email"
                value={formData.email || ""}
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
              />
              <InputField
                label="Tanggal Lahir" icon="calendar_month" type="date"
                value={formData.birth || formData.tanggal_lahir || ""}
                onChange={(e: any) => setFormData({ ...formData, birth: e.target.value, tanggal_lahir: e.target.value })}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Nomor WhatsApp" icon="call" type="tel"
                  placeholder="Contoh: 081234567890"
                  value={formData.phone || ""}
                  onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* GROUP 2: DOMISILI */}
          <section className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-[#00BCD4] uppercase mb-5 flex items-center gap-2">
              <span className="p-1.5 bg-[#00BCD4]/10 rounded-lg">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </span>
              Alamat Domisili
            </h4>

            <div className="space-y-5">
              {/* SMART SEARCH REGION */}
              <div className="relative z-20" ref={searchContainerRef}>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">
                  Cari Kelurahan / Kecamatan
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00BCD4] material-symbols-outlined text-[22px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Ketik minimal 3 huruf (cth: Ciater)..."
                    className="w-full pl-12 pr-10 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none transition-all font-semibold text-sm"
                  />
                  {isSearchingRegion && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 size-5 border-2 border-slate-300 border-t-[#00BCD4] rounded-full animate-spin"></span>
                  )}
                </div>

                {/* DROPDOWN RESULTS */}
                {showDropdown && regionOptions.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl mt-2 max-h-72 overflow-y-auto ring-4 ring-black/5 animate-in slide-in-from-top-2">
                    <div className="sticky top-0 bg-slate-50 dark:bg-slate-900 p-2 text-xs font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700">
                      Hasil Pencarian:
                    </div>
                    {regionOptions.map((region: any, index: number) => {
                      // Manfaatkan helper extractor agar konsisten
                      const parsed = parseRegionData(region.region_name || "");
                      const kelurahan = region.kelurahan || parsed.kelurahan;
                      const kecamatan = region.kecamatan || parsed.kecamatan;
                      const kota = region.kota || parsed.kota;
                      const provinsi = region.provinsi || parsed.provinsi;
                      const kode_pos = region.kode_pos || parsed.kode_pos;

                      return (
                        <div
                          key={region.region_id || index}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              region_id: region.region_id,
                              region_name: region.region_name,
                              kelurahan, kecamatan, kota, provinsi, kode_pos,
                            });
                            setSearchQuery(region.region_name);
                            setShowDropdown(false);
                          }}
                          className="p-4 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 group transition-colors"
                        >
                          <p className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-[#00BCD4]">
                            {kelurahan}, {kecamatan}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            {kode_pos && (
                              <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono">
                                {kode_pos}
                              </span>
                            )}
                            {kota}, {provinsi}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* READ-ONLY DETAILS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <ReadOnlyField label="Kelurahan" value={formData.kelurahan} />
                <ReadOnlyField label="Kecamatan" value={formData.kecamatan} />
                <ReadOnlyField label="Kota / Kab" value={formData.kota} />
                <ReadOnlyField label="Provinsi" value={formData.provinsi} />
                <div className="col-span-2 md:col-span-4">
                  <ReadOnlyField label="Kode Pos" value={formData.kode_pos} />
                </div>
              </div>

              {/* DETAIL ALAMAT TEXTAREA */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Detail Jalan / Nomor Rumah
                </label>
                <textarea
                  rows={2}
                  value={formData.address || formData.alamat || ""}
                  onChange={(e: any) => setFormData({ ...formData, address: e.target.value, alamat: e.target.value })}
                  placeholder="Contoh: Jl. Merpati No. 12, RT 01/RW 02"
                  className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#00BCD4] focus:ring-4 focus:ring-[#00BCD4]/10 outline-none transition-all text-sm font-medium resize-none"
                />
              </div>
            </div>
          </section>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="w-full md:w-auto px-10 py-4 bg-[#00BCD4] hover:bg-[#00acc1] text-white font-bold rounded-xl shadow-xl shadow-cyan-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              Simpan Perubahan
            </button>
          </div>
        </form>

      ) : (

        /* ==================== VIEW MODE ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">
              DATA DIRI
            </h4>
            <InfoRow icon="badge" label="Nama Lengkap" value={`${user.name || user.nama} ${user.last_name || user.nama_belakang || ""}`} />
            <InfoRow icon="mail" label="Email" value={user.email} />
            <InfoRow icon="call" label="WhatsApp" value={user.phone} />
            <InfoRow icon="cake" label="Tanggal Lahir" value={user.birth || user.tanggal_lahir} />
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">
              DOMISILI
            </h4>
            <InfoRow icon="home_pin" label="Alamat Lengkap" value={user.address || user.alamat} />
            <InfoRow 
               icon="location_city" 
               label="Wilayah" 
               value={`${viewRegionData.kelurahan ? viewRegionData.kelurahan + ", " : ""}${viewRegionData.kecamatan ? viewRegionData.kecamatan + ", " : ""}${viewRegionData.kota || user.region_name}`} 
            />
            {/* ✨ Provinsi dan Kode Pos kini dijamin terisi karena mengambil dari fungsi pembedah string ✨ */}
            <InfoRow icon="flag" label="Provinsi" value={user.provinsi || viewRegionData.provinsi} />
            <InfoRow icon="local_post_office" label="Kode Pos" value={user.kode_pos || viewRegionData.kode_pos} />
          </div>
          
        </div>
      )}
    </div>
  );
}