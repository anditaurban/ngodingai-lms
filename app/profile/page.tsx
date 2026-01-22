'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import userProfileData from '@/data/user_profile.json';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const user = userProfileData;

  const menuItems = [
    { id: 'general', label: 'General Info', icon: 'person' },
    { id: 'attendance', label: 'Attendance', icon: 'how_to_reg' },
    { id: 'portfolio', label: 'Portfolio', icon: 'folder_open' },
    { id: 'certificates', label: 'Certificates', icon: 'verified' },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.clear();
    }

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });

    router.replace('/'); 
  };

  return (
    <div className="p-6 md:p-10 min-h-screen">
      
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">Account Settings</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        <aside className="w-full md:w-64 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm shrink-0 md:sticky md:top-24">
          <div className="p-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm mb-1 ${
                  activeTab === item.id
                  ? 'bg-slate-100 dark:bg-slate-700 text-primary dark:text-[#00BCD4] font-bold'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${
                  activeTab === item.id ? 'text-primary dark:text-[#00BCD4]' : 'text-slate-400'
                }`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="p-2 border-t border-slate-100 dark:border-slate-700 mt-2">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign Out
            </button>
          </div>
        </aside>

        <div className="flex-1 w-full min-h-125">
          
          {activeTab === 'general' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm animate-fade-in space-y-8">
               
                <div className="flex items-center gap-6 pb-8 border-b border-slate-200 dark:border-slate-700">
                    <div className="relative group size-24 shrink-0">
                        <Image 
                            src={user.avatar} 
                            alt={user.name}
                            fill
                            className="rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
                        />
                        <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary-dark transition-colors" title="Change Photo">
                            <span className="material-symbols-outlined text-[16px] block">photo_camera</span>
                        </button>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                        <p className="text-slate-500 dark:text-slate-400">{user.role}</p>
                    </div>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); alert('Profile Updated (Simulation)'); }}>
                    
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bio / About Me</label>
                        <textarea 
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary" 
                            rows={3}
                            defaultValue={user.bio}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                        <input type="text" defaultValue={user.name} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-primary focus:border-primary" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number (Read Only)</label>
                        <input type="text" defaultValue={user.phone} readOnly className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                        <input type="text" defaultValue={user.location} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-primary focus:border-primary" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">LinkedIn URL</label>
                        <input type="text" defaultValue={user.socials.linkedin} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-primary focus:border-primary" />
                    </div>

                    <div className="md:col-span-2 flex justify-end pt-4">
                        <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="animate-fade-in space-y-8">
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
                                {user.attendance_log.map((log, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{log.date}</td>
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
          )}

          {activeTab === 'portfolio' && (
             <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">My Projects</h3>
                    <button onClick={() => alert('Open Upload Modal Simulation')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Upload Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.projects.map((project) => (
                        <div key={project.id} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div className="h-40 bg-gray-200 relative">
                                <Image 
                                    src={project.image} 
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-5">
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded">{project.category}</span>
                                <h4 className="font-bold text-lg mt-2 text-slate-900 dark:text-white">{project.title}</h4>
                                <p className="text-sm text-slate-500 mt-1">{project.description}</p>
                                <div className="mt-4 flex gap-2">
                                    <button className="text-xs font-bold text-slate-500 hover:text-primary">Edit</button>
                                    <button className="text-xs font-bold text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <button onClick={() => alert('Open Upload Modal')} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center h-full min-h-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                        <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-slate-400">cloud_upload</span>
                        </div>
                        <span className="text-sm font-bold text-slate-500">Upload New Project</span>
                    </button>
                </div>
            </div>
          )}

          {activeTab === 'certificates' && (
             <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.certificates.map((cert) => (
                        <div key={cert.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-4 items-center">

                            <img src={cert.image} className="w-24 h-16 object-cover rounded border border-slate-200 shadow-sm" alt={cert.title} />
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{cert.title}</h4>
                                <p className="text-xs text-slate-500 mb-2">Issued: {cert.date}</p>
                                <button className="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">download</span> Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}