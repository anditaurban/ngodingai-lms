import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Matikan pengecekan ketat React (opsional, biar tidak render 2x di dev)
  reactStrictMode: false,

  // Izinkan akses dari IP lokal (HP/WiFi)
  experimental: {
    // Masukkan IP yang muncul di error tadi
    serverActions: {
      allowedOrigins: ['localhost:3000', '172.16.1.26:3000'], 
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", 
      },
    ],
  },
};

export default nextConfig;