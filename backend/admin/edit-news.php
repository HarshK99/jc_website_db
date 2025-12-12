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

session_start([
    'cookie_samesite' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'None' : 'Lax',
    'cookie_secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
    'cookie_httponly' => true,
]);
require_once '../config/db.php';

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Session expired. Please login again.']);
    exit;
}

try {

    $id = $_GET['id'] ?? null;
    $news = null;
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM news WHERE id = ?");
        $stmt->execute([$id]);
        $news = $stmt->fetch();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'News ID required']);
        exit;
    }

    try {
        // Fetch news with tags
        $stmt = $pdo->prepare("
            SELECT n.*, GROUP_CONCAT(nt.tag) as tags
            FROM news n
            LEFT JOIN news_tags nt ON n.id = nt.newsId
            WHERE n.id = ?
            GROUP BY n.id
        ");
        $stmt->execute([$id]);
        $news = $stmt->fetch();

        if ($news) {
            $news['tags'] = $news['tags'] ? explode(',', $news['tags']) : [];
            echo json_encode($news);
        } else {
            echo json_encode(['success' => false, 'message' => 'News not found']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $slug = $_POST['slug'];
    $excerpt = $_POST['excerpt'];
    $content = $_POST['content'];
    $status = $_POST['status'];
    $publishedAt = $_POST['publishedAt'];
    $coverImage = $_POST['coverImage'] ?? '';
    $isRecommended = isset($_POST['is_recommended']) ? 1 : 0;

    // Convert empty publishedAt to NULL
    $publishedAtValue = empty($publishedAt) ? null : $publishedAt;

    try {
        if ($id) {
            // Update
            $stmt = $pdo->prepare("UPDATE news SET title=?, slug=?, excerpt=?, content=?, status=?, publishedAt=?, coverImage=?, is_recommended=? WHERE id=?");
            $stmt->execute([$title, $slug, $excerpt, $content, $status, $publishedAtValue, $coverImage, $isRecommended, $id]);
            $newsId = $id;
            echo json_encode(['success' => true, 'message' => 'News updated successfully', 'id' => $id]);
        } else {
            // Insert
            $stmt = $pdo->prepare("INSERT INTO news (title, slug, excerpt, content, status, publishedAt, coverImage, authorId, is_recommended) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $slug, $excerpt, $content, $status, $publishedAtValue, $coverImage, $_SESSION['admin_id'], $isRecommended]);
            $newsId = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'message' => 'News created successfully', 'id' => $newsId]);
        }

        // Handle tags
        if (isset($newsId)) {
            // Delete existing tags
            $pdo->prepare("DELETE FROM news_tags WHERE newsId = ?")->execute([$newsId]);

            // Insert new tags if provided
            if (isset($_POST['tags']) && is_array($_POST['tags'])) {
                $tagStmt = $pdo->prepare("INSERT INTO news_tags (newsId, tag) VALUES (?, ?)");
                foreach ($_POST['tags'] as $tag) {
                    $tag = trim($tag);
                    if (!empty($tag)) {
                        $tagStmt->execute([$newsId, $tag]);
                    }
                }
            }
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'News ID required for deletion']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'News deleted successfully']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    exit;
}
?>