'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import komponen Image untuk performa

// --- IMPORT DATA ASLI ---
import coursesData from '@/data/courses.json';

export default function MyClassPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // Logic Filtering menggunakan Data JSON Asli
  const filteredCourses = coursesData.filter(course => {
    // 1. Search Logic
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(search.toLowerCase());
    
    // 2. Category Logic (Kita tebak kategori berdasarkan Slug karena di JSON tidak ada field 'category')
    let category = 'All';
    if(course.slug.includes('ngoding') || course.slug.includes('ai')) category = 'AI';
    if(course.slug.includes('esp32') || course.slug.includes('iot')) category = 'IoT';
    if(course.slug.includes('n8n') || course.slug.includes('auto')) category = 'Automation';
    
    const matchesFilter = filter === 'All' || category === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 md:p-10 min-h-screen">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">My Learning</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your courses and track your progress.</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-72">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search course..." 
                    className="pl-10 pr-4 py-3 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-primary shadow-sm text-sm outline-none focus:border-[#00BCD4]"
                />
            </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'AI', 'IoT', 'Automation'].map((cat) => (
                <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                        filter === cat 
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                        : 'bg-white text-slate-600 border-transparent hover:border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                >
                    {cat === 'All' ? 'All Courses' : cat}
                </button>
            ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
                <Link href={`/course/${course.slug}`} key={course.slug} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full">
                    
                    {/* Thumbnail Image dengan Next/Image */}
                    <div className="aspect-video w-full relative">
                       <Image 
                          src={course.thumbnail} 
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                       />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                        <div className="absolute top-3 left-3 z-20">
                            {/* Status Badge Logic */}
                            {course.progress > 0 && course.progress < 100 && (
                                <span className="bg-white/90 backdrop-blur text-[#00BCD4] text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">schedule</span> In Progress
                                </span>
                            )}
                            {course.progress === 100 && (
                                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">check_circle</span> Completed
                                </span>
                            )}
                            {course.progress === 0 && (
                                <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">lock_open</span> Not Started
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-[#00BCD4] transition-colors mb-2 line-clamp-2">
                            {course.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[14px] text-slate-500">person</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{course.instructor}</p>
                        </div>

                        <div className="mt-auto space-y-3">
                            {/* Progress Bar */}
                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span className="text-slate-500">Progress</span>
                                    <span className="text-slate-900 dark:text-white">{course.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className="bg-[#00BCD4] h-1.5 rounded-full transition-all duration-500" 
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">video_library</span> 
                                    {/* Hitung Module secara Dinamis jika ada */}
                                    {course.tabs?.curriculum?.length || 0} Modules
                                </span>
                                <span className="text-[#00BCD4] text-sm font-bold group-hover:underline">
                                    {course.progress > 0 ? 'Continue' : 'Start Course'}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
        
        {/* Empty State */}
        {filteredCourses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-full mb-4">
                    <span className="material-symbols-outlined text-4xl text-slate-400">search_off</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No courses found</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                    We couldn&apos;t find any courses matching &quot;{search}&quot;.
                </p>
                <button 
                    onClick={() => { setSearch(''); setFilter('All'); }} 
                    className="text-[#00BCD4] font-bold hover:underline"
                >
                    Clear Filters
                </button>
            </div>
        )}

    </div>
  );
}