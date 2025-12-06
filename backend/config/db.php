<?php
// Database configuration for XAMPP local development
$host = 'localhost'; // Usually localhost on local development
$dbname = 'jc_website_db'; // Database name you created in phpMyAdmin
$username = 'root'; // Default XAMPP username
$password = ''; // Default XAMPP password (empty)

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    throw new Exception("Database connection failed: " . $e->getMessage());
}
?>