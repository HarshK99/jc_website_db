<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    require_once '../includes/functions.php';
    require_once '../config/db.php';

    // Fetch all books
    $stmt = $pdo->query("SELECT * FROM books ORDER BY publishedYear DESC");
    $books = $stmt->fetchAll();

    // Return books as JSON
    jsonResponse($books);

} catch (Exception $e) {
    errorResponse('Failed to fetch books: ' . $e->getMessage(), 500);
}
?>