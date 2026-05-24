import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeaderboard, useCurrentUser } from '../hooks';

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: '初学者',
  LEARNER: '学习者',
  SCHOLAR: '学者',
  EXPLORER: '探险家',
  MASTER: '大师',
};

function getAvatarInitials(name: string): string {
  return name.charAt(0) || '?';
}

const RANK_COLORS = [
  { border: 'border-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', badge: 'bg-yellow-500', bar: 'from-yellow-400 to-yellow-300 dark:from-yellow-600 dark:to-yellow-500', shadow: 'shadow-yellow-400/30', text: 'text-yellow-600 dark:text-yellow-400' },
  { border: 'border-slate-300 dark:border-slate-600', bg: 'bg-slate-100 dark:bg-slate-800', badge: 'bg-slate-400', bar: 'from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-500', shadow: '', text: 'text-slate-500' },
  { border: 'border-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', badge: 'bg-orange-500', bar: 'from-orange-400 to-orange-300 dark:from-orange-600 dark:to-orange-500', shadow: '', text: 'text-slate-500' },
];

const BAR_HEIGHTS = ['h-32', 'h-24', 'h-20'];
const AVATAR_SIZES = ['size-20', 'size-16', 'size-16'];
const TEXT_SIZES = ['text-4xl', 'text-3xl', 'text-3xl'];

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useCurrentUser();
  const { data: leaderboardData, loading, error } = useLeaderboard(currentUser?.id);

  const topThree = leaderboardData?.slice(0, 3) ?? [];
  const restOfList = leaderboardData?.slice(3) ?? [];
  const currentUserEntry = leaderboardData?.find(u => u.userId === currentUser?.id);

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
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full size-10 border-2 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <div className="text-center text-slate-500 py-16">
            <span className="material-symbols-outlined text-4xl mb-2">error_outline</span>
            <p>加载失败，请稍后重试</p>
          </div>
        ) : !leaderboardData || leaderboardData.length === 0 ? (
          <div className="text-center text-slate-500 py-16">
            <span className="material-symbols-outlined text-4xl mb-2">emoji_events</span>
            <p>暂无排行数据</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="flex items-end justify-center gap-3 mb-8">
              {[1, 0, 2].map((pos) => {
                const user = topThree[pos];
                if (!user) return <div key={pos} className="w-20" />;
                const colors = RANK_COLORS[pos];
                return (
                  <div key={user.userId} className="flex flex-col items-center">
                    <div className="relative mb-2">
                      <div className={`${AVATAR_SIZES[pos]} rounded-full ${colors.bg} flex items-center justify-center ${TEXT_SIZES[pos]} border-4 ${colors.border} ${pos === 0 ? colors.shadow : ''}`}>
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="size-full rounded-full object-cover" />
                        ) : (
                          <span className="font-bold text-slate-600 dark:text-slate-300 text-base">
                            {getAvatarInitials(user.name)}
                          </span>
                        )}
                      </div>
                      {pos === 0 && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                          <span className="material-symbols-outlined text-yellow-500 text-3xl">crown</span>
                        </div>
                      )}
                      <div className={`absolute -bottom-1 -right-1 size-6 ${colors.badge} ${pos === 0 ? 'size-7' : ''} rounded-full flex items-center justify-center text-white text-xs font-bold ${pos === 0 ? 'text-sm' : ''}`}>
                        {pos + 1}
                      </div>
                    </div>
                    <p className={`text-sm ${pos === 0 ? 'font-bold' : 'font-medium'} mb-1 truncate w-20 text-center`}>
                      {user.name}
                    </p>
                    <p className={`text-xs ${colors.text}`}>{user.totalStars} ⭐</p>
                    <div className={`w-20 ${BAR_HEIGHTS[pos]} bg-gradient-to-t ${colors.bar} rounded-t-lg mt-2`}></div>
                  </div>
                );
              })}
            </div>

            {/* Rest of List */}
            <div className="space-y-2">
              {restOfList.map((user) => {
                const isMe = user.userId === currentUser?.id;
                return (
                  <div
                    key={user.userId}
                    className={`flex items-center gap-4 p-4 rounded-xl ${
                      isMe
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-700'
                    }`}
                  >
                    <span className={`w-8 text-center font-bold ${
                      user.rank <= 3 ? 'text-primary' : 'text-slate-400'
                    }`}>
                      {user.rank}
                    </span>
                    <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 overflow-hidden shrink-0">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="size-full object-cover" />
                      ) : (
                        getAvatarInitials(user.name)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isMe ? 'text-primary' : ''}`}>
                        {user.name}
                        {isMe && <span className="ml-2 text-xs">(我)</span>}
                      </p>
                      <p className="text-xs text-slate-500">{LEVEL_LABELS[user.level] || user.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-500">{user.totalStars}</p>
                      <p className="text-xs text-slate-500">⭐</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Current User Stats (Fixed Bottom) */}
      {currentUserEntry && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4 p-3 bg-primary/10 rounded-xl border border-primary/20">
            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary shrink-0 overflow-hidden">
              {currentUserEntry.avatarUrl ? (
                <img src={currentUserEntry.avatarUrl} alt="" className="size-full object-cover" />
              ) : (
                getAvatarInitials(currentUserEntry.name)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{currentUserEntry.name}</p>
              <p className="text-sm text-slate-500">{LEVEL_LABELS[currentUserEntry.level] || currentUserEntry.level}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-primary">#{currentUserEntry.rank}</p>
              <p className="text-xs text-slate-500">{currentUserEntry.totalStars} ⭐</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
