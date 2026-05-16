-- GeoExplorer Database Schema for MySQL

CREATE DATABASE IF NOT EXISTS geoexplorer DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE geoexplorer;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    age INT,
    level ENUM('BEGINNER', 'LEARNER', 'SCHOLAR', 'EXPLORER', 'MASTER') DEFAULT 'BEGINNER',
    total_stars INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_phone (phone)
) ENGINE=InnoDB;

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_refresh_tokens_user_id (user_id)
) ENGINE=InnoDB;

-- Verification codes table
CREATE TABLE IF NOT EXISTS verification_codes (
    id CHAR(36) PRIMARY KEY,
    target VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_verification_codes_target (target)
) ENGINE=InnoDB;

-- Levels table
CREATE TABLE IF NOT EXISTS levels (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    unlock_requirement INT DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_levels_order_index (order_index)
) ENGINE=InnoDB;

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id CHAR(36) PRIMARY KEY,
    level_id CHAR(36) NOT NULL,
    question TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer INT NOT NULL,
    explanation TEXT,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_questions_level_id (level_id),
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- User level progress table
CREATE TABLE IF NOT EXISTS user_level_progress (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    level_id CHAR(36) NOT NULL,
    status ENUM('LOCKED', 'ACTIVE', 'COMPLETED') DEFAULT 'LOCKED',
    score INT DEFAULT 0,
    stars INT DEFAULT 0,
    completion_percentage DOUBLE DEFAULT 0.0,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_user_level_progress_user_level (user_id, level_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Quiz results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    question_id CHAR(36) NOT NULL,
    selected_answer INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_quiz_results_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Mistakes table
CREATE TABLE IF NOT EXISTS mistakes (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    question TEXT,
    category ENUM('PHYSICAL', 'HUMAN', 'REGIONAL'),
    mastery_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'LOW',
    image_url TEXT,
    explanation TEXT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_mistakes_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Daily trivia table
CREATE TABLE IF NOT EXISTS daily_trivia (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    location VARCHAR(255),
    region VARCHAR(255),
    featured_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_daily_trivia_featured_date (featured_date)
) ENGINE=InnoDB;

-- Geographic features table
CREATE TABLE IF NOT EXISTS geographic_features (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    feature_type VARCHAR(100),
    latitude DOUBLE,
    longitude DOUBLE,
    region VARCHAR(255),
    image_url TEXT,
    stats JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- AR landforms table
CREATE TABLE IF NOT EXISTS ar_landforms (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('BASIN', 'PEAK', 'VALLEY', 'CLIFF') NOT NULL,
    image_url TEXT,
    elevation DOUBLE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- Community Module Tables
-- ============================================================

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    post_type ENUM('share', 'checkin', 'question') NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    images JSON,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    favorite_count INT DEFAULT 0,
    is_top BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_posts_user_id (user_id),
    INDEX idx_posts_type (post_type),
    INDEX idx_posts_status (status),
    INDEX idx_posts_created (created_at DESC),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Question details table
CREATE TABLE IF NOT EXISTS question_details (
    post_id CHAR(36) PRIMARY KEY,
    is_accepted BOOLEAN DEFAULT FALSE,
    accepted_answer_id CHAR(36),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    parent_id CHAR(36),
    content TEXT NOT NULL,
    images JSON,
    is_accepted BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_comments_post_id (post_id),
    INDEX idx_comments_user_id (user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    target_id CHAR(36) NOT NULL,
    target_type ENUM('post', 'comment') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_likes_user_target (user_id, target_id, target_type),
    INDEX idx_likes_target (target_id, target_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    post_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_favorites_user_post (user_id, post_id),
    INDEX idx_favorites_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed data

-- Test user (password: password123)
INSERT INTO users (id, name, email, phone, password_hash, avatar_url, level, total_stars, is_verified, is_active, created_at, updated_at)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Test User', 'test@example.com', '13800138000',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        NULL, 'BEGINNER', 0, TRUE, TRUE, NOW(), NOW());

-- Levels
INSERT INTO levels (id, name, description, order_index, unlock_requirement, is_active, created_at, updated_at) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Rock Cycle', 'Learn about the rock cycle and how rocks are formed', 1, 0, TRUE, NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Plate Tectonics', 'Understanding plate tectonics and continental drift', 2, 5, TRUE, NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Weather & Climate', 'Explore weather patterns and climate systems', 3, 10, TRUE, NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Rivers & Erosion', 'How rivers shape the landscape through erosion', 4, 15, TRUE, NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Volcanoes', 'Understanding volcanic activity and its effects', 5, 20, TRUE, NOW(), NOW());

-- Questions for Rock Cycle level
INSERT INTO questions (id, level_id, question, options, correct_answer, explanation, order_index, is_active, created_at) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 'What are the three main types of rocks?',
 '["Igneous, Sedimentary, Metamorphic", "Granite, Limestone, Marble", "Mineral, Crystal, Fossil", "Volcanic, Oceanic, Continental"]',
 0, 'The three main types of rocks are igneous (formed from cooled magma), sedimentary (formed from compressed layers), and metamorphic (changed by heat and pressure).', 1, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 'How is igneous rock formed?',
 '["From compressed sediments", "From cooled and solidified magma or lava", "From heat and pressure on existing rocks", "From organic material accumulation"]',
 1, 'Igneous rock forms when magma (below surface) or lava (above surface) cools and solidifies.', 2, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 'What process turns sedimentary rock into metamorphic rock?',
 '["Erosion", "Weathering", "Heat and pressure", "Cooling"]',
 2, 'Metamorphic rock is formed when existing rocks are subjected to intense heat and pressure, causing physical and chemical changes.', 3, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 'Which type of rock is most likely to contain fossils?',
 '["Igneous", "Sedimentary", "Metamorphic", "Volcanic"]',
 1, 'Sedimentary rocks are formed in layers and can preserve fossils of ancient organisms.', 4, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 'What drives the rock cycle?',
 '["Wind", "Water only", "Earth internal heat and solar energy", "Gravity alone"]',
 2, 'The rock cycle is driven by Earth internal heat (plate tectonics, volcanism) and solar energy (weathering, erosion).', 5, TRUE, NOW());

-- Daily trivia
INSERT INTO daily_trivia (id, title, description, image_url, location, region, featured_date, is_active, created_at) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'The Grand Canyon', 'The Grand Canyon is over 277 miles long and up to 18 miles wide, carved by the Colorado River over millions of years.',
 NULL, 'Arizona, USA', 'North America', CURDATE(), TRUE, NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Mount Everest', 'Mount Everest is the highest mountain above sea level at 8,849 meters, located in the Himalayas.',
 NULL, 'Nepal/Tibet', 'Asia', DATE_SUB(CURDATE(), INTERVAL 1 DAY), TRUE, NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'The Amazon Rainforest', 'The Amazon is the world largest tropical rainforest, spanning 9 countries and covering 5.5 million square kilometers.',
 NULL, 'South America', 'South America', DATE_SUB(CURDATE(), INTERVAL 2 DAY), TRUE, NOW());

-- Geographic features
INSERT INTO geographic_features (id, name, description, feature_type, latitude, longitude, region, image_url, stats, is_active, created_at) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Pacific Ocean', 'The Pacific Ocean is the largest and deepest ocean on Earth.', 'ocean',
 0.0, -160.0, 'Pacific', NULL, '{"area_sq_km": 165250000, "avg_depth_m": 4280}', TRUE, NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Sahara Desert', 'The Sahara is the largest hot desert in the world.', 'desert',
 23.0, 13.0, 'Africa', NULL, '{"area_sq_km": 9200000, "avg_temp_c": 30}', TRUE, NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Himalayan Mountains', 'The Himalayas are the highest mountain range in the world.', 'mountain',
 28.0, 84.0, 'Asia', NULL, '{"highest_peak_m": 8849, "length_km": 2400}', TRUE, NOW());

-- AR landforms
INSERT INTO ar_landforms (id, name, description, type, image_url, elevation, is_active, created_at) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Grand Canyon', 'A steep-sided canyon carved by the Colorado River in Arizona.', 'VALLEY', NULL, 2100.0, TRUE, NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Mount Fuji', 'An active stratovolcano and the highest peak in Japan.', 'PEAK', NULL, 3776.0, TRUE, NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Dead Sea Rift', 'A geological depression and the lowest point on Earth surface.', 'VALLEY', NULL, -430.0, TRUE, NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'White Cliffs of Dover', 'Iconic chalk cliffs on the English Channel coast.', 'CLIFF', NULL, 110.0, TRUE, NOW());
