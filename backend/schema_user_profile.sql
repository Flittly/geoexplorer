-- ============================================
-- Database Migration: Add Gender and Age to Users Table
-- 为 users 表添加性别和年龄字段
-- ============================================

-- Add gender column (性别: male-男, female-女, other-保密)
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other'));

-- Add age column (年龄: 1-120)
ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 1 AND age <= 120);

-- ============================================
-- Indexes for performance (optional)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_gender ON users(gender);

-- ============================================
-- Update existing rows to set default values if needed
-- ============================================
-- 注意：以下更新语句是可选的，如果需要为现有用户设置默认值，可以取消注释
-- UPDATE users SET gender = 'other' WHERE gender IS NULL;
-- UPDATE users SET age = 18 WHERE age IS NULL;
