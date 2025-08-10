-- Board Game Studio Database Schema (Node.js Version)
-- Run this script in your cPanel MySQL database

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(500),
    bio TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    skills JSON,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_date (created_date)
);

-- Create Projects table  
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content LONGTEXT,
    image_url VARCHAR(500),
    tags JSON,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_by INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_date (created_date),
    INDEX idx_created_by (created_by),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company VARCHAR(255),
    location VARCHAR(255),
    type ENUM('Full-time', 'Part-time', 'Contract', 'Freelance') DEFAULT 'Contract',
    salary_range VARCHAR(100),
    requirements TEXT,
    posted_by INT,
    status ENUM('active', 'closed', 'draft') DEFAULT 'active',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_date (created_date),
    INDEX idx_posted_by (posted_by),
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE,
    time TIME,
    location VARCHAR(255),
    event_type ENUM('workshop', 'conference', 'meetup', 'online', 'tournament') DEFAULT 'meetup',
    max_participants INT,
    registration_required BOOLEAN DEFAULT FALSE,
    created_by INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_created_date (created_date),
    INDEX idx_created_by (created_by),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Forum Posts table
CREATE TABLE IF NOT EXISTS forum_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT,
    category ENUM('general', 'design', 'publishing', 'feedback', 'showcase') DEFAULT 'general',
    status ENUM('published', 'draft', 'archived') DEFAULT 'published',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_created_date (created_date),
    INDEX idx_author_id (author_id),
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Resources/Design Diaries table
CREATE TABLE IF NOT EXISTS design_diaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    author_id INT,
    is_published BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    tags JSON,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_published (is_published),
    INDEX idx_featured (featured),
    INDEX idx_created_date (created_date),
    INDEX idx_author_id (author_id),
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Service Providers table
CREATE TABLE IF NOT EXISTS service_providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    service_type ENUM('artist', 'designer', 'writer', 'publisher', 'manufacturer', 'consultant') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    portfolio_url VARCHAR(500),
    rate VARCHAR(100),
    availability ENUM('available', 'busy', 'unavailable') DEFAULT 'available',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_service_type (service_type),
    INDEX idx_availability (availability),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (email, name, profile_picture, bio, location, skills) VALUES
('designer@boardgamestudio.com', 'Board Game Designer', 'https://via.placeholder.com/100x100?text=User1', 'Passionate board game designer with 5+ years experience creating strategic and engaging games.', 'Melbourne, Australia', '["Game Design", "Strategy Games", "Prototyping"]'),
('artist@boardgamestudio.com', 'Game Artist', 'https://via.placeholder.com/100x100?text=User2', 'Professional illustrator specializing in fantasy themes and character design for board games.', 'Sydney, Australia', '["Illustration", "Character Design", "Fantasy Art"]'),
('publisher@boardgamestudio.com', 'Indie Publisher', 'https://via.placeholder.com/100x100?text=User3', 'Small indie publisher looking for great games to publish and bring to market.', 'Brisbane, Australia', '["Publishing", "Marketing", "Distribution"]');

INSERT INTO projects (title, description, content, image_url, tags, status, created_by) VALUES
('Medieval Kingdom Builder', 'A strategic city-building game set in medieval times where players compete to build the most prosperous kingdom', 'In this game, players take on the role of medieval lords building their kingdoms from scratch. The game features resource management, strategic placement of buildings, and political maneuvering to achieve victory.', 'https://via.placeholder.com/300x200?text=Medieval+Kingdom', '["Strategy", "City Building", "Medieval", "Resource Management"]', 'published', 1),
('Space Colony Expansion', 'Colonize planets and build your space empire in this epic 4X strategy game', 'Players explore the galaxy, expand their territory, exploit resources, and exterminate enemies in this comprehensive space strategy experience.', 'https://via.placeholder.com/300x200?text=Space+Colony', '["Sci-Fi", "Strategy", "4X", "Space"]', 'published', 2),
('Dungeon Delvers', 'A cooperative dungeon crawler with modular board and character progression', 'Work together as a team of adventurers to explore dangerous dungeons, fight monsters, and collect treasure in this cooperative adventure game.', 'https://via.placeholder.com/300x200?text=Dungeon+Delvers', '["Co-op", "Dungeon Crawler", "Fantasy", "Adventure"]', 'published', 1);

INSERT INTO jobs (title, description, company, location, type, posted_by) VALUES
('Fantasy Game Artist Needed', 'Looking for talented artist to create artwork for upcoming fantasy board game. Must have experience with medieval themes and character design. Portfolio required.', 'Mystic Games Studio', 'Remote', 'Contract', 3),
('Board Game Playtester', 'We need experienced playtesters for our new strategy game. Must be available for weekly sessions and provide detailed feedback.', 'Indie Games Collective', 'Melbourne, Australia', 'Part-time', 1),
('Game Publisher Partnership', 'Seeking publishing partner for completed worker placement game. Game is fully designed, tested, and ready for production.', 'Solo Designer', 'Australia-wide', 'Contract', 2);

INSERT INTO events (title, description, date, location, event_type, created_by) VALUES
('Board Game Design Workshop', 'Learn the fundamentals of board game design from industry professionals. Covers ideation, prototyping, and playtesting.', '2024-02-15', 'Melbourne Convention Centre', 'workshop', 1),
('Playtesting Night', 'Monthly playtesting event for designers to test their prototypes with fellow designers and enthusiasts.', '2024-02-20', 'Local Game Store, Sydney', 'meetup', 2),
('Publisher Speed Dating', 'Meet with publishers and pitch your game concepts in structured 10-minute sessions.', '2024-03-01', 'Online via Zoom', 'online', 3);

INSERT INTO design_diaries (title, content, author_id, is_published, featured, tags) VALUES
('Getting Started with Board Game Design', 'Board game design can seem daunting at first, but with the right approach, anyone can create engaging games. Here are the key steps to get started: 1. Start with a theme or mechanic you love, 2. Create a simple prototype, 3. Playtest early and often, 4. Iterate based on feedback, 5. Keep refining until it feels right.', 1, TRUE, TRUE, '["Beginner", "Design Process", "Tips"]'),
('Balancing Your Game Mechanics', 'Game balance is crucial for player enjoyment. In this article, we explore different approaches to balancing game mechanics, including mathematical analysis, extensive playtesting, and player feedback integration.', 2, TRUE, FALSE, '["Game Balance", "Mechanics", "Advanced"]'),
('Art Direction for Indie Games', 'Creating compelling artwork on a budget requires creativity and planning. Here\'s how indie designers can achieve professional-looking games without breaking the bank.', 2, TRUE, FALSE, '["Art Direction", "Budget", "Indie Games"]');
