-- Database schema for J & C Group website
-- Run this in phpMyAdmin to create the tables

-- Books table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    shortDescription TEXT,
    description TEXT,
    ageGroup VARCHAR(50),
    coverImage VARCHAR(255),
    buyLink VARCHAR(255),
    publishedYear INT,
    pages INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Authors table
CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table (for blog)
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    coverImage VARCHAR(255),
    status ENUM('draft', 'published') DEFAULT 'draft',
    publishedAt TIMESTAMP NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    authorId INT,
    FOREIGN KEY (authorId) REFERENCES authors(id)
);

-- Post tags (many-to-many)
CREATE TABLE post_tags (
    postId INT,
    tag VARCHAR(100),
    PRIMARY KEY (postId, tag),
    FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);

-- Admin users table
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL
);

-- Tags table
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

-- Insert sample data
INSERT INTO authors (name, bio, avatar) VALUES
('J&C Editorial', 'The core editorial voice guiding every title at J & C.', '/uploads/authors/jc.png');

INSERT INTO books (title, slug, shortDescription, description, ageGroup, coverImage, buyLink, publishedYear, pages) VALUES
('Under the Banyan Tree', 'under-the-banyan-tree', 'A gentle, poetic journey beneath a wise old tree.', '<p>The banyan tree watches generations grow...</p>', '6–9 years', '/uploads/books/banyan.jpg', 'https://amazon.in/banyan', 2024, 42),
('Clouds With Secrets', 'clouds-with-secrets', 'A whimsical chase through shifting skies.', '<p>Clouds hold more than rain...</p>', '5–8 years', '/uploads/books/clouds.jpg', 'https://amazon.in/clouds', 2023, 38);

INSERT INTO admin_users (name, email, password, role) VALUES
('J & C Owner', 'admin@jc.com', '$2y$10$examplehashedpassword', 'owner'); -- Use password_hash() in PHP for real password