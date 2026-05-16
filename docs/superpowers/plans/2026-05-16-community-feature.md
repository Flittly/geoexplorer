# 社区功能实现计划

> **For agentic workers:** 使用 superpowers:executing-plans 或 superpowers:subagent-driven-development 逐任务执行。

**Goal:** 为 GeoExplorer 添加社区功能，包含学习分享、打卡动态、问答交流三个模块，支持点赞、评论、收藏、采纳和审核。

**Architecture:** 基础表 + 扩展表方案。posts 表存储所有类型内容，question_details 存储问答扩展字段。评论、点赞、收藏通过独立关系表关联。审核机制通过 status 字段控制。

**Tech Stack:** Spring Boot 4.0.6, MyBatis 4.0.1, MySQL 8, React 19, TypeScript, Tailwind CSS

---

## 文件结构

### 后端（Spring Boot）

| 文件 | 职责 |
|------|------|
| `entity/Post.java` | 帖子实体 |
| `entity/Comment.java` | 评论实体 |
| `entity/QuestionDetail.java` | 问答扩展实体 |
| `entity/Like.java` | 点赞实体 |
| `entity/Favorite.java` | 收藏实体 |
| `entity/enums/PostType.java` | 帖子类型枚举 |
| `entity/enums/PostStatus.java` | 审核状态枚举 |
| `entity/enums/TargetType.java` | 点赞目标类型枚举 |
| `mapper/PostMapper.java` + XML | 帖子数据访问 |
| `mapper/CommentMapper.java` + XML | 评论数据访问 |
| `mapper/QuestionDetailMapper.java` + XML | 问答扩展数据访问 |
| `mapper/LikeMapper.java` + XML | 点赞数据访问 |
| `mapper/FavoriteMapper.java` + XML | 收藏数据访问 |
| `dto/PostCreateRequest.java` | 发帖请求 |
| `dto/PostResponse.java` | 帖子响应（含作者信息、互动状态） |
| `dto/CommentCreateRequest.java` | 评论请求 |
| `dto/CommentResponse.java` | 评论响应 |
| `service/PostService.java` | 帖子业务逻辑 |
| `service/CommentService.java` | 评论业务逻辑 |
| `service/LikeService.java` | 点赞业务逻辑 |
| `service/FavoriteService.java` | 收藏业务逻辑 |
| `controller/PostController.java` | 帖子接口 |
| `controller/CommentController.java` | 评论接口 |
| `controller/LikeController.java` | 点赞接口 |
| `controller/FavoriteController.java` | 收藏接口 |

### 前端（React）

| 文件 | 职责 |
|------|------|
| `pages/Community.tsx` | 社区首页（三个 Tab） |
| `pages/PostDetail.tsx` | 帖子详情页 |
| `pages/CreatePost.tsx` | 发帖页 |
| `pages/MyFavorites.tsx` | 我的收藏页 |

---

## Task 1: 数据库建表

**Files:**
- Modify: `src/main/resources/schema.sql`

- [ ] **Step 1: 在 schema.sql 末尾追加社区相关表**

```sql
-- ==================== 社区模块 ====================

-- 帖子表
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

-- 问答扩展表
CREATE TABLE IF NOT EXISTS question_details (
    post_id CHAR(36) PRIMARY KEY,
    is_accepted BOOLEAN DEFAULT FALSE,
    accepted_answer_id CHAR(36),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 评论表
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

-- 点赞表
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

-- 收藏表
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
```

---

## Task 2: 创建枚举类

**Files:**
- Create: `entity/enums/PostType.java`
- Create: `entity/enums/PostStatus.java`
- Create: `entity/enums/TargetType.java`

- [ ] **Step 1: 创建 PostType 枚举**

```java
package com.flittly.bankendspringboot.entity.enums;

public enum PostType {
    SHARE, CHECKIN, QUESTION
}
```

- [ ] **Step 2: 创建 PostStatus 枚举**

