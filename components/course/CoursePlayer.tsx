'use client';

import React, { useState } from 'react';
import { CourseData, CurriculumData } from '@/types';

// Import Tabs
import OverviewTab from './tabs/OverviewTab';
import PreparationTab from './tabs/PreparationTab';
import ClassroomTab from './tabs/ClassroomTab';
import MaterialsTab from './tabs/MaterialsTab'; // <-- Import Baru

interface CoursePlayerProps {
  course: CourseData;
  curriculum?: CurriculumData; 
}

export default function CoursePlayer({ course, curriculum }: CoursePlayerProps) {
  // Tambahkan 'materials' ke tipe state
  const [activeTab, setActiveTab] = useState<'overview' | 'preparation' | 'materials' | 'classroom'>('overview');

  return (
    <div className="flex flex-col h-full">
      {/* STICKY TAB NAVIGATION */}
      <div className="sticky top-0 z-20 bg-white dark:bg-[#1b2636] border-b border-slate-200 dark:border-slate-700 px-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-8 min-w-max">
          {[
            { id: 'overview', icon: 'info', label: 'Overview' },
            { id: 'preparation', icon: 'article', label: 'Preparation' },
            { id: 'materials', icon: 'folder_open', label: 'Materi & Slides' }, // <-- Tab Baru
            { id: 'classroom', icon: 'play_circle', label: 'Classroom' },
          ].map((tab) => (
            <button
              key={tab.id}
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
          <OverviewTab data={course.tabs.overview} />
        )}

        {activeTab === 'preparation' && (
          <PreparationTab data={course.tabs.preparation} />
        )}

        {/* Render Materials Tab */}
        {activeTab === 'materials' && (
          <MaterialsTab materials={course.tabs.materials} />
        )}

        {activeTab === 'classroom' && (
          <ClassroomTab 
            curriculum={course.tabs.curriculum} 
            legacyCurriculum={curriculum}
            slug={course.slug}
          />
        )}
      </div>
    </div>
  );
}