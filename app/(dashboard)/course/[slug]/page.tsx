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
    <div className="flex flex-col w-full min-h-screen">
      
      {/* --- HEADER STATIC --- */}
      <div className="bg-[#1b2636] text-white p-5 md:p-6 border-b border-white/5 shrink-0">
        
        {/* Breadcrumb Navigation - DIUBAH ALURNYA */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/my-class" className="hover:text-white transition-colors">My Courses</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#00BCD4] line-clamp-1 max-w-62.5">{displayTitle}</span>
        </div>
      </div>

      <CoursePlayer course={course} curriculum={curriculum} />

    </div>
  );
}