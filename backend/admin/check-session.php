<?php
require_once '../config/cors.php';

// CORS headers
header('Access-Control-Allow-Origin: ' . getCorsOrigin());
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start([
    'cookie_samesite' => 'Lax',
    'cookie_secure' => false, // Set to true in production with HTTPS
    'cookie_httponly' => true,
]);
header('Content-Type: application/json');

if (isset($_SESSION['admin_id'])) {
    echo json_encode([
        'logged_in' => true,
        'name' => $_SESSION['admin_name'],
        'role' => $_SESSION['admin_role']
    ]);
} else {
    echo json_encode(['logged_in' => false]);
}
?>