```java
package com.flittly.bankendspringboot.entity.enums;

public enum PostStatus {
    PENDING, APPROVED, REJECTED
}
```

- [ ] **Step 3: 创建 TargetType 枚举**

```java
package com.flittly.bankendspringboot.entity.enums;

public enum TargetType {
    POST, COMMENT
}
```

---

## Task 3: 创建实体类

**Files:**
- Create: `entity/Post.java`
- Create: `entity/Comment.java`
- Create: `entity/QuestionDetail.java`
- Create: `entity/Like.java`
- Create: `entity/Favorite.java`

- [ ] **Step 1: 创建 Post 实体**

```java
package com.flittly.bankendspringboot.entity;

import com.flittly.bankendspringboot.entity.enums.PostStatus;
import com.flittly.bankendspringboot.entity.enums.PostType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class Post {
    private UUID id;
    private UUID userId;
    private PostType postType;
    private String title;
    private String content;
    private List<String> images;
    private PostStatus status;
    private Integer likeCount;
    private Integer commentCount;
    private Integer favoriteCount;
    private Boolean isTop;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

- [ ] **Step 2: 创建 Comment 实体**

```java
package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class Comment {
    private UUID id;
    private UUID postId;
    private UUID userId;
    private UUID parentId;
    private String content;
    private List<String> images;
    private Boolean isAccepted;
    private Integer likeCount;
    private LocalDateTime createdAt;
}
```

- [ ] **Step 3: 创建 QuestionDetail 实体**

```java
package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.util.UUID;

@Data
public class QuestionDetail {
    private UUID postId;
    private Boolean isAccepted;
    private UUID acceptedAnswerId;
}
```

- [ ] **Step 4: 创建 Like 实体**

```java
package com.flittly.bankendspringboot.entity;

import com.flittly.bankendspringboot.entity.enums.TargetType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Like {
    private UUID id;
    private UUID userId;
    private UUID targetId;
    private TargetType targetType;
    private LocalDateTime createdAt;
}
```

- [ ] **Step 5: 创建 Favorite 实体**

```java
package com.flittly.bankendspringboot.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Favorite {
    private UUID id;
    private UUID userId;
    private UUID postId;
    private LocalDateTime createdAt;
}
```

---

## Task 4: 创建 Mapper 接口

**Files:**
- Create: `mapper/PostMapper.java`
- Create: `mapper/CommentMapper.java`
- Create: `mapper/QuestionDetailMapper.java`
- Create: `mapper/LikeMapper.java`
- Create: `mapper/FavoriteMapper.java`

- [ ] **Step 1: 创建 PostMapper**

```java
package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Post;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface PostMapper {
    List<Post> findByFilters(@Param("postType") String postType, @Param("status") String status,
                             @Param("userId") UUID userId, @Param("limit") int limit, @Param("offset") int offset);
    Post findById(@Param("id") UUID id);
    int insert(Post post);
    int update(Post post);
    int deleteById(@Param("id") UUID id);
    int incrementLikeCount(@Param("id") UUID id);
    int decrementLikeCount(@Param("id") UUID id);
    int incrementCommentCount(@Param("id") UUID id);
    int decrementCommentCount(@Param("id") UUID id);
    int incrementFavoriteCount(@Param("id") UUID id);
    int decrementFavoriteCount(@Param("id") UUID id);
}
```

- [ ] **Step 2: 创建 CommentMapper**

```java
package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface CommentMapper {
    List<Comment> findByPostId(@Param("postId") UUID postId, @Param("limit") int limit, @Param("offset") int offset);
    Comment findById(@Param("id") UUID id);
    int insert(Comment comment);
    int deleteById(@Param("id") UUID id);
    int updateAccepted(@Param("id") UUID id, @Param("isAccepted") boolean isAccepted);
    int incrementLikeCount(@Param("id") UUID id);
    int decrementLikeCount(@Param("id") UUID id);
}
```

- [ ] **Step 3: 创建 QuestionDetailMapper**

```java
package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.QuestionDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.UUID;

