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

try {
    require_once '../includes/functions.php';
    require_once '../config/db.php';

    // Check if featured parameter is set
    $featured = isset($_GET['featured']) && $_GET['featured'] == '1';

    // Fetch books
    if ($featured) {
        $stmt = $pdo->query("SELECT * FROM books WHERE is_featured = 1 ORDER BY publishedYear DESC");
    } else {
        $stmt = $pdo->query("SELECT * FROM books ORDER BY publishedYear DESC");
    }

    $books = $stmt->fetchAll();

    // Return books as JSON
    jsonResponse($books);

} catch (Exception $e) {
    errorResponse('Failed to fetch books: ' . $e->getMessage(), 500);
}
?>