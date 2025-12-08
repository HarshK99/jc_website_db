<?php

require_once '../config/cors.php';

// CORS headers
header('Access-Control-Allow-Origin: ' . getCorsOrigin());
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start([
    'cookie_samesite' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'None' : 'Lax',
    'cookie_secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
    'cookie_httponly' => true,
]);

// Destroy the session
session_destroy();

// Clear the session cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/', '', false, true);
}

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>