@Mapper
public interface QuestionDetailMapper {
    QuestionDetail findByPostId(@Param("postId") UUID postId);
    int insert(QuestionDetail detail);
    int updateAccepted(@Param("postId") UUID postId, @Param("isAccepted") boolean isAccepted,
                       @Param("acceptedAnswerId") UUID acceptedAnswerId);
}
```

- [ ] **Step 4: 创建 LikeMapper**

```java
package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Like;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.UUID;

@Mapper
public interface LikeMapper {
    Like findByUserAndTarget(@Param("userId") UUID userId, @Param("targetId") UUID targetId,
                             @Param("targetType") String targetType);
    int insert(Like like);
    int deleteByUserAndTarget(@Param("userId") UUID userId, @Param("targetId") UUID targetId,
                              @Param("targetType") String targetType);
}
```

- [ ] **Step 5: 创建 FavoriteMapper**

```java
package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Favorite;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface FavoriteMapper {
    Favorite findByUserAndPost(@Param("userId") UUID userId, @Param("postId") UUID postId);
    List<Favorite> findByUserId(@Param("userId") UUID userId, @Param("limit") int limit, @Param("offset") int offset);
    int insert(Favorite favorite);
    int deleteByUserAndPost(@Param("userId") UUID userId, @Param("postId") UUID postId);
}
```

---

## Task 5: 创建 Mapper XML 文件

**Files:**
- Create: `resources/mapper/PostMapper.xml`
- Create: `resources/mapper/CommentMapper.xml`
- Create: `resources/mapper/QuestionDetailMapper.xml`
- Create: `resources/mapper/LikeMapper.xml`
- Create: `resources/mapper/FavoriteMapper.xml`

- [ ] **Step 1: 创建 PostMapper.xml**（包含完整 resultMap、findByFilters、insert、update、计数器增减）
- [ ] **Step 2: 创建 CommentMapper.xml**（包含 findByPostId、insert、updateAccepted、计数器增减）
- [ ] **Step 3: 创建 QuestionDetailMapper.xml**（包含 findByPostId、insert、updateAccepted）
- [ ] **Step 4: 创建 LikeMapper.xml**（包含 findByUserAndTarget、insert、delete）
- [ ] **Step 5: 创建 FavoriteMapper.xml**（包含 findByUserAndPost、findByUserId、insert、delete）

---

## Task 6: 创建 DTO 类

**Files:**
- Create: `dto/PostCreateRequest.java`
- Create: `dto/PostResponse.java`
- Create: `dto/CommentCreateRequest.java`
- Create: `dto/CommentResponse.java`

- [ ] **Step 1: 创建 PostCreateRequest**

```java
package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.util.List;

