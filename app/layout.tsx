import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inovasia Digital Academy",
  description: "Platform pembelajaran digital",
  icons: {
    icon: "/icon-inovasia2.png", 
    shortcut: "/icon-inovasia2.png",
    apple: "/icon-inovasia2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${manrope.variable} font-sans`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white dark:bg-[#0f111a] text-slate-900 dark:text-white antialiased">
        {children}
      </body>
    </html>
  );
}