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
$book = null;
if ($id) {
    $stmt = $pdo->prepare("SELECT * FROM books WHERE id = ?");
    $stmt->execute([$id]);
    $book = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $slug = $_POST['slug'];
    $shortDescription = $_POST['shortDescription'];
    $description = $_POST['description'];
    $ageGroup = $_POST['ageGroup'];
    $coverImage = $_POST['coverImage'] ?? '';
    $buyLink = $_POST['buyLink'] ?? '';
    $publishedYear = $_POST['publishedYear'] ? (int)$_POST['publishedYear'] : null;
    $pages = $_POST['pages'] ? (int)$_POST['pages'] : null;
    $isbn = $_POST['isbn'] ?? '';
    $author = $_POST['author'] ?? '';
    $category = $_POST['category'] ?? '';
    $price = $_POST['price'] ? (float)$_POST['price'] : null;
    $isFeatured = isset($_POST['is_featured']) ? 1 : 0;

    try {
        if ($id) {
            // Update
            $stmt = $pdo->prepare("UPDATE books SET title=?, slug=?, shortDescription=?, description=?, ageGroup=?, coverImage=?, buyLink=?, publishedYear=?, pages=?, isbn=?, author=?, category=?, price=?, is_featured=? WHERE id=?");
            $stmt->execute([$title, $slug, $shortDescription, $description, $ageGroup, $coverImage, $buyLink, $publishedYear, $pages, $isbn, $author, $category, $price, $isFeatured, $id]);
            echo json_encode(['success' => true, 'message' => 'Book updated successfully', 'id' => $id]);
        } else {
            // Insert
            $stmt = $pdo->prepare("INSERT INTO books (title, slug, shortDescription, description, ageGroup, coverImage, buyLink, publishedYear, pages, isbn, author, category, price, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $slug, $shortDescription, $description, $ageGroup, $coverImage, $buyLink, $publishedYear, $pages, $isbn, $author, $category, $price, $isFeatured]);
            $newId = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'message' => 'Book created successfully', 'id' => $newId]);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'Book ID required for deletion']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM books WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Book deleted successfully']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}
?>
<!DOCTYPE html>
<html>
<head><title><?php echo $id ? 'Edit' : 'Add'; ?> Book</title></head>
<body>
    <form method="POST">
        <input type="text" name="title" value="<?php echo htmlspecialchars($book['title'] ?? ''); ?>" placeholder="Title" required>
        <input type="text" name="slug" value="<?php echo htmlspecialchars($book['slug'] ?? ''); ?>" placeholder="Slug" required>
        <textarea name="shortDescription" placeholder="Short Description"><?php echo htmlspecialchars($book['shortDescription'] ?? ''); ?></textarea>
        <textarea name="description" placeholder="Description"><?php echo htmlspecialchars($book['description'] ?? ''); ?></textarea>
        <input type="text" name="ageGroup" value="<?php echo htmlspecialchars($book['ageGroup'] ?? ''); ?>" placeholder="Age Group">
        <input type="text" name="coverImage" value="<?php echo htmlspecialchars($book['coverImage'] ?? ''); ?>" placeholder="Cover Image URL">
        <input type="text" name="buyLink" value="<?php echo htmlspecialchars($book['buyLink'] ?? ''); ?>" placeholder="Buy Link">
        <input type="number" name="publishedYear" value="<?php echo $book['publishedYear'] ?? ''; ?>" placeholder="Published Year">
        <input type="number" name="pages" value="<?php echo $book['pages'] ?? ''; ?>" placeholder="Pages">
        <input type="text" name="isbn" value="<?php echo htmlspecialchars($book['isbn'] ?? ''); ?>" placeholder="ISBN">
        <input type="text" name="author" value="<?php echo htmlspecialchars($book['author'] ?? ''); ?>" placeholder="Author">
        <input type="text" name="category" value="<?php echo htmlspecialchars($book['category'] ?? ''); ?>" placeholder="Category">
        <input type="number" name="price" value="<?php echo $book['price'] ?? ''; ?>" placeholder="Price" step="0.01">
        <label><input type="checkbox" name="is_featured" <?php echo ($book['is_featured'] ?? 0) ? 'checked' : ''; ?>> Featured</label>
        <button type="submit"><?php echo $id ? 'Update' : 'Create'; ?> Book</button>
    </form>
</body>
</html>