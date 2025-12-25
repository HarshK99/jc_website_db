-- Database schema for JNC Group website
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
    isbn VARCHAR(20),
    author VARCHAR(255),
    category VARCHAR(100),
    price DECIMAL(10,2),
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

-- News table (similar to posts but for news)
CREATE TABLE news (
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

-- News tags (many-to-many)
CREATE TABLE news_tags (
    newsId INT,
    tag VARCHAR(100),
    PRIMARY KEY (newsId, tag),
    FOREIGN KEY (newsId) REFERENCES news(id) ON DELETE CASCADE
);

-- Update Current Affairs table
CREATE TABLE current_affairs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT,
    coverImage VARCHAR(255),
    status ENUM('draft', 'published') DEFAULT 'draft',
    publishedAt TIMESTAMP NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    authorId INT,
    FOREIGN KEY (authorId) REFERENCES authors(id)
);

-- Update Current Affairs tags (many-to-many)
CREATE TABLE current_affairs_tags (
    currentAffairsId INT,
    tag VARCHAR(100),
    PRIMARY KEY (currentAffairsId, tag),
    FOREIGN KEY (currentAffairsId) REFERENCES current_affairs(id) ON DELETE CASCADE
);

-- Poems table
CREATE TABLE poems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    content LONGTEXT,
    excerpt TEXT,
    status ENUM('draft', 'published') DEFAULT 'draft',
    publishedAt TIMESTAMP NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Poem tags (many-to-many)
CREATE TABLE poem_tags (
    poemId INT,
    tag VARCHAR(100),
    PRIMARY KEY (poemId, tag),
    FOREIGN KEY (poemId) REFERENCES poems(id) ON DELETE CASCADE
);


-- Insert sample data
INSERT INTO authors (name, bio) VALUES
('JNC News Editorial', 'The core editorial voice guiding every title at J & C.');

INSERT INTO books (title, slug, shortDescription, description, ageGroup, coverImage, buyLink, publishedYear, pages, isbn, author, category, price) VALUES
('Under the Banyan Tree', 'under-the-banyan-tree', 'A gentle, poetic journey beneath a wise old tree.', '<p>The banyan tree watches generations grow...</p>', '6–9 years', '/uploads/books/banyan.jpg', 'https://amazon.in/banyan', 2024, 42, '9788123456789', 'Dr. A.P.J. Abdul Kalam', 'Fiction', 299.00),
('Clouds With Secrets', 'clouds-with-secrets', 'A whimsical chase through shifting skies.', '<p>Clouds hold more than rain...</p>', '5–8 years', '/uploads/books/clouds.jpg', 'https://amazon.in/clouds', 2023, 38, '9788987654321', 'Maya Angelou', 'Adventure', 249.00);

INSERT INTO posts (title, slug, excerpt, content, coverImage, status, publishedAt, authorId) VALUES
('How Stories Build Thinking', 'how-stories-build-thinking', 'The right stories help children form deeper reasoning, empathy, and imagery.', '<p>Stories are not just entertainment—they are powerful tools for cognitive development. When children engage with well-crafted narratives, they learn to think critically, understand different perspectives, and build emotional intelligence.</p><p>Research shows that regular exposure to quality children\'s literature can significantly improve language skills, concentration, and even academic performance. The key is choosing stories that challenge young minds while remaining age-appropriate.</p><h3>The Science Behind Story-Based Learning</h3><p>Neuroscientists have discovered that stories activate multiple areas of the brain simultaneously. This multi-modal engagement creates stronger neural connections and improves memory retention compared to traditional learning methods.</p>', '/uploads/blog/stories-thinking.jpg', 'published', '2025-12-01 10:00:00', 1),

('Why Illustrations Matter in Children\'s Books', 'why-illustrations-matter', 'Illustrations are literacy tools, not decoration—they deepen comprehension and engagement.', '<p>Many people underestimate the importance of illustrations in children\'s books, viewing them merely as decorative elements. However, research consistently shows that quality illustrations are essential literacy tools that enhance comprehension and engagement.</p><p>Illustrations serve multiple purposes: they provide visual context for text, help children make connections between words and meanings, and support different learning styles. A well-illustrated book can be understood by children who are not yet fluent readers.</p><h3>The Role of Visual Literacy</h3><p>Visual literacy is a crucial skill in today\'s image-saturated world. Quality children\'s book illustrations teach children how to "read" images, understand symbolism, and interpret visual narratives. This skill transfers to other areas of learning and life.</p>', '/uploads/blog/illustrations-matter.jpg', 'published', '2025-11-28 09:30:00', 1),

