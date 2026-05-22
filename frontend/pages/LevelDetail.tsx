import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { levelsAPI, questionsAPI } from '../api';
import { useCurrentUser, useLevelProgress, useAsyncData } from '../hooks';

const LevelDetail: React.FC = () => {
  const navigate = useNavigate();
  const { levelId } = useParams<{ levelId: string }>();

  const { user } = useCurrentUser();
  const { data: level, loading: levelLoading } = useAsyncData(
    () => levelsAPI.getLevel(levelId!),
    [levelId]
  );
  const { data: questions } = useAsyncData(
    () => questionsAPI.getQuestionsByLevel(levelId!),
    [levelId]
  );
  const { data: progressList } = useLevelProgress(user?.id);
  const progress = progressList?.find((p) => p.level_id === levelId);

  const startQuiz = () => {
    navigate(`/quiz/${levelId}`);
  };

  if (levelLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-5xl text-slate-400">error_outline</span>
        <p className="text-slate-500">关卡不存在</p>
        <button onClick={() => navigate('/levels')} className="text-primary font-medium">返回关卡列表</button>
      </div>
    );
  }

  const isCompleted = progress?.status?.toLowerCase() === 'completed';
  const totalQuestions = questions?.length ?? 0;

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
          <h1 className="text-lg font-bold flex-1 text-center">{level.name}</h1>
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
              <h2 className="text-xl font-bold">{level.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{level.description || '暂无描述'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-2xl font-bold text-primary">{totalQuestions}</p>
              <p className="text-xs text-slate-500">题目数量</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-2xl font-bold text-yellow-500">{progress?.score ?? 0}</p>
              <p className="text-xs text-slate-500">得分</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-2xl font-bold text-emerald-500">{progress?.completion_percentage ?? 0}%</p>
              <p className="text-xs text-slate-500">完成度</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-400">学习进度</span>
              <span className="font-bold">{progress?.completion_percentage ?? 0}%</span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                style={{ width: `${progress?.completion_percentage ?? 0}%` }}
              ></div>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className={`material-symbols-outlined text-3xl ${i <= (progress?.stars ?? 0) ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-600'}`}
              >
                star
              </span>
            ))}
          </div>

          {isCompleted && (
            <div className="mt-4 flex items-center justify-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium">
                <span className="material-symbols-outlined text-base">check_circle</span>
                已完成
              </span>
            </div>
          )}
        </div>

        {/* Level Meta */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">school</span>
            关卡信息
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              <span className="text-sm">序号：第 {level.order_index} 关</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              <span className="text-sm">解锁需要：{level.unlock_requirement} 颗星</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              <span className="text-sm">题目总数：{totalQuestions} 题</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={startQuiz}
          className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">{isCompleted ? 'replay' : 'play_arrow'}</span>
          {isCompleted ? '再次挑战' : '开始答题'}
        </button>
      </div>
    </div>
  );
};

export default LevelDetail;
