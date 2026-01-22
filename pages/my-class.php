<?php
// Load Data Course
$jsonFile = '../data/courses.json';
$courses = json_decode(file_get_contents($jsonFile), true);
?>

<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>My Classes - Inovasia</title>
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
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
        [x-cloak] { display: none !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
    </style>
</head>
<body class="bg-background-light dark:bg-black font-display text-slate-900 dark:text-white h-screen flex flex-col overflow-hidden">
    
    <!-- Navbar -->
    <?php include '../components/navbar.php'; ?>

    <!-- Wrapper -->
    <div class="flex pt-16 h-full">
        
        <!-- Sidebar -->
        <?php include '../components/sidebar.php'; ?>

        <!-- Main Content Area -->
        <main class="flex-1 lg:ml-72 flex flex-col h-full relative"
              x-data="{ 
                  search: '', 
                  filter: 'All',
                  courses: <?php echo htmlspecialchars(json_encode($courses)); ?>,
                  get filteredCourses() {
                      return this.courses.filter(course => {
                          const matchesSearch = course.title.toLowerCase().includes(this.search.toLowerCase()) || 
                                              course.instructor.toLowerCase().includes(this.search.toLowerCase());
                          let category = 'All';
                          if(course.slug.includes('ngoding')) category = 'AI';
                          if(course.slug.includes('esp32')) category = 'IoT';
                          if(course.slug.includes('n8n')) category = 'Automation';
                          const matchesFilter = this.filter === 'All' || category === this.filter;
                          return matchesSearch && matchesFilter;
                      });
                  }
              }">
            
            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
                
                <!-- Page Header -->
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">My Learning</h1>
                        <p class="text-slate-500 dark:text-slate-400">Manage your courses and track your progress.</p>
                    </div>
                    <div class="relative w-full md:w-72">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input x-model="search" type="text" placeholder="Search course..." class="pl-10 pr-4 py-3 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-primary shadow-sm">
                    </div>
                </div>

                <!-- Filter Tabs -->
                <div class="flex flex-wrap items-center gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
                    <button @click="filter = 'All'" :class="filter === 'All' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'" class="px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border border-transparent hover:border-slate-200">All Courses</button>
                    <button @click="filter = 'AI'" :class="filter === 'AI' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'" class="px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border border-transparent hover:border-slate-200">Artificial Intelligence</button>
                    <button @click="filter = 'IoT'" :class="filter === 'IoT' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'" class="px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border border-transparent hover:border-slate-200">IoT & Hardware</button>
                    <button @click="filter = 'Automation'" :class="filter === 'Automation' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'" class="px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border border-transparent hover:border-slate-200">Automation</button>
                </div>

                <!-- Course Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <template x-for="course in filteredCourses" :key="course.slug">
                        <a :href="'course-detail.php?id=' + course.slug" class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full">
                            <div class="aspect-video w-full bg-cover bg-center relative" :style="'background-image: url(' + course.thumbnail + ')'">
                                <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                <div class="absolute top-3 left-3">
                                     <span x-show="course.progress > 0 && course.progress < 100" class="bg-white/90 backdrop-blur text-primary text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">schedule</span> In Progress</span>
                                    <span x-show="course.progress === 100" class="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">check_circle</span> Completed</span>
                                    <span x-show="course.progress === 0" class="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">lock_open</span> Not Started</span>
                                </div>
                            </div>
                            <div class="p-5 flex flex-col flex-1">
                                <h3 class="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors mb-2" x-text="course.title"></h3>
                                <div class="flex items-center gap-2 mb-4">
                                    <div class="size-6 rounded-full bg-slate-200 flex items-center justify-center"><span class="material-symbols-outlined text-[14px] text-slate-500">person</span></div>
                                    <p class="text-xs font-semibold text-slate-500" x-text="course.instructor"></p>
                                </div>
                                <div class="mt-auto space-y-3">
                                    <div>
                                        <div class="flex justify-between text-xs font-semibold mb-1.5"><span class="text-slate-500">Progress</span><span class="text-slate-900 dark:text-white" x-text="course.progress + '%'"></span></div>
                                        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"><div class="bg-primary h-1.5 rounded-full" :style="'width: ' + course.progress + '%'"></div></div>
                                    </div>
                                    <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                        <span class="text-xs text-slate-400 font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">video_library</span> Modules</span>
                                        <span class="text-primary text-sm font-bold group-hover:underline">Continue</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </template>
                </div>
                
                 <!-- Empty State -->
                <div x-show="filteredCourses.length === 0" x-cloak class="flex flex-col items-center justify-center py-20 text-center">
                    <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-full mb-4"><span class="material-symbols-outlined text-4xl text-slate-400">search_off</span></div>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No courses found</h3>
                    <p class="text-slate-500 max-w-md mx-auto">We couldn't find any courses matching "<span x-text="search" class="font-bold"></span>".</p>
                    <button @click="search = ''; filter = 'All'" class="mt-6 text-primary font-bold hover:underline">Clear Filters</button>
                </div>

            </div>

            <!-- Footer -->
            <?php include '../components/footer.php'; ?>

        </main>
    </div>
</body>
</html>