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
    $recommended = isset($_GET['recommended']) && $_GET['recommended'] == '1';

    // Base query
    $query = "
        SELECT
            n.id, n.title, n.slug, n.excerpt, n.content, n.coverImage, n.status, n.publishedAt, n.is_recommended, n.updatedAt, n.authorId,
            a.name as authorName,
            a.avatar as authorAvatar
        FROM news n
        LEFT JOIN authors a ON n.authorId = a.id
    ";

    $params = [];

    // Only filter by status if not fetching by id (for admin edit)
    if (!$id) {
        $query .= " WHERE n.status = 'published'";
    } else {
        $query .= " WHERE 1=1";
    }

    if ($slug) {
        $query .= " AND n.slug = ?";
        $params[] = $slug;
    } elseif ($id) {
        $query .= " AND n.id = ?";
        $params[] = $id;
    }

    if ($recommended) {
        $query .= " AND n.is_recommended = 1";
    }

    $query .= " ORDER BY n.publishedAt DESC";

    if ($limit && !$slug) {
        $query .= " LIMIT $limit";
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    if ($slug) {
        $news = $stmt->fetch();
        $newsItems = $news ? [$news] : [];
    } else {
        $newsItems = $stmt->fetchAll();
    }

    // Add tags to each news item
    foreach ($newsItems as &$newsItem) {
        $tagQuery = "SELECT tag FROM news_tags WHERE newsId = ?";
        $tagStmt = $pdo->prepare($tagQuery);
        $tagStmt->execute([$newsItem['id']]);
        $tags = $tagStmt->fetchAll(PDO::FETCH_COLUMN);
        $newsItem['tags'] = $tags;
    }

    // Return news as JSON
    jsonResponse($newsItems);

} catch (Exception $e) {
    errorResponse('Failed to fetch news: ' . $e->getMessage(), 500);
}
?>