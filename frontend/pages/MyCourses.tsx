import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLevels, useUserProgress } from '../hooks';

const MyCourses: React.FC = () => {
  const navigate = useNavigate();
  const { data: levels, loading: levelsLoading } = useLevels();
  const { data: progress } = useUserProgress();

  const completedCount = progress?.completed_levels || 0;
  const totalStars = progress?.total_stars || 0;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">我的课程</h1>
        <div className="w-10"></div>
      </header>

      <main className="p-4 space-y-5">
        {/* 学习概览 */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">学习概览</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{levels?.length || 0}</p>
              <p className="text-xs text-slate-500">总关卡</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">{completedCount}</p>
              <p className="text-xs text-slate-500">已完成</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-500">★ {totalStars}</p>
              <p className="text-xs text-slate-500">获得星星</p>
            </div>
          </div>
          {levels && levels.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">完成进度</span>
                <span className="font-bold text-primary">{Math.round((completedCount / levels.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all"
                  style={{ width: `${(completedCount / levels.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 课程列表 */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">全部课程</h2>
          </div>

          {levelsLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-slate-500 mt-2">加载中...</p>
            </div>
          ) : levels && levels.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {levels.map((level, index) => (
                <button
                  key={level.id}
                  onClick={() => navigate(`/level/${level.id}`)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="size-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{level.name}</p>
                    {level.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{level.description}</p>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300">school</span>
              <p className="text-sm text-slate-500 mt-2">暂无课程</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyCourses;
