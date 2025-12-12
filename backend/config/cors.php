<?php
// CORS configuration constants

// Environment detection
$isProduction = isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'hostingersite.com') !== false;

// Allowed origins for CORS
$ALLOWED_ORIGINS = [
    'http://localhost:3000',  // Next.js development server
    'https://jncnews.in'  // Production domain
];

// Default origin (fallback)
$DEFAULT_ORIGIN = $isProduction ? 'https://jncnews.in' : 'http://localhost:3000';

/**
 * Get the appropriate CORS origin based on the request
 * @return string The allowed origin or default
 */
function getCorsOrigin() {
    global $ALLOWED_ORIGINS, $DEFAULT_ORIGIN;

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    return in_array($origin, $ALLOWED_ORIGINS) ? $origin : $DEFAULT_ORIGIN;
}
?>