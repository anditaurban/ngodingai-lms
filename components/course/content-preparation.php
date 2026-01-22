<!-- Gunakan CDNJS (Versi Community) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js" referrerpolicy="origin"></script>

<?php
// Ambil ID Slide jika ada
$slideId = $currentCourse['tabs']['preparation']['slides_id'] ?? null;

// Persiapkan data untuk Alpine JS
$alpineData = [
    'isEditing' => false,
    'showSlideModal' => false, // Default HARUS False
    'articleContent' => $currentCourse['tabs']['preparation']['content_html']
];
// Encode JSON dengan aman
$xDataAttribute = htmlspecialchars(json_encode($alpineData), ENT_QUOTES, 'UTF-8');
?>

<div x-show="activeTab === 'preparation'" x-cloak class="animate-fade-in"
     x-data="<?php echo $xDataAttribute; ?>"
     x-init="$watch('isEditing', value => { if(!value) tinymce.remove('#editor-textarea'); })">

    <div class="max-w-5xl mx-auto space-y-8">

        <!-- BAGIAN 1: SLIDE RESOURCE CARD (Hanya Tampil Jika ID Slide Ada) -->
        <?php if($slideId): ?>
        <div>
            <h3 class="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                <span class="material-symbols-outlined text-orange-500 text-[18px]">folder_open</span> Learning Resources
            </h3>
            
            <div class="bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 pr-6 hover:border-orange-300 transition-colors group cursor-pointer"
                 @click="showSlideModal = true">
                
                <!-- Icon Box -->
                <div class="size-16 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 border border-orange-100 dark:border-orange-800/50">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" class="w-8 h-8 opacity-90" alt="Slide Icon">
                </div>

                <!-- Info -->
                <div class="flex-1 py-2">
                    <h4 class="font-bold text-slate-900 dark:text-white text-base group-hover:text-primary transition-colors">Course Presentation Slides</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Google Slides • View Only</p>
                </div>

                <!-- Action Button -->
                <button class="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg text-xs font-bold group-hover:bg-primary group-hover:text-white transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[16px]">open_in_full</span>
                    Preview
                </button>
            </div>
        </div>
        <?php endif; ?>

        <!-- BAGIAN 2: ARTICLE GUIDES -->
        <div>
            <h3 class="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[18px]">article</span> Session Guide
            </h3>

            <div class="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative group">
                
                <!-- BUTTON ADMIN: EDIT (Simulasi) -->
                <button @click="isEditing = true; $nextTick(() => initEditor())" 
                        x-show="!isEditing"
                        class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 dark:bg-slate-700 hover:bg-primary hover:text-white text-slate-500 p-2 rounded-lg flex items-center gap-2 text-xs font-bold shadow-sm z-10"
                        title="Edit Article">
                    <span class="material-symbols-outlined text-[16px]">edit_note</span>
                    <span>Edit Content</span>
                </button>

                <!-- MODE 1: READ ONLY -->
                <article x-show="!isEditing" class="prose prose-slate dark:prose-invert max-w-none">
                    <div class="mt-2" x-html="articleContent"></div>
                </article>

                <!-- MODE 2: EDITING (TinyMCE) -->
                <div x-show="isEditing" style="display: none;">
                    <h3 class="font-bold text-lg mb-4 text-slate-900 dark:text-white">Editing Guide</h3>
                    <textarea id="editor-textarea" x-model="articleContent"></textarea>
                    <div class="flex items-center gap-3 mt-4 justify-end">
                        <button @click="isEditing = false" class="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                        <button @click="saveContent()" class="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center gap-2">
                            <span class="material-symbols-outlined text-[18px]">save</span> Save Changes
                        </button>
                    </div>
                </div>

            </div>
        </div>
        
        <!-- Footer Navigation -->
        <div x-show="!isEditing" class="flex justify-end pt-4">
             <button @click="activeTab = 'classroom'" class="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
                Go to Classroom <span class="material-symbols-outlined">arrow_forward</span>
            </button>
        </div>

    </div>

    <!-- MODAL SLIDES OVERLAY (Hidden by Default) -->
    <!-- style="display: none;" memastikan modal tidak muncul saat loading -->
    <?php if($slideId): ?>
    <div x-show="showSlideModal" 
         style="display: none;" 
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        
        <!-- Modal Content -->
        <div @click.away="showSlideModal = false" 
             class="bg-white dark:bg-slate-900 w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-fade-in">
            
            <!-- Modal Header -->
            <div class="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <h3 class="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-orange-500">slideshow</span>
                    Presentation Preview
                </h3>
                <div class="flex items-center gap-3">
                    <a href="https://docs.google.com/presentation/d/<?php echo $slideId; ?>/edit" target="_blank" class="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                        Open in Google Slides <span class="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                    <button @click="showSlideModal = false" class="size-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-100 text-slate-500 hover:text-red-500 flex items-center justify-center transition-colors">
                        <span class="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
            </div>

            <!-- Iframe Container -->
            <div class="flex-1 bg-slate-100 dark:bg-black relative">
                <iframe src="https://docs.google.com/presentation/d/<?php echo $slideId; ?>/embed?start=false&loop=false&delayms=3000" 
                        frameborder="0" width="100%" height="100%" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"
                        class="absolute inset-0 w-full h-full">
                </iframe>
            </div>
        </div>
    </div>
    <?php endif; ?>

</div>

<script>
    function initEditor() {
        if (tinymce.get('editor-textarea')) tinymce.remove('#editor-textarea');
        tinymce.init({
            selector: '#editor-textarea', height: 500, menubar: false,
            skin: (window.matchMedia("(prefers-color-scheme: dark)").matches ? "oxide-dark" : "oxide"),
            content_css: (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "default"),
            plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'preview', 'code', 'table', 'help', 'wordcount'],
            toolbar: 'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
            content_style: 'body { font-family:Manrope,sans-serif; font-size:16px; }',
            setup: function(editor) {
                editor.on('change keyup', function () {
                    const element = document.querySelector('[x-data]');
                    if(element && element._x_dataStack) element._x_dataStack[0].articleContent = editor.getContent();
                });
            }
        });
    }
    function saveContent() {
        if(tinymce.get('editor-textarea')) {
            const content = tinymce.get('editor-textarea').getContent();
            const element = document.querySelector('[x-data]');
            if(element && element._x_dataStack) {
                    element._x_dataStack[0].articleContent = content;
                    element._x_dataStack[0].isEditing = false;
            }
            tinymce.remove('#editor-textarea');
            alert('Content updated successfully! (Simulation Mode)');
        }
    }
</script>