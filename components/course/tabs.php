<!-- sticky top-0 membuat menu ini nempel di atas saat discroll -->
<div class="sticky top-0 z-40 bg-white dark:bg-[#1b2636] border-b border-slate-200 dark:border-white/10 shadow-sm px-6 md:px-8">
    <div class="flex items-center gap-8">
        <button @click="activeTab = 'overview'" 
                :class="activeTab === 'overview' ? 'text-primary dark:text-teal-accent border-primary dark:border-teal-accent' : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-white'"
                class="py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">info</span> 
            <span class="hidden sm:inline">Overview</span>
        </button>
        <button @click="activeTab = 'preparation'"
                :class="activeTab === 'preparation' ? 'text-primary dark:text-teal-accent border-primary dark:border-teal-accent' : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-white'" 
                class="py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">article</span> 
            <span class="hidden sm:inline">Preparation</span>
        </button>
        <button @click="activeTab = 'classroom'"
                :class="activeTab === 'classroom' ? 'text-primary dark:text-teal-accent border-primary dark:border-teal-accent' : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-white'"
                class="py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">play_circle</span> 
            <span class="hidden sm:inline">Classroom</span>
        </button>
    </div>
</div>