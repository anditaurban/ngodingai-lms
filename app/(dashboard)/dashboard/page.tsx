'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [userName, setUserName] = useState('Student');

  // 2. Ambil data dari Local Storage saat komponen dimuat
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem('user_profile');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.name) {
            setUserName(parsedData.name);
          }
        }
      } catch (error) {
        console.error("Gagal memuat data user:", error);
      }
    }
  }, []);

  return (
    <div className="p-6 md:p-10 min-h-screen">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Welcome back, <span className="font-bold text-slate-800 dark:text-white capitalize">{userName.toLowerCase()}</span>! You have <span className="text-[#00BCD4] font-bold">1 assignments</span> pending.
          </p>
        </div>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        
        {/* LEFT COLUMN (Main Activity) - Span 8 */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* 1. Stat Cards Row (SEJAJAR 3 DI MOBILE) */}
<div className="grid grid-cols-3 gap-2 md:gap-4">
  
  {/* Stat Card 1: Study Time */}
  <div className="group bg-white dark:bg-slate-800 p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
    {/* Badge Pojok Kanan Atas */}
    <span className="absolute top-2 right-2 md:top-4 md:right-4 flex items-center gap-0.5 text-[8px] md:text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full border border-green-100 dark:border-green-800">
       +5%
    </span>

    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 gap-1">
      <div className="size-7 md:size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-[16px] md:text-[20px]">schedule</span>
      </div>
    </div>
    <div>
      <p className="text-[9px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5 truncate pr-4">Study Time</p>
      <p className="text-base md:text-3xl font-extrabold text-slate-900 dark:text-white leading-none">12.5<span className="text-[10px] md:text-lg text-slate-400 font-medium ml-0.5">h</span></p>
    </div>
  </div>

  {/* Stat Card 2: Active Courses */}
  <div className="group bg-white dark:bg-slate-800 p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 gap-1">
      <div className="size-7 md:size-10 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-[16px] md:text-[20px]">school</span>
      </div>
    </div>
    <div>
      <p className="text-[9px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5 truncate">Courses</p>
      <p className="text-base md:text-3xl font-extrabold text-slate-900 dark:text-white leading-none">3 <span className="text-[10px] md:text-lg text-slate-400 font-medium ml-0.5">act</span></p>
    </div>
  </div>

  {/* Stat Card 3: Points */}
  <div className="group bg-white dark:bg-slate-800 p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
    {/* Badge Pojok Kanan Atas */}
    <span className="absolute top-2 right-2 md:top-4 md:right-4 flex items-center gap-0.5 text-[8px] md:text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded-full border border-purple-100 dark:border-purple-800">
      Lvl 5
    </span>

    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 gap-1">
      <div className="size-7 md:size-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-[16px] md:text-[20px]">emoji_events</span>
      </div>
    </div>
    <div>
      <p className="text-[9px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5 truncate pr-4">Points</p>
      <p className="text-base md:text-3xl font-extrabold text-slate-900 dark:text-white leading-none">1,450</p>
    </div>
  </div>

          </div>

          {/* 2. Hero Course (Last Accessed) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row h-full overflow-hidden">
            <div 
              className="w-full md:w-5/12 bg-gray-200 bg-cover bg-center min-h-50 md:min-h-auto relative" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop')" }}
            >
               <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent md:hidden"></div>
               <div className="absolute bottom-4 left-4 md:hidden">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30">
                    Resume Learning
                  </span>
               </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
              <div className="hidden md:flex items-center gap-2 mb-3">
                <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Last Activity: 2h ago</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">NgodingAI: GenAI Masterclass</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                Module 3: Neural Networks & Deep Learning Architectures. You stopped at video <span className="font-semibold text-slate-700 dark:text-slate-300">"Introduction to Transformers"</span>.
              </p>
              
              <div className="mt-auto">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-500">Course Progress</span>
                  <span className="text-primary">40% Completed</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-6 overflow-hidden">
                  <div className="bg-primary h-2.5 rounded-full transition-all duration-1000 relative overflow-hidden" style={{ width: "40%" }}>
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <Link href="/course/ngodingai" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                  Resume Session
                </Link>
              </div>
            </div>
          </div>
          
          {/* 3. Discussion Forum */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                <span className="material-symbols-outlined text-primary">forum</span> Recent Discussions
              </h3>
              <button className="text-slate-500 hover:text-primary text-xs font-bold flex items-center gap-1 transition-colors">
                View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Discussion Item 1 */}
              <div className="group flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://ui-avatars.com/api/?name=Sarah+J&background=random" className="size-10 rounded-full border border-white shadow-sm" alt="User" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate pr-2">Error when installing LangChain on M1 Mac</h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700">2h ago</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-3">I keep getting &apos;grpc&apos; build errors when running pip install. Has anyone faced this issue before?</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined text-[12px]">chat_bubble</span> 5
                    </span>
                    <span className="text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-md border border-teal-100 dark:border-teal-800/30">
                      NgodingAI
                    </span>
                  </div>
                </div>
              </div>
               {/* Discussion Item 2 */}
               <div className="group flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://ui-avatars.com/api/?name=Budi+S&background=random" className="size-10 rounded-full border border-white shadow-sm" alt="User" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate pr-2">Best wiring for Solenoid Lock 12V?</h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700">5h ago</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-3">Do I need a relay module or mosfet is enough for ESP32 project?</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined text-[12px]">chat_bubble</span> 12
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-800/30">
                      IoT & Hardware
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Widgets) - Span 4 */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* 1. Upcoming Events */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 text-lg">
              <span className="material-symbols-outlined text-orange-500">event</span> Upcoming Events
            </h3>
            <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-3 space-y-8 pb-2">
              
              {/* Event 1 */}
              <div className="relative pl-6 group cursor-pointer">
                <span className="absolute -left-1.25 top-1 size-2.5 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-800 group-hover:scale-125 transition-transform"></span>
                <p className="text-xs font-bold text-slate-400 mb-1">DECEMBER 21</p>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Live Q&A Session</h4>
                <p className="text-xs text-slate-500 mt-0.5">20:00 WIB • Zoom Meeting</p>
              </div>

               {/* Event 2 */}
               <div className="relative pl-6 group cursor-pointer">
                <span className="absolute -left-1.25 top-1 size-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-800 group-hover:scale-125 transition-transform"></span>
                <p className="text-xs font-bold text-slate-400 mb-1">DECEMBER 24</p>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Project Deadline</h4>
                <p className="text-xs text-slate-500 mt-0.5">23:59 WIB • NgodingAI</p>
              </div>
            </div>
          </div>

          {/* 2. Assignments */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex-1 flex flex-col">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 text-lg">
              <span className="material-symbols-outlined text-red-500">assignment</span> Assignments
            </h3>
            <div className="space-y-4 flex-1">
              {/* Task 1 */}
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all bg-white dark:bg-slate-900/30 group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">NgodingAI</span>
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[12px]">timer</span> 2 Days Left
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-red-600 transition-colors">AI-Powered SaaS Dashboard</h4>
                <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
                  <span>Progress</span>
                  <span className="font-bold">80%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 text-xs font-bold text-slate-500 hover:text-white hover:bg-slate-900 dark:hover:bg-primary py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl transition-all flex items-center justify-center gap-2">
              See All Assignments <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}