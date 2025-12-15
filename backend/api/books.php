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

    // Check if requesting a single book by slug or ID
    if (isset($_GET['slug'])) {
        $slug = $_GET['slug'];
        $stmt = $pdo->prepare("SELECT * FROM books WHERE slug = ?");
        $stmt->execute([$slug]);
        $book = $stmt->fetch();

        if (!$book) {
            errorResponse('Book not found', 404);
        }

        jsonResponse($book);
        exit;
    }

    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare("SELECT * FROM books WHERE id = ?");
        $stmt->execute([$id]);
        $book = $stmt->fetch();

        if (!$book) {
            errorResponse('Book not found', 404);
        }

        jsonResponse($book);
        exit;
    }

    // Build query with optional filters
    $whereConditions = [];
    $params = [];

    // Check if featured parameter is set
    if (isset($_GET['featured']) && $_GET['featured'] == '1') {
        $whereConditions[] = "is_featured = 1";
    }

    // Search parameter for general search across multiple fields
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $searchTerm = '%' . $_GET['search'] . '%';
        $whereConditions[] = "(title LIKE ? OR author LIKE ? OR category LIKE ? OR shortDescription LIKE ? OR isbn LIKE ?)";
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm]);
    }

    // Individual filters
    if (isset($_GET['author']) && !empty($_GET['author'])) {
        $whereConditions[] = "author LIKE ?";
        $params[] = '%' . $_GET['author'] . '%';
    }

    if (isset($_GET['category']) && !empty($_GET['category'])) {
        $whereConditions[] = "category LIKE ?";
        $params[] = '%' . $_GET['category'] . '%';
    }

    if (isset($_GET['isbn']) && !empty($_GET['isbn'])) {
        $whereConditions[] = "isbn LIKE ?";
        $params[] = '%' . $_GET['isbn'] . '%';
    }

    if (isset($_GET['min_price']) && is_numeric($_GET['min_price'])) {
        $whereConditions[] = "price >= ?";
        $params[] = (float)$_GET['min_price'];
    }

    if (isset($_GET['max_price']) && is_numeric($_GET['max_price'])) {
        $whereConditions[] = "price <= ?";
        $params[] = (float)$_GET['max_price'];
    }

    // Build the WHERE clause
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";

    // Fetch books
    $stmt = $pdo->prepare("SELECT * FROM books $whereClause ORDER BY publishedYear DESC");
    $stmt->execute($params);
    $books = $stmt->fetchAll();

    // Return books as JSON
    jsonResponse($books);

} catch (Exception $e) {
    errorResponse('Failed to fetch books: ' . $e->getMessage(), 500);
}
?>