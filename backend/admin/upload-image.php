<?php
header('Content-Type: application/json');

// Include CORS configuration
require_once '../config/cors.php';

// Set CORS headers with proper origin
$origin = getCorsOrigin();
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include database configuration
require_once '../config/db.php';

// Check if user is logged in
session_start();
if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No image file provided']);
    exit;
}

$file = $_FILES['image'];

// Determine upload folder based on request parameter
$folder = isset($_POST['folder']) ? $_POST['folder'] : 'blog';

// Validate folder to prevent directory traversal
$allowedFolders = ['blog', 'books', 'news'];
if (!in_array($folder, $allowedFolders)) {
    $folder = 'blog'; // Default to blog if invalid
}

$uploadDir = dirname(__DIR__, 2) . '/uploads/' . $folder . '/';

// Create upload directory if it doesn't exist
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create upload directory']);
        exit;
    }
}

// Validate file type
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.']);
    exit;
}

// Validate file size (max 10MB)
$maxSize = 10 * 1024 * 1024; // 10MB
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'File too large. Maximum size is 10MB.']);
    exit;
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('blog_', true) . '.' . $extension;
$filepath = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    // Verify the file was actually created
    if (file_exists($filepath)) {
        // Return the full URL for the image
        $imageUrl = $uploadBaseUrl . '/uploads/' . $folder . '/' . $filename;
        echo json_encode([
            'success' => true,
            'message' => 'Image uploaded successfully',
            'imageUrl' => $imageUrl,
            'filename' => $filename
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'File upload reported success but file not found']);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to upload image']);
}
?>