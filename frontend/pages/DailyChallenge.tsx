import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'explore' | 'memory';
  reward: number;
  progress: number;
  total: number;
  completed: boolean;
  icon: string;
  color: string;
}

const DailyChallenge: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 32, seconds: 15 });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const challenges: Challenge[] = [
    {
      id: '1',
      title: '快速答题',
      description: '完成5道地理选择题',
      type: 'quiz',
      reward: 50,
      progress: 3,
      total: 5,
      completed: false,
      icon: 'quiz',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      title: '探索世界',
      description: '在地图上发现3个新地点',
      type: 'explore',
      reward: 30,
      progress: 1,
      total: 3,
      completed: false,
      icon: 'explore',
      color: 'bg-emerald-500',
    },
    {
      id: '3',
      title: '记忆大师',
      description: '连续答对3道题',
      type: 'memory',
      reward: 40,
      progress: 3,
      total: 3,
      completed: true,
      icon: 'psychology',
      color: 'bg-purple-500',
    },
  ];

  const totalReward = challenges.reduce((sum, c) => sum + (c.completed ? c.reward : 0), 0);
  const maxReward = challenges.reduce((sum, c) => sum + c.reward, 0);

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
          <h1 className="text-lg font-bold flex-1 text-center">每日挑战</h1>
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </header>

      <main className="p-4 pb-24">
        {/* Timer Card */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80">距离刷新</p>
              <p className="text-2xl font-bold">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </p>
            </div>
            <div className="size-16 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">timer</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            <p className="text-sm opacity-80">每日挑战将在 UTC 00:00 刷新</p>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">今日进度</h2>
            <span className="text-primary font-bold">{totalReward}/{maxReward} ⭐</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
              style={{ width: `${(totalReward / maxReward) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            完成所有挑战可获得 {maxReward} 星星奖励！
          </p>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id}
              className={`bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-lg border transition-all ${
                challenge.completed 
                  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10' 
                  : 'border-slate-100 dark:border-slate-700 hover:shadow-xl'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`size-12 rounded-xl ${challenge.color} flex items-center justify-center text-white`}>
                  <span className="material-symbols-outlined text-2xl">{challenge.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{challenge.title}</h3>
                    {challenge.completed && (
                      <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{challenge.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">进度</span>
                      <span className="font-medium">{challenge.progress}/{challenge.total}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          challenge.completed ? 'bg-emerald-500' : 'bg-primary'
                        }`}
                        style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-500">+{challenge.reward}</p>
                  <p className="text-xs text-slate-500">⭐</p>
                </div>
              </div>
              
              {!challenge.completed && (
                <button 
                  onClick={() => {
                    if (challenge.type === 'quiz') {
                      navigate('/quiz/daily');
                    }
                  }}
                  className="w-full mt-4 py-3 bg-primary/10 text-primary font-medium rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">play_arrow</span>
                  继续挑战
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Bonus Section */}
        <div className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">workspace_premium</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">连续挑战奖励</h3>
              <p className="text-sm opacity-80">连续7天完成每日挑战，获得额外100星星！</p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i}
                className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < 3 ? 'bg-white text-orange-500' : 'bg-white/30 text-white'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DailyChallenge;
