import type { NextConfig } from "next";

// 1. Definisikan Kebijakan Keamanan (Daftar Tamu VIP)
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://ui-avatars.com https://images.unsplash.com https://upload.wikimedia.org https://lh3.googleusercontent.com;
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
  // Matikan strict mode agar tidak render 2x saat dev (optional)
  reactStrictMode: false,

  // Solusi Warning: Pindahkan 'allowedDevOrigins' ke root / level teratas next.config
  // @ts-ignore - Abaikan error TS sementara karena ini fitur baru Next.js
  allowedDevOrigins: ['192.168.0.100', '192.168.1.10', 'localhost', '127.0.0.1'],

  // Izinkan akses dari IP lokal (agar bisa dibuka di HP saat dev)
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '192.168.1.10:3000', '192.168.0.100:3000'], 
    },
  },

  // Konfigurasi Image Next.js
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // Terima semua gambar (Dev Mode)
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
            value: cspHeader.replace(/\n/g, ''), // Minify string CSP
          },
          // Header keamanan tambahan standar industri
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