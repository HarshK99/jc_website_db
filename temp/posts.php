<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    echo "Starting posts API...\n";
    require_once '../includes/functions.php';
    echo "Functions loaded\n";
    require_once '../config/db.php';
    echo "Database config loaded\n";

    // Get query parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
    echo "Limit: " . ($limit ?? 'none') . "\n";

    // Base query
    $query = "
        SELECT
            p.*,
            a.name as authorName,
            a.avatar as authorAvatar
        FROM posts p
        LEFT JOIN authors a ON p.authorId = a.id
        WHERE p.status = 'published'
        ORDER BY p.publishedAt DESC
    ";

    if ($limit) {
        $query .= " LIMIT $limit";
    }

    echo "Query: $query\n";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $posts = $stmt->fetchAll();

    echo "Found " . count($posts) . " posts\n";

    // Add tags to each post
    foreach ($posts as &$post) {
        $tagQuery = "SELECT tag FROM post_tags WHERE postId = ?";
        $tagStmt = $pdo->prepare($tagQuery);
        $tagStmt->execute([$post['id']]);
        $tags = $tagStmt->fetchAll(PDO::FETCH_COLUMN);
        $post['tags'] = $tags;
    }

    echo "Tags added, returning JSON\n";

    // Return posts as JSON
    jsonResponse($posts);

} catch (Exception $e) {
    errorResponse('Failed to fetch books: ' . $e->getMessage(), 500);
}
?>