@Data
public class PostCreateRequest {
    private String postType;    // share, checkin, question
    private String title;
    private String content;
    private List<String> images;
}
```

- [ ] **Step 2: 创建 PostResponse**

```java
package com.flittly.bankendspringboot.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PostResponse {
    private UUID id;
    private UUID userId;
    private String userName;
    private String userAvatar;
    private String userLevel;
    private String postType;
    private String title;
    private String content;
    private List<String> images;
    private String status;
    private Integer likeCount;
    private Integer commentCount;
    private Integer favoriteCount;
    private Boolean isTop;
    private Boolean isLiked;
    private Boolean isFavorited;
    private Boolean isAccepted;
    private LocalDateTime createdAt;
}
```

- [ ] **Step 3: 创建 CommentCreateRequest**

```java
package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class CommentCreateRequest {
    private UUID parentId;
    private String content;
    private List<String> images;
}
```

- [ ] **Step 4: 创建 CommentResponse**

```java
package com.flittly.bankendspringboot.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CommentResponse {
    private UUID id;
    private UUID postId;
    private UUID userId;
    private String userName;
    private String userAvatar;
    private UUID parentId;
    private String content;
    private List<String> images;
    private Boolean isAccepted;
    private Integer likeCount;
    private Boolean isLiked;
    private LocalDateTime createdAt;
}
```

---

## Task 7: 创建 Service 层

**Files:**
- Create: `service/PostService.java`
- Create: `service/CommentService.java`
- Create: `service/LikeService.java`
- Create: `service/FavoriteService.java`

- [ ] **Step 1: 创建 PostService**（发帖、查列表、查详情、编辑、删除、审核、组装作者信息和互动状态）
- [ ] **Step 2: 创建 CommentService**（评论、查评论列表、删除评论、采纳）
- [ ] **Step 3: 创建 LikeService**（点赞、取消、查询状态，同时更新帖子/评论计数器）
- [ ] **Step 4: 创建 FavoriteService**（收藏、取消、查列表，同时更新帖子计数器）

---

## Task 8: 创建 Controller 层

**Files:**
- Create: `controller/PostController.java`
- Create: `controller/CommentController.java`
- Create: `controller/LikeController.java`
- Create: `controller/FavoriteController.java`

- [ ] **Step 1: 创建 PostController**（GET /api/posts, GET /api/posts/{id}, POST /api/posts, PUT /api/posts/{id}, DELETE /api/posts/{id}）
- [ ] **Step 2: 创建 CommentController**（GET /api/posts/{id}/comments, POST /api/posts/{id}/comments, DELETE /api/comments/{id}, POST /api/comments/{id}/accept）
- [ ] **Step 3: 创建 LikeController**（POST /api/likes, DELETE /api/likes, GET /api/likes/status）
- [ ] **Step 4: 创建 FavoriteController**（POST /api/favorites, DELETE /api/favorites/{postId}, GET /api/favorites）

---

## Task 9: 更新 SecurityConfig 权限配置

**Files:**
- Modify: `config/SecurityConfig.java`

- [ ] **Step 1: 添加社区接口权限规则**

在 `authorizeHttpRequests` 中添加：
- GET 请求 `/api/posts/**`、`/api/posts/*/comments` 公开
- POST/PUT/DELETE 需要认证
- `/api/likes/**`、`/api/favorites/**` 需要认证

---

## Task 10: 创建前端社区首页

**Files:**
- Create: `pages/Community.tsx`

- [ ] **Step 1: 创建 Community 组件**（三个 Tab 切换、帖子卡片列表、发帖按钮）
- [ ] **Step 2: 在 App.tsx 添加 `/community` 路由**
- [ ] **Step 3: 在 BottomNav 中为社区按钮添加跳转**

---

## Task 11: 创建前端帖子详情页

**Files:**
- Create: `pages/PostDetail.tsx`

- [ ] **Step 1: 创建 PostDetail 组件**（帖子内容、互动栏、评论列表、评论输入框）
- [ ] **Step 2: 在 App.tsx 添加 `/community/:id` 路由**

---

## Task 12: 创建前端发帖页

**Files:**
- Create: `pages/CreatePost.tsx`

- [ ] **Step 1: 创建 CreatePost 组件**（选择类型、标题、内容、图片上传、提交）
- [ ] **Step 2: 在 App.tsx 添加 `/community/create` 路由**

---

## Task 13: 扩展图片上传接口

**Files:**
- Modify: `controller/UploadController.java`

- [ ] **Step 1: 添加通用图片上传接口** `POST /api/upload/image`（复用头像上传逻辑，返回完整 URL）

---

## 执行顺序

```
Task 1 (建表)
  ↓
Task 2 (枚举) → Task 3 (实体) → Task 4 (Mapper接口) → Task 5 (Mapper XML)
  ↓
Task 6 (DTO) → Task 7 (Service) → Task 8 (Controller)
  ↓
Task 9 (SecurityConfig)
  ↓
Task 10 (社区首页) → Task 11 (详情页) → Task 12 (发帖页)
  ↓
Task 13 (图片上传扩展)
```
