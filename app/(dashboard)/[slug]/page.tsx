import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Menggunakan alias @/ untuk path yang lebih aman dan rapi
// Pastikan tsconfig.json Anda mendukung path alias "@/*"
import coursesDataRaw from "@/data/courses.json";
import curriculumDataRaw from "@/data/curriculum.json";
import CoursePlayer from "@/components/course/CoursePlayer";
import { CourseData, CurriculumData } from "@/types";

// Helper casting data agar TypeScript tidak komplain
const courses = coursesDataRaw as unknown as CourseData[];
const curriculumMap = curriculumDataRaw as unknown as Record<
  string,
  CurriculumData
>;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate Metadata untuk SEO otomatis
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) return { title: "Course Not Found" };

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
    notFound();
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* --- HEADER STATIC (Server Side Rendered) --- */}
      {/* Bagian ini dirender di server untuk performa awal yang cepat */}
      <div className="bg-[#1b2636] text-white p-6 md:p-8 shrink-0">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
          <Link
            href="/dashboard"
            className="hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-[12px]">
            chevron_right
          </span>
          <Link href="/my-class" className="hover:text-white transition-colors">
            My Courses
          </Link>
          <span className="material-symbols-outlined text-[12px]">
            chevron_right
          </span>
          <span className="text-[#00BCD4]">{course.title}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Course Thumbnail */}
          <div className="w-full md:w-64 shrink-0 relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
              unoptimized={true}
            />
          </div>

          {/* Course Info Text */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed line-clamp-2">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-slate-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-300 text-[18px]">
                    person
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">
                    Instructor
                  </p>
                  <p className="font-bold text-white">{course.instructor}</p>
                </div>
              </div>

              <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                  Your Progress
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${course.progress}%` }}
                      className="h-full bg-[#00BCD4]"
                    ></div>
                  </div>
                  <span className="text-[#00BCD4] font-bold">
                    {course.progress}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CoursePlayer course={course} curriculum={curriculum} />
    </div>
  );
}
