-- Course purchasing system tables

CREATE TABLE IF NOT EXISTS course_packages (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url TEXT,
    category VARCHAR(50),
    original_price INT NOT NULL DEFAULT 0 COMMENT 'Original price in cents',
    selling_price INT NOT NULL DEFAULT 0 COMMENT 'Selling price in cents',
    expire_days INT NOT NULL DEFAULT 365 COMMENT 'Access days after purchase',
    course_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured)
);

CREATE TABLE IF NOT EXISTS courses (
    id CHAR(36) PRIMARY KEY,
    package_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL COMMENT 'iframe embed URL',
    cover_url TEXT,
    duration VARCHAR(20) COMMENT 'Format: mm:ss',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_package_id (package_id),
    FOREIGN KEY (package_id) REFERENCES course_packages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT 'Format: GEOyyyyMMddHHmmssxxxx',
    total_amount INT NOT NULL DEFAULT 0 COMMENT 'Total amount in cents',
    status ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
    payment_method VARCHAR(20) COMMENT 'WECHAT / ALIPAY',
    payment_time DATETIME,
    expire_time DATETIME COMMENT 'Auto-cancel if unpaid',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_order_no (order_no),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    package_id CHAR(36) NOT NULL,
    price INT NOT NULL DEFAULT 0 COMMENT 'Price at purchase time in cents',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES course_packages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_purchases (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    package_id CHAR(36) NOT NULL,
    order_id CHAR(36) NOT NULL,
    purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expire_at DATETIME NOT NULL,
    is_expired BOOLEAN DEFAULT FALSE,
    UNIQUE INDEX idx_user_package (user_id, package_id),
    INDEX idx_user_id (user_id),
    INDEX idx_expire_at (expire_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES course_packages(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_course_progress (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    course_id CHAR(36) NOT NULL,
    package_id CHAR(36) NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'NOT_STARTED',
    progress_percent INT DEFAULT 0 COMMENT '0-100',
    last_position INT DEFAULT 0 COMMENT 'Last playback position in seconds',
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_user_course (user_id, course_id),
    INDEX idx_user_package (user_id, package_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES course_packages(id) ON DELETE CASCADE
);
