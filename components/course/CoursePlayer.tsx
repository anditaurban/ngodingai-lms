'use client';

import React, { useState } from 'react';
import { CourseData } from '@/types'; 

// Import Tabs
import OverviewTab from './tabs/OverviewTab';
import VideosTab from './tabs/VideosTab';
import MaterialsTab from './tabs/MaterialsTab';
import AssignmentsTab from './tabs/AssignmentsTab';

interface CoursePlayerProps {
  course: CourseData;
  curriculum?: any;
}

export default function CoursePlayer({ course }: CoursePlayerProps) {
  // ✨ FIX: Mengubah state awal dan tipe data dari 'quizzes' menjadi 'assignments'
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'recordings' | 'assignments'>('overview');

  return (
    <div className="flex flex-col h-full">
      {/* STICKY TAB NAVIGATION */}
      <div className="sticky top-0 z-20 bg-white dark:bg-[#1b2636] border-b border-slate-200 dark:border-slate-700 px-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-8 min-w-max">
          {[
            { id: 'overview', icon: 'info', label: 'Overview' },
            { id: 'materials', icon: 'folder_zip', label: 'Materials' },
            { id: 'recordings', icon: 'videocam', label: 'Videos' },
            // ✨ FIX: Mengganti label, id, dan icon menjadi Assignments
            { id: 'assignments', icon: 'assignment', label: 'Assignments' },
          ].map((tab) => (
            <button
              key={tab.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === tab.id
                ? 'text-[#00BCD4] border-[#00BCD4]' 
                : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' && (
          // ✨ FIX: Tambahkan courseSlug={course.slug} agar Hardcoded Demo berjalan
          <OverviewTab data={course.tabs?.overview} courseSlug={course.slug} />
        )}

        {activeTab === 'materials' && (
          // ✨ FIX: Tambahkan courseSlug={course.slug} agar Live Auto-Sync Materi berjalan
          <MaterialsTab materials={course.tabs?.materials} courseSlug={course.slug} />
        )}

        {activeTab === 'recordings' && (
          <VideosTab 
            courseId={1} // Ganti dengan course.id jika nanti datanya sudah dinamis dari API
            slug={course.slug}
          />
        )}

        {/* ✨ FIX: Memanggil AssignmentsTab dengan ID yang benar ✨ */}
        {activeTab === 'assignments' && (
          <AssignmentsTab />
        )}
      </div>
    </div>
  );
}