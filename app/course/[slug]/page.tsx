'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Editor } from '@tinymce/tinymce-react';

// Import Data (Menggunakan Relative Path agar aman)
import coursesDataRaw from '../../../data/courses.json';
import curriculumDataRaw from '../../../data/curriculum.json';

// --- DEFINISI TIPE DATA ---
interface Video {
  id: string;
  type: string;
  title: string;
  url: string;
  duration: string;
}

interface Module {
  title: string;
  videos: Video[];
}

interface Batch {
  id: string;
  name: string;
}

interface CurriculumContent {
  batches: Batch[];
  content: Record<string, Module[]>;
}

interface CourseTabs {
  overview: {
    about: string;
    tools: string[];
  };
  preparation: {
    content_html: string;
    slides_id?: string;
  };
}

interface Course {
  slug: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  tabs: CourseTabs;
}

// Casting JSON ke tipe yang benar
const coursesData = coursesDataRaw as unknown as Course[];
const curriculumData = curriculumDataRaw as unknown as Record<string, CurriculumContent>;

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  // --- LOGIC CARI DATA ---
  const foundCourse = coursesData.find((c) => c.slug === slug);
  const foundCurriculum = curriculumData[slug];

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('overview');
  
  const [activeBatch, setActiveBatch] = useState(() => {
    return foundCurriculum?.batches[0]?.id || '';
  });

  const [currentVideo, setCurrentVideo] = useState<Video | null>(() => {
    if (foundCurriculum && foundCurriculum.batches.length > 0) {
      const firstBatchId = foundCurriculum.batches[0].id;
      const firstModule = foundCurriculum.content[firstBatchId]?.[0];
      return firstModule?.videos?.[0] || null;
    }
    return null;
  });

  // Editor State
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [articleContent, setArticleContent] = useState(() => {
    return foundCourse?.tabs.preparation.content_html || '';
  });

  // --- EFFECTS ---
  useEffect(() => {
    if (!foundCourse) {
      router.push('/dashboard');
    }
  }, [foundCourse, router]);

  if (!foundCourse) return <div className="p-10 text-center">Loading Course...</div>;

  // --- HANDLERS ---
  const currentModules = (foundCurriculum && activeBatch && foundCurriculum.content[activeBatch]) 
    ? foundCurriculum.content[activeBatch] 
    : [];

  const handleBatchChange = (batchId: string) => {
    setActiveBatch(batchId);
    if (!foundCurriculum) return;

    // Reset video ke yang pertama di batch baru
    const firstModule = foundCurriculum.content[batchId]?.[0];
    if (firstModule?.videos?.length > 0) {
      setCurrentVideo(firstModule.videos[0]);
    } else {
      setCurrentVideo(null);
    }
  };

  return (
    // PERBAIKAN LAYOUT:
    // Hapus 'h-[calc...]' dan 'overflow-hidden'. Gunakan flex-col biasa.
    // Ini membuat Header menjadi bagian dari aliran halaman (bisa di-scroll).
    <div className="flex flex-col w-full min-h-screen">
      
      {/* SECTION 1: HEADER INFO (Akan ikut ter-scroll ke atas dan hilang) */}
      <div className="bg-[#1b2636] text-white p-6 md:p-8 shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <Link href="/my-class" className="hover:text-white transition-colors">My Courses</Link>
          <span className="text-teal-accent ml-2 text-xs bg-teal-accent/10 px-2 py-0.5 rounded border border-teal-accent/20">Active</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-48 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={foundCourse.thumbnail} className="w-full aspect-video object-cover rounded-lg shadow-lg border border-white/10" alt="Thumbnail" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2 leading-tight">{foundCourse.title}</h1>
            <p className="text-slate-300 text-sm mb-4 line-clamp-2">{foundCourse.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>
                <span className="font-bold text-white">{foundCourse.instructor}</span>
              </div>
              <div className="h-4 w-px bg-white/20"></div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Progress:</span>
                <span className="text-teal-accent font-bold">{foundCourse.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: STICKY TABS (Akan menempel di top saat di-scroll) */}
      {/* Gunakan top-0 dan z-30 agar menempel di bawah Navbar AppShell */}
      <div className="sticky top-0 z-30 bg-white dark:bg-[#1b2636] border-b border-slate-200 dark:border-slate-700 shadow-sm px-6 md:px-8">
        <div className="flex items-center gap-8">
          {['overview', 'preparation', 'classroom'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 capitalize ${
                activeTab === tab 
                ? 'text-primary dark:text-teal-accent border-primary dark:border-teal-accent' 
                : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {tab === 'overview' ? 'info' : tab === 'preparation' ? 'article' : 'play_circle'}
              </span>
              <span className="hidden sm:inline">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3: CONTENT BODY (Mengalir di bawah tabs) */}
      {/* Hapus overflow-y-auto disini karena scroll ikut body utama */}
      <div className="flex-1 bg-background-light dark:bg-[#0f111a]">
        <div className="p-6 md:p-8 w-full max-w-7xl mx-auto min-h-full">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-xl font-bold mb-4 dark:text-white">About this Class</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{foundCourse.tabs.overview.about}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-slate-800 p-5 rounded-2xl border border-blue-100 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase">Tools Needed</h4>
                  <ul className="space-y-2">
                    {foundCourse.tabs.overview.tools.map((tool, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined text-[16px] text-blue-500">check_circle</span>
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PREPARATION */}
          {activeTab === 'preparation' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
              
              {foundCourse.tabs.preparation.slides_id && (
                <div 
                  onClick={() => setShowSlideModal(true)}
                  className="bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 pr-6 hover:border-orange-300 transition-colors group cursor-pointer"
                >
                  <div className="size-16 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 border border-orange-100 dark:border-orange-800/50">
                    <span className="material-symbols-outlined text-3xl">slideshow</span>
                  </div>
                  <div className="flex-1 py-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-primary transition-colors">Lecture Slides</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Google Slides • View Only</p>
                  </div>
                  <button className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg text-xs font-bold group-hover:bg-primary group-hover:text-white transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">open_in_full</span> Preview
                  </button>
                </div>
              )}

              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative group">
                <button 
                  onClick={() => setIsEditing(true)} 
                  className={`absolute top-6 right-6 bg-slate-100 dark:bg-slate-700 hover:bg-primary hover:text-white text-slate-500 p-2 rounded-lg flex items-center gap-2 text-xs font-bold shadow-sm z-10 transition-all ${isEditing ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  <span className="material-symbols-outlined text-[16px]">edit_note</span> Edit Content
                </button>

                {!isEditing ? (
                  <article className="prose prose-slate dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: articleContent }} />
                  </article>
                ) : (
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Editing Guide</h3>
                    <Editor
                      apiKey='no-api-key'
                      value={articleContent}
                      init={{
                        height: 500,
                        menubar: false,
                        plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                        toolbar: 'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                        content_style: 'body { font-family:Manrope,sans-serif; font-size:16px }'
                      }}
                      onEditorChange={(newContent) => setArticleContent(newContent)}
                    />
                    <div className="flex items-center gap-3 mt-4 justify-end">
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
                      <button onClick={() => { setIsEditing(false); alert('Saved!'); }} className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-lg">Save Changes</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CLASSROOM */}
          {activeTab === 'classroom' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              <div className="lg:col-span-8">
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border border-slate-800">
                  {currentVideo ? (
                    currentVideo.type === 'youtube' ? (
                      <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${currentVideo.url}?autoplay=1&rel=0`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    ) : (
                      <iframe className="w-full h-full" src={`https://drive.google.com/file/d/${currentVideo.url}/preview`} frameBorder="0" allowFullScreen></iframe>
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">movie</span>
                      <p>No video selected.</p>
                    </div>
                  )}
                </div>
                {currentVideo && (
                  <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide text-white ${currentVideo.type === 'youtube' ? 'bg-red-600' : 'bg-blue-600'}`}>
                        {currentVideo.type === 'youtube' ? 'YouTube' : 'Drive'}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold dark:text-white">{currentVideo.title}</h2>
                  </div>
                )}
              </div>

              {/* Playlist - Perhatikan h-[600px] agar list tetap bisa discroll meski halaman utama discroll */}
              <div className="lg:col-span-4 flex flex-col h-[600px] lg:h-auto">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Select Batch</label>
                    <select 
                      value={activeBatch} 
                      onChange={(e) => handleBatchChange(e.target.value)}
                      className="w-full bg-white dark:bg-[#0f111a] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
                    >
                      {foundCurriculum?.batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>{batch.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
                    {currentModules.map((module, idx) => (
                      <div key={idx}>
                        <div className="px-2 mb-2 flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary"></span>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{module.title}</h4>
                        </div>
                        <div className="space-y-1">
                          {module.videos.map((video) => (
                            <button 
                              key={video.id}
                              onClick={() => setCurrentVideo(video)}
                              className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all group ${
                                currentVideo?.id === video.id 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700 border-transparent text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className={`mt-0.5 size-7 rounded flex items-center justify-center shrink-0 ${
                                currentVideo?.id === video.id ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-600'
                              }`}>
                                <span className="material-symbols-outlined text-[16px]">
                                  {currentVideo?.id === video.id ? 'equalizer' : 'play_arrow'}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold leading-tight mb-1.5">{video.title}</p>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-mono">{video.duration}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL SLIDES (FIXED OVERLAY) */}
      {showSlideModal && foundCourse.tabs.preparation.slides_id && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500">slideshow</span> Presentation Preview
              </h3>
              <button onClick={() => setShowSlideModal(false)} className="size-8 rounded-full bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-black relative">
              <iframe 
                src={`https://docs.google.com/presentation/d/${foundCourse.tabs.preparation.slides_id}/embed?start=false&loop=false&delayms=3000`} 
                frameBorder="0" width="100%" height="100%" allowFullScreen 
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}