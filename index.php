<?php
// Mulai sesi untuk mengecek status login
session_start();

// Cek apakah user sudah memiliki sesi login yang valid
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    // Jika user sudah login, jangan suruh login lagi, langsung ke Dashboard
    header("Location: pages/dashboard.php");
    exit;
} else {
    // Jika belum login (atau sesi habis), arahkan ke Halaman Login
    header("Location: pages/login.php");
    exit;
}
?>