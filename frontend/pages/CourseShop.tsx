import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsyncData } from '../hooks';
import { courseShopAPI, CoursePackage } from '../api';

const categories = ['全部', '自然地理', '人文地理', '区域地理', '地理工具'];

const CourseShop: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('全部');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, loading } = useAsyncData(
    () => courseShopAPI.getPackages({
      category: category === '全部' ? undefined : category,
      limit,
      offset: (page - 1) * limit,
    }),
    [category, page]
  );

  const packages = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-8">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">课程商城</h1>
        <button onClick={() => navigate('/cart')} className="relative flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">shopping_cart</span>
        </button>
      </header>

      <main className="p-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {categories.map(c => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === c ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full size-8 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3">inventory_2</span>
            <p className="text-sm">暂无课程</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {packages.map(pkg => (
              <div key={pkg.id} onClick={() => navigate(`/course-shop/${pkg.id}`)}
                className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50 cursor-pointer hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {pkg.cover_url ? (
                    <img src={pkg.cover_url} alt={pkg.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">play_circle</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{pkg.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pkg.course_count} 节课</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-primary font-bold text-sm">¥{(pkg.selling_price / 100).toFixed(0)}</span>
                    {pkg.original_price > pkg.selling_price && (
                      <span className="text-xs text-slate-400 line-through">¥{(pkg.original_price / 100).toFixed(0)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm disabled:opacity-40">上一页</button>
            <span className="text-sm text-slate-500">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm disabled:opacity-40">下一页</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseShop;
