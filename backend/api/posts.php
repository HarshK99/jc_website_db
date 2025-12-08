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
            p.id, p.title, p.slug, p.excerpt, p.content, p.coverImage, p.status, p.publishedAt, p.is_recommended, p.updatedAt, p.authorId,
            a.name as authorName,
            a.avatar as authorAvatar
        FROM posts p
        LEFT JOIN authors a ON p.authorId = a.id
        WHERE p.status = 'published'
    ";

    $params = [];

    if ($slug) {
        $query .= " AND p.slug = ?";
        $params[] = $slug;
    } elseif ($id) {
        $query .= " AND p.id = ?";
        $params[] = $id;
    }

    if ($recommended) {
        $query .= " AND p.is_recommended = 1";
    }

    $query .= " ORDER BY p.publishedAt DESC";

    if ($limit && !$slug) {
        $query .= " LIMIT $limit";
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    
    if ($slug) {
        $post = $stmt->fetch();
        $posts = $post ? [$post] : [];
    } else {
        $posts = $stmt->fetchAll();
    }

    // Add tags to each post
    foreach ($posts as &$post) {
        $tagQuery = "SELECT tag FROM post_tags WHERE postId = ?";
        $tagStmt = $pdo->prepare($tagQuery);
        $tagStmt->execute([$post['id']]);
        $tags = $tagStmt->fetchAll(PDO::FETCH_COLUMN);
        $post['tags'] = $tags;
    }

    // Return posts as JSON
    jsonResponse($posts);

} catch (Exception $e) {
    errorResponse('Failed to fetch posts: ' . $e->getMessage(), 500);
}
?>