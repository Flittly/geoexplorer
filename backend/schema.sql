-- GeoExplorer Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    level VARCHAR(50) DEFAULT '初学者',
    total_stars INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Daily Trivia table (每日百科)
-- ============================================
CREATE TABLE IF NOT EXISTS daily_trivia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url TEXT,
    location VARCHAR(100),
    region VARCHAR(100),
    featured_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Levels table (学习关卡)
-- ============================================
CREATE TABLE IF NOT EXISTS levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    unlock_requirement INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- User Level Progress table (用户关卡进度)
-- ============================================
CREATE TABLE IF NOT EXISTS user_level_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'locked',
    score INTEGER DEFAULT 0,
    stars INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, level_id)
);

-- ============================================
-- Mistakes table (错题集)
-- ============================================
CREATE TABLE IF NOT EXISTS mistakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    question TEXT,
    category VARCHAR(50),
    mastery_level VARCHAR(20),
    image_url TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Geographic Features table (地理特征/地图库)
-- ============================================
CREATE TABLE IF NOT EXISTS geographic_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    feature_type VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    region VARCHAR(100),
    image_url TEXT,
    stats JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- AR Landforms table (AR地貌模型)
-- ============================================
CREATE TABLE IF NOT EXISTS ar_landforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(200),
    type VARCHAR(50),
    image_url TEXT,
    elevation INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Create indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_daily_trivia_date ON daily_trivia(featured_date);
