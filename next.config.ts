import type { NextConfig } from "next";

// ✨ 1. UPDATE DAFTAR VIP (TAMBAH DEV.KATIB.CLOUD DI IMG-SRC)
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://dev.katib.cloud https://ui-avatars.com https://images.unsplash.com https://upload.wikimedia.org https://lh3.googleusercontent.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://dev.katib.cloud https://region.katib.cloud;
    frame-src 'self' https://www.youtube.com https://drive.google.com https://docs.google.com https://www.google.com;
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  // Matikan strict mode agar tidak render 2x saat dev
  reactStrictMode: false,

  // Izinkan akses dari IP lokal (agar bisa dibuka di HP saat dev)
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '192.168.1.10:3000', '192.168.0.100:3000'], 
    },
  },

  // Konfigurasi Image Next.js
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dev.katib.cloud" }, // ✨ Daftarkan Katib secara eksplisit
      { protocol: "https", hostname: "**" }, // Terima semua gambar lainnya
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Menyuntikkan Header Keamanan ke Browser
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ' ').trim(), // Lebih aman pakai spasi untuk replace newline
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;