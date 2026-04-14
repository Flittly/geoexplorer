import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  stars: number;
  level: string;
  isCurrentUser?: boolean;
}

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  // Mock leaderboard data
  const leaderboardData: LeaderboardUser[] = [
    { id: '1', rank: 1, name: '地理达人小王', avatar: '👨‍🎓', stars: 2850, level: '探险家' },
    { id: '2', rank: 2, name: '热爱地理的小李', avatar: '👩‍🎓', stars: 2720, level: '探险家' },
    { id: '3', rank: 3, name: '山川湖海', avatar: '🧑‍🎓', stars: 2650, level: '探险家' },
    { id: '4', rank: 4, name: '环球旅行家', avatar: '👨‍💼', stars: 2480, level: '学者' },
    { id: '5', rank: 5, name: '地图迷', avatar: '👩‍💼', stars: 2350, level: '学者' },
    { id: '6', rank: 6, name: '地球探索者', avatar: '🧑‍💼', stars: 2200, level: '学者' },
    { id: '7', rank: 7, name: '自然爱好者', avatar: '👨‍🔬', stars: 2050, level: '学习者' },
    { id: '8', rank: 8, name: '地理小能手', avatar: '👩‍🔬', stars: 1900, level: '学习者' },
    { id: '9', rank: 9, name: '世界那么大', avatar: '🧑‍🔬', stars: 1750, level: '学习者' },
    { id: '10', rank: 10, name: '探索未知', avatar: '👨‍🏫', stars: 1600, level: '学习者' },
    { id: 'current', rank: 28, name: '我', avatar: '😊', stars: 450, level: '初学者', isCurrentUser: true },
  ];

  const topThree = leaderboardData.slice(0, 3);
  const restOfList = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">排行榜</h1>
          <div className="size-10"></div>
        </div>
      </header>

      <main className="p-4 pb-24">
        {/* Time Range Selector */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
          <button 
            onClick={() => setTimeRange('week')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              timeRange === 'week' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' 
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            本周
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              timeRange === 'month' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' 
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            本月
          </button>
          <button 
            onClick={() => setTimeRange('all')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              timeRange === 'all' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' 
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            总榜
          </button>
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-3 mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl border-4 border-slate-300 dark:border-slate-600">
                {topThree[1]?.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-bold">
                2
              </div>
            </div>
            <p className="text-sm font-medium mb-1 truncate w-20 text-center">{topThree[1]?.name}</p>
            <p className="text-xs text-slate-500">{topThree[1]?.stars} ⭐</p>
            <div className="w-20 h-24 bg-gradient-to-t from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-500 rounded-t-lg mt-2"></div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="size-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-4xl border-4 border-yellow-400 shadow-lg shadow-yellow-400/30">
                {topThree[0]?.avatar}
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <span className="material-symbols-outlined text-yellow-500 text-3xl">crown</span>
              </div>
              <div className="absolute -bottom-1 -right-1 size-7 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
            </div>
            <p className="text-sm font-bold mb-1 truncate w-24 text-center">{topThree[0]?.name}</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">{topThree[0]?.stars} ⭐</p>
            <div className="w-24 h-32 bg-gradient-to-t from-yellow-400 to-yellow-300 dark:from-yellow-600 dark:to-yellow-500 rounded-t-lg mt-2"></div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="size-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-3xl border-4 border-orange-400">
                {topThree[2]?.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                3
              </div>
            </div>
            <p className="text-sm font-medium mb-1 truncate w-20 text-center">{topThree[2]?.name}</p>
            <p className="text-xs text-slate-500">{topThree[2]?.stars} ⭐</p>
            <div className="w-20 h-20 bg-gradient-to-t from-orange-400 to-orange-300 dark:from-orange-600 dark:to-orange-500 rounded-t-lg mt-2"></div>
          </div>
        </div>

        {/* Rest of List */}
        <div className="space-y-2">
          {restOfList.map((user) => (
            <div 
              key={user.id}
              className={`flex items-center gap-4 p-4 rounded-xl ${
                user.isCurrentUser 
                  ? 'bg-primary/10 border-2 border-primary' 
                  : 'bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-700'
              }`}
            >
              <span className={`w-8 text-center font-bold ${
                user.rank <= 10 ? 'text-primary' : 'text-slate-400'
              }`}>
                {user.rank}
              </span>
              <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${user.isCurrentUser ? 'text-primary' : ''}`}>
                  {user.name}
                  {user.isCurrentUser && <span className="ml-2 text-xs">(我)</span>}
                </p>
                <p className="text-xs text-slate-500">{user.level}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-yellow-500">{user.stars}</p>
                <p className="text-xs text-slate-500">⭐</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Current User Stats (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 p-3 bg-primary/10 rounded-xl border border-primary/20">
          <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
            😊
          </div>
          <div className="flex-1">
            <p className="font-bold">我的排名</p>
            <p className="text-sm text-slate-500">继续努力，冲进前10！</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">#28</p>
            <p className="text-xs text-slate-500">450 ⭐</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
