'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import coursesData from '@/data/courses.json';

export default function DashboardPage() {

  const activeCourses = coursesData.filter(c => c.progress > 0 && c.progress < 100);
  const activeCount = activeCourses.length;

  const heroCourse = activeCourses.sort((a, b) => b.progress - a.progress)[0] || coursesData[0];

  return (
    <div className="p-6">

      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Welcome back, Alex! You have <span className="text-primary font-bold">2 assignments</span> pending.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

        <div className="lg:col-span-8 flex flex-col gap-6">

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Study Time</p>
                <p className="text-xl font-extrabold">12.5h</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="size-10 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Courses</p>
                <p className="text-xl font-extrabold">{activeCount} Active</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="size-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <span className="material-symbols-outlined">emoji_events</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Points</p>
                <p className="text-xl font-extrabold">1,450</p>
              </div>
            </div>
          </div>

          {heroCourse && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row h-full">
                <div className="w-full md:w-5/12 relative min-h-50 md:min-h-auto overflow-hidden rounded-xl md:rounded-r-none">
                    <Image 
                        src={heroCourse.thumbnail} 
                        alt={heroCourse.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                    />
                </div>
                
                <div className="p-6 flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Continue Learning</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 leading-tight">
                        {heroCourse.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                        {heroCourse.description}
                    </p>
                    
                    <div className="mt-auto">
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-400">Progress ({heroCourse.progress}%)</span>
                            <span className="text-primary">{heroCourse.progress === 100 ? 'Completed' : 'On Track'}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-4">
                            <div 
                                className="bg-primary h-2 rounded-full transition-all duration-1000" 
                                style={{ width: `${heroCourse.progress}%` }}
                            ></div>
                        </div>
                        <Link 
                            href={`/course/${heroCourse.slug}`}
                            className="block text-center w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                        >
                            {heroCourse.progress > 0 ? 'Resume Session' : 'Start Learning'}
                        </Link>
                    </div>
                </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">forum</span> Recent Discussions
              </h3>
              <button className="text-primary text-xs font-bold hover:underline">View Forum</button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                <Image src="https://ui-avatars.com/api/?name=Sarah+J&background=random" width={40} height={40} className="size-10 rounded-full" alt="User" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary cursor-pointer">Error when installing LangChain on M1 Mac</h4>
                    <span className="text-[10px] text-slate-400">2h ago</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">I keep getting &apos;grpc&apos; build errors when running pip install...</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">chat_bubble</span> 5 Replies
                    </span>
                    <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">NgodingAI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500">event</span> Upcoming Events
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-center group cursor-pointer">
                <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg p-2 text-center min-w-12.5">
                  <span className="block text-xs font-bold uppercase">Dec</span>
                  <span className="block text-xl font-extrabold leading-none">21</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Live Q&A Session</h4>
                  <p className="text-xs text-slate-500">20:00 WIB • Zoom Meeting</p>
                </div>
              </div>

              <div className="flex gap-3 items-center group cursor-pointer">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg p-2 text-center min-w-12.5">
                  <span className="block text-xs font-bold uppercase">Dec</span>
                  <span className="block text-xl font-extrabold leading-none">24</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Project Deadline</h4>
                  <p className="text-xs text-slate-500">23:59 WIB • NgodingAI</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">assignment</span> Assignments
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/50 transition-colors bg-white dark:bg-slate-900/30">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">NgodingAI</span>
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">timer</span> 2 Days
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Create RAG Chatbot</h4>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}