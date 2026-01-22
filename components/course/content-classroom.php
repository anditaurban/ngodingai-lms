<div x-show="activeTab === 'classroom'" x-cloak class="animate-fade-in">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Player Area (Kiri) -->
        <div class="lg:col-span-8">
            <div class="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border border-slate-800">
                <template x-if="currentVideo">
                    <div class="w-full h-full">
                        <!-- 1. YouTube Player -->
                        <template x-if="currentVideo.type === 'youtube'">
                            <iframe class="w-full h-full" 
                                    :src="'https://www.youtube.com/embed/' + currentVideo.url + '?autoplay=1&rel=0'" 
                                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                            </iframe>
                        </template>

                        <!-- 2. Google Drive Player -->
                        <template x-if="currentVideo.type === 'gdrive'">
                            <iframe class="w-full h-full" 
                                    :src="'https://drive.google.com/file/d/' + currentVideo.url + '/preview'" 
                                    frameborder="0" allowfullscreen>
                            </iframe>
                        </template>
                    </div>
                </template>
                
                <!-- Empty State -->
                <template x-if="!currentVideo">
                    <div class="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                        <span class="material-symbols-outlined text-4xl mb-2 opacity-50">movie</span>
                        <p>No video selected.</p>
                    </div>
                </template>
            </div>
            
            <div class="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <template x-if="currentVideo">
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide text-white"
                                  :class="currentVideo.type === 'youtube' ? 'bg-red-600' : 'bg-blue-600'"
                                  x-text="currentVideo.type === 'youtube' ? 'YouTube' : 'Google Drive'">
                            </span>
                             <span class="text-xs text-slate-500 font-mono" x-text="'ID: ' + currentVideo.id"></span>
                        </div>
                        <h2 class="text-xl font-bold dark:text-white" x-text="currentVideo.title"></h2>
                    </div>
                </template>
                 <template x-if="!currentVideo">
                    <div class="text-slate-500 italic">Select a video from the curriculum list.</div>
                </template>
            </div>
        </div>

        <!-- Playlist Sidebar (Kanan) -->
        <div class="lg:col-span-4 flex flex-col h-[600px] lg:h-auto">
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
                
                <!-- BATCH SELECTOR -->
                <div class="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">history</span> Select Batch
                    </label>
                    <div class="relative">
                        <select x-model="activeBatch" @change="changeBatch()" 
                                class="w-full bg-white dark:bg-[#0f111a] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8 appearance-none font-semibold">
                            <?php if($courseCurriculum): ?>
                                <?php foreach ($courseCurriculum['batches'] as $batch): ?>
                                    <option value="<?php echo $batch['id']; ?>"><?php echo $batch['name']; ?></option>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <option>No Batches Available</option>
                            <?php endif; ?>
                        </select>
                        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                             <span class="material-symbols-outlined">expand_more</span>
                        </div>
                    </div>
                </div>
                
                <!-- Video List -->
                <div class="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
                    <template x-for="(module, index) in currentModules" :key="index">
                        <div>
                            <div class="px-2 mb-2 flex items-center gap-2">
                                <span class="size-1.5 rounded-full bg-primary"></span>
                                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider" x-text="module.title"></h4>
                            </div>
                            <div class="space-y-1">
                                <template x-for="video in module.videos" :key="video.id">
                                    <button @click="playVideo(video)"
                                            :class="currentVideo && currentVideo.id === video.id 
                                                ? 'bg-primary/10 border-primary text-primary' 
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-700 border-transparent text-slate-700 dark:text-slate-300'"
                                            class="w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all group">
                                        
                                        <div class="mt-0.5 size-7 rounded flex items-center justify-center shrink-0 transition-colors"
                                             :class="currentVideo && currentVideo.id === video.id ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-slate-200 dark:bg-slate-600 text-slate-500'">
                                            <span class="material-symbols-outlined text-[16px]" x-text="currentVideo && currentVideo.id === video.id ? 'equalizer' : 'play_arrow'"></span>
                                        </div>
                                        
                                        <div class="min-w-0">
                                            <p class="text-sm font-semibold leading-tight mb-1.5" x-text="video.title"></p>
                                            <div class="flex items-center gap-2">
                                                <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-mono" x-text="video.duration"></span>
                                                <span class="material-symbols-outlined text-[14px] text-slate-400" x-text="video.type === 'gdrive' ? 'add_to_drive' : 'smart_display'" title="Source"></span>
                                            </div>
                                        </div>
                                    </button>
                                </template>
                            </div>
                        </div>
                    </template>
                    
                    <div x-show="currentModules.length === 0" class="p-8 text-center text-slate-500 flex flex-col items-center">
                        <span class="material-symbols-outlined text-4xl mb-2 opacity-30">folder_off</span>
                        <p class="text-sm">No recordings found for this batch.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>