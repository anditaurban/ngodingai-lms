<?php
// 1. Logic PHP: Load Data (TETAP UTUH)
$slug = $_GET['id'] ?? '';

$jsonFileCourses = '../data/courses.json';
$courses = json_decode(file_get_contents($jsonFileCourses), true);

$jsonFileCurriculum = '../data/curriculum.json';
$curriculumData = json_decode(file_get_contents($jsonFileCurriculum), true);

// Cari course berdasarkan slug
$currentCourse = null;
foreach ($courses as $course) {
    if ($course['slug'] === $slug) {
        $currentCourse = $course;
        break;
    }
}

if (!$currentCourse) {
    header("Location: dashboard.php");
    exit;
}

// Ambil data kurikulum & batch
$courseCurriculum = $curriculumData[$slug] ?? null;
// Default batch = Batch pertama di array
$defaultBatchId = $courseCurriculum['batches'][0]['id'] ?? '';
?>

<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title><?php echo $currentCourse['title']; ?> - Inovasia</title>
    
    <!-- External Libs -->
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <script>
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: { "primary": "#4040d4", "background-light": "#f3f4f6", "background-dark": "#0f111a", "teal-accent": "#00BCD4" },
            fontFamily: { "display": ["Manrope", "sans-serif"] },
          },
        },
      }
    </script>
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        [x-cloak] { display: none !important; }
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; } 
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="bg-background-light dark:bg-black font-display text-slate-900 dark:text-white h-screen flex flex-col overflow-hidden">
    
    <!-- 1. Navbar Fixed Top -->
    <?php include '../components/navbar.php'; ?>

    <!-- 2. Main Wrapper -->
    <div class="flex pt-16 h-full">
        
        <!-- Sidebar Fixed Left (Full Height) -->
        <?php include '../components/sidebar.php'; ?>

        <!-- 3. Main Content Area (Layout Baru) -->
        <main class="flex-1 lg:ml-72 flex flex-col h-full relative"
              x-data="{ 
                  activeTab: 'overview',
                  
                  // Data Kurikulum untuk JS
                  curriculumData: <?php echo htmlspecialchars(json_encode($courseCurriculum['content'] ?? [])); ?>,
                  activeBatch: '<?php echo $defaultBatchId; ?>',
                  currentVideo: null,

                  init() {
                      this.loadFirstVideo();
                  },

                  get currentModules() {
                      return this.curriculumData[this.activeBatch] || [];
                  },

                  loadFirstVideo() {
                      const modules = this.currentModules;
                      if(modules.length > 0 && modules[0].videos.length > 0) {
                          this.currentVideo = modules[0].videos[0];
                      } else {
                          this.currentVideo = null;
                      }
                  },

                  changeBatch() {
                      this.loadFirstVideo();
                  },

                  playVideo(videoObj) {
                      this.currentVideo = videoObj;
                      this.activeTab = 'classroom';
                      // Scroll logic handled by container now
                      const contentArea = document.getElementById('content-area');
                      if(contentArea) contentArea.scrollIntoView({behavior: 'smooth'});
                  }
              }">
            
            <!-- Scrollable Content Container -->
            <div class="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                
                <!-- Mobile Toggle (Hanya muncul di mobile) -->
                <div class="lg:hidden flex items-center justify-between p-4 bg-[#1b2636] text-white shrink-0">
                    <div class="flex items-center gap-2"><span class="material-symbols-outlined text-teal-accent">token</span><span class="font-bold">Inovasia</span></div>
                    <button class="text-white"><span class="material-symbols-outlined">menu</span></button>
                </div>

                <!-- Course Header (Komponen) -->
                <?php include '../components/course/header.php'; ?>

                <!-- Tabs Navigation (Komponen - Sticky Top works here inside scrollable div) -->
                <?php include '../components/course/tabs.php'; ?>

                <!-- Content Area Wrapper -->
                <div id="content-area" class="p-6 md:p-8 w-full max-w-7xl mx-auto min-h-screen">
                    <!-- Include Content per Tab (LOGIC TETAP ADA) -->
                    <?php include '../components/course/content-overview.php'; ?>
                    <?php include '../components/course/content-preparation.php'; ?>
                    <?php include '../components/course/content-classroom.php'; ?>
                </div>

            </div>

            <!-- Footer Fixed Bottom (Inside Main) -->
            <?php include '../components/footer.php'; ?>

        </main>
    </div>

</body>
</html>