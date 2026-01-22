<div class="bg-[#1b2636] text-white p-6 md:p-8 relative shrink-0">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
        <a href="dashboard.php" class="hover:text-white transition-colors">Dashboard</a>
        <span class="material-symbols-outlined text-[12px]">chevron_right</span>
        <a href="my-class.php" class="hover:text-white transition-colors">My Courses</a>
        <span class="material-symbols-outlined text-[12px]">chevron_right</span>
        <span class="text-teal-accent ml-2 text-xs bg-teal-accent/10 px-2 py-0.5 rounded border border-teal-accent/20">Active</span>
    </div>

    <div class="flex flex-col md:flex-row gap-6 items-start">
        <!-- Thumbnail -->
        <div class="w-full md:w-48 shrink-0">
            <img src="<?php echo $currentCourse['thumbnail']; ?>" class="w-full aspect-video object-cover rounded-lg shadow-lg border border-white/10" alt="Thumbnail">
        </div>
        
        <!-- Title & Meta -->
        <div class="flex-1">
            <h1 class="text-2xl md:text-3xl font-extrabold mb-2 leading-tight"><?php echo $currentCourse['title']; ?></h1>
            <p class="text-slate-300 text-sm mb-4 line-clamp-2">
                <?php echo $currentCourse['description']; ?>
            </p>
            
            <div class="flex items-center gap-4 text-sm">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-slate-400 text-[18px]">person</span>
                    <span class="font-bold text-white"><?php echo $currentCourse['instructor']; ?></span>
                </div>
                <div class="h-4 w-px bg-white/20"></div>
                <div class="flex items-center gap-2">
                    <span class="text-slate-400">Progress:</span>
                    <span class="text-teal-accent font-bold"><?php echo $currentCourse['progress']; ?>%</span>
                </div>
            </div>
        </div>
    </div>
</div>