CREATE INDEX IF NOT EXISTS idx_levels_order ON levels(order_index);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_level_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_level ON user_level_progress(level_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_user ON mistakes(user_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_category ON mistakes(category);
CREATE INDEX IF NOT EXISTS idx_geo_features_type ON geographic_features(feature_type);
CREATE INDEX IF NOT EXISTS idx_ar_landforms_type ON ar_landforms(type);

-- ============================================
-- Insert sample data
-- ============================================

-- Sample user
INSERT INTO users (id, name, avatar_url, level, total_stars) 
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Alex',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCJlC6i-GX8uG7cjiRQSTfVaEJIZn3Gso0HxkCA4ttXcyCvdT7GybSqY1yhQGMn7L1LsM_W0amrWj6WGwFjjZKlh7nZEjt_e0GvrKTfDNHO5bvEO7Y4DN00qSs4Uzte6ZgqBS0NSsD5fyUKGePGwpWltJCnL6ItWwPf9WqjObykoz1swallvLNQc4MZL_8_XQxfWCpvscMKYox9GKuWrK8Yqm_3cNtvY7N4rkHIHKsZxDcVXz8-1I9bD2JHPBRp_FOpuslPtQ5USRDZ',
    '初学者',
    45
) ON CONFLICT (id) DO NOTHING;

-- Sample daily trivia
INSERT INTO daily_trivia (title, description, image_url, location, region, featured_date)
VALUES (
    '阿塔卡马沙漠',
    '是世界上除极地外最干旱的地方。那里的某些气象站从未有过降雨记录。',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAvRoGHJUMVXrXCoOa_ExHzawnBPbV5hRGNAaxcE6DNmCkR7_-QZknxw2QD7b5OmFGEbsWEcUN4rN_k_FFUJCq4FqyryK88491OB7W2ndIGjy0xIqOy64T_WVpbrOAzqNO65wvkPCL61hU399-g8ggQ0vNScK-uStP1xSqzoF5l5VEJs28Bep_PvyN05noYg4HaTqVjqwnDIoAmLmCJGBX3wCxzF2BQ3T_bmKBC28b3AtrdvIcUpXTGStW4wBE-caIuv3BWwR6Us09s',
    '智利',
    '南美洲',
    CURRENT_DATE
);

-- Sample levels
INSERT INTO levels (name, description, order_index, unlock_requirement) VALUES
    ('太阳系', '探索太阳系的行星和卫星', 1, 0),
    ('板块构造', '地球板块运动与地质变化', 2, 0),
    ('岩石圈循环', '岩浆岩、沉积岩和变质岩的转化过程', 3, 2),
    ('全球贸易网络', '国际贸易与经济地理', 4, 3),
    ('气候系统', '全球气候模式与变化', 5, 4);

-- Sample user level progress
INSERT INTO user_level_progress (user_id, level_id, status, score, stars, completion_percentage)
SELECT 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    id,
    CASE order_index
        WHEN 1 THEN 'completed'
        WHEN 2 THEN 'completed'
        WHEN 3 THEN 'active'
        ELSE 'locked'
    END,
    CASE order_index
        WHEN 1 THEN 380
        WHEN 2 THEN 450
        ELSE 0
    END,
    CASE order_index
        WHEN 1 THEN 2
        WHEN 2 THEN 3
        ELSE 0
    END,
    CASE order_index
        WHEN 1 THEN 92
        WHEN 2 THEN 100
        ELSE 0
    END
FROM levels;

-- Sample mistakes
INSERT INTO mistakes (user_id, title, question, category, mastery_level, image_url) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '大气环流', '解释北半球风向偏转的主要原因及其对气旋形成的影响。', 'physical', 'low', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVTVJSeXI0-vYmcD6YMgL161veZ4gzMMLRmjPr9JlHkMw0VjV7wS91YhKBYlJpWSDcjqvUp6yLKhcpSHZfqdLR5gfFrvGrP3vPsf6C_40_HTiWuHPoln8OjKf2dbwiCqWB7Arm8kkAtQQbKF7cc7lHeZGDP-bPHOo_Li4rvu3QevBzRq49e3ojjiml4p_kUVOioZafiDbdH59v5_AVngpgRZA23qij3f4lVlkKlGVBIECoze3SXNFlEictAZQokLuCPireadINbI8v'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '城市化', '北美标准城市的中心商务区（CBD）与欧洲模式有何主要区别？', 'human', 'medium', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyDmUvEiw-IEGC_hjRjeufKCoOYc8MXhu2fHPQ3a273G3tO3PbPSbX0riQ92VXv4kqgC5puUXt4MnmAYvOcTdoIxqVe7UlDO5HYvdcLdP_N5Zt_e8TaAK6xhw6zzyf-7JVzsqY1lpIsRjG_cZzdEWfoxWxB5bx96QFbkmui8lTrfIeIWaaYN_ItoFB9q5AcrsEwcnYqUtA1hSv8ZtC2qbzX3FLqXjMBIu7De9kxyvDomsLUfyDJ1zw-_YVxAaH5IEX3VvVulj7xaMy'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '板块构造', '识别大西洋中脊的板块边界类型，并描述相关的火山活动特征。', 'physical', 'critical', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAopS9Mi0VrJ_SNrqyZ9nTJScnNtUUitAeCwa70hVcawjBxO6nXGUSD-QgdEoYr3g5T3MPIgueVHisT5HCbFiaFMdoy7jLYbLbhvCS71H6YhPv26B6aj4wwisL62if-5UPp4VQT8PMkxwYmEQ0CfM90sXdj01iRHNaehShpB2xjCNryzHTbQb0-cCjoXGAhCRjVCBWTWDNCaFgFUwrKyRoLl7V-OyNfoaqgpSeVRyEdJvDZ7irZsUma6lBRaRoFzdCiKlq_TMyLSQvb');

-- Sample geographic feature
INSERT INTO geographic_features (name, description, feature_type, latitude, longitude, region, image_url, stats) VALUES
    ('火环 (环太平洋火山地震带)', '环绕太平洋边缘的马蹄形地带，这里活火山和地震活动频繁。全球约75%的活火山和休眠火山都分布于此。', 'volcanic_belt', 35.6762, 139.6503, '太平洋海盆', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAguUrUOwLmBkvDC8ktavChpifcEti-Fqt4nPqKN668GhbhUcEVIczoHNLOT6JBICPkf3WQSTOOGTQqeYg1sLJf-w3FpzZvf_W2wlNRLWB8RebNE7nJZZH-IlmfE4KgjDRq2x3g0d5dZ2G_AQAgFjZlB6WEFaK2hpVx1l9a7yzj8oBSDlfRrjjulvje7s-G8GvX68beixYPkXbkYpa6C6MdLMvXC11vMwOvo03I6CBIVWcBeRLDM9_MiCy1lhn8vPDZQdOxIZVfO8Ic', '{"volcanoes": 452, "active_percentage": 75, "length_km": 40000}');

-- Sample AR landforms
INSERT INTO ar_landforms (name, description, type, image_url, elevation) VALUES
    ('盆地', '洼地地形', 'basin', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbteVbQ0sa32oJuXjgLDVmvaD19LnBTEtHqH8n2V56o_eOYr82vQvYc-c9mcNZiTAY69hWKUQMk8gBOjIpMney81f5MzZtS4-WaYaaTbcLQs6ImGEkr1Qk9-gJhhzwdqCa8LXxTQ5M9JOyXbWdOK_xHinDUtSrrUXcjQhrznc_7zFJFziqTu0nE03fOgN0-2citcLO8oIs2HsvIx362dDp2lQwv5C-obe24IsH2_JX-aqa_LLIM1Zc-0-9jbtEvsmP-g2ubKLzgT0N', 1240),
    ('山峰', '高海拔', 'peak', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQcli__sM-0T1nstJTOl6SetpNyGEBznEa-Zsi6xaG1ixJqfs0HcgjvCs2Po6NzNoUI6tZbF6e8fmmKwtZcTqFzoPa-DbZaNGgWIWbolwDRIVFZ9CaFOhjJSJgnTi7DYOukp3W6tIyYKEJOErTFrIKjFBQ1DCWRokbvgs1sOSmA1JtE9SnxrHSHnwNTrZ6ZK7MhvwILC3iZvSXqOM2i-r0d1cLSwX74av7u8S4nGFX203DOYCteiflNN20_0erVYcF_I0paD7A06YI', 4500),
    ('山谷', '河流路径', 'valley', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2gpXpxJZuZSBZd2Ys7C0tWIMax-mUPYfYy5U0GZQlfKBf3WlO9NDSSlqCc9bNWpfprjN2zO_tweoiSl8X2HN7NqJ33y4TweqKFXbNTkU8dsSlN1suiDGLg2DJNX6uRmKLrsX3QiVvrEoR6fCtqGKoS7U629fAo_nSeuv-V804_VnLmTkAp0iVy7rg4IVfE5CkLGLY3PO3eYCpkMTFu5WtOel0dUdU_ssEMG29zHsU-0GskpHhtIGSTXGaL8fzhWthY-En3RGdkWAg', 800),
    ('悬崖', '垂直落差', 'cliff', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPhbbndKJv9XTmDhnfCUixfjC9B5RJ7FlGj3mPluThV6pBadflks3DXszXQ4ewuvGKzvwQFkUfvLmhl7bTbawbAZ4zWUpvBVipjIX-zqlVEErd1x9mZawxXnuK-BYdDA5t3AXDY4afolw6S_6ktlHNjzR__h9LZiMdE50rPIgfPj5OFRWvLdSeMWQJ6EM9kvSyAHUHq_tGKANQPyHDfF5lWWgu1Oa7xwqXfQdu7DgvgeK3_bv50DgfCHON90oGLihJJJfEQmrpSjnJ', 2000);

-- Enable Row Level Security for public access (adjust as needed)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_trivia ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_level_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE geographic_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE ar_landforms ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust based on your auth requirements)
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Public read access" ON daily_trivia FOR SELECT USING (true);
CREATE POLICY "Public read access" ON levels FOR SELECT USING (true);
CREATE POLICY "Public read access" ON user_level_progress FOR SELECT USING (true);
CREATE POLICY "Public read access" ON mistakes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON geographic_features FOR SELECT USING (true);
CREATE POLICY "Public read access" ON ar_landforms FOR SELECT USING (true);

-- Create policies for insert/update/delete (for development - adjust for production)
CREATE POLICY "Public write access" ON users FOR ALL USING (true);
CREATE POLICY "Public write access" ON daily_trivia FOR ALL USING (true);
CREATE POLICY "Public write access" ON levels FOR ALL USING (true);
CREATE POLICY "Public write access" ON user_level_progress FOR ALL USING (true);
CREATE POLICY "Public write access" ON mistakes FOR ALL USING (true);
CREATE POLICY "Public write access" ON geographic_features FOR ALL USING (true);
CREATE POLICY "Public write access" ON ar_landforms FOR ALL USING (true);
