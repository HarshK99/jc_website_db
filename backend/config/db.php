<?php
// Database configuration - Environment-aware setup

// Check if we're in production (jncnews.in) or development (localhost)
$isProduction = isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'jncnews.in') !== false;

// Define base URL for the application
$baseUrl = $isProduction ? 'https://jncnews.in/backend' : 'http://localhost:8080/jc_backend';

// Define base URL for uploads (served directly from web root)
$uploadBaseUrl = $isProduction ? 'https://jncnews.in' : 'http://localhost:8080';

if ($isProduction) {
    // Production configuration (Hostinger)
    $host = 'localhost';
    $dbname = 'u457360812_jcnews';
    $username = 'u457360812_jcadmin';
    $password = 'Jc@admin9';
} else {
    // Development configuration (XAMPP/localhost)
    $host = 'localhost';
    $dbname = 'jc_website_db';
    $username = 'root';
    $password = '';
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    throw new Exception("Database connection failed: " . $e->getMessage());
}
?>