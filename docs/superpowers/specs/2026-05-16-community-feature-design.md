# GeoExplorer 社区功能设计文档

> 日期：2026-05-16

---

## 一、功能概述

社区功能是 GeoExplorer 的社交模块，包含三个子模块：

| 模块 | 定位 | 内容形式 |
|------|------|---------|
| 学习分享 | 地理知识笔记、学习心得 | 图文卡片 |
| 打卡动态 | 学习打卡、成就解锁 | 简短动态 |
| 问答交流 | 地理问题提问与回答 | 问答帖 |

### 核心特性

- **内容格式**：文字 + 图片，卡片化布局（小红书风格）
- **用户互动**：点赞、评论、收藏、转发
- **问答机制**：提问者可采纳最佳答案
- **内容审核**：先审后发，管理员审核通过后才对外可见
- **用户身份**：直接使用现有用户信息（头像、昵称、等级）

---

## 二、数据库设计

采用**基础表 + 扩展表**方案（方案三）。

### 2.1 posts 表（基础内容表）

```sql
CREATE TABLE posts (
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_post_type (post_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at DESC)
);
```

### 2.2 question_details 表（问答扩展表）

```sql
CREATE TABLE question_details (
    post_id CHAR(36) PRIMARY KEY,
    is_accepted BOOLEAN DEFAULT FALSE,
    accepted_answer_id CHAR(36),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
```

### 2.3 comments 表（评论/回答表）

```sql
CREATE TABLE comments (
    id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    parent_id CHAR(36),
    content TEXT NOT NULL,
    images JSON,
    is_accepted BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id)
);
```

### 2.4 likes 表（点赞关系表）

```sql
CREATE TABLE likes (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    target_id CHAR(36) NOT NULL,
    target_type ENUM('post', 'comment') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_target (user_id, target_id, target_type),
    INDEX idx_target (target_id, target_type)
);
```

### 2.5 favorites 表（收藏关系表）

```sql
CREATE TABLE favorites (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    post_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_post (user_id, post_id),
    INDEX idx_user_id (user_id)
);
```

---

## 三、API 设计

### 3.1 帖子接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/posts` | 帖子列表 | 公开 |
| GET | `/api/posts/{id}` | 帖子详情 | 公开 |
| POST | `/api/posts` | 发布帖子 | 登录 |
| PUT | `/api/posts/{id}` | 编辑帖子 | 作者 |
| DELETE | `/api/posts/{id}` | 删除帖子 | 作者 |

查询参数：
- `type`: share / checkin / question
- `status`: pending / approved / rejected
- `page`: 页码
- `size`: 每页数量

### 3.2 评论接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/posts/{id}/comments` | 评论列表 | 公开 |
| POST | `/api/posts/{id}/comments` | 发表评论 | 登录 |
| DELETE | `/api/comments/{id}` | 删除评论 | 作者 |

### 3.3 点赞接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/likes` | 点赞 | 登录 |
| DELETE | `/api/likes` | 取消点赞 | 登录 |
| GET | `/api/likes/status` | 查询点赞状态 | 登录 |

### 3.4 收藏接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/favorites` | 收藏 | 登录 |
| DELETE | `/api/favorites/{post_id}` | 取消收藏 | 登录 |
| GET | `/api/favorites` | 我的收藏列表 | 登录 |

### 3.5 采纳接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/api/comments/{id}/accept` | 采纳为最佳答案 | 提问者 |

### 3.6 审核接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/admin/posts/pending` | 待审核列表 | 管理员 |
| PUT | `/api/admin/posts/{id}/approve` | 审核通过 | 管理员 |
| PUT | `/api/admin/posts/{id}/reject` | 审核拒绝 | 管理员 |

---

## 四、前端页面设计

### 4.1 页面结构

```
/community          社区首页（三个 Tab）
/community/create   发帖页
/community/:id      帖子详情页
/community/favorites 我的收藏
```

