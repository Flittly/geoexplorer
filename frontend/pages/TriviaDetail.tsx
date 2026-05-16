import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { DailyTrivia } from '../api';

const TriviaDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [trivia, setTrivia] = useState<DailyTrivia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchTrivia = async () => {
      try {
        const data = await api.trivia.getTrivia(id);
        setTrivia(data);
      } catch {
        setError('加载失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchTrivia();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !trivia) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">error_outline</span>
          <p className="text-slate-500 dark:text-slate-400">{error || '内容不存在'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 rounded-xl bg-primary text-white font-medium"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-8">
      {/* 头图 */}
      <div className="relative h-64 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${trivia.image_url || 'https://via.placeholder.com/800x400'}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 size-10 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center border border-white/20"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        {/* 标签 */}
        <div className="absolute top-4 right-3 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 border border-white/30">
          <span className="text-xs font-bold text-white tracking-wide uppercase">每日百科</span>
        </div>

        {/* 底部信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-bold text-white mb-2">{trivia.title}</h1>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white/80 text-sm">location_on</span>
            <span className="text-sm text-white/80">
              {trivia.location}{trivia.region ? ` · ${trivia.region}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <main className="p-4 space-y-6">
        {/* 基本信息卡片 */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50">
          <div className="grid grid-cols-2 gap-4">
            {trivia.location && (
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">地点</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{trivia.location}</p>
                </div>
              </div>
            )}
            {trivia.region && (
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-500 text-xl">public</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">区域</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{trivia.region}</p>
                </div>
              </div>
            )}
            {trivia.featured_date && (
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-500 text-xl">calendar_today</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">日期</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{trivia.featured_date}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 详细介绍 */}
        {trivia.description && (
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">详细介绍</h2>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {trivia.description}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TriviaDetail;
