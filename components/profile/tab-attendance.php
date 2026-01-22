<div x-show="activeTab === 'attendance'" x-cloak class="animate-fade-in space-y-8">
    
    <div class="flex flex-col md:flex-row gap-8 items-center bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        
        <!-- Circular Progress (SVG) -->
        <div class="relative size-32 shrink-0">
            <svg class="size-full" viewBox="0 0 36 36">
                <path class="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4" />
                <path class="text-teal-500" stroke-dasharray="<?php echo $user['stats']['attendance_rate']; ?>, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center flex-col">
                <span class="text-xl font-bold text-slate-900 dark:text-white"><?php echo $user['stats']['attendance_rate']; ?>%</span>
                <span class="text-[10px] uppercase font-bold text-slate-400">Rate</span>
            </div>
        </div>

        <div class="flex-1 grid grid-cols-2 gap-4 w-full">
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                <p class="text-xs font-bold text-green-600 dark:text-green-400 uppercase">Present</p>
                <p class="text-2xl font-bold text-slate-900 dark:text-white"><?php echo $user['stats']['present']; ?> <span class="text-sm font-medium text-slate-400">Sessions</span></p>
            </div>
            <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                <p class="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Absent</p>
                <p class="text-2xl font-bold text-slate-900 dark:text-white"><?php echo $user['stats']['absent']; ?> <span class="text-sm font-medium text-slate-400">Sessions</span></p>
            </div>
        </div>
    </div>

    <!-- Log Table -->
    <div>
        <h3 class="font-bold text-lg mb-4 text-slate-900 dark:text-white">Recent Activity</h3>
        <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <table class="w-full text-sm text-left">
                <thead class="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-bold text-xs">
                    <tr>
                        <th class="px-6 py-3">Date</th>
                        <th class="px-6 py-3">Class</th>
                        <th class="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                    <?php foreach($user['attendance_log'] as $log): ?>
                    <tr>
                        <td class="px-6 py-4 font-medium text-slate-900 dark:text-white"><?php echo date('d M Y', strtotime($log['date'])); ?></td>
                        <td class="px-6 py-4 text-slate-500"><?php echo $log['class']; ?></td>
                        <td class="px-6 py-4">
                            <?php if($log['status'] == 'Present'): ?>
                                <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Present</span>
                            <?php else: ?>
                                <span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Absent</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>