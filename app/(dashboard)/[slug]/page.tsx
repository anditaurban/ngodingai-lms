import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import coursesDataRaw from "@/data/courses.json";
import curriculumDataRaw from "@/data/curriculum.json";
import CoursePlayer from "@/components/course/CoursePlayer";
import { CourseData, CurriculumData } from "@/types";

const courses = coursesDataRaw as unknown as CourseData[];
const curriculumMap = curriculumDataRaw as unknown as Record<
  string,
  CurriculumData
>;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Helper untuk mereplace judul kelas sesuai request
const getDisplayTitle = (title: string) => {
  if (title.includes("NgodingAI: Master GenAI & LLMs")) {
    return "NgodingAI: Belajar ngoding pakai AI, bangun project website dalam waktu singkat";
  }
  return title;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) return { title: "Course Not Found" };

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
    notFound();
  }

  const displayTitle = getDisplayTitle(course.title);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* --- HEADER STATIC --- */}
      <div className="bg-[#1b2636] text-white p-6 md:p-8 shrink-0">
        
        {/* Breadcrumb Navigation - DIUBAH ALURNYA */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-[14px]">
            chevron_right
          </span>
          <Link href="/my-class" className="hover:text-white transition-colors">
            My Courses
          </Link>
          <span className="material-symbols-outlined text-[14px]">
            chevron_right
          </span>
          <span className="text-[#00BCD4] line-clamp-1 max-w-50 md:max-w-none">
            {displayTitle}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Course Thumbnail - UI disesuaikan agar lebih proporsional */}
          <div className="w-full md:w-72 shrink-0 relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-white/10 group bg-slate-800">
            <Image
              src={course.thumbnail}
              alt={displayTitle}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
              unoptimized={true}
            />
          </div>

          {/* Course Info Text */}
          <div className="flex-1 max-w-3xl flex flex-col justify-center min-h-40">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight tracking-tight text-white">
              {displayTitle}
            </h1>
            <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed line-clamp-2 md:line-clamp-3">
              {course.description}
            </p>

            {/* Bagian Bawah Card - PROGRESS DIHAPUS, MENTOK DI INSTRUKTUR */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                <span className="material-symbols-outlined text-[#00BCD4] text-[20px]">
                  person
                </span>
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                  Instructor
                </p>
                <p className="font-bold text-white text-sm">
                  {course.instructor}
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <CoursePlayer course={course} curriculum={curriculum} />
    </div>
  );
}