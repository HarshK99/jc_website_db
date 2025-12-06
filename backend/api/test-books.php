<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=jc_website_db;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT * FROM books ORDER BY publishedYear DESC");
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($books);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>