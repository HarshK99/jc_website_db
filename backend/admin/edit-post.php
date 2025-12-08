<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start([
    'cookie_samesite' => 'None',
    'cookie_secure' => false, // Set to true in production with HTTPS
    'cookie_httponly' => true,
]);
require_once '../config/db.php';

if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
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

    if ($id) {
        // Update
        $stmt = $pdo->prepare("UPDATE posts SET title=?, slug=?, excerpt=?, content=?, status=?, publishedAt=? WHERE id=?");
        $stmt->execute([$title, $slug, $excerpt, $content, $status, $publishedAt, $id]);
    } else {
        // Insert
        $stmt = $pdo->prepare("INSERT INTO posts (title, slug, excerpt, content, status, publishedAt, authorId) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $slug, $excerpt, $content, $status, $publishedAt, $_SESSION['admin_id']]);
    }
    header('Location: dashboard.php');
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