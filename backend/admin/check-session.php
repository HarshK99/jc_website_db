<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

session_start();
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