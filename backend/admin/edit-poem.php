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
    $poem = null;
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM poems WHERE id = ?");
        $stmt->execute([$id]);
        $poem = $stmt->fetch();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'Poem ID required']);
        exit;
    }

    try {
        // Fetch poem with tags
        $stmt = $pdo->prepare("
            SELECT p.*, GROUP_CONCAT(pt.tag) as tags
            FROM poems p
            LEFT JOIN poem_tags pt ON p.id = pt.poemId
            WHERE p.id = ?
            GROUP BY p.id
        ");
        $stmt->execute([$id]);
        $poem = $stmt->fetch();

        if ($poem) {
            $poem['tags'] = $poem['tags'] ? explode(',', $poem['tags']) : [];
            echo json_encode($poem);
        } else {
            echo json_encode(['success' => false, 'message' => 'Poem not found']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $author = $_POST['author'];
    $content = $_POST['content'];
    $excerpt = $_POST['excerpt'] ?? '';
    $status = $_POST['status'];
    $publishedAt = $_POST['publishedAt'];

    // Convert empty publishedAt to NULL
    $publishedAtValue = empty($publishedAt) ? null : $publishedAt;

    try {
        if ($id) {
            // Update
            $stmt = $pdo->prepare("UPDATE poems SET title=?, author=?, content=?, excerpt=?, status=?, publishedAt=? WHERE id=?");
            $stmt->execute([$title, $author, $content, $excerpt, $status, $publishedAtValue, $id]);
            $poemId = $id;
            echo json_encode(['success' => true, 'message' => 'Poem updated successfully', 'id' => $id]);
        } else {
            // Insert
            $stmt = $pdo->prepare("INSERT INTO poems (title, author, content, excerpt, status, publishedAt) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $author, $content, $excerpt, $status, $publishedAtValue]);
            $poemId = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'message' => 'Poem created successfully', 'id' => $poemId]);
        }

        // Handle tags
        if (isset($poemId)) {
            // Delete existing tags
            $pdo->prepare("DELETE FROM poem_tags WHERE poemId = ?")->execute([$poemId]);

            // Insert new tags if provided
            if (isset($_POST['tags']) && is_array($_POST['tags'])) {
                $tagStmt = $pdo->prepare("INSERT INTO poem_tags (poemId, tag) VALUES (?, ?)");
                foreach ($_POST['tags'] as $tag) {
                    if (!empty(trim($tag))) {
                        $tagStmt->execute([$poemId, trim($tag)]);
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
        echo json_encode(['success' => false, 'message' => 'Poem ID required']);
        exit;
    }

    try {
        // Delete tags first (due to foreign key constraint)
        $pdo->prepare("DELETE FROM poem_tags WHERE poemId = ?")->execute([$id]);

        // Delete the poem
        $stmt = $pdo->prepare("DELETE FROM poems WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Poem deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Poem not found']);
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