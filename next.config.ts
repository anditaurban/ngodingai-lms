import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Matikan Strict Mode agar tidak double-render saat dev (mengurangi beban)
  reactStrictMode: false, 
  
  images: {
    // Izinkan gambar dari domain APAPUN (Dangerous but good for Dev)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", 
      },
    ],
    // Jika unoptimized di komponen tadi berhasil, Anda bisa set global di sini:
    // unoptimized: true, 
  },
};

export default nextConfig;