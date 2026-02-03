import React from 'react';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// PERBAIKAN: Gunakan Relative Path agar file ditemukan di semua environment
// (Di VS Code Anda boleh tetap pakai @/ jika tsconfig mendukung, tapi ini lebih aman)
import coursesDataRaw from '../../../../data/courses.json';
import curriculumDataRaw from '../../../../data/curriculum.json';
import CoursePlayer from '../../../../components/course/CoursePlayer';
import { CourseData, CurriculumData } from '../../../../types';

// Helper casting data agar TypeScript tidak komplain
const courses = coursesDataRaw as unknown as CourseData[];
const curriculumMap = curriculumDataRaw as unknown as Record<string, CurriculumData>;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate Metadata untuk SEO otomatis
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  
  if (!course) return { title: 'Course Not Found' };
  
  return {
    title: `${course.title} | Inovasia Academy`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 1. Ambil data course berdasarkan slug
  const course = courses.find((c) => c.slug === slug);
  const curriculum = curriculumMap[slug];

  // 2. Validasi: Jika data tidak ditemukan, tampilkan halaman 404
  if (!course) {
    return notFound();
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      
      {/* --- HEADER STATIC (Server Side Rendered) --- */}
      {/* Bagian ini dirender di server untuk performa awal yang cepat */}
      <div className="bg-[#1b2636] text-white p-5 md:p-5 shrink-0">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-0 uppercase tracking-wider">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <Link href="/my-class" className="hover:text-white transition-colors">My Courses</Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-[#00BCD4]">{course.title}</span>
        </div>
      </div>

      <CoursePlayer course={course} curriculum={curriculum} />

    </div>
  );
}