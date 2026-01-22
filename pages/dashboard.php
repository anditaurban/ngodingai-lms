<?php
session_start();
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Dashboard - Inovasia Digital Academy</title>
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script>
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: { "primary": "#4040d4", "background-light": "#f3f4f6", "background-dark": "#0f111a", "teal-accent": "#00BCD4" },
            fontFamily: { "display": ["Manrope", "sans-serif"] },
          },
        },
      }
    </script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
    </style>
</head>
<body class="bg-background-light dark:bg-black font-display text-slate-900 dark:text-white h-screen flex flex-col overflow-hidden">
    
    <!-- 1. Navbar Fixed Top -->
    <?php include '../components/navbar.php'; ?>

    <!-- 2. Main Wrapper (Di bawah Navbar) -->
    <div class="flex pt-16 h-full">
        
        <!-- Sidebar Fixed Left -->
        <?php include '../components/sidebar.php'; ?>

        <!-- 3. Content Area Wrapper (Sebelah Sidebar) -->
        <!-- flex-col h-full agar footer bisa didorong ke bawah -->
        <main class="flex-1 lg:ml-72 flex flex-col h-full relative">
            
            <!-- Scrollable Content (Tengah) -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6">
                
                <!-- Welcome Header -->
                <div class="flex justify-between items-end mb-6">
                    <div>
                        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Dashboard Overview</h1>
                        <p class="text-slate-500 dark:text-slate-400 text-sm">Welcome back, Alex! You have <span class="text-primary font-bold">2 assignments</span> pending.</p>
                    </div>
                </div>

                <!-- BENTO GRID -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                    
                    <!-- LEFT COLUMN (Main Activity) - Span 8 -->
                    <div class="lg:col-span-8 flex flex-col gap-6">
                        <!-- Stats Row -->
                        <div class="grid grid-cols-3 gap-4">
                            <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                                <div class="size-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"><span class="material-symbols-outlined">schedule</span></div>
                                <div><p class="text-xs text-slate-500 font-bold uppercase">Study Time</p><p class="text-xl font-extrabold">12.5h</p></div>
                            </div>
                            <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                                <div class="size-10 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400"><span class="material-symbols-outlined">school</span></div>
                                <div><p class="text-xs text-slate-500 font-bold uppercase">Courses</p><p class="text-xl font-extrabold">3 Active</p></div>
                            </div>
                            <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                                <div class="size-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400"><span class="material-symbols-outlined">emoji_events</span></div>
                                <div><p class="text-xs text-slate-500 font-bold uppercase">Points</p><p class="text-xl font-extrabold">1,450</p></div>
                            </div>
                        </div>

                        <!-- Hero Course -->
                        <div class="bg-white dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row h-full">
                            <div class="w-full md:w-5/12 bg-gray-200 rounded-xl bg-cover bg-center min-h-[200px]" style="background-image: url('https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop')"></div>
                            <div class="p-6 flex flex-col justify-center flex-1">
                                <div class="flex items-center gap-2 mb-2"><span class="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Continue Learning</span></div>
                                <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">NgodingAI: GenAI Masterclass</h3>
                                <p class="text-slate-500 text-sm mb-4 line-clamp-2">Module 3: Neural Networks & Deep Learning Architectures.</p>
                                <div class="mt-auto">
                                    <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-400">Progress (40%)</span><span class="text-primary">Module 3/8</span></div>
                                    <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-4"><div class="bg-primary h-2 rounded-full" style="width: 40%"></div></div>
                                    <button onclick="window.location.href='course-detail.php?id=ngodingai'" class="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">Resume Session</button>
                                </div>
                            </div>
                        </div>

                        <!-- Discussion Forum -->
                        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2"><span class="material-symbols-outlined text-primary">forum</span> Recent Discussions</h3>
                                <button class="text-primary text-xs font-bold hover:underline">View Forum</button>
                            </div>
                            <div class="space-y-4">
                                <div class="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                                    <img src="https://ui-avatars.com/api/?name=Sarah+J&background=random" class="size-10 rounded-full">
                                    <div class="flex-1">
                                        <div class="flex justify-between items-start"><h4 class="text-sm font-bold text-slate-900 dark:text-white hover:text-primary cursor-pointer">Error when installing LangChain on M1 Mac</h4><span class="text-[10px] text-slate-400">2h ago</span></div>
                                        <p class="text-xs text-slate-500 mt-1 line-clamp-1">I keep getting 'grpc' build errors when running pip install...</p>
                                        <div class="flex items-center gap-4 mt-2"><span class="text-[10px] font-bold text-slate-400 flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">chat_bubble</span> 5 Replies</span><span class="text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">NgodingAI</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN (Widgets) - Span 4 -->
                    <div class="lg:col-span-4 flex flex-col gap-6">
                        <!-- Upcoming Events -->
                        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                            <h3 class="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-orange-500">event</span> Upcoming Events</h3>
                            <div class="space-y-4">
                                <div class="flex gap-3 items-center group cursor-pointer">
                                    <div class="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg p-2 text-center min-w-[50px]"><span class="block text-xs font-bold uppercase">Dec</span><span class="block text-xl font-extrabold leading-none">21</span></div>
                                    <div><h4 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Live Q&A Session</h4><p class="text-xs text-slate-500">20:00 WIB • Zoom Meeting</p></div>
                                </div>
                                <div class="flex gap-3 items-center group cursor-pointer">
                                    <div class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg p-2 text-center min-w-[50px]"><span class="block text-xs font-bold uppercase">Dec</span><span class="block text-xl font-extrabold leading-none">24</span></div>
                                    <div><h4 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Project Deadline</h4><p class="text-xs text-slate-500">23:59 WIB • NgodingAI</p></div>
                                </div>
                            </div>
                        </div>

                        <!-- Assignments -->
                        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex-1">
                            <h3 class="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-red-500">assignment</span> Assignments</h3>
                            <div class="space-y-3">
                                <div class="p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/50 transition-colors bg-white dark:bg-slate-900/30">
                                    <div class="flex justify-between items-start mb-2"><span class="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">NgodingAI</span><span class="text-[10px] font-bold text-red-500 flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">timer</span> 2 Days</span></div>
                                    <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-1">Create RAG Chatbot</h4>
                                    <div class="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2"><div class="bg-green-500 h-1.5 rounded-full" style="width: 80%"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Fixed Footer (Di bawah konten scrollable) -->
            <?php include '../components/footer.php'; ?>

        </main>
    </div>
</body>
</html>