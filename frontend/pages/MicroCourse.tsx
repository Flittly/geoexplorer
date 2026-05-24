import React from 'react';
import { useNavigate } from 'react-router-dom';

const COURSES = [
  { id: 1, title: '地球的结构', duration: '8:32', category: '自然地理' },
  { id: 2, title: '气候的形成与分布', duration: '12:15', category: '自然地理' },
  { id: 3, title: '中国地形概况', duration: '10:48', category: '区域地理' },
  { id: 4, title: '世界人口分布', duration: '7:55', category: '人文地理' },
  { id: 5, title: '河流与湖泊', duration: '9:20', category: '自然地理' },
  { id: 6, title: '经纬网与地图', duration: '11:05', category: '地理工具' },
];

const MicroCourse: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 gap-4">
          <button onClick={() => navigate(-1)} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-bold">知识点精讲</h1>
            <p className="text-xs text-slate-500">点击视频卡片开始学习</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-3">
        {COURSES.map(course => (
          <div key={course.id} className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="size-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-3xl">play_circle</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white">{course.title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{course.category}</span>
                <span className="text-xs text-slate-400">{course.duration}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </div>
        ))}
      </main>
    </div>
  );
};

export default MicroCourse;