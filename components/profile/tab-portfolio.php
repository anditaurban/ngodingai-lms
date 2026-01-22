<div x-show="activeTab === 'portfolio'" x-cloak class="animate-fade-in">
    <div class="flex justify-between items-center mb-6">
        <h3 class="font-bold text-lg text-slate-900 dark:text-white">My Projects</h3>
        <button onclick="alert('Open Upload Modal Simulation')" class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span class="material-symbols-outlined text-[16px]">add</span>
            Upload Project
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <?php foreach($user['projects'] as $project): ?>
        <div class="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div class="h-40 bg-gray-200 bg-cover bg-center" style="background-image: url('<?php echo $project['image']; ?>')"></div>
            <div class="p-5">
                <span class="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded"><?php echo $project['category']; ?></span>
                <h4 class="font-bold text-lg mt-2 text-slate-900 dark:text-white"><?php echo $project['title']; ?></h4>
                <p class="text-sm text-slate-500 mt-1"><?php echo $project['description']; ?></p>
                <div class="mt-4 flex gap-2">
                    <button class="text-xs font-bold text-slate-500 hover:text-primary">Edit</button>
                    <button class="text-xs font-bold text-red-500 hover:text-red-700">Delete</button>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
        
        <!-- Empty Slot Style -->
        <button onclick="alert('Open Upload Modal')" class="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center h-full min-h-[200px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
            <div class="size-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-slate-400">cloud_upload</span>
            </div>
            <span class="text-sm font-bold text-slate-500">Upload New Project</span>
        </button>
    </div>
</div>