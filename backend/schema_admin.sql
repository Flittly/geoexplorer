-- ========================================
-- 管理后台扩展数据库表结构
-- ========================================

-- 1. 题目表 (题库)
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,                    -- 题目内容
    options JSONB NOT NULL,                    -- 选项数组 ["选项A", "选项B", "选项C", "选项D"]
    correct_answer INTEGER NOT NULL,           -- 正确答案索引 (0-3)
    explanation TEXT,                          -- 答案解析
    category VARCHAR(50) NOT NULL,             -- 类别: physical(自然地理), human(人文地理), regional(区域地理)
    difficulty VARCHAR(20) NOT NULL,           -- 难度: easy(简单), medium(中等), hard(困难)
    level_id UUID REFERENCES levels(id),       -- 关联关卡 (可选)
    image_url TEXT,                            -- 题目图片
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 题目表索引
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_level ON questions(level_id);

-- 2. 用户消息通知表
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- 接收用户ID (NULL表示全员广播)
    title VARCHAR(200) NOT NULL,               -- 消息标题
    content TEXT NOT NULL,                     -- 消息内容
    type VARCHAR(50) DEFAULT 'system',         -- 消息类型: system(系统), course(课程), achievement(成就), reminder(提醒)
    is_read BOOLEAN DEFAULT FALSE,             -- 是否已读
    is_broadcast BOOLEAN DEFAULT FALSE,        -- 是否广播消息
    sent_by UUID REFERENCES users(id),         -- 发送者ID (管理员)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE           -- 阅读时间
);

-- 消息通知表索引
CREATE INDEX IF NOT EXISTS idx_notifications_user ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON user_notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON user_notifications(created_at DESC);

-- 3. 管理员表 (用于管理后台登录)
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,     -- 管理员用户名
    password_hash TEXT NOT NULL,               -- 密码哈希
    email VARCHAR(255) UNIQUE NOT NULL,        -- 邮箱
    name VARCHAR(100),                         -- 显示名称
    role VARCHAR(50) DEFAULT 'editor',         -- 角色: super_admin(超级管理员), admin(管理员), editor(编辑)
    is_active BOOLEAN DEFAULT TRUE,            -- 是否启用
    last_login_at TIMESTAMP WITH TIME ZONE,    -- 最后登录时间
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 管理员表索引
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- 4. 操作日志表 (记录管理员操作)
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admins(id),       -- 操作管理员ID
    action VARCHAR(100) NOT NULL,              -- 操作类型: create, update, delete, send_notification等
    target_table VARCHAR(100),                 -- 操作的表名
    target_id UUID,                            -- 操作的记录ID
    details JSONB,                             -- 操作详情
    ip_address INET,                           -- IP地址
    user_agent TEXT,                           -- 用户代理
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 操作日志表索引
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at DESC);

-- ========================================
-- 触发器：自动更新 updated_at 字段
-- ========================================

-- 题目表 updated_at 触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 管理员表 updated_at 触发器
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 初始数据：创建默认管理员
-- 密码: admin123 (使用 bcrypt 哈希)
-- ========================================

INSERT INTO admins (username, password_hash, email, name, role)
VALUES (
    'admin',
    '$2b$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',  -- 请使用 bcrypt 生成实际密码哈希
    'admin@geoexplorer.com',
    '系统管理员',
    'super_admin'
)
ON CONFLICT (username) DO NOTHING;

-- ========================================
-- 扩展说明
-- ========================================

COMMENT ON TABLE questions IS '题库表，存储所有地理学习题目';
COMMENT ON TABLE user_notifications IS '用户消息通知表，支持定向发送和广播';
COMMENT ON TABLE admins IS '管理员表，用于管理后台登录和权限控制';
COMMENT ON TABLE admin_logs IS '管理员操作日志表，用于审计追踪';
