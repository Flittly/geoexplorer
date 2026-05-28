import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsyncData } from '../hooks';
import { myCoursesAPI, MyCourse } from '../api';

const MyCourses: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'learning' | 'completed' | 'expired'>('learning');

  const { data: courses, loading } = useAsyncData<MyCourse[]>(
    () => myCoursesAPI.getMyCourses(),
    []
  );

  const now = new Date();
  const filtered = (courses || []).filter(c => {
    const expired = new Date(c.expire_at) < now;
    const completed = c.progress_percent >= 100;
    if (tab === 'expired') return expired;
    if (tab === 'completed') return completed && !expired;
    return !completed && !expired;
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-8">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">我的课程</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex gap-1 px-4 py-3 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800/50">
        {[
          { key: 'learning' as const, label: '学习中' },
          { key: 'completed' as const, label: '已完成' },
          { key: 'expired' as const, label: '已过期' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${tab === t.key ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <main className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full size-8 border-2 border-primary border-t-transparent"></div></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3">school</span>
            <p className="text-sm">{tab === 'expired' ? '没有过期课程' : tab === 'completed' ? '还没有完成的课程' : '还没有购买课程'}</p>
            {tab === 'learning' && (
              <button onClick={() => navigate('/course-shop')} className="mt-4 px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium">去购买</button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(course => (
              <div key={course.package_id} className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="size-16 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                    {course.cover_url ? (
                      <img src={course.cover_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-2xl text-slate-300">play_circle</span></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{course.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{course.completed_count}/{course.course_count} 节</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${course.progress_percent}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-500">{course.progress_percent}%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">有效期至 {new Date(course.expire_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => navigate(`/my-courses/${course.package_id}`)}
                  className="mt-3 w-full py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                  {course.progress_percent > 0 && course.progress_percent < 100 ? '继续学习' : '开始学习'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyCourses;
