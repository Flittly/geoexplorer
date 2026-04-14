# 数据库迁移指南

## 从 Supabase 迁移到 PostgreSQL

本指南帮助你将 GeoExplorer 后端从 Supabase 迁移到本地 PostgreSQL 数据库。

## 前置条件

1. 安装 PostgreSQL（推荐版本 14+）
2. 创建数据库 `geoexplorer`

## 步骤

### 1. 安装 PostgreSQL

**Windows:**
- 下载并安装：https://www.postgresql.org/download/windows/
- 安装时记住设置的密码

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. 创建数据库

```bash
# 登录 PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE geoexplorer;

# 退出
\q
```

### 3. 配置环境变量

编辑 `backend/.env` 文件：

```env
# 修改为你的 PostgreSQL 连接信息
DATABASE_URL=postgresql+asyncpg://postgres:你的密码@localhost:5432/geoexplorer
DATABASE_URL_SYNC=postgresql://postgres:你的密码@localhost:5432/geoexplorer
```

### 4. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 5. 初始化数据库

```bash
# 创建表并插入初始数据
python init_db.py
```

### 6. 启动后端服务

```bash
python main.py
```

## 数据库表结构

| 表名 | 说明 |
|------|------|
| users | 用户表 |
| refresh_tokens | 刷新令牌表 |
| verification_codes | 验证码表 |
| levels | 关卡表 |
| questions | 题目表 |
| user_level_progress | 用户关卡进度表 |
| quiz_results | 答题结果表 |
| mistakes | 错题本表 |
| daily_trivia | 每日百科表 |
| geographic_features | 地理特征表 |
| ar_landforms | AR地貌表 |

## 测试账号

初始化后会创建一个测试用户：
- 邮箱：test@example.com
- 密码：password123

## 常见问题

### Q: 连接数据库失败
A: 检查 PostgreSQL 服务是否启动，以及 `.env` 中的连接信息是否正确

### Q: 表已存在错误
A: 运行 `init_db.py` 会先删除所有表再重新创建

### Q: 如何保留 Supabase 的数据？
A: 需要先从 Supabase 导出数据，然后编写迁移脚本导入到 PostgreSQL
