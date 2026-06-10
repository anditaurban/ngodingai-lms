'use client';

import React, { useState } from 'react';

import DynamicOverviewTab from './tabs/DynamicOverviewTab';
import DynamicMaterialsTab from './tabs/DynamicMaterialsTab';
import VideosTab from './tabs/VideosTab'; 
import AssignmentsTab from './tabs/AssignmentsTab';

interface CoursePlayerDynamicProps {
  courseId: string;
  courseData: any; // Data dari API yang dilempar dari page.tsx
}

export default function CoursePlayerDynamic({ courseId, courseData }: CoursePlayerDynamicProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'recordings' | 'assignments'>('overview');

  return (
    <div className="flex flex-col h-full">
      {/* STICKY TAB NAVIGATION */}
      <div className="sticky top-0 z-20 bg-white dark:bg-[#1b2636] border-b border-slate-200 dark:border-slate-700 px-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-8 min-w-max">
          {[
            { id: 'overview', icon: 'info', label: 'Overview' },
            { id: 'materials', icon: 'folder_zip', label: 'Materials' },
            { id: 'recordings', icon: 'videocam', label: 'Live Session' },
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
          // Jika nanti overview sudah ada API-nya, ganti dengan DynamicOverviewTab
          <DynamicOverviewTab courseSlug={courseId} />
        )}

        {activeTab === 'materials' && (
          // ✨ FULL API INTEGRATION
          <DynamicMaterialsTab courseSlug={courseId} />
        )}

        {activeTab === 'recordings' && (
          // Jika VideosTab butuh course_id, kita lempar langsung ID real-nya
          <VideosTab courseId={Number(courseId)} slug={courseId} />
        )}

        {activeTab === 'assignments' && (
           <AssignmentsTab /> 
        )}
        
      </div>
    </div>
  );
}