<?php
session_start();
require_once '../config/db.php';

if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

$posts = $pdo->query("SELECT id, title, slug, status, publishedAt FROM posts ORDER BY publishedAt DESC")->fetchAll();
?>
<!DOCTYPE html>
<html>
<head><title>Admin Dashboard</title></head>
<body>
    <h1>Admin Dashboard</h1>
    <a href="posts.php?action=add">Add New Post</a>
    <table>
        <tr><th>Title</th><th>Status</th><th>Published</th><th>Actions</th></tr>
        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo htmlspecialchars($post['title']); ?></td>
            <td><?php echo $post['status']; ?></td>
            <td><?php echo $post['publishedAt']; ?></td>
            <td>
                <a href="posts.php?action=edit&id=<?php echo $post['id']; ?>">Edit</a>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>