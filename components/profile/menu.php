<nav class="flex flex-col gap-1">
    <button @click="activeTab = 'general'"
            :class="activeTab === 'general' ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 border-transparent'"
            class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-left transition-all">
        <span class="material-symbols-outlined text-[20px]">person</span>
        General Info
    </button>
    
    <button @click="activeTab = 'attendance'"
            :class="activeTab === 'attendance' ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 border-transparent'"
            class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-left transition-all">
        <span class="material-symbols-outlined text-[20px]">calendar_month</span>
        Attendance
    </button>

    <button @click="activeTab = 'portfolio'"
            :class="activeTab === 'portfolio' ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 border-transparent'"
            class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-left transition-all">
        <span class="material-symbols-outlined text-[20px]">folder_open</span>
        Portfolio
    </button>

    <button @click="activeTab = 'certificates'"
            :class="activeTab === 'certificates' ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 border-transparent'"
            class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-left transition-all">
        <span class="material-symbols-outlined text-[20px]">verified</span>
        Certificates
    </button>

    <div class="h-px bg-slate-200 dark:bg-slate-700 my-2 mx-4"></div>

    <a href="../functions/logout.php" 
       class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-l-4 border-transparent transition-all text-left">
        <span class="material-symbols-outlined text-[20px]">logout</span>
        Sign Out
    </a>
</nav>