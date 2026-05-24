import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser, useLevels, useLevelProgress } from '../hooks';
import { Level } from '../api';

const getLevelStatus = (
  level: Level,
  index: number,
  levels: Level[],
  progressList: ReturnType<typeof useLevelProgress>['data']
) => {
  const progress = progressList?.find(p => p.level_id === level.id);
  const pStatus = progress?.status?.toLowerCase();
  if (pStatus === 'completed') return 'completed';
  if (pStatus === 'active') return 'active';
  if (index === 0) return 'unlocked';
  const prevLevel = levels[index - 1];
  const prevProgress = progressList?.find(p => p.level_id === prevLevel?.id);
  if (prevProgress?.status?.toLowerCase() === 'completed') return 'unlocked';
  return 'locked';
};

const getStarIcons = (stars: number) => {
  const full = Math.floor(stars);
  const half = stars % 1 >= 0.5 ? 1 : 0;
  const empty = 3 - full - half;
  return (
    <>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`} className="material-symbols-outlined icon-filled" style={{ fontSize: '16px' }}>star</span>
      ))}
      {half === 1 && <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px' }}>star_half</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} className="material-symbols-outlined" style={{ fontSize: '16px' }}>star</span>
      ))}
    </>
  );
};

const Levels: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { data: levels, loading: levelsLoading } = useLevels();
  const { data: progressList, loading: progressLoading } = useLevelProgress(user?.id);

  const loading = levelsLoading || progressLoading;

  console.log('Levels debug:', { levels, progressList, userId: user?.id });

  const sortedLevels = levels
    ? [...levels].sort((a, b) => a.order_index - b.order_index)
    : [];

  const completedCount = progressList?.filter(p => p.status?.toLowerCase() === 'completed').length ?? 0;
  const totalCount = sortedLevels.length;
  const totalStars = progressList?.reduce((sum, p) => sum + (p.stars || 0), 0) ?? 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased selection:bg-primary-green selection:text-background-dark">
      <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100 dark:from-[#1c4d2e] via-background-light dark:via-background-dark to-transparent opacity-60 dark:opacity-60 pointer-events-none z-0"></div>

      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-emerald-200/50 dark:border-white/5">
        <div className="flex items-center p-4 justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-slate-500 dark:text-white/80 hover:text-primary-green transition-colors flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-emerald-50 dark:hover:bg-white/5"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
          </button>
          <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">地理闯关</h1>
          <button className="flex size-10 items-center justify-center rounded-full text-slate-500 dark:text-white/80 hover:text-primary-green hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>settings</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col px-4 pb-24">
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="size-10 border-2 border-primary-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm">加载中...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 rounded-2xl border border-emerald-200 dark:border-[#326744] bg-emerald-50 dark:bg-surface-green-dark p-4 items-center text-center shadow-lg">
                <div className="bg-emerald-100 dark:bg-[#326744]/30 p-2 rounded-full mb-1">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-primary-green" style={{ fontSize: '24px' }}>hiking</span>
                </div>
                <p className="text-emerald-900 dark:text-white tracking-tight text-xl font-bold leading-tight">{user?.level || '初学者'}</p>
                <p className="text-emerald-600 dark:text-[#92c9a4] text-xs uppercase tracking-wider font-medium">当前等级</p>
              </div>
              <div className="flex flex-col gap-1 rounded-2xl border border-emerald-200 dark:border-[#326744] bg-emerald-50 dark:bg-surface-green-dark p-4 items-center text-center shadow-lg">
                <div className="bg-emerald-100 dark:bg-[#326744]/30 p-2 rounded-full mb-1">
                  <span className="material-symbols-outlined text-yellow-500" style={{ fontSize: '24px' }}>star</span>
                </div>
                <p className="text-emerald-900 dark:text-white tracking-tight text-xl font-bold leading-tight">{totalStars}</p>
                <p className="text-emerald-600 dark:text-[#92c9a4] text-xs uppercase tracking-wider font-medium">总星数</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <p className="text-slate-700 dark:text-white text-sm font-medium">闯关进度</p>
                <p className="text-emerald-600 dark:text-primary-green text-sm font-bold">{completedCount}/{totalCount}</p>
              </div>
              <div className="h-3 w-full rounded-full bg-emerald-100 dark:bg-[#326744]/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 dark:from-primary-green/60 to-emerald-500 dark:to-primary-green transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-emerald-600 dark:text-[#92c9a4] text-xs text-right mt-1">
                已完成 {completedCount} 个关卡
              </p>
            </div>

            <div className="mt-8 flex flex-col relative">
              <div className="absolute left-[27px] top-4 bottom-10 w-0.5 bg-emerald-200 dark:bg-[#326744]/30 z-0"></div>

              {[...sortedLevels].reverse().map((level, reverseIndex) => {
                const index = sortedLevels.length - 1 - reverseIndex;
                const status = getLevelStatus(level, index, sortedLevels, progressList);
                console.log('Level status:', { name: level.name, index, status, progress: progressList?.find(p => p.level_id === level.id) });
                const progress = progressList?.find(p => p.level_id === level.id);

                if (status === 'locked') {
                  const isFirst = reverseIndex === sortedLevels.length - 1;
                  return (
                    <div key={level.id} className={`relative grid grid-cols-[56px_1fr] gap-x-4 mb-2 ${isFirst ? '' : 'opacity-60'}`}>
                      <div className="flex flex-col items-center h-full">
                        <div className="w-0.5 bg-transparent h-4 shrink-0"></div>
                        <div className="z-10 flex items-center justify-center size-14 rounded-full border-2 border-emerald-200 dark:border-[#326744] bg-slate-100 dark:bg-background-dark text-slate-400 dark:text-slate-500 shadow-sm">
                          <span className="material-symbols-outlined">lock</span>
                        </div>
                        <div className="w-0.5 bg-emerald-200 dark:bg-[#326744]/50 h-full grow min-h-[40px]"></div>
                      </div>
                      <div className="pt-3 pb-8">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-slate-500 dark:text-slate-400 text-lg font-bold">{level.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                              第 {level.order_index} 关
                            </span>
                            <span className="text-slate-400 dark:text-slate-600 text-sm">未解锁</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (status === 'completed') {
                  return (
                    <div
                      key={level.id}
                      className="relative grid grid-cols-[56px_1fr] gap-x-4 mb-2 cursor-pointer group"
                      onClick={() => navigate(`/level/${level.id}`)}
                    >
                      <div className="flex flex-col items-center h-full">
                        <div className="w-1 bg-emerald-400 dark:bg-primary-green h-4 shrink-0"></div>
                        <div className="z-10 flex flex-col items-center justify-center size-14 rounded-full border-2 border-emerald-400 dark:border-primary-green bg-emerald-50 dark:bg-surface-green-dark text-emerald-500 dark:text-primary-green shadow-[0_0_10px_rgba(5,150,105,0.2)] dark:shadow-[0_0_10px_rgba(19,236,91,0.2)] group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>check</span>
                        </div>
                        <div className="w-1 bg-emerald-400 dark:bg-primary-green h-full grow min-h-[40px]"></div>
                      </div>
                      <div className="pt-3 pb-8">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center pr-2">
                            <h3 className="text-slate-800 dark:text-white text-lg font-bold">{level.name}</h3>
                            <span className="text-emerald-600 dark:text-primary-green font-bold text-sm">{progress?.completion_percentage ?? 0}%</span>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400">
                            {getStarIcons(progress?.stars ?? 0)}
                            <span className="text-xs text-slate-400 ml-2 font-normal">得分: {progress?.score ?? 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (status === 'active') {
                  return (
                    <div key={level.id} className="relative grid grid-cols-[56px_1fr] gap-x-4 mb-2">
                      <div className="flex flex-col items-center h-full">
                        <div className="w-0.5 bg-emerald-200 dark:bg-[#326744] h-4 shrink-0"></div>
                        <div className="relative z-10">
                          <div className="absolute inset-0 rounded-full bg-emerald-400 dark:bg-primary-green blur-md opacity-40 animate-pulse"></div>
                          <button
                            onClick={() => navigate(`/level/${level.id}`)}
                            className="relative flex items-center justify-center size-14 rounded-full border-4 border-emerald-500 dark:border-primary-green bg-white dark:bg-background-dark text-emerald-600 dark:text-primary-green hover:scale-105 transition-transform shadow-[0_0_20px_rgba(5,150,105,0.2)] dark:shadow-[0_0_20px_rgba(19,236,91,0.3)]"
                          >
                            <span className="material-symbols-outlined filled" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                          </button>
                        </div>
                        <div className="w-1 bg-gradient-to-b from-emerald-400 dark:from-primary-green to-emerald-400/60 dark:to-primary-green/80 h-full grow min-h-[50px]"></div>
                      </div>
                      <div className="pt-2 pb-10">
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-surface-green-dark border border-emerald-300 dark:border-primary-green/30 shadow-lg flex flex-col gap-3">
                          <div>
                            <h3 className="text-emerald-900 dark:text-white text-xl font-bold">{level.name}</h3>
                            {level.description && (
                              <p className="text-emerald-600 dark:text-[#92c9a4] text-sm mt-1">{level.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-primary-green/20 text-emerald-700 dark:text-primary-green border border-emerald-200 dark:border-primary-green/20">当前关卡</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                              {getStarIcons(progress?.stars ?? 0)}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">正在探索</span>
                          </div>
                          <button
                            onClick={() => navigate(`/level/${level.id}`)}
                            className="w-full mt-1 bg-emerald-500 dark:bg-primary-green text-white dark:text-background-dark font-bold py-2 rounded-lg hover:bg-emerald-600 dark:hover:bg-white transition-colors"
                          >
                            继续答题
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // status === 'unlocked'
                return (
                  <div
                    key={level.id}
                    className="relative grid grid-cols-[56px_1fr] gap-x-4 mb-2 cursor-pointer group"
                    onClick={() => navigate(`/level/${level.id}`)}
                  >
                    <div className="flex flex-col items-center h-full">
                      <div className="w-0.5 bg-emerald-200 dark:bg-[#326744] h-4 shrink-0"></div>
                      <div className="z-10 flex items-center justify-center size-14 rounded-full border-2 border-emerald-400/50 dark:border-primary-green/50 bg-white dark:bg-background-dark text-emerald-600 dark:text-primary-green group-hover:scale-105 transition-transform shadow-sm">
                        <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>play_arrow</span>
                      </div>
                      <div className="w-0.5 bg-emerald-200 dark:bg-[#326744] h-full grow min-h-[40px]"></div>
                    </div>
                    <div className="pt-3 pb-8">
                      <div className="flex flex-col gap-2">
                        <div>
                          <h3 className="text-slate-800 dark:text-white text-lg font-bold">{level.name}</h3>
                          {level.description && (
                            <p className="text-emerald-600 dark:text-[#92c9a4] text-xs mt-1">{level.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-primary-green border border-emerald-200 dark:border-primary-green/20">
                            第 {level.order_index} 关
                          </span>
                          <span className="text-emerald-600 dark:text-primary-green text-sm">已解锁</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/level/${level.id}`); }}
                          className="w-fit px-4 mt-1 bg-primary-green/10 text-primary-green font-bold py-1.5 rounded-lg border border-primary-green/20 hover:bg-primary-green hover:text-background-dark transition-colors text-sm"
                        >
                          开始闯关
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <div className="fixed bottom-24 right-6 z-50">
        <button className="group flex items-center justify-center rounded-2xl h-14 bg-primary-green text-background-dark shadow-[0_4px_20px_rgba(19,236,91,0.4)] hover:shadow-[0_6px_25px_rgba(19,236,91,0.6)] hover:-translate-y-1 transition-all pl-4 pr-5 gap-2 overflow-hidden">
          <div className="bg-black/10 rounded-full p-1 group-hover:bg-black/20 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>bolt</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80 leading-none mb-0.5">快速</span>
            <span className="text-sm font-bold leading-none">每日挑战</span>
          </div>
        </button>
      </div>

      <nav className="fixed bottom-0 w-full bg-emerald-100/95 dark:bg-[#102216]/95 backdrop-blur border-t border-emerald-200/50 dark:border-white/5 pb-4 pt-2 px-6 flex justify-between items-center z-40">
        <button
          onClick={() => navigate('/levels')}
          className="flex flex-col items-center gap-1 p-2 text-emerald-600 dark:text-primary-green"
        >
          <span className="material-symbols-outlined icon-filled">map</span>
          <span className="text-[10px] font-medium">路径</span>
        </button>
        <button
          onClick={() => navigate('/leaderboard')}
          className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="text-[10px] font-medium">排行</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">book_2</span>
          <span className="text-[10px] font-medium">学习</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default Levels;
