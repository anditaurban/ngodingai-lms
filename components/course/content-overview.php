<div x-show="activeTab === 'overview'" x-cloak class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
    <div class="md:col-span-2 space-y-6">
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 class="text-xl font-bold mb-4 dark:text-white">About this Class</h3>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <?php echo $currentCourse['tabs']['overview']['about']; ?>
            </p>
        </div>
        
        <!-- Informasi Tambahan -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 class="text-xl font-bold mb-4 dark:text-white">Curriculum Insight</h3>
             <p class="text-slate-600 dark:text-slate-300">
                This course is designed with <?php echo count($courseCurriculum['batches'] ?? []); ?> active batches. 
                Ensure you select the correct batch in the Classroom tab to view your specific recording sessions.
             </p>
        </div>
    </div>
    
    <div class="space-y-6">
        <div class="bg-blue-50 dark:bg-slate-800 p-5 rounded-2xl border border-blue-100 dark:border-slate-700">
            <h4 class="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase">Tools Needed</h4>
            <ul class="space-y-2">
                <?php foreach ($currentCourse['tabs']['overview']['tools'] as $tool): ?>
                    <li class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span class="material-symbols-outlined text-[16px] text-blue-500">check_circle</span>
                        <?php echo $tool; ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</div>