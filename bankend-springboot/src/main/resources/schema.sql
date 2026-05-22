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
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '岩石循环', '了解岩石循环以及岩石是如何形成的', 1, 0, TRUE, NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', '板块构造', '了解板块构造和大陆漂移', 2, 5, TRUE, NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', '天气与气候', '探索天气模式和气候系统', 3, 10, TRUE, NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', '河流与侵蚀', '了解河流如何通过侵蚀塑造地貌', 4, 15, TRUE, NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', '火山', '了解火山活动及其影响', 5, 20, TRUE, NOW(), NOW());

-- Questions for 岩石循环 (Rock Cycle) level
INSERT INTO questions (id, level_id, question, options, correct_answer, explanation, order_index, is_active, created_at) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 '岩石的三大类型是什么？',
 '["火成岩、沉积岩、变质岩","花岗岩、石灰岩、大理石","矿物、晶体、化石","火山岩、海洋岩、大陆岩"]',
 0, '岩石的三大类型是火成岩（由岩浆冷却形成）、沉积岩（由压缩层形成）和变质岩（受热压变化形成）。', 1, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 '火成岩是如何形成的？',
 '["由压缩沉积物形成","由冷却凝固的岩浆或熔岩形成","由热量和压力作用于现有岩石","由有机物积累形成"]',
 1, '火成岩是岩浆（地下）或熔岩（地表）冷却凝固后形成的。', 2, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 '什么过程将沉积岩变成变质岩？',
 '["侵蚀","风化","高温高压","冷却"]',
 2, '变质岩是现有岩石受到强烈热量和压力后，发生物理和化学变化而形成的。', 3, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 '哪种岩石最可能含有化石？',
 '["火成岩","沉积岩","变质岩","火山岩"]',
 1, '沉积岩是分层形成的，可以保存古代生物的化石。', 4, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 '什么驱动了岩石循环？',
 '["风","仅水","地球内部热能和太阳能","仅重力"]',
 2, '岩石循环由地球内部热能（板块构造、火山活动）和太阳能（风化、侵蚀）共同驱动。', 5, TRUE, NOW());

-- Questions for 板块构造 (Plate Tectonics) level
INSERT INTO questions (id, level_id, question, options, correct_answer, explanation, order_index, is_active, created_at) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
 '地球的岩石圈被分为多少个主要板块？',
 '["5个","7个","9个","12个"]',
 1, '地球岩石圈被划分为7个主要板块：太平洋板块、北美板块、欧亚板块、非洲板块、南美板块、印度-澳大利亚板块和南极板块。',
 1, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
 '谁提出了大陆漂移学说？',
 '["查尔斯·达尔文","阿尔弗雷德·魏格纳","艾萨克·牛顿","伽利略·伽利莱"]',
 1, '德国气象学家阿尔弗雷德·魏格纳在1912年提出了大陆漂移学说，为现代板块构造理论奠定了基础。',
 2, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
 '板块构造的主要驱动力是什么？',
 '["地球自转","地幔对流","月球引力","太阳风"]',
 1, '地幔对流是板块构造的主要驱动力，地幔中的热物质上升、冷物质下沉，带动上方的板块移动。',
 3, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
 '喜马拉雅山脉是由哪两个板块碰撞形成的？',
 '["太平洋板块和北美板块","印度-澳大利亚板块和欧亚板块","南美板块和非洲板块","纳斯卡板块和南美板块"]',
 1, '约5000万年前，印度-澳大利亚板块与欧亚板块碰撞，形成了喜马拉雅山脉和青藏高原。',
 4, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a0a', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
 '哪种板块边界会产生新地壳？',
 '["汇聚边界","离散边界","转换边界","所有边界"]',
 1, '在离散边界（如大洋中脊），板块相互分离，岩浆上涌冷却形成新的洋壳。',
 5, TRUE, NOW());

