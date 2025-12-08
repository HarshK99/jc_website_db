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
    is_featured BOOLEAN DEFAULT FALSE,
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
    is_recommended BOOLEAN DEFAULT FALSE,
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

INSERT INTO posts (title, slug, excerpt, content, coverImage, status, publishedAt, authorId) VALUES
('How Stories Build Thinking', 'how-stories-build-thinking', 'The right stories help children form deeper reasoning, empathy, and imagery.', '<p>Stories are not just entertainment—they are powerful tools for cognitive development. When children engage with well-crafted narratives, they learn to think critically, understand different perspectives, and build emotional intelligence.</p><p>Research shows that regular exposure to quality children\'s literature can significantly improve language skills, concentration, and even academic performance. The key is choosing stories that challenge young minds while remaining age-appropriate.</p><h3>The Science Behind Story-Based Learning</h3><p>Neuroscientists have discovered that stories activate multiple areas of the brain simultaneously. This multi-modal engagement creates stronger neural connections and improves memory retention compared to traditional learning methods.</p>', '/uploads/blog/stories-thinking.jpg', 'published', '2025-12-01 10:00:00', 1),

('Why Illustrations Matter in Children\'s Books', 'why-illustrations-matter', 'Illustrations are literacy tools, not decoration—they deepen comprehension and engagement.', '<p>Many people underestimate the importance of illustrations in children\'s books, viewing them merely as decorative elements. However, research consistently shows that quality illustrations are essential literacy tools that enhance comprehension and engagement.</p><p>Illustrations serve multiple purposes: they provide visual context for text, help children make connections between words and meanings, and support different learning styles. A well-illustrated book can be understood by children who are not yet fluent readers.</p><h3>The Role of Visual Literacy</h3><p>Visual literacy is a crucial skill in today\'s image-saturated world. Quality children\'s book illustrations teach children how to "read" images, understand symbolism, and interpret visual narratives. This skill transfers to other areas of learning and life.</p>', '/uploads/blog/illustrations-matter.jpg', 'published', '2025-11-28 09:30:00', 1),

('Building Emotional Intelligence Through Literature', 'building-emotional-intelligence', 'Children\'s books that explore emotions help develop empathy and self-awareness.', '<p>Emotional intelligence is one of the most important skills we can teach children. Quality children\'s literature provides safe spaces for exploring complex emotions and social situations.</p><p>Through stories, children learn to identify, understand, and manage their own emotions while developing empathy for others. Books that tackle themes like friendship, loss, courage, and kindness provide valuable lessons that stick with children throughout their lives.</p><h3>Choosing Books for Emotional Development</h3><p>When selecting books for emotional development, look for stories that: present authentic emotions, model healthy coping strategies, show diverse perspectives, and encourage discussion about feelings.</p>', '/uploads/blog/emotional-intelligence.jpg', 'published', '2025-11-25 14:15:00', 1);

INSERT INTO post_tags (postId, tag) VALUES
(1, 'reading'), (1, 'child-development'), (1, 'storytelling'),
(2, 'visual-learning'), (2, 'child-development'), (2, 'literacy'),
(3, 'emotional-intelligence'), (3, 'child-development'), (3, 'empathy');

INSERT INTO tags (name, slug) VALUES
('reading', 'reading'),
('child-development', 'child-development'),
('storytelling', 'storytelling'),
('visual-learning', 'visual-learning'),
('literacy', 'literacy'),
('emotional-intelligence', 'emotional-intelligence'),
('empathy', 'empathy');

INSERT INTO admin_users (name, email, password, role) VALUES
('J & C Owner', 'admin@jc.com', '$2y$10$examplehashedpassword', 'owner'); -- Use password_hash() in PHP for real password