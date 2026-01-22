<?php
// Load Data Profile (TETAP UTUH)
$jsonFile = '../data/user_profile.json';
$user = json_decode(file_get_contents($jsonFile), true);
?>

<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Profile & Settings - Inovasia</title>
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <!-- Tailwind & Alpine -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <script>
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: { "primary": "#4040d4", "primary-dark": "#3030b0", "background-light": "#f3f4f6", "background-dark": "#0f111a", "teal-accent": "#00BCD4" },
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

        <!-- 3. Main Content Area -->
        <main class="flex-1 lg:ml-72 flex flex-col h-full relative"
              x-data="{ activeTab: 'general' }">
            
            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
                
                <h1 class="text-3xl font-extrabold mb-8">Account Settings</h1>

                <div class="flex flex-col md:flex-row gap-8 items-start">
                    
                    <!-- Internal Profile Sidebar (Menu Kiri) -->
                    <!-- sticky top-0 agar nempel saat konten kanan discroll -->
                    <aside class="w-full md:w-64 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm shrink-0 md:sticky md:top-0">
                        <?php include '../components/profile/menu.php'; ?>
                    </aside>

                    <!-- Tab Content Area (Kanan) -->
                    <!-- Load semua komponen logic yang sudah dibuat sebelumnya -->
                    <div class="flex-1 w-full min-h-[500px]">
                        <?php include '../components/profile/tab-general.php'; ?>
                        <?php include '../components/profile/tab-attendance.php'; ?>
                        <?php include '../components/profile/tab-portfolio.php'; ?>
                        <?php include '../components/profile/tab-certificates.php'; ?>
                    </div>

                </div>

            </div>

            <!-- Footer Fixed Bottom (Inside Main) -->
            <?php include '../components/footer.php'; ?>

        </main>
    </div>
</body>
</html>