('Building Emotional Intelligence Through Literature', 'building-emotional-intelligence', 'Children\'s books that explore emotions help develop empathy and self-awareness.', '<p>Emotional intelligence is one of the most important skills we can teach children. Quality children\'s literature provides safe spaces for exploring complex emotions and social situations.</p><p>Through stories, children learn to identify, understand, and manage their own emotions while developing empathy for others. Books that tackle themes like friendship, loss, courage, and kindness provide valuable lessons that stick with children throughout their lives.</p><h3>Choosing Books for Emotional Development</h3><p>When selecting books for emotional development, look for stories that: present authentic emotions, model healthy coping strategies, show diverse perspectives, and encourage discussion about feelings.</p>', '/uploads/blog/emotional-intelligence.jpg', 'published', '2025-11-25 14:15:00', 1);

INSERT INTO news (title, slug, excerpt, content, coverImage, status, publishedAt, authorId) VALUES
('JNC Group Launches New Educational Initiative', 'jc-group-launches-educational-initiative', 'A groundbreaking program to bring quality education to underserved communities.', '<p>JNC Group today announced the launch of their new educational initiative, "Books for All," aimed at providing quality children\'s literature to schools in underserved communities across India.</p><p>The program will distribute over 50,000 books to more than 200 schools in rural areas, focusing on age-appropriate content that promotes critical thinking, emotional intelligence, and cultural awareness.</p><h3>Program Details</h3><p>"Books for All" will include specially curated collections of children\'s books, teacher training workshops, and ongoing support for school libraries. The initiative is expected to benefit over 100,000 students in its first year.</p>', '/uploads/news/educational-initiative.jpg', 'published', '2025-12-10 08:00:00', 1),

('Award-Winning Author Joins J & C Family', 'award-winning-author-joins-jc-family', 'Celebrated children\'s author Dr. Maya Sharma becomes the latest addition to our publishing family.', '<p>We are thrilled to announce that Dr. Maya Sharma, recipient of the prestigious Children\'s Literature Prize, has joined JNC Group as a featured author.</p><p>Dr. Sharma\'s work focuses on stories that bridge cultural divides and promote understanding among young readers. Her upcoming title, "Bridges of Friendship," is scheduled for release next spring.</p><h3>Author Background</h3><p>With over 15 years of experience in children\'s literature, Dr. Sharma brings a wealth of knowledge and creativity to our team. Her books have been translated into 12 languages and have won numerous international awards.</p>', '/uploads/news/new-author.jpg', 'published', '2025-12-08 10:30:00', 1),

('Digital Learning Platform Goes Live', 'digital-learning-platform-launches', 'JNC Group introduces interactive digital learning tools to complement traditional reading.', '<p>JNC Group has launched its new digital learning platform, designed to enhance the reading experience for children through interactive multimedia content.</p><p>The platform includes animated story adaptations, vocabulary games, and discussion guides that teachers can use to create engaging classroom experiences.</p><h3>Platform Features</h3><p>Available features include: interactive story maps, character voice-overs, comprehension quizzes, and printable activity sheets. The platform is accessible on tablets, computers, and smartboards.</p>', '/uploads/news/digital-platform.jpg', 'published', '2025-12-05 14:00:00', 1);

INSERT INTO post_tags (postId, tag) VALUES
(1, 'reading'), (1, 'child-development'), (1, 'storytelling'),
(2, 'visual-learning'), (2, 'child-development'), (2, 'literacy'),
(3, 'emotional-intelligence'), (3, 'child-development'), (3, 'empathy');

INSERT INTO news_tags (newsId, tag) VALUES
(1, 'education'), (1, 'community'), (1, 'initiative'),
(2, 'authors'), (2, 'publishing'), (2, 'literature'),
(3, 'technology'), (3, 'digital-learning'), (3, 'education');

INSERT INTO current_affairs (title, slug, content, coverImage, status, publishedAt, authorId) VALUES
('India Successfully Launches Chandrayaan-4 Mission', 'india-launches-chandrayaan-4-mission', '<p>India has successfully launched its Chandrayaan-4 mission, marking another significant achievement in space exploration. The mission, aimed at studying the lunar surface and collecting valuable scientific data, was launched from the Satish Dhawan Space Centre in Sriharikota.</p><p>The spacecraft carries advanced scientific instruments designed to study the moon\'s geology, mineral composition, and potential resources. This mission is expected to provide crucial data for future lunar exploration programs.</p><h3>Mission Objectives</h3><p>Chandrayaan-4 will focus on: mapping lunar surface minerals, studying lunar geology, analyzing surface chemistry, and collecting data for future manned missions.</p>', '/uploads/current-affairs/chandrayaan-4.jpg', 'published', '2025-12-15 06:00:00', 1),

