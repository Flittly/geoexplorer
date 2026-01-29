# GeoExplorer 后端服务

基于 FastAPI 的后端服务，使用 Supabase 作为数据库存储。

## 技术栈

- **FastAPI** - Python Web 框架
- **Supabase** - PostgreSQL 数据库服务
- **Pydantic** - 数据验证

## 快速开始

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入 Supabase 凭证：

```bash
cp .env.example .env
```

编辑 `.env`:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### 3. 创建数据库表

在 Supabase SQL Editor 中运行 `schema.sql` 文件内容。

### 4. 启动服务

```bash
uvicorn main:app --reload --port 8000
```

服务将在 `http://localhost:8000` 启动。

## API 文档

启动服务后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API 端点

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/{id}` | 获取用户信息 |
| PUT | `/api/users/{id}` | 更新用户信息 |
| GET | `/api/trivia/today` | 获取今日百科 |
| GET | `/api/trivia` | 获取所有百科 |
| GET | `/api/levels` | 获取所有关卡 |
| GET | `/api/levels/user/{id}/progress` | 获取关卡进度 |
| GET | `/api/mistakes` | 获取错题列表 |
| POST | `/api/mistakes` | 添加错题 |
| GET | `/api/geo-features` | 获取地理特征 |
| GET | `/api/ar-landforms` | 获取 AR 地貌 |

## 项目结构

```
backend/
├── main.py              # FastAPI 入口
├── config.py            # 配置管理
├── requirements.txt     # Python 依赖
├── schema.sql           # 数据库表结构
├── .env.example         # 环境变量模板
├── models/              # Pydantic 数据模型
│   ├── user.py
│   ├── trivia.py
│   ├── level.py
│   ├── mistake.py
│   ├── geo_feature.py
│   └── ar_landform.py
├── routes/              # API 路由
│   ├── users.py
│   ├── trivia.py
│   ├── levels.py
│   ├── mistakes.py
│   ├── geo_features.py
│   └── ar_landforms.py
└── services/
    └── supabase_client.py
```
