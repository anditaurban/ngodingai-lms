'use client';

import React from 'react';
// Fix Import: Ambil dari folder types
import { UserProfile } from '@/types';

export default function AttendanceTab({ user }: { user: UserProfile }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8 items-center bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        
        <div className="relative size-32 shrink-0">
          <svg className="size-full" viewBox="0 0 36 36">
            <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
            <path className="text-teal-500" strokeDasharray={`${user.stats.attendance_rate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{user.stats.attendance_rate}%</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Rate</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
            <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">Present</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.stats.present} <span className="text-sm font-medium text-slate-400">Sessions</span></p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
            <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Absent</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.stats.absent} <span className="text-sm font-medium text-slate-400">Sessions</span></p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Recent Activity</h3>
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Class</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
              {/* Fix: Tambahkan tipe explicit (log: any, idx: number) atau biarkan inferred jika import sudah benar */}
              {user.attendance_log.map((log, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{formatDate(log.date)}</td>
                  <td className="px-6 py-4 text-slate-500">{log.class}</td>
                  <td className="px-6 py-4">
                    {log.status === 'Present' ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Present</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Absent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}