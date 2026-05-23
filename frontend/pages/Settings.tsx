import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-8">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">设置</h1>
        <div className="w-10"></div>
      </header>

      <main className="p-4 space-y-5">
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">外观</h2>
          </div>

          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-500">
                  {isDark ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">深色模式</p>
                <p className="text-xs text-slate-500">切换页面的深色/浅色主题</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                isDark ? 'bg-primary' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
                  isDark ? 'translate-x-[22px]' : 'translate-x-[2px]'
                }`}
              />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
