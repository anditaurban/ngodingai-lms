import React from 'react';
// Pastikan nama file di path ini juga sudah di-rename menjadi AppLayout.tsx
import AppLayout from '@/components/layout/AppLayout'; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}