<?php
// Database configuration - Environment-aware setup

// Check if we're in production (Hostinger) or development (localhost)
$isProduction = isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'hostingersite.com') !== false;

if ($isProduction) {
    // Production configuration (Hostinger)
    $host = 'localhost';
    $dbname = 'u457360812_jc_website_db';
    $username = 'u457360812_jc';
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