import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodayTrivia, useUser, useUserProgress, DEFAULT_USER_ID } from '../hooks';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // API hooks for fetching data
  const { data: user, loading: userLoading } = useUser();
  const { data: trivia, loading: triviaLoading } = useTodayTrivia();
  const { data: progress } = useUserProgress();

  // Fallback data for when API is not available
  const displayUser = user || {
    name: 'Alex',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJlC6i-GX8uG7cjiRQSTfVaEJIZn3Gso0HxkCA4ttXcyCvdT7GybSqY1yhQGMn7L1LsM_W0amrWj6WGwFjjZKlh7nZEjt_e0GvrKTfDNHO5bvEO7Y4DN00qSs4Uzte6ZgqBS0NSsD5fyUKGePGwpWltJCnL6ItWwPf9WqjObykoz1swallvLNQc4MZL_8_XQxfWCpvscMKYox9GKuWrK8Yqm_3cNtvY7N4rkHIHKsZxDcVXz8-1I9bD2JHPBRp_FOpuslPtQ5USRDZ',
  };

  const displayTrivia = trivia || {
    title: '阿塔卡马沙漠',
    description: '是世界上除极地外最干旱的地方。那里的某些气象站从未有过降雨记录。',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvRoGHJUMVXrXCoOa_ExHzawnBPbV5hRGNAaxcE6DNmCkR7_-QZknxw2QD7b5OmFGEbsWEcUN4rN_k_FFUJCq4FqyryK88491OB7W2ndIGjy0xIqOy64T_WVpbrOAzqNO65wvkPCL61hU399-g8ggQ0vNScK-uStP1xSqzoF5l5VEJs28Bep_PvyN05noYg4HaTqVjqwnDIoAmLmCJGBX3wCxzF2BQ3T_bmKBC28b3AtrdvIcUpXTGStW4wBE-caIuv3BWwR6Us09s',
    location: '智利',
    region: '南美洲',
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="size-10 rounded-full bg-cover bg-center border-2 border-primary/20"
              style={{ backgroundImage: `url("${displayUser.avatar_url}")` }}
            >
            </div>
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-background-dark rounded-full"></div>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{getGreeting()},</p>
            <h2 className="text-lg font-bold leading-none text-slate-900 dark:text-white">
              {userLoading ? '...' : displayUser.name}
            </h2>
          </div>
        </div>
        <button className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="flex flex-col gap-6 p-4">
        <section className="w-full">
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:shadow-lg dark:shadow-none dark:border dark:border-slate-700/50">
            <div className="relative h-48 w-full overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url("${displayTrivia.image_url}")` }}
              >
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute top-3 right-3 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 border border-white/30 shadow-sm">
                <span className="text-xs font-bold text-white tracking-wide uppercase">每日百科</span>
              </div>
            </div>
            <div className="p-4 relative">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {triviaLoading ? '加载中...' : displayTrivia.title}
                </h3>
                <button className="text-primary hover:text-primary/80 transition-colors">
                  <span className="material-symbols-outlined">bookmark_border</span>
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {displayTrivia.description}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {displayTrivia.location} · {displayTrivia.region}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">学习模块</h2>
            <button className="text-sm font-semibold text-primary hover:underline">查看全部</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              className="flex flex-col items-start gap-3 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
              onClick={() => navigate('/levels')}
            >
              <div className="flex items-center justify-center size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">play_circle</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white leading-tight">微课</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">知识点精讲视频</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/globe')}
              className="flex flex-col items-start gap-3 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
            >
              <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">public</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white leading-tight">地图库</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">探索全球地理</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/mistakes')}
              className="flex flex-col items-start gap-3 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
            >
              <div className="flex items-center justify-center size-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">quiz</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white leading-tight">题库</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">巩固练习测试</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/ar')}
              className="flex flex-col items-start gap-3 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
            >
              <div className="flex items-center justify-center size-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">view_in_ar</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white leading-tight">AR探索</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">沉浸式观察体验</p>
              </div>
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 px-1">继续学习</h2>
          <div className="rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 size-16 rounded-xl bg-slate-100 dark:bg-slate-800 bg-cover bg-center"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCgh3swzb5IvgpNez37xMkY78r4kd_G38O4InINNLSkwLcUyodml7x5lI44sZ7yn_802CwKlO5iIbOB30e0kUGz9Vo8cI1GFi3CRYrR9kug4_glOSFVZU8RZaKRTv4n51XGijliFUHqlvL0SARYIlqTRij5k3li4GUzLM8NgFGpHHeTgzUp6EqkVh-FckVUtnoygSGpAfC-PGJMhDzDXCm58htxx0u3sBmozyodM2Qrf78ggTHQrK55HZfuuvP2e3XAFc-k0U_3YVPx")' }}
              >
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">大气环流</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">气候系统 • 高中二年级</p>
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  <span>学习进度</span>
                  <span>{progress?.completed_levels ? `${progress.completed_levels * 20}%` : '60%'}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: progress?.completed_levels ? `${progress.completed_levels * 20}%` : '60%' }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="h-px w-full bg-slate-100 dark:bg-slate-700/50"></div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex -space-x-2">
                <div
                  className="size-6 rounded-full bg-slate-200 border-2 border-white dark:border-surface-dark bg-cover bg-center"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBoGxGJ5O6HZcMdjg6GtyQ6kBQL-k2-S-xl6b-FD4OKj_hL-Z85taX6t5tebUSJNv_BhrsHigltrfqIQl6MwSrFHDjT_QglRgvWeGcllm8nFVvz2wjazaO1kyi4XOrBQgxe4Eeo600WfoMZ-GPrV64fb0-jkk1QiWM031Gr26_Y1YU8YbaAgnEpYRhBN_NqB0Lxv3RqDuY_BnqEUQtXJBdxQEobxXlVqQDmrlf1iYbP6mXK3Fx60mJt22-EW0bIzeiQqVgr7vI19VuJ")' }}
                ></div>
                <div
                  className="size-6 rounded-full bg-slate-300 border-2 border-white dark:border-surface-dark bg-cover bg-center"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAkNOrSSWG4nagFyt9XNL6GhavmaGYpqLkjqLg64gUbu4micLSdRGdTfkfXvvguobqCwEYdBoFU_EM9SmGQTkQFJzRJt3isMqWe5ZBeknWKybac3jJ60eLApu7CBTGqFLdLX9hkwvOIjgaHVkjaF2OLQzB0FB42juA07r0RUeT8ePa8xlgqN01JfpzGKVJHyPSY0xSsWl5aiveaWnurV6gjf7DNban3mI3LBgMakppqL6PuJ6TEM4QrQ1-ANRvczdsSY5R2k2s4MI4q")' }}
                ></div>
                <div className="size-6 rounded-full bg-slate-100 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[8px] font-bold text-slate-600">+12</div>
              </div>
              <button
                onClick={() => navigate('/levels')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
              >
                恢复学习
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;