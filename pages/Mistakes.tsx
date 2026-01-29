import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Mistakes: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('physical');

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight text-center flex-1">错题集</h1>
        <button className="flex items-center justify-center p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>
      
      <div className="px-4 py-4 bg-background-light dark:bg-background-dark">
        <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
          <label className="flex-1 text-center cursor-pointer relative z-10">
            <input 
              checked={category === 'physical'} 
              onChange={() => setCategory('physical')}
              className="peer sr-only" 
              name="category" 
              type="radio" 
            />
            <div className="py-2 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-primary peer-checked:shadow-sm transition-all duration-200">
              自然地理
            </div>
          </label>
          <label className="flex-1 text-center cursor-pointer relative z-10">
            <input 
              checked={category === 'human'} 
              onChange={() => setCategory('human')}
              className="peer sr-only" 
              name="category" 
              type="radio" 
            />
            <div className="py-2 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-primary peer-checked:shadow-sm transition-all duration-200">
              人文地理
            </div>
          </label>
          <label className="flex-1 text-center cursor-pointer relative z-10">
            <input 
              checked={category === 'regional'} 
              onChange={() => setCategory('regional')}
              className="peer sr-only" 
              name="category" 
              type="radio" 
            />
            <div className="py-2 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-primary peer-checked:shadow-sm transition-all duration-200">
              区域地理
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-full text-sm font-medium shadow-sm shadow-primary/30 flex-shrink-0 whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
          <span>全部</span>
        </button>
        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium flex-shrink-0 whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          高频错题
        </button>
        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium flex-shrink-0 whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          近期错误
        </button>
        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium flex-shrink-0 whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          掌握度 &lt; 50%
        </button>
      </div>

      <div className="flex-1 px-4 pb-32 space-y-4 overflow-y-auto">
        {/* Card 1 */}
        <article className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden group">
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    掌握度: 低
                  </span>
                  <span className="text-xs text-slate-400 font-medium">添加于 10月24日</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">大气环流</h3>
              </div>
              <div 
                className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0 bg-cover bg-center" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVTVJSeXI0-vYmcD6YMgL161veZ4gzMMLRmjPr9JlHkMw0VjV7wS91YhKBYlJpWSDcjqvUp6yLKhcpSHZfqdLR5gfFrvGrP3vPsf6C_40_HTiWuHPoln8OjKf2dbwiCqWB7Arm8kkAtQQbKF7cc7lHeZGDP-bPHOo_Li4rvu3QevBzRq49e3ojjiml4p_kUVOioZafiDbdH59v5_AVngpgRZA23qij3f4lVlkKlGVBIECoze3SXNFlEictAZQokLuCPireadINbI8v")' }}
              ></div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-body">
              解释北半球风向偏转的主要原因及其对气旋形成的影响。
            </p>
            <div className="flex items-center gap-3 pt-2 mt-1 border-t border-slate-100 dark:border-slate-700">
              <button className="flex-1 py-2 px-4 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                重做
              </button>
              <button className="flex-1 py-2 px-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                分析
              </button>
            </div>
          </div>
        </article>

        {/* Card 2 */}
        <article className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden group">
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    掌握度: 中
                  </span>
                  <span className="text-xs text-slate-400 font-medium">添加于 10月21日</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">城市化</h3>
              </div>
              <div 
                className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0 bg-cover bg-center" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCyDmUvEiw-IEGC_hjRjeufKCoOYc8MXhu2fHPQ3a273G3tO3PbPSbX0riQ92VXv4kqgC5puUXt4MnmAYvOcTdoIxqVe7UlDO5HYvdcLdP_N5Zt_e8TaAK6xhw6zzyf-7JVzsqY1lpIsRjG_cZzdEWfoxWxB5bx96QFbkmui8lTrfIeIWaaYN_ItoFB9q5AcrsEwcnYqUtA1hSv8ZtC2qbzX3FLqXjMBIu7De9kxyvDomsLUfyDJ1zw-_YVxAaH5IEX3VvVulj7xaMy")' }}
              ></div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-body">
              北美标准城市的中心商务区（CBD）与欧洲模式有何主要区别？
            </p>
            <div className="flex items-center gap-3 pt-2 mt-1 border-t border-slate-100 dark:border-slate-700">
              <button className="flex-1 py-2 px-4 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                重做
              </button>
              <button className="flex-1 py-2 px-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                分析
              </button>
            </div>
          </div>
        </article>

        {/* Card 3 */}
        <article className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden group">
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    掌握度: 关键
                  </span>
                  <span className="text-xs text-slate-400 font-medium">添加于 昨天</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">板块构造</h3>
              </div>
              <div 
                className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0 bg-cover bg-center" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAopS9Mi0VrJ_SNrqyZ9nTJScnNtUUitAeCwa70hVcawjBxO6nXGUSD-QgdEoYr3g5T3MPIgueVHisT5HCbFiaFMdoy7jLYbLbhvCS71H6YhPv26B6aj4wwisL62if-5UPp4VQT8PMkxwYmEQ0CfM90sXdj01iRHNaehShpB2xjCNryzHTbQb0-cCjoXGAhCRjVCBWTWDNCaFgFUwrKyRoLl7V-OyNfoaqgpSeVRyEdJvDZ7irZsUma6lBRaRoFzdCiKlq_TMyLSQvb")' }}
              ></div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-body">
              识别大西洋中脊的板块边界类型，并描述相关的火山活动特征。
            </p>
            <div className="flex items-center gap-3 pt-2 mt-1 border-t border-slate-100 dark:border-slate-700">
              <button className="flex-1 py-2 px-4 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                重做
              </button>
              <button className="flex-1 py-2 px-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                分析
              </button>
            </div>
          </div>
        </article>
      </div>

      <button className="absolute bottom-6 right-6 z-30 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 transition-transform">
        <span className="material-symbols-outlined text-2xl">play_arrow</span>
      </button>
    </div>
  );
};

export default Mistakes;