ALTER TABLE geographic_features
  ADD COLUMN grade_level VARCHAR(10) DEFAULT NULL COMMENT '高一/高二/高三' AFTER stats,
  ADD COLUMN textbook VARCHAR(20) DEFAULT NULL COMMENT '人教版/鲁教版/湘教版/中图版' AFTER grade_level,
  ADD COLUMN source_type VARCHAR(20) DEFAULT NULL COMMENT '知识点/高考真题/模拟题' AFTER textbook,
  ADD COLUMN category VARCHAR(20) DEFAULT NULL COMMENT '地质/地形/生态/水文/人文/气候' AFTER source_type,
  ADD COLUMN min_zoom INT DEFAULT 5 COMMENT '完整标记显示的最小缩放级别' AFTER category,
  ADD COLUMN level_id CHAR(36) DEFAULT NULL COMMENT '关联的闯关关卡ID' AFTER min_zoom;
