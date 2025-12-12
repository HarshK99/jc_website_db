<?php
require_once '../config/cors.php';
header('Access-Control-Allow-Origin: ' . getCorsOrigin());
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../includes/functions.php';
require_once '../config/db.php';

$query = isset($_GET['q']) ? $_GET['q'] : '';

try {
    if ($query) {
        // Search for tags matching the query
        $stmt = $pdo->prepare("SELECT name FROM tags WHERE name LIKE ? ORDER BY name LIMIT 10");
        $stmt->execute(["%$query%"]);
    } else {
        // Get all tags for general autocomplete
        $stmt = $pdo->prepare("SELECT name FROM tags ORDER BY name");
    }

    $tags = $stmt->fetchAll(PDO::FETCH_COLUMN);
    jsonResponse($tags);
} catch (Exception $e) {
    errorResponse('Failed to fetch tags: ' . $e->getMessage(), 500);
}
?>