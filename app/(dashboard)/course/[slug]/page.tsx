import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import coursesDataRaw from '../../../../data/courses.json';
import curriculumDataRaw from '../../../../data/curriculum.json';
import CoursePlayer from '../../../../components/course/CoursePlayer';
import { CourseData, CurriculumData } from '../../../../types';

const courses = coursesDataRaw as unknown as CourseData[];
const curriculumMap = curriculumDataRaw as unknown as Record<string, CurriculumData>;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Helper untuk mereplace judul kelas
const getDisplayTitle = (title: string) => {
  if (title.includes("NgodingAI: Master GenAI & LLMs")) {
    return "NgodingAI: Belajar ngoding pakai AI, bangun project website dalam waktu singkat";
  }
  return title;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  
  if (!course) return { title: 'Course Not Found' };
  
  return {
    title: `${getDisplayTitle(course.title)} | Inovasia Academy`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const course = courses.find((c) => c.slug === slug);
  const curriculum = curriculumMap[slug];

  if (!course) {
    return notFound();
  }

  const displayTitle = getDisplayTitle(course.title);

  return (
    // Latar belakang utama dikembalikan ke normal (mengikuti tema bawaan aplikasi)
    <div className="flex flex-col w-full min-h-screen">
      
      {/* --- HEADER STATIC DENGAN MODERN GAMING GRADIENT --- */}
      <div className="relative bg-linear-to-r from-[#1e40af] via-[#1b2636] to-[#1b2636] text-white p-5 md:p-6 border-b border-white/10 shrink-0 overflow-hidden shadow-md">
        
        {/* Efek lighting tipis di sisi kiri atas untuk kesan modern/gaming */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-linear-to-br from-blue-400/10 to-transparent pointer-events-none blur-xl" />

        {/* Breadcrumb Navigation */}
        <div className="relative flex items-center gap-2 text-[11px] font-bold text-slate-100 uppercase tracking-wider z-10">
          {/* Link Home diarahkan ke /my-class */}
          {/* <Link href="/my-class" className="hover:text-[#00BCD4] transition-colors duration-200">
            Home
          </Link>
          <span className="material-symbols-outlined text-[14px] opacity-70">chevron_right</span> */}
          
          <Link href="/my-class" className="hover:text-[#00BCD4] transition-colors duration-200">
            My Courses
          </Link>
          <span className="material-symbols-outlined text-[14px] opacity-70">chevron_right</span>
          
          {/* Judul kelas aktif dengan aksen cyan */}
          <span className="text-[#00BCD4] drop-shadow-[0_0_8px_rgba(0,188,212,0.3)] line-clamp-1 max-w-62.5 sm:max-w-md md:max-w-lg truncate block">
            {displayTitle}
          </span>
        </div>
      </div>

      {/* Bagian bawah kembali normal, mengikuti styling dari CoursePlayer */}
      <CoursePlayer course={course} curriculum={curriculum} />

    </div>
  );
}