# GeoExplorer 管理后台

## 概述

这是 GeoExplorer 地理探索学习应用的 PC 端管理后台，采用与主应用一致的 UI 设计风格（蓝色主题 + Tailwind CSS）。

## 功能模块

### 1. 仪表盘
- 查看用户总数、课程总数、题目总数、百科条目数
- 今日新增用户、活跃用户统计
- 未读通知数量
- 最近管理员操作日志

### 2. 用户管理
- 查看所有用户列表（支持分页和搜索）
- 编辑用户信息（名称、邮箱、等级、星星数等）
- 删除用户（软删除）
- 查看用户学习进度
- 修改用户学习进度（关卡完成状态、分数、星星数）

### 3. 课程管理（关卡管理）
- 查看所有课程/关卡列表
- 添加新课程（名称、描述、排序、解锁条件）
- 编辑课程信息
- 删除课程
- 查看课程关联的题目数量

### 4. 题库管理
- 查看所有题目列表（支持分页、筛选、搜索）
- 添加新题目（题目内容、选项、正确答案、解析、分类、难度）
- 编辑题目
- 删除题目
- 支持三种分类：自然地理、人文地理、区域地理
- 支持三种难度：简单、中等、困难

### 5. 每日百科管理
- 查看所有百科条目（卡片式布局）
- 添加新百科（标题、描述、地点、地区、展示日期、图片）
- 编辑百科条目
- 删除百科条目

### 6. 消息通知管理
- 查看所有已发送的通知列表
- 发送定向通知给指定用户
- 发送广播通知给所有用户
- 支持多种通知类型：系统、课程、成就、提醒
- 删除通知

## 技术栈

- **前端**: React 19 + TypeScript + Tailwind CSS
- **后端**: FastAPI (Python)
- **数据库**: Supabase (PostgreSQL)
- **图标**: Google Material Symbols
- **字体**: Noto Sans SC

## 文件结构

```
admin/
├── index.html              # 管理后台入口 HTML
├── src/
│   ├── index.tsx           # 入口文件
│   ├── AdminApp.tsx        # 主应用组件（路由配置）
│   ├── context/
│   │   └── AdminContext.tsx    # 管理员认证上下文
│   └── pages/
│       ├── AdminLogin.tsx      # 登录页面
│       ├── AdminDashboard.tsx  # 仪表盘
│       ├── UserManagement.tsx  # 用户管理
│       ├── LevelManagement.tsx # 课程管理
│       ├── QuestionManagement.tsx # 题库管理
│       ├── TriviaManagement.tsx   # 百科管理
│       └── NotificationManagement.tsx # 通知管理
└── backend/
    ├── __init__.py         # 路由整合
    ├── models/
    │   └── admin_models.py # Pydantic 模型
    └── routes/
        ├── auth_admin.py       # 认证路由
        ├── dashboard_admin.py  # 仪表盘路由
        ├── users_admin.py      # 用户管理路由
        ├── levels_admin.py     # 课程管理路由
        ├── questions_admin.py  # 题库管理路由
        ├── trivia_admin.py     # 百科管理路由
        └── notifications_admin.py # 通知管理路由
```

## 数据库变更 (SQL)

管理后台需要以下数据库表，详见 `backend/schema_admin.sql`：

1. **questions** - 题库表
2. **user_notifications** - 用户消息通知表
3. **admins** - 管理员表
4. **admin_logs** - 操作日志表

## 使用说明

### 1. 数据库初始化

请先执行 SQL 文件创建必要的表：

```bash
# 在 Supabase SQL 编辑器中执行
backend/schema_admin.sql
```

### 2. 创建默认管理员

执行 SQL 插入默认管理员（密码需要 bcrypt 哈希）：

```sql
-- 使用 Python 生成密码哈希
-- import bcrypt
-- bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())

INSERT INTO admins (username, password_hash, email, name, role)
VALUES (
    'admin',
    '$2b$12$...',  -- 替换为实际的 bcrypt 哈希
    'admin@geoexplorer.com',
    '系统管理员',
    'super_admin'
);
```

### 3. 访问管理后台

启动后端服务后，访问：

```
http://localhost:3000/admin/index.html
```

默认登录账号：
- 用户名: `admin`
- 密码: `admin123`

### 4. 开发模式运行

```bash
# 1. 启动后端服务
cd backend
uv run main.py

# 2. 启动前端开发服务器
npm run dev

# 3. 访问管理后台
open http://localhost:3000/admin/index.html
```

## API 端点

所有管理后台 API 都以 `/api/admin` 为前缀：

### 认证
- `POST /api/admin/auth/login` - 管理员登录
- `GET /api/admin/auth/me` - 获取当前管理员信息

### 仪表盘
- `GET /api/admin/dashboard/stats` - 获取统计数据
- `GET /api/admin/dashboard/recent-activities` - 获取最近操作

### 用户管理
- `GET /api/admin/users` - 获取用户列表
- `GET /api/admin/users/{id}` - 获取用户详情
- `PUT /api/admin/users/{id}` - 更新用户
- `DELETE /api/admin/users/{id}` - 删除用户
- `GET /api/admin/users/{id}/progress` - 获取用户进度
- `PUT /api/admin/users/{id}/progress/{level_id}` - 更新用户进度

### 课程管理
- `GET /api/admin/levels` - 获取课程列表
- `POST /api/admin/levels` - 创建课程
- `GET /api/admin/levels/{id}` - 获取课程详情
- `PUT /api/admin/levels/{id}` - 更新课程
- `DELETE /api/admin/levels/{id}` - 删除课程

### 题库管理
- `GET /api/admin/questions` - 获取题目列表
- `POST /api/admin/questions` - 创建题目
- `GET /api/admin/questions/{id}` - 获取题目详情
- `PUT /api/admin/questions/{id}` - 更新题目
- `DELETE /api/admin/questions/{id}` - 删除题目

### 百科管理
- `GET /api/admin/trivia` - 获取百科列表
- `POST /api/admin/trivia` - 创建百科
- `GET /api/admin/trivia/{id}` - 获取百科详情
- `PUT /api/admin/trivia/{id}` - 更新百科
- `DELETE /api/admin/trivia/{id}` - 删除百科

### 通知管理
- `GET /api/admin/notifications` - 获取通知列表
- `POST /api/admin/notifications` - 发送通知
- `GET /api/admin/notifications/{id}` - 获取通知详情
- `DELETE /api/admin/notifications/{id}` - 删除通知

## 安全说明

1. 所有管理后台 API 都需要 JWT 认证令牌
2. 令牌在登录时获取，有效期 1 天
3. 令牌存储在 localStorage 中
4. 操作日志自动记录所有管理员操作
5. 支持不同角色：超级管理员、管理员、编辑

## 注意事项

1. 管理后台与主应用完全独立，不修改现有代码
2. 管理后台使用独立的路由前缀 `/admin`
3. 前端页面采用响应式设计，适配桌面端
4. 支持深色/浅色模式切换
