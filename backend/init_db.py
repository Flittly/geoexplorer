"""
数据库初始化脚本
用于创建表和插入初始数据
"""

import asyncio
import uuid
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from config import settings
from database import (
    Base,
    User,
    Level,
    Question,
    DailyTrivia,
    GeographicFeature,
    ARLandform,
    UserLevel,
    ProgressStatus,
    CategoryType,
    LandformType,
)
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def init_database():
    """初始化数据库"""
    print("🚀 开始初始化数据库...")

    # 创建异步引擎
    engine = create_async_engine(settings.database_url, echo=True)

    # 创建所有表
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)  # 先删除所有表
        await conn.run_sync(Base.metadata.create_all)  # 重新创建

    print("✅ 数据库表创建完成")

    # 创建会话
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # 插入初始数据
        await insert_initial_data(session)
        await session.commit()

    print("✅ 初始数据插入完成")

    await engine.dispose()
    print("🎉 数据库初始化完成！")


async def insert_initial_data(session: AsyncSession):
    """插入初始数据"""

    # 1. 创建测试用户
    print("📝 创建测试用户...")
    test_user = User(
        id=uuid.uuid4(),
        name="测试用户",
        email="test@example.com",
        password_hash=pwd_context.hash("password123"),
        level=UserLevel.BEGINNER,
        total_stars=45,
        is_verified=True,
    )
    session.add(test_user)

    # 2. 创建关卡
    print("📚 创建关卡数据...")
    levels_data = [
        {
            "name": "太阳系",
            "description": "了解太阳系的八大行星",
            "order_index": 1,
            "unlock_requirement": 0,
        },
        {
            "name": "板块构造",
            "description": "地球板块运动与地质现象",
            "order_index": 2,
            "unlock_requirement": 10,
        },
        {
            "name": "岩石圈循环",
            "description": "岩浆岩、沉积岩和变质岩的转化",
            "order_index": 3,
            "unlock_requirement": 30,
        },
        {
            "name": "全球贸易网络",
            "description": "国际贸易与经济地理",
            "order_index": 4,
            "unlock_requirement": 50,
        },
        {
            "name": "气候系统",
            "description": "全球气候类型与变化",
            "order_index": 5,
            "unlock_requirement": 80,
        },
    ]

    level_ids = []
    for level_data in levels_data:
        level = Level(
            id=uuid.uuid4(),
            name=level_data["name"],
            description=level_data["description"],
            order_index=level_data["order_index"],
            unlock_requirement=level_data["unlock_requirement"],
        )
        session.add(level)
        level_ids.append(level.id)

    # 3. 创建题目
    print("❓ 创建题目数据...")
    questions_data = [
        {
            "level_index": 2,  # 岩石圈循环
            "question": "下列哪种岩石是由岩浆冷却凝固形成的？",
            "options": ["花岗岩", "石灰岩", "大理岩", "页岩"],
            "correct_answer": 0,
            "explanation": "花岗岩是典型的岩浆岩，由岩浆在地下深处缓慢冷却凝固形成。",
        },
        {
            "level_index": 2,
            "question": "石灰岩属于哪一类岩石？",
            "options": ["岩浆岩", "沉积岩", "变质岩", "火山岩"],
            "correct_answer": 1,
            "explanation": "石灰�ite是由�ite酸钙沉积物经过压实和胶结作用形成的沉积岩。",
        },
        {
            "level_index": 2,
            "question": "大理岩是由哪种岩石变质形成的？",
            "options": ["花岗岩", "玄武岩", "石灰岩", "砂岩"],
            "correct_answer": 2,
            "explanation": "大理岩是由石灰岩在高温高压条件下变质形成的变质岩。",
        },
        {
            "level_index": 2,
            "question": "下列哪种地质作用属于内力作用？",
            "options": ["风化作用", "侵蚀作用", "地壳运动", "搬运作用"],
            "correct_answer": 2,
            "explanation": "地壳运动是地球内部能量引起的地质作用，属于内力作用。",
        },
        {
            "level_index": 2,
            "question": "沉积岩的典型特征是什么？",
            "options": ["有气孔构造", "有层理构造", "有片理构造", "有块状构造"],
            "correct_answer": 1,
            "explanation": "沉积岩具有层理构造，这是沉积物逐层堆积形成的典型特征。",
        },
    ]

    for i, q_data in enumerate(questions_data):
        question = Question(
            id=uuid.uuid4(),
            level_id=level_ids[q_data["level_index"]],
            question=q_data["question"],
            options=q_data["options"],
            correct_answer=q_data["correct_answer"],
            explanation=q_data["explanation"],
            order_index=i,
        )
        session.add(question)

    # 4. 创建每日百科
    print("📖 创建每日百科数据...")
    trivias = [
        {
            "title": "阿塔卡马沙漠",
            "description": "是世界上除极地外最干旱的地方。那里的某些气象站从未有过降雨记录。",
            "location": "智利",
            "region": "南美洲",
        },
        {
            "title": "马里亚纳海沟",
            "description": "是世界上最深的海沟，最深处挑战者深渊约有11,034米深。",
            "location": "太平洋西部",
            "region": "大洋洲",
        },
        {
            "title": "撒哈拉沙漠",
            "description": "是世界上最大的热沙漠，面积约920万平方公里。",
            "location": "非洲北部",
            "region": "非洲",
        },
    ]

    for i, trivia_data in enumerate(trivias):
        trivia = DailyTrivia(
            id=uuid.uuid4(),
            title=trivia_data["title"],
            description=trivia_data["description"],
            location=trivia_data["location"],
            region=trivia_data["region"],
            featured_date=datetime.utcnow() - timedelta(days=i),
        )
        session.add(trivia)

    # 5. 创建地理特征
    print("🌍 创建地理特征数据...")
    features = [
        {
            "name": "环太平洋火山地震带",
            "description": "环绕太平洋边缘的马蹄形地带，活火山和地震活动频繁。",
            "feature_type": "地质特征",
            "region": "太平洋",
        },
        {
            "name": "喜马拉雅山脉",
            "description": "世界最高的山脉，由印度板块与欧亚板块碰撞形成。",
            "feature_type": "地形特征",
            "region": "亚洲",
        },
        {
            "name": "亚马逊雨林",
            "description": "世界上最大的热带雨林，被称为地球之肺。",
            "feature_type": "生态特征",
            "region": "南美洲",
        },
    ]

    for feature_data in features:
        feature = GeographicFeature(
            id=uuid.uuid4(),
            name=feature_data["name"],
            description=feature_data["description"],
            feature_type=feature_data["feature_type"],
            region=feature_data["region"],
        )
        session.add(feature)

    # 6. 创建AR地貌
    print("🏔️ 创建AR地貌数据...")
    landforms = [
        {
            "name": "盆地",
            "description": "洼地地形",
            "type": LandformType.BASIN,
            "elevation": 1240,
        },
        {
            "name": "山峰",
            "description": "高海拔地形",
            "type": LandformType.PEAK,
            "elevation": 8848,
        },
        {
            "name": "山谷",
            "description": "河流路径",
            "type": LandformType.VALLEY,
            "elevation": 500,
        },
        {
            "name": "悬崖",
            "description": "垂直落差",
            "type": LandformType.CLIFF,
            "elevation": 900,
        },
    ]

    for landform_data in landforms:
        landform = ARLandform(
            id=uuid.uuid4(),
            name=landform_data["name"],
            description=landform_data["description"],
            type=landform_data["type"],
            elevation=landform_data["elevation"],
        )
        session.add(landform)

    await session.flush()
    print("✅ 所有初始数据已准备就绪")


if __name__ == "__main__":
    asyncio.run(init_database())
