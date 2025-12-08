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

$id = $_GET['id'] ?? null;
$post = null;
if ($id) {
    $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    $post = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
            $stmt = $pdo->prepare("UPDATE posts SET title=?, slug=?, excerpt=?, content=?, status=?, publishedAt=?, coverImage=?, is_recommended=? WHERE id=?");
            $stmt->execute([$title, $slug, $excerpt, $content, $status, $publishedAtValue, $coverImage, $isRecommended, $id]);
            echo json_encode(['success' => true, 'message' => 'Post updated successfully', 'id' => $id]);
        } else {
            // Insert
            $stmt = $pdo->prepare("INSERT INTO posts (title, slug, excerpt, content, status, publishedAt, coverImage, authorId, is_recommended) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $slug, $excerpt, $content, $status, $publishedAtValue, $coverImage, $_SESSION['admin_id'], $isRecommended]);
            $newId = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'message' => 'Post created successfully', 'id' => $newId]);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'Post ID required for deletion']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Post deleted successfully']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}
?>
<!DOCTYPE html>
<html>
<head><title><?php echo $id ? 'Edit' : 'Add'; ?> Post</title></head>
<body>
    <form method="POST">
        <input type="text" name="title" value="<?php echo htmlspecialchars($post['title'] ?? ''); ?>" placeholder="Title" required>
        <input type="text" name="slug" value="<?php echo htmlspecialchars($post['slug'] ?? ''); ?>" placeholder="Slug" required>
        <textarea name="excerpt" placeholder="Excerpt"><?php echo htmlspecialchars($post['excerpt'] ?? ''); ?></textarea>
        <textarea name="content" placeholder="Content"><?php echo htmlspecialchars($post['content'] ?? ''); ?></textarea>
        <select name="status">
            <option value="draft" <?php echo ($post['status'] ?? '') === 'draft' ? 'selected' : ''; ?>>Draft</option>
            <option value="published" <?php echo ($post['status'] ?? '') === 'published' ? 'selected' : ''; ?>>Published</option>
        </select>
        <input type="datetime-local" name="publishedAt" value="<?php echo $post['publishedAt'] ?? ''; ?>">
        <button type="submit"><?php echo $id ? 'Update' : 'Create'; ?> Post</button>
    </form>
</body>
</html>