('New Education Policy Implementation Begins Nationwide', 'new-education-policy-implementation', '<p>The Government of India has announced the nationwide implementation of the New Education Policy 2025, bringing significant changes to the education system. The policy aims to provide holistic education and skill development to students from early childhood to higher education.</p><p>Key highlights include increased focus on vocational education, emphasis on mother tongue instruction in early years, and flexible curriculum choices for students.</p><h3>Major Changes</h3><p>The policy introduces: flexible board examinations, multidisciplinary education, focus on skill development, and increased emphasis on research and innovation.</p>', '/uploads/current-affairs/education-policy.jpg', 'published', '2025-12-14 08:30:00', 1),

('India-US Strategic Partnership Strengthens', 'india-us-strategic-partnership', '<p>India and the United States have announced several new initiatives to strengthen their strategic partnership. The developments come amid growing concerns about regional security and economic cooperation in the Indo-Pacific region.</p><p>The partnership includes enhanced defense cooperation, technology sharing, and joint initiatives in critical and emerging technologies.</p><h3>Key Areas of Cooperation</h3><p>Focus areas include: defense technology, cybersecurity, critical minerals, semiconductors, and clean energy transition.</p>', '/uploads/current-affairs/india-us-partnership.jpg', 'published', '2025-12-13 10:00:00', 1);

INSERT INTO current_affairs_tags (currentAffairsId, tag) VALUES
(1, 'space'), (1, 'isro'), (1, 'science'), (1, 'technology'),
(2, 'education'), (2, 'policy'), (2, 'government'),
(3, 'diplomacy'), (3, 'international-relations'), (3, 'defense');

-- Sample data for poems
INSERT INTO poems (title, author, excerpt, content, status, publishedAt) VALUES
('The Road Not Taken', 'Robert Frost', 'Two roads diverged in a yellow wood...', 'Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;\n\nThen took the other, as just as fair,\nAnd having perhaps the better claim,\nBecause it was grassy and wanted wear;\nThough as for that the passing there\nHad worn them really about the same,\n\nAnd both that morning equally lay\nIn leaves no step had trodden black.\nOh, I kept the first for another day!\nYet knowing how way leads on to way,\nI doubted if I should ever come back.\n\nI shall be telling this with a sigh\nSomewhere ages and ages hence:\nTwo roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.', 'published', '2025-12-15 09:00:00'),

('If', 'Rudyard Kipling', 'If you can keep your head when all about you...', 'If you can keep your head when all about you\nAre losing theirs and blaming it on you,\nIf you can trust yourself when all men doubt you,\nBut make allowance for their doubting too;\nIf you can wait and not be tired by waiting,\nOr being lied about, don\'t deal in lies,\nOr being hated, don\'t give way to hating,\nAnd yet don\'t look too good, nor talk too wise:\n\nIf you can dream—and not make dreams your master;\nIf you can think—and not make thoughts your aim;\nIf you can meet with Triumph and Disaster\nAnd treat those two impostors just the same;\nIf you can bear to hear the truth you\'ve spoken\nTwisted by knaves to make a trap for fools,\nOr watch the things you gave your life to, broken,\nAnd stoop and build \'em up with worn-out tools:\n\nIf you can make one heap of all your winnings\nAnd risk it on one turn of pitch-and-toss,\nAnd lose, and start again at your beginnings\nAnd never breathe a word about your loss;\nIf you can force your heart and nerve and sinew\nTo serve your turn long after they are gone,\nAnd so hold on when there is nothing in you\nExcept the Will which says to them: \'Hold on!\'\n\nIf you can talk with crowds and keep your virtue,\nOr walk with Kings—nor lose the common touch,\nIf neither foes nor loving friends can hurt you,\nIf all men count with you, but none too much;\nIf you can fill the unforgiving minute\nWith sixty seconds\' worth of distance run,\nYours is the Earth and everything that\'s in it,\nAnd—which is more—you\'ll be a Man, my son!', 'published', '2025-12-14 10:00:00');

INSERT INTO poem_tags (poemId, tag) VALUES
(1, 'nature'), (1, 'choice'), (1, 'reflection'),
(2, 'inspiration'), (2, 'life'), (2, 'wisdom');

INSERT INTO admin_users (name, email, password, role) VALUES
('J & C Owner', 'admin@jc.com', '$2y$10$ENfVclRG7h7QobKrJTvpr.KjkRV9s7KjAYvaf03AbOB6e.s3ze5N2', 'owner'); -- Use password_hash() in PHP for real password