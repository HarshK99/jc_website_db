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

    // Get query parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

    // Base query
    $query = "
        SELECT
            p.id, p.title, p.author, p.content, p.excerpt, p.status, p.publishedAt, p.updatedAt
        FROM poems p
    ";

    $params = [];

    // Only filter by status if not fetching by id (for admin edit)
    if (!$id) {
        $query .= " WHERE p.status = 'published'";
    } else {
        $query .= " WHERE 1=1";
    }

    if ($id) {
        $query .= " AND p.id = ?";
        $params[] = $id;
    }

    // Order by published date descending
    $query .= " ORDER BY p.publishedAt DESC";

    if ($limit) {
        $query .= " LIMIT ?";
        $params[] = $limit;
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $poems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get tags for each poem
    foreach ($poems as &$poem) {
        $tagQuery = "SELECT tag FROM poem_tags WHERE poemId = ?";
        $tagStmt = $pdo->prepare($tagQuery);
        $tagStmt->execute([$poem['id']]);
        $tags = $tagStmt->fetchAll(PDO::FETCH_COLUMN);
        $poem['tags'] = $tags;
    }

    echo json_encode($poems);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>