### 4.2 社区首页布局

```
┌──────────────────────────────┐
│  社区          [搜索] [发帖+] │
├──────────────────────────────┤
│  [学习分享] [打卡动态] [问答]  │
├──────────────────────────────┤
│  卡片列表...                  │
│  卡片列表...                  │
│  卡片列表...                  │
└──────────────────────────────┘
```

### 4.3 卡片设计（小红书风格）

```
┌─────────────────────────────┐
│  [头像] 昵称 · 等级 · 2小时前 │
│                              │
│  标题文字（加粗）              │
│  正文内容预览（最多3行）        │
│                              │
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ 图片 │ │ 图片 │ │ 图片 │   │
│  └─────┘ └─────┘ └─────┘   │
│                              │
│  ❤ 12  💬 5  ⭐ 3  ↗ 2     │
└─────────────────────────────┘
```

### 4.4 三个 Tab 差异

| Tab | 卡片特点 | 排序方式 |
|-----|---------|---------|
| 学习分享 | 图文卡片，强调内容质量 | 时间/热度 |
| 打卡动态 | 简短动态，显示学习成就 | 时间 |
| 问答交流 | 显示采纳状态和回答数 | 未回答优先 |

### 4.5 帖子详情页

```
┌──────────────────────────────┐
│  ← 返回        帖子详情       │
├──────────────────────────────┤
│  [头像] 昵称 · 等级            │
│  2026-05-16 12:00             │
│                              │
│  标题（加粗大字）              │
│  正文内容...                  │
│                              │
│  ┌─────┐ ┌─────┐            │
│  │ 图片 │ │ 图片 │            │
│  └─────┘ └─────┘            │
│                              │
│  ❤ 点赞  ⭐ 收藏  ↗ 转发     │
├──────────────────────────────┤
│  评论 (5)                    │
│  ├ [头像] 用户A: 评论内容      │
│  │  └ [头像] 用户B: 回复内容   │
│  ├ [头像] 用户C: 评论内容      │
│  └ ...                       │
├──────────────────────────────┤
│  [输入评论...]        [发送]   │
└──────────────────────────────┘
```

### 4.6 审核状态提示

- 发布后显示"已提交，等待审核"
- 被拒绝时通知用户并显示原因
- 审核通过后出现在社区列表
- 用户可在"我的"页面查看自己发布的帖子状态

---

## 五、数据关系图

```
users (用户表)
  │
  ├── 1:N ──→ posts (帖子表)
  │             │
  │             ├── 1:1 ──→ question_details (问答扩展)
  │             │
  │             ├── 1:N ──→ comments (评论表)
  │             │             │
  │             │             └── self-ref (楼中楼 parent_id)
  │             │
  │             └── 1:N ──→ favorites (收藏表)
  │
  └── 1:N ──→ likes (点赞表)
                │
                └── target_type: 'post' | 'comment'
```

---

## 六、实现优先级

| 阶段 | 内容 | 估计工作量 |
|------|------|-----------|
| P1 | 数据库建表 + 帖子 CRUD API | 2天 |
| P2 | 评论 + 点赞 + 收藏 API | 2天 |
| P3 | 社区首页 + 卡片列表 + 详情页 | 3天 |
| P4 | 发帖页 + 图片上传 | 2天 |
| P5 | 问答采纳机制 | 1天 |
| P6 | 审核后台 | 1天 |
| P7 | 转发功能 | 1天 |

---

## 七、技术要点

- **图片上传**：复用已有的 `/api/upload/avatar` 接口，改为通用上传接口
- **审核机制**：发布默认 `pending`，前端只查询 `approved` 状态
- **计数器**：点赞/评论/收藏数量冗余存储在 posts 表，通过事件更新
- **采纳机制**：采纳时同时更新 `question_details.is_accepted` 和 `comments.is_accepted`
- **分页**：使用游标分页（基于 created_at），避免深度分页性能问题
