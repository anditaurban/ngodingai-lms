<?php
session_start();

// Set header agar output berupa JSON
header('Content-Type: application/json');

// Lokasi file JSON
$jsonFile = '../data/users.json';

// Baca Request dari Frontend (JSON Body)
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['action'])) {
    echo json_encode(['status' => 'error', 'message' => 'No action provided']);
    exit;
}

$users = json_decode(file_get_contents($jsonFile), true);

// ---------------------------------------------------------
// ACTION 1: CEK NOMOR TELEPON
// ---------------------------------------------------------
if ($input['action'] === 'check_phone') {
    $phone = $input['phone'] ?? '';
    
    // Bersihkan nomor (hanya ambil angka)
    $phone = preg_replace('/[^0-9]/', '', $phone);

    // Cari apakah nomor ada di database
    $userFound = false;
    foreach ($users as $user) {
        if ($user['phone'] === $phone) {
            $userFound = true;
            break;
        }
    }

    if ($userFound) {
        echo json_encode(['status' => 'success', 'message' => 'OTP Sent']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Nomor tidak terdaftar!']);
    }
    exit;
}

// ---------------------------------------------------------
// ACTION 2: VERIFIKASI OTP & LOGIN
// ---------------------------------------------------------
if ($input['action'] === 'login') {
    $phone = $input['phone'] ?? '';
    $otpInput = $input['otp'] ?? '';
    
    $phone = preg_replace('/[^0-9]/', '', $phone);

    foreach ($users as $user) {
        // Cek kecocokan Nomor HP DAN Kode OTP
        if ($user['phone'] === $phone && $user['otp'] === $otpInput) {
            
            // Login Sukses: Simpan data ke Session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['logged_in'] = true;

            echo json_encode(['status' => 'success', 'redirect' => 'dashboard.php']);
            exit;
        }
    }

    echo json_encode(['status' => 'error', 'message' => 'Kode OTP salah!']);
    exit;
}
?>