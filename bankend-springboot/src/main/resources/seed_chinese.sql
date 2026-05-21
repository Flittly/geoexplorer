USE geoexplorer;
SET NAMES utf8mb4;

-- 更新关卡名称为中文
UPDATE levels SET name = '岩石循环', description = '了解岩石循环以及岩石是如何形成的' WHERE name = 'Rock Cycle';
UPDATE levels SET name = '板块构造', description = '了解板块构造和大陆漂移' WHERE name = 'Plate Tectonics';
UPDATE levels SET name = '天气与气候', description = '探索天气模式和气候系统' WHERE name = 'Weather & Climate';
UPDATE levels SET name = '河流与侵蚀', description = '了解河流如何通过侵蚀塑造地貌' WHERE name = 'Rivers & Erosion';
UPDATE levels SET name = '火山', description = '了解火山活动及其影响' WHERE name = 'Volcanoes';

-- 删除英文题目
DELETE FROM questions;

-- 插入中文题目 - 岩石循环关卡
INSERT INTO questions (id, level_id, question, options, correct_answer, explanation, order_index, is_active, created_at) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 '岩石的三大类型是什么？',
 '["火成岩、沉积岩、变质岩","花岗岩、石灰岩、大理石","矿物、晶体、化石","火山岩、海洋岩、大陆岩"]',
 0, '岩石的三大类型是火成岩（由岩浆冷却形成）、沉积岩（由压缩层形成）和变质岩（受热压变化形成）。',
 1, TRUE, NOW()),

('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 '火成岩是如何形成的？',
 '["由压缩沉积物形成","由冷却凝固的岩浆或熔岩形成","由热量和压力作用于现有岩石","由有机物积累形成"]',
 1, '火成岩是岩浆（地下）或熔岩（地表）冷却凝固后形成的。',
 2, TRUE, NOW()),

('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 '什么过程将沉积岩变成变质岩？',
 '["侵蚀","风化","高温高压","冷却"]',
 2, '变质岩是现有岩石受到强烈热量和压力后，发生物理和化学变化而形成的。',
 3, TRUE, NOW()),

('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 '哪种岩石最可能含有化石？',
 '["火成岩","沉积岩","变质岩","火山岩"]',
 1, '沉积岩是分层形成的，可以保存古代生物的化石。',
 4, TRUE, NOW()),

('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 '什么驱动了岩石循环？',
 '["风","仅水","地球内部热能和太阳能","仅重力"]',
 2, '岩石循环由地球内部热能（板块构造、火山活动）和太阳能（风化、侵蚀）共同驱动。',
 5, TRUE, NOW());
