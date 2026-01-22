<div x-show="activeTab === 'certificates'" x-cloak class="animate-fade-in">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <?php foreach($user['certificates'] as $cert): ?>
        <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-4 items-center">
            <img src="<?php echo $cert['image']; ?>" class="w-24 h-16 object-cover rounded border border-slate-200 shadow-sm">
            <div>
                <h4 class="font-bold text-slate-900 dark:text-white text-sm"><?php echo $cert['title']; ?></h4>
                <p class="text-xs text-slate-500 mb-2">Issued: <?php echo $cert['date']; ?></p>
                <button class="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">download</span> Download
                </button>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</div>