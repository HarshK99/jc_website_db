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
    $currentAffairs = null;
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM current_affairs WHERE id = ?");
        $stmt->execute([$id]);
        $currentAffairs = $stmt->fetch();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'Current Affairs ID required']);
        exit;
    }

    try {
        // Fetch current affairs with tags
        $stmt = $pdo->prepare("
            SELECT ca.*, GROUP_CONCAT(cat.tag) as tags
            FROM current_affairs ca
            LEFT JOIN current_affairs_tags cat ON ca.id = cat.currentAffairsId
            WHERE ca.id = ?
            GROUP BY ca.id
        ");
        $stmt->execute([$id]);
        $currentAffairs = $stmt->fetch();

        if ($currentAffairs) {
            $currentAffairs['tags'] = $currentAffairs['tags'] ? explode(',', $currentAffairs['tags']) : [];
            echo json_encode($currentAffairs);
        } else {
            echo json_encode(['success' => false, 'message' => 'Current Affairs not found']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $slug = $_POST['slug'];
    $content = $_POST['content'];
    $status = $_POST['status'];
    $publishedAt = $_POST['publishedAt'];
    $coverImage = $_POST['coverImage'] ?? '';
    $isFeatured = isset($_POST['is_featured']) ? 1 : 0;

    // Convert empty publishedAt to NULL
    $publishedAtValue = empty($publishedAt) ? null : $publishedAt;

    try {
        if ($id) {
            // Update
            $stmt = $pdo->prepare("UPDATE current_affairs SET title=?, slug=?, content=?, status=?, publishedAt=?, coverImage=?, is_featured=? WHERE id=?");
            $stmt->execute([$title, $slug, $content, $status, $publishedAtValue, $coverImage, $isFeatured, $id]);
            $currentAffairsId = $id;
            echo json_encode(['success' => true, 'message' => 'Current Affairs updated successfully', 'id' => $id]);
        } else {
            // Insert
            $stmt = $pdo->prepare("INSERT INTO current_affairs (title, slug, content, status, publishedAt, coverImage, authorId, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $slug, $content, $status, $publishedAtValue, $coverImage, $_SESSION['admin_id'], $isFeatured]);
            $currentAffairsId = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'message' => 'Current Affairs created successfully', 'id' => $currentAffairsId]);
        }

        // Handle tags
        if (isset($currentAffairsId)) {
            // Delete existing tags
            $pdo->prepare("DELETE FROM current_affairs_tags WHERE currentAffairsId = ?")->execute([$currentAffairsId]);

            // Insert new tags if provided
            if (isset($_POST['tags']) && is_array($_POST['tags'])) {
                $tagStmt = $pdo->prepare("INSERT INTO current_affairs_tags (currentAffairsId, tag) VALUES (?, ?)");
                foreach ($_POST['tags'] as $tag) {
                    if (!empty(trim($tag))) {
                        $tagStmt->execute([$currentAffairsId, trim($tag)]);
                    }
                }
            }
        }

    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>