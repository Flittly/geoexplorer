# GeoExplorer 后端服务

基于 FastAPI 的后端服务，使用 Supabase 作为数据库存储。

## 技术栈

- **FastAPI** - Python Web 框架
- **Supabase** - PostgreSQL 数据库服务
- **Pydantic** - 数据验证
- **uv** - 快速 Python 包管理器

## 快速开始

### 前置要求

安装 uv (如未安装):

```bash
# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 或使用 pip
pip install uv
```

### 1. 创建虚拟环境并安装依赖

```bash
cd backend

# 创建虚拟环境并安装依赖 (推荐)
uv sync

# 或者只安装依赖到现有环境
uv pip install -e .
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入 Supabase 凭证：

```bash
copy .env.example .env
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
# 使用 uv run 启动 (推荐)
uv run uvicorn main:app --reload --port 8000

# 或激活虚拟环境后运行
.venv\Scripts\activate  # Windows
uvicorn main:app --reload --port 8000
```

服务将在 `http://localhost:8000` 启动。

## 常用 uv 命令

```bash
# 同步依赖
uv sync

# 添加新依赖
uv add <package-name>

# 添加开发依赖
uv add --dev <package-name>

# 移除依赖
uv remove <package-name>

# 更新所有依赖
uv lock --upgrade

# 运行命令
uv run <command>

# 运行 Python
uv run python
```

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
├── pyproject.toml       # uv 项目配置
├── uv.lock              # 依赖锁定文件
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

## 开发

### 运行测试

```bash
uv run pytest
```

### 代码检查

```bash
uv add --dev ruff
uv run ruff check .
```
