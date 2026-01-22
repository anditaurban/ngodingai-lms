<!-- Sidebar: Top 16 (64px), Full Height sisa layar -->
<aside class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-[#1b2636] text-white border-r border-slate-800/50 hidden lg:flex flex-col z-20 overflow-y-auto custom-scrollbar shadow-xl">
    
    <div class="flex flex-col gap-2 p-4 pt-6 flex-1">
        <nav class="flex flex-col gap-2">
            <p class="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
            
            <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group <?php echo basename($_SERVER['PHP_SELF']) == 'dashboard.php' ? 'bg-[#182d4e] shadow-lg border border-white/5 text-white' : 'hover:bg-white/5 text-slate-400 hover:text-white'; ?>" href="dashboard.php">
                <span class="material-symbols-outlined <?php echo basename($_SERVER['PHP_SELF']) == 'dashboard.php' ? 'text-teal-400' : 'group-hover:text-teal-400'; ?>">dashboard</span>
                <p class="text-sm font-medium">Dashboard</p>
            </a>

            <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group <?php echo basename($_SERVER['PHP_SELF']) == 'my-class.php' || basename($_SERVER['PHP_SELF']) == 'course-detail.php' ? 'bg-[#182d4e] shadow-lg border border-white/5 text-white' : 'hover:bg-white/5 text-slate-400 hover:text-white'; ?>" href="my-class.php">
                <span class="material-symbols-outlined group-hover:text-teal-400 transition-colors">school</span>
                <p class="text-sm font-medium">My Courses</p>
            </a>
            
            <p class="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Academic</p>

            <a class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white group" href="#">
                <span class="material-symbols-outlined group-hover:text-teal-400 transition-colors">event_upcoming</span>
                <p class="text-sm font-medium">Schedule</p>
            </a>

            <a class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white group" href="#">
                <span class="material-symbols-outlined group-hover:text-teal-400 transition-colors">assignment</span>
                <div class="flex-1 flex justify-between items-center">
                    <p class="text-sm font-medium">Assignments</p>
                    <span class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">2</span>
                </div>
            </a>
             <a class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white group" href="#">
                <span class="material-symbols-outlined group-hover:text-teal-400 transition-colors">group</span>
                <p class="text-sm font-medium">Community</p>
            </a>
        </nav>
    </div>

    <!-- User Profile (Sticky Bottom in Sidebar) -->
    <div class="p-4 border-t border-slate-800 bg-[#151e2c]">
        <a href="profile.php" class="flex items-center gap-3 p-3 rounded-xl border transition-all group <?php echo basename($_SERVER['PHP_SELF']) == 'profile.php' ? 'bg-[#182d4e] border-white/10' : 'bg-white/5 border-white/5 hover:bg-white/10'; ?>">
            <div class="relative">
                <img src="https://ui-avatars.com/api/?name=Alex+Morgan&background=0D8ABC&color=fff" class="size-9 rounded-full border border-slate-600">
                <div class="absolute -bottom-0.5 -right-0.5 bg-teal-400 size-2.5 rounded-full border-2 border-[#1b2636]"></div>
            </div>
            <div class="flex flex-col overflow-hidden">
                <p class="text-white text-sm font-bold truncate">Alex Morgan</p>
                <p class="text-slate-400 text-[10px] uppercase font-bold truncate">Student PRO</p>
            </div>
        </a>
    </div>
</aside>