-- Questions for 天气与气候 (Weather & Climate) level
INSERT INTO questions (id, level_id, question, options, correct_answer, explanation, order_index, is_active, created_at) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a0b', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
 '地球大气中最丰富的两种气体是什么？',
 '["氧气和二氧化碳","氮气和氧气","氢气和氦气","氩气和氧气"]',
 1, '地球大气中氮气约占78%、氧气约占21%，两者合计占大气的99%以上。',
 1, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a0c', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
 '风是如何形成的？',
 '["地球自转产生的","空气从高压区流向低压区","海洋温度变化","月球的引力作用"]',
 1, '风是由气压差驱动的，空气从高压区向低压区流动，气压差越大风速越强。',
 2, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a0d', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
 '温室效应主要由哪种气体引起？',
 '["氧气","氮气","二氧化碳","氩气"]',
 2, '二氧化碳是最主要的温室气体，燃烧化石燃料和森林砍伐导致大气中二氧化碳浓度持续上升。',
 3, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a0e', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
 '季风气候的典型特征是什么？',
 '["全年干燥","明显的旱季和雨季","全年寒冷","全年温暖潮湿"]',
 1, '季风气候的特点是季节性风向反转，带来明显的旱季和雨季，主要分布在亚洲和非洲。',
 4, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a0f', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
 '天气和气候的主要区别是什么？',
 '["没有区别","天气是短期大气状态，气候是长期平均","天气看温度，气候看降水","气候每天变化，天气年复一年"]',
 1, '天气指某时某地的大气状态（如今天下雨），气候则是长期（通常30年）的天气统计平均。',
 5, TRUE, NOW());

-- Questions for 河流与侵蚀 (Rivers & Erosion) level
INSERT INTO questions (id, level_id, question, options, correct_answer, explanation, order_index, is_active, created_at) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
 '河流流速最快的部分通常在哪里？',
 '["河床底部","河岸两侧","河流中上层","河流转弯处内侧"]',
 2, '河流中上层受河床摩擦力最小，流速最快。河床底部和河岸两侧因摩擦力较大流速较慢。',
 1, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
 'V型谷是由什么侵蚀作用形成的？',
 '["冰川侵蚀","河流下切侵蚀","风力侵蚀","化学风化"]',
 1, '河流在山区向下切割河床，形成深而窄的V型谷。这是河流下切侵蚀的典型地貌。',
 2, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
 '三角洲通常在河流的什么位置形成？',
 '["源头","上游","中游","入海口"]',
 3, '河流在入海口流速骤减，携带的沉积物堆积形成三角洲，如长江三角洲和尼罗河三角洲。',
 3, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
 '河流搬运沉积物的方式不包括以下哪项？',
 '["溶解","悬浮","跳跃","蒸发"]',
 3, '河流搬运沉积物的主要方式有：溶解搬运（离子形式）、悬浮搬运（悬浮水中）、跳跃搬运和滚动搬运。蒸发不属于搬运方式。',
 4, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
 '瀑布通常在什么地质条件下形成？',
 '["河流流速减慢时","河流遇到不同硬度的岩层时","河流温度升高时","河流结冰时"]',
 1, '当河流流经硬岩层后遇到较软的岩层时，软岩被侵蚀更快，形成陡坎，从而形成瀑布。',
 5, TRUE, NOW());

-- Questions for 火山 (Volcanoes) level
INSERT INTO questions (id, level_id, question, options, correct_answer, explanation, order_index, is_active, created_at) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
 '火山喷发的主要驱动力是什么？',
 '["太阳热能","地球内部岩浆压力","风化作用","潮汐力"]',
 1, '地幔中的岩石熔融形成岩浆，岩浆中溶解的气体膨胀产生巨大压力，推动岩浆喷出地表。',
 1, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
 '以下哪个不属于火山的主要类型？',
 '["盾形火山","复合火山（层火山）","火山锥","沉积火山"]',
 3, '火山的主要类型包括盾形火山（如夏威夷）、复合火山（如富士山）和火山锥。沉积火山不是火山类型。',
 2, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
 '环太平洋火山带是什么？',
 '["太平洋中的岛屿链","环太平洋的火山和地震活跃区","一条海底山脉","海洋热泉分布区"]',
 1, '环太平洋火山带是一个围绕太平洋的巨大火山和地震活动带，拥有全球75%以上的活火山。',
 3, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
 '火山喷发中危害最大的喷发物是什么？',
 '["熔岩流","火山灰和火山碎屑流","火山气体","火山弹"]',
 1, '火山碎屑流是高温气体和火山碎屑的混合物，温度可达1000°C，速度可达700km/h，是火山喷发中最致命的危害。',
 4, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
 '著名的维苏威火山位于哪个国家？',
 '["日本","意大利","印度尼西亚","美国"]',
 1, '维苏威火山位于意大利那不勒斯湾畔，公元79年的大喷发掩埋了庞贝古城，是历史上最著名的火山喷发之一。',
 5, TRUE, NOW());

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
