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
    $slug = isset($_GET['slug']) ? $_GET['slug'] : null;
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $featured = isset($_GET['featured']) && $_GET['featured'] == '1';

    // Base query
    $query = "
        SELECT
            ca.id, ca.title, ca.slug, ca.excerpt, ca.content, ca.coverImage, ca.status, ca.publishedAt, ca.is_featured, ca.updatedAt, ca.authorId,
            a.name as authorName,
            a.avatar as authorAvatar
        FROM current_affairs ca
        LEFT JOIN authors a ON ca.authorId = a.id
    ";

    $params = [];

    // Only filter by status if not fetching by id (for admin edit)
    if (!$id) {
        $query .= " WHERE ca.status = 'published'";
    } else {
        $query .= " WHERE 1=1";
    }

    if ($slug) {
        $query .= " AND ca.slug = ?";
        $params[] = $slug;
    } elseif ($id) {
        $query .= " AND ca.id = ?";
        $params[] = $id;
    }

    if ($featured) {
        $query .= " AND ca.is_featured = 1";
    }

    $query .= " ORDER BY ca.publishedAt DESC";

    if ($limit && !$slug) {
        $query .= " LIMIT $limit";
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    if ($slug) {
        $currentAffairs = $stmt->fetch();
        $currentAffairsList = $currentAffairs ? [$currentAffairs] : [];
    } else {
        $currentAffairsList = $stmt->fetchAll();
    }

    // Add tags to each current affairs item
    foreach ($currentAffairsList as &$item) {
        $tagQuery = "SELECT tag FROM current_affairs_tags WHERE currentAffairsId = ?";
        $tagStmt = $pdo->prepare($tagQuery);
        $tagStmt->execute([$item['id']]);
        $tags = $tagStmt->fetchAll(PDO::FETCH_COLUMN);
        $item['tags'] = $tags;
    }

    // Return current affairs as JSON
    jsonResponse($currentAffairsList);

} catch (Exception $e) {
    errorResponse('Failed to fetch current affairs: ' . $e->getMessage(), 500);
}
?>