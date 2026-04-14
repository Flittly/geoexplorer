import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const LevelDetail: React.FC = () => {
  const navigate = useNavigate();
  const { levelId } = useParams<{ levelId: string }>();

  // Mock level data
  const levelData = {
    id: levelId || '1',
    name: '岩石圈循环',
    description: '了解岩浆岩、沉积岩和变质岩的转化过程',
    totalQuestions: 10,
    completedQuestions: 0,
    stars: 0,
    maxStars: 3,
    difficulty: '中等',
    estimatedTime: '15分钟',
  };

  const startQuiz = () => {
    navigate(`/quiz/${levelId}`);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between">
          <button 
            onClick={() => navigate('/levels')}
            className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">{levelData.name}</h1>
          <div className="size-10"></div>
        </div>
      </header>

      <main className="p-4 pb-32">
        {/* Level Info Card */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">landscape</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{levelData.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{levelData.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-2xl font-bold text-primary">{levelData.totalQuestions}</p>
              <p className="text-xs text-slate-500">题目数量</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-2xl font-bold text-yellow-500">{levelData.difficulty}</p>
              <p className="text-xs text-slate-500">难度</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-2xl font-bold text-emerald-500">{levelData.estimatedTime}</p>
              <p className="text-xs text-slate-500">预计时间</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-400">学习进度</span>
              <span className="font-bold">{levelData.completedQuestions}/{levelData.totalQuestions}</span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                style={{ width: `${(levelData.completedQuestions / levelData.totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center justify-center gap-2">
            {[...Array(levelData.maxStars)].map((_, i) => (
              <span 
                key={i}
                className={`material-symbols-outlined text-3xl ${i < levelData.stars ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-600'}`}
              >
                {i < levelData.stars ? 'star' : 'star'}
              </span>
            ))}
          </div>
        </div>

        {/* Knowledge Points */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">school</span>
            知识要点
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-emerald-500 mt-0.5">check_circle</span>
              <span className="text-sm">岩石的三大类型：岩浆岩、沉积岩、变质岩</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-emerald-500 mt-0.5">check_circle</span>
              <span className="text-sm">岩石循环的过程和条件</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-emerald-500 mt-0.5">check_circle</span>
              <span className="text-sm">各类岩石的典型代表和特征</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-emerald-500 mt-0.5">check_circle</span>
              <span className="text-sm">地质作用对岩石转化的影响</span>
            </li>
          </ul>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
            关卡成就
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl opacity-50">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-slate-400">speed</span>
                <span className="text-sm font-medium">速度之星</span>
              </div>
              <p className="text-xs text-slate-500">5分钟内完成</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl opacity-50">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-slate-400">favorite</span>
                <span className="text-sm font-medium">完美通关</span>
              </div>
              <p className="text-xs text-slate-500">全部答对</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <button 
          onClick={startQuiz}
          className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">play_arrow</span>
          开始答题
        </button>
      </div>
    </div>
  );
};

export default LevelDetail;
