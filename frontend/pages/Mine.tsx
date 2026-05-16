import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks';
import { clearAuthData } from '../api';

const Mine: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (refreshToken) {
        const { default: api } = await import('../api');
        await api.auth.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuthData();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  const genderDisplay = user?.gender === 'male' ? '男' : user?.gender === 'female' ? '女' : '';

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">我的</h1>
        <div className="w-10"></div>
      </header>

      <main className="p-4 space-y-5">
        {/* 用户信息卡片 */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-primary/20 shadow-md"
              style={{ backgroundImage: `url("${user?.avatar_url || 'https://via.placeholder.com/64'}")` }}
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || '未设置昵称'}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {user?.email || user?.phone || '未绑定账号'}
                {genderDisplay && ` · ${genderDisplay}`}
                {user?.age && ` · ${user.age}岁`}
              </p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              编辑
            </button>
          </div>

          {/* 等级和星星 */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <span className="material-symbols-outlined text-primary text-sm">school</span>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{user?.level || '初学者'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <span className="text-amber-500 text-sm">★</span>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">{user?.total_stars || 0} 星星</span>
            </div>
          </div>
        </div>

        {/* 功能入口 */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
          <button
            onClick={() => navigate('/my-courses')}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-700/50"
          >
            <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-500">menu_book</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white">我的课程</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">查看学习进度和关卡</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>

          <button
            onClick={() => navigate('/mistakes')}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-700/50"
          >
            <div className="size-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-500">error</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white">错题集</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">复习做错的题目</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-700/50"
          >
            <div className="size-10 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-yellow-500">leaderboard</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white">排行榜</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">查看学习排名</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>

          <button
            onClick={() => navigate('/daily-challenge')}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="size-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-500">bolt</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white">每日挑战</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">每日答题挑战</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>
        </div>

        {/* 退出登录 */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold text-base hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all"
        >
          退出登录
        </button>
      </main>
    </div>
  );
};

export default Mine;
