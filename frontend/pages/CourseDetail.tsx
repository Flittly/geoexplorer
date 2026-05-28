import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseShopAPI, CoursePackage, Course } from '../api';

const CourseDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<CoursePackage | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      courseShopAPI.getPackage(id),
      courseShopAPI.getPackageCourses(id),
    ]).then(([p, c]) => {
      setPkg(p);
      setCourses(c);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    if (!id) return;
    const cart: string[] = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.includes(id)) {
      cart.push(id);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    alert('已加入购物车');
  };

  const buyNow = () => {
    if (!id) return;
    localStorage.setItem('cart', JSON.stringify([id]));
    navigate('/cart');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full size-8 border-2 border-primary border-t-transparent"></div></div>;
  }

  if (!pkg) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">课程包不存在</div>;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[60%]">{pkg.title}</h1>
        <div className="w-10"></div>
      </header>

      <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {pkg.cover_url ? (
          <img src={pkg.cover_url} alt={pkg.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">play_circle</span>
          </div>
        )}
      </div>

      <main className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-primary font-bold text-2xl">¥{(pkg.selling_price / 100).toFixed(0)}</span>
          {pkg.original_price > pkg.selling_price && (
            <span className="text-sm text-slate-400 line-through">¥{(pkg.original_price / 100).toFixed(0)}</span>
          )}
          {pkg.category && (
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{pkg.category}</span>
          )}
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{pkg.title}</h2>
        {pkg.description && <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{pkg.description}</p>}

        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <span>{pkg.course_count} 节课</span>
          <span>有效期 {pkg.expire_days} 天</span>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">课程列表</h3>
          <div className="space-y-2">
            {courses.map((course, index) => (
              <div key={course.id} className="flex items-center gap-3 bg-white dark:bg-surface-dark rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-400 w-6 text-center">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{course.title}</p>
                  {course.duration && <p className="text-xs text-slate-400 mt-0.5">{course.duration}</p>}
                </div>
                <span className="material-symbols-outlined text-slate-400 text-lg">play_circle</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 px-4 py-3 pb-safe z-50">
        <div className="flex gap-3 max-w-md mx-auto">
          <button onClick={addToCart} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            加入购物车
          </button>
          <button onClick={buyNow} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-blue-600 active:scale-[0.99] transition-all">
            立即购买
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
