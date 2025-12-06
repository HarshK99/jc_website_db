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

    // Get query parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    $tag = isset($_GET['tag']) ? $_GET['tag'] : null;

    // Base query
    $query = "
        SELECT
            p.*,
            a.name as authorName,
            a.avatar as authorAvatar
        FROM posts p
        LEFT JOIN authors a ON p.authorId = a.id
        WHERE p.status = 'published'
    ";

    $params = [];

    // Add filters
    if ($category) {
        $query .= " AND p.category = ?";
        $params[] = $category;
    }

    if ($tag) {
        $query .= " AND EXISTS (
            SELECT 1 FROM post_tags pt WHERE pt.postId = p.id AND pt.tag = ?
        )";
        $params[] = $tag;
    }

    // Base query
    $query = "
        SELECT
            p.*,
            a.name as authorName,
            a.avatar as authorAvatar
        FROM posts p
        LEFT JOIN authors a ON p.authorId = a.id
        WHERE p.status = 'published'
    ";

    $params = [];

    // Add filters
    if ($category) {
        $query .= " AND p.category = ?";
        $params[] = $category;
    }

    if ($tag) {
        $query .= " AND EXISTS (
            SELECT 1 FROM post_tags pt WHERE pt.postId = p.id AND pt.tag = ?
        )";
        $params[] = $tag;
    }

    // Order by published date
    $query .= " ORDER BY p.publishedAt DESC";

    // Add limit if specified
    if ($limit) {
        $query .= " LIMIT ?";
        $params[] = $limit;
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $posts = $stmt->fetchAll();

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