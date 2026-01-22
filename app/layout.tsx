import type { Metadata } from "next";
// Import Font Manrope dari Google
import { Manrope } from "next/font/google"; 
import "./globals.css";
import AppShell from "@/components/AppShell";

// Konfigurasi Font
const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope", // Variable CSS
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inovasia Digital Academy",
  description: "LMS Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} font-sans`}>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" 
          rel="stylesheet" 
        />
      </head>
      
      {/* Terapkan font ke body */}
      <body className="bg-[#f3f4f6] dark:bg-[#0f111a] font-sans text-slate-900 dark:text-white">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}