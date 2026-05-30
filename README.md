<div align="center">

# GeoExplorer

**探索世界，启迪未来**

一个创新的地理知识学习平台，融合游戏化学习、AR 增强现实、社区互动等现代教育理念，让地理学习变得生动有趣。

[English](#english) | 中文

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-6DB33F?logo=spring-boot)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)

</div>

---

## 📖 目录

- [项目简介](#项目简介)
- [核心功能](#核心功能)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [API 文档](#api-文档)
- [部署指南](#部署指南)
- [开发指南](#开发指南)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 🌍 项目简介

GeoExplorer 是一款面向地理学习者的综合性学习平台，旨在通过现代化的技术手段和创新的交互方式，让地理知识的学习变得更加直观、有趣和高效。项目采用前后端分离架构，支持多端访问，适合学生、教师和地理爱好者使用。

### 为什么选择 GeoExplorer？

- **游戏化学习**：通过关卡挑战、星星收集、排行榜等机制激发学习动力
- **AR 增强现实**：利用 AR 技术直观展示地貌特征，增强空间认知
- **智能错题本**：自动记录错题，支持针对性复习，提高学习效率
- **社区互动**：学习者可以分享心得、交流经验，形成良好的学习氛围
- **个性化学习**：根据学习进度和能力水平，提供个性化的学习路径

## ✨ 核心功能

### 🎮 学习系统

| 功能模块 | 描述 |
|---------|------|
| 🏔️ 关卡学习 | 分级关卡设计，从基础到进阶，循序渐进掌握地理知识 |
| 📚 每日百科 | 每天推送地理趣闻，拓宽知识视野 |
| 🎯 每日挑战 | 限时答题挑战，检验学习成果 |
| 📝 错题本 | 智能收集错题，支持分类复习和错题重做 |
| 🏆 排行榜 | 全球/好友排名，激发竞争意识 |

### 🔬 探索工具

| 功能模块 | 描述 |
|---------|------|
| 🌐 3D 地球 | 基于 Three.js 的交互式 3D 地球仪，直观展示地理信息 |
| 📱 AR 地貌 | 增强现实技术展示山川、河流、平原等地貌特征 |
| 🗺️ 地理特征 | 详细的地理特征数据库，支持搜索和浏览 |

### 👥 社区功能

| 功能模块 | 描述 |
|---------|------|
| 💬 社区帖子 | 发布和浏览地理相关的帖子和讨论 |
| 🛒 课程商城 | 优质地理课程推荐和购买 |
| 👤 个人中心 | 学习统计、成就展示、个人设置 |

### 🔧 管理后台

| 功能模块 | 描述 |
|---------|------|
| 📊 仪表盘 | 数据统计、用户活跃度、系统状态监控 |
| 👥 用户管理 | 用户列表、信息编辑、学习进度管理 |
| 📚 内容管理 | 课程、题库、百科内容的增删改查 |
| 🔔 通知管理 | 系统通知、定向推送、广播消息 |

## 🛠️ 技术栈

### 前端技术

| 技术 | 版本 | 用途 |
|-----|------|------|
| React | 19.2 | 用户界面构建 |
| TypeScript | 5.8 | 类型安全的 JavaScript |
| Tailwind CSS | - | 原子化 CSS 框架 |
| Three.js | 0.184 | 3D 图形渲染 |
| React Router | 7.13 | 前端路由管理 |
| Vite | 6.2 | 现代化构建工具 |

### 后端技术（Python）

| 技术 | 版本 | 用途 |
|-----|------|------|
| FastAPI | 0.109 | 高性能 Web 框架 |
| SQLAlchemy | 2.0 | ORM 数据库操作 |
| Pydantic | 2.6 | 数据验证和序列化 |
| Supabase | - | PostgreSQL 数据库服务 |

### 后端技术（Java 微服务）

| 技术 | 版本 | 用途 |
|-----|------|------|
| Spring Boot | 4.0.6 | 微服务框架 |
| MyBatis | 4.0 | ORM 框架 |
| MySQL | 8.0 | 关系型数据库 |
| JWT | - | 身份认证 |

### 开发工具

| 工具 | 用途 |
|-----|------|
| ESLint | 代码规范检查 |
| Prettier | 代码格式化 |
| Vitest | 单元测试框架 |
| uv | Python 包管理器 |
| Maven | Java 项目管理 |

## 📁 项目结构

```
geoexplorer/
├── frontend/                    # 前端应用
│   ├── src/                    # 源代码
│   ├── pages/                  # 页面组件
│   │   ├── Home.tsx           # 首页
│   │   ├── Levels.tsx         # 关卡列表
│   │   ├── Quiz.tsx           # 答题页面
│   │   ├── ARView.tsx         # AR 视图
│   │   ├── Community.tsx      # 社区
│   │   └── ...
│   ├── components/            # 公共组件
│   ├── hooks.ts               # 自定义 Hooks
│   ├── api.ts                 # API 接口
│   └── package.json
│
├── backend/                     # Python 后端
│   ├── main.py                # FastAPI 入口
│   ├── models/                # 数据模型
│   ├── routes/                # API 路由
│   ├── services/              # 业务逻辑
│   ├── schema.sql             # 数据库表结构
│   └── requirements.txt
│
├── bankend-springboot/          # Java 微服务后端
│   ├── bankend-common/        # 公共模块
│   ├── bankend-auth-service/  # 认证服务
│   ├── bankend-user-service/  # 用户服务
│   ├── bankend-content-service/ # 内容服务
│   ├── bankend-geo-service/   # 地理服务
│   ├── bankend-gateway/       # 网关服务
│   └── pom.xml
│
├── admin/                       # 管理后台
│   ├── src/                   # 前端源码
│   ├── backend/               # 后端路由
│   └── index.html
│
└── docs/                        # 项目文档
```

## 🚀 快速开始

### 前置要求

- **Node.js** >= 18.0
- **Python** >= 3.10
- **Java** >= 21
- **MySQL** >= 8.0
- **npm** 或 **yarn** 或 **pnpm**

### 1. 克隆项目

```bash
git clone https://github.com/your-username/geoexplorer.git
cd geoexplorer
```

### 2. 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的 API 密钥

# 启动开发服务器
npm run dev
```

前端将在 http://localhost:5173 启动。

### 3. 启动 Python 后端

```bash
cd backend

# 安装 uv (如未安装)
pip install uv

# 创建虚拟环境并安装依赖
uv sync

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入 Supabase 凭证

# 初始化数据库
# 在 Supabase SQL Editor 中运行 schema.sql

# 启动服务
uv run uvicorn main:app --reload --port 8000
```

后端将在 http://localhost:8000 启动。

### 4. 启动 Java 微服务（可选）

```bash
cd bankend-springboot

# 编译项目
mvn clean install

# 启动各个微服务
mvn spring-boot:run -pl bankend-gateway
```

### 5. 启动管理后台

```bash
cd admin

# 启动开发服务器
npm run dev
```

管理后台将在 http://localhost:3000/admin 启动。

## ⚙️ 环境配置

### 前端环境变量

创建 `frontend/.env.local` 文件：

```env
# Gemini API (用于 AI 功能)
GEMINI_API_KEY=your_gemini_api_key

# 后端 API 地址
VITE_API_URL=http://localhost:8000
```

### Python 后端环境变量

创建 `backend/.env` 文件：

```env
# Supabase 配置
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# JWT 密钥
JWT_SECRET=your_jwt_secret_key

# 数据库连接 (可选，使用 Supabase 时不需要)
DATABASE_URL=postgresql://user:password@localhost:5432/geoexplorer
```

### Java 微服务环境变量

在 `bankend-springboot/` 各服务的 `application.yml` 中配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/geoexplorer
    username: root
    password: your_password

jwt:
  secret: your_jwt_secret
```

## 📚 API 文档

### Python 后端 API

启动服务后访问：
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

#### 主要 API 端点

| 方法 | 端点 | 描述 |
|-----|------|------|
| GET | `/api/users/{id}` | 获取用户信息 |
| PUT | `/api/users/{id}` | 更新用户信息 |
| GET | `/api/levels` | 获取所有关卡 |
| GET | `/api/levels/user/{id}/progress` | 获取用户进度 |
| GET | `/api/trivia/today` | 获取今日百科 |
| GET | `/api/mistakes` | 获取错题列表 |
| POST | `/api/mistakes` | 添加错题 |
| GET | `/api/geo-features` | 获取地理特征 |
| GET | `/api/ar-landforms` | 获取 AR 地貌 |

### Java 微服务 API

网关服务统一入口：http://localhost:8080

| 服务 | 端口 | 描述 |
|-----|------|------|
| Gateway | 8080 | API 网关 |
| Auth Service | 8081 | 认证服务 |
| User Service | 8082 | 用户服务 |
| Content Service | 8083 | 内容服务 |
| Geo Service | 8084 | 地理服务 |

### 管理后台 API

所有管理 API 以 `/api/admin` 为前缀：

| 方法 | 端点 | 描述 |
|-----|------|------|
| POST | `/api/admin/auth/login` | 管理员登录 |
| GET | `/api/admin/dashboard/stats` | 获取统计数据 |
| GET | `/api/admin/users` | 获取用户列表 |
| GET | `/api/admin/levels` | 获取课程列表 |
| GET | `/api/admin/questions` | 获取题目列表 |

## 🚢 部署指南

### 前端部署

```bash
# 构建生产版本
cd frontend
npm run build

# 部署到静态服务器
# 将 dist/ 目录部署到 Nginx、Vercel、Netlify 等
```

### Python 后端部署

```bash
# 使用 Docker 部署
docker build -t geoexplorer-backend .
docker run -p 8000:8000 geoexplorer-backend

# 或使用 Gunicorn
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Java 微服务部署

```bash
# 打包
mvn clean package -DskipTests

# 运行
java -jar bankend-gateway/target/bankend-gateway-0.0.1-SNAPSHOT.jar
```

### Docker Compose 部署

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
  
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
  
  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_DATABASE=geoexplorer
```

## 💻 开发指南

### 代码规范

```bash
# 前端代码检查
cd frontend
npm run lint

# 前端代码格式化
npm run format

# 前端类型检查
npm run typecheck

# Python 代码检查
cd backend
uv run ruff check .

# Java 代码检查
cd bankend-springboot
mvn checkstyle:check
```

### 运行测试

```bash
# 前端测试
cd frontend
npm run test

# Python 测试
cd backend
uv run pytest

# Java 测试
cd bankend-springboot
mvn test
```

### 数据库迁移

```bash
# Python 后端
cd backend
uv run alembic revision --autogenerate -m "description"
uv run alembic upgrade head

# Java 后端
# 使用 Flyway 或手动执行 SQL
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 提交规范

请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
test: 添加测试
chore: 构建/工具变动
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://react.dev/) - 用户界面库
- [FastAPI](https://fastapi.tiangolo.com/) - Python Web 框架
- [Spring Boot](https://spring.io/projects/spring-boot) - Java 微服务框架
- [Three.js](https://threejs.org/) - 3D 图形库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Supabase](https://supabase.com/) - 数据库服务

---

<div align="center">

**[⬆ 回到顶部](#geoexplorer)**

</div>

---

<a id="english"></a>

# GeoExplorer

**Explore the World, Inspire the Future**

An innovative geography learning platform that combines gamified learning, augmented reality, and modern educational concepts to make geography learning engaging and fun.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-6DB33F?logo=spring-boot)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Introduction

GeoExplorer is a comprehensive learning platform designed for geography enthusiasts. It leverages modern technologies and innovative interactions to make learning geography more intuitive, engaging, and efficient. The project adopts a front-end and back-end separation architecture, supporting multi-platform access.

### Why GeoExplorer?

- **Gamified Learning**: Level challenges, star collection, and leaderboards to motivate learning
- **Augmented Reality**: AR technology to visualize landforms and enhance spatial awareness
- **Smart Mistake Book**: Automatic error tracking with categorized review for efficient learning
- **Community Interaction**: Share insights and experiences with fellow learners
- **Personalized Learning**: Adaptive learning paths based on progress and skill level

## Features

### Learning System

| Module | Description |
|--------|-------------|
| 🏔️ Level Learning | Progressive level design from basic to advanced |
| 📚 Daily Trivia | Daily geography facts to expand knowledge |
| 🎯 Daily Challenges | Timed quizzes to test learning outcomes |
| 📝 Mistake Book | Smart error collection with review support |
| 🏆 Leaderboards | Global and friend rankings |

### Exploration Tools

| Module | Description |
|--------|-------------|
| 🌐 3D Globe | Interactive 3D globe powered by Three.js |
| 📱 AR Landforms | Augmented reality visualization of geographical features |
| 🗺️ Geo Features | Comprehensive geographical feature database |

### Community Features

| Module | Description |
|--------|-------------|
| 💬 Community Posts | Share and browse geography-related discussions |
| 🛒 Course Shop | Premium geography course recommendations |
| 👤 Profile Center | Learning statistics, achievements, and settings |

### Admin Panel

| Module | Description |
|--------|-------------|
| 📊 Dashboard | Data statistics and system monitoring |
| 👥 User Management | User list, info editing, progress tracking |
| 📚 Content Management | CRUD for courses, questions, and trivia |
| 🔔 Notification Management | System notifications and push messages |

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2 | UI framework |
| TypeScript | 5.8 | Type-safe JavaScript |
| Tailwind CSS | - | Utility-first CSS framework |
| Three.js | 0.184 | 3D graphics rendering |
| React Router | 7.13 | Frontend routing |
| Vite | 6.2 | Build tool |

### Backend (Python)

| Technology | Version | Purpose |
|-----------|---------|---------|
| FastAPI | 0.109 | High-performance web framework |
| SQLAlchemy | 2.0 | ORM |
| Pydantic | 2.6 | Data validation |
| Supabase | - | PostgreSQL database service |

### Backend (Java Microservices)

| Technology | Version | Purpose |
|-----------|---------|---------|
| Spring Boot | 4.0.6 | Microservice framework |
| MyBatis | 4.0 | ORM framework |
| MySQL | 8.0 | Relational database |
| JWT | - | Authentication |

## Project Structure

```
geoexplorer/
├── frontend/                    # Frontend application
│   ├── src/                    # Source code
│   ├── pages/                  # Page components
│   ├── components/             # Shared components
│   └── package.json
│
├── backend/                     # Python backend
│   ├── main.py                # FastAPI entry
│   ├── models/                # Data models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   └── requirements.txt
│
├── bankend-springboot/          # Java microservices
│   ├── bankend-common/        # Common module
│   ├── bankend-auth-service/  # Auth service
│   ├── bankend-user-service/  # User service
│   ├── bankend-content-service/ # Content service
│   ├── bankend-geo-service/   # Geo service
│   └── bankend-gateway/       # API gateway
│
├── admin/                       # Admin panel
│   ├── src/                   # Frontend source
│   └── backend/               # Backend routes
│
└── docs/                        # Documentation
```

## Getting Started

### Prerequisites

- **Node.js** >= 18.0
- **Python** >= 3.10
- **Java** >= 21
- **MySQL** >= 8.0

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/geoexplorer.git
cd geoexplorer

# Start frontend
cd frontend
npm install
npm run dev

# Start Python backend
cd backend
pip install uv
uv sync
uv run uvicorn main:app --reload --port 8000

# Start admin panel
cd admin
npm run dev
```

## Configuration

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key
VITE_API_URL=http://localhost:8000
```

### Python Backend Environment Variables

Create `backend/.env`:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
```

## API Documentation

### Python Backend API

Access after starting the service:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/{id}` | Get user info |
| GET | `/api/levels` | Get all levels |
| GET | `/api/trivia/today` | Get today's trivia |
| GET | `/api/mistakes` | Get mistake list |
| GET | `/api/geo-features` | Get geo features |

## Deployment

```bash
# Frontend
cd frontend
npm run build
# Deploy dist/ to Nginx, Vercel, or Netlify

# Python Backend
docker build -t geoexplorer-backend .
docker run -p 8000:8000 geoexplorer-backend

# Java Microservices
mvn clean package -DskipTests
java -jar bankend-gateway/target/bankend-gateway-0.0.1-SNAPSHOT.jar
```

## Development

```bash
# Frontend linting
cd frontend
npm run lint

# Python linting
cd backend
uv run ruff check .

# Run tests
npm run test  # Frontend
uv run pytest  # Python
mvn test  # Java
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://react.dev/) - UI library
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [Spring Boot](https://spring.io/projects/spring-boot) - Java microservice framework
- [Three.js](https://threejs.org/) - 3D graphics library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Supabase](https://supabase.com/) - Database service

---

<div align="center">

**[⬆ Back to Top](#geoexplorer)**

Made with ❤️ by GeoExplorer Team

</div>
