import React from 'react';
import { useNavigate } from 'react-router-dom';

const Levels: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased selection:bg-primary-green selection:text-background-dark">
      <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c4d2e] via-background-dark to-transparent opacity-60 pointer-events-none z-0"></div>
      
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center p-4 justify-between">
          <button 
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-primary-green transition-colors flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
          </button>
          <h1 className="text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">地理闯关</h1>
          <button className="flex size-10 items-center justify-center rounded-full text-white/80 hover:text-primary-green hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>settings</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col px-4 pb-24">
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-2xl border border-[#326744] bg-surface-green-dark p-4 items-center text-center shadow-lg">
            <div className="bg-[#326744]/30 p-2 rounded-full mb-1">
              <span className="material-symbols-outlined text-primary-green" style={{ fontSize: '24px' }}>hiking</span>
            </div>
            <p className="text-white tracking-tight text-xl font-bold leading-tight">初学者</p>
            <p className="text-[#92c9a4] text-xs uppercase tracking-wider font-medium">当前等级</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl border border-[#326744] bg-surface-green-dark p-4 items-center text-center shadow-lg">
            <div className="bg-[#326744]/30 p-2 rounded-full mb-1">
              <span className="material-symbols-outlined text-yellow-400" style={{ fontSize: '24px' }}>star</span>
            </div>
            <p className="text-white tracking-tight text-xl font-bold leading-tight">45</p>
            <p className="text-[#92c9a4] text-xs uppercase tracking-wider font-medium">总星数</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <div className="flex justify-between items-end px-1">
            <p className="text-white text-sm font-medium">距离下一等级</p>
            <p className="text-primary-green text-sm font-bold">45/100</p>
          </div>
          <div className="h-3 w-full rounded-full bg-[#326744]/30 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary-green/60 to-primary-green" style={{ width: '45%' }}></div>
          </div>
          <p className="text-[#92c9a4] text-xs text-right mt-1">还差 55 星升级！</p>
        </div>

        <div className="mt-8 flex flex-col relative">
          <div className="absolute left-[27px] top-4 bottom-10 w-0.5 bg-[#326744]/30 z-0"></div> 
          
          {/* Level 5 - Locked */}
          <div className="relative grid grid-cols-[56px_1fr] gap-x-4 mb-2 opacity-60">
            <div className="flex flex-col items-center h-full">
              <div className="w-0.5 bg-transparent h-4 shrink-0"></div>
              <div className="z-10 flex items-center justify-center size-14 rounded-full border-2 border-[#326744] bg-background-dark text-slate-500 shadow-sm">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div className="w-0.5 bg-[#326744]/50 h-full grow min-h-[40px]"></div>
            </div>
            <div className="pt-3 pb-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-slate-400 text-lg font-bold">气候系统</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-500 border border-slate-700">第 5 关</span>
                  <span className="text-slate-600 text-sm">未解锁</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level 4 - Locked */}
          <div className="relative grid grid-cols-[56px_1fr] gap-x-4 mb-2 opacity-80">
            <div className="flex flex-col items-center h-full">
              <div className="w-0.5 bg-[#326744]/50 h-4 shrink-0"></div>
              <div className="z-10 flex items-center justify-center size-14 rounded-full border-2 border-[#326744] bg-background-dark text-slate-400 shadow-sm">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div className="w-0.5 bg-[#326744] h-full grow min-h-[40px]"></div>
            </div>
            <div className="pt-3 pb-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-slate-300 text-lg font-bold">全球贸易网络</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-500 border border-slate-700">第 4 关</span>
                  <span className="text-slate-500 text-sm">需解锁第 3 关</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level 3 - Active */}
          <div className="relative grid grid-cols-[56px_1fr] gap-x-4 mb-2">
            <div className="flex flex-col items-center h-full">
              <div className="w-0.5 bg-[#326744] h-4 shrink-0"></div>
              <div className="relative z-10">
                <div className="absolute inset-0 rounded-full bg-primary-green blur-md opacity-40 animate-pulse"></div>
                <button className="relative flex items-center justify-center size-14 rounded-full border-4 border-primary-green bg-background-dark text-primary-green hover:scale-105 transition-transform shadow-[0_0_20px_rgba(19,236,91,0.3)]">
                  <span className="material-symbols-outlined filled" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </button>
              </div>
              <div className="w-1 bg-gradient-to-b from-primary-green to-primary-green/80 h-full grow min-h-[50px]"></div>
            </div>
            <div className="pt-2 pb-10">
              <div className="p-4 rounded-xl bg-surface-green-dark border border-primary-green/30 shadow-lg shadow-primary-green/5 flex flex-col gap-3">
                <div>
                  <h3 className="text-white text-xl font-bold">岩石圈循环</h3>
                  <p className="text-[#92c9a4] text-sm mt-1">岩浆岩、沉积岩和变质岩的转化过程。</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-primary-green/20 text-primary-green border border-primary-green/20">当前关卡</span>
                  <div className="flex -space-x-1">
                    <div className="size-6 rounded-full bg-slate-700 border border-surface-green-dark"></div>
                    <div className="size-6 rounded-full bg-slate-700 border border-surface-green-dark"></div>
                    <div className="size-6 rounded-full bg-slate-700 border border-surface-green-dark flex items-center justify-center text-[8px] text-white">+12</div>
                  </div>
                  <span className="text-xs text-slate-400">正在探索</span>
                </div>
                <button className="w-full mt-1 bg-primary-green text-background-dark font-bold py-2 rounded-lg hover:bg-white transition-colors">
                  开始测评
                </button>
              </div>
            </div>
          </div>

          {/* Level 2 - Completed */}
          <div className="relative grid grid-cols-[56px_1fr] gap-x-4 mb-2">
            <div className="flex flex-col items-center h-full">
              <div className="w-1 bg-primary-green h-4 shrink-0"></div>
              <div className="z-10 flex flex-col items-center justify-center size-14 rounded-full border-2 border-primary-green bg-surface-green-dark text-primary-green shadow-[0_0_10px_rgba(19,236,91,0.2)]">
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>check</span>
              </div>
              <div className="w-1 bg-primary-green h-full grow min-h-[40px]"></div>
            </div>
            <div className="pt-3 pb-8">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center pr-2">
                  <h3 className="text-white text-lg font-bold">板块构造</h3>
                  <span className="text-primary-green font-bold text-sm">100%</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px' }}>star</span>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px' }}>star</span>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px' }}>star</span>
                  <span className="text-xs text-slate-400 ml-2 font-normal">得分: 450</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level 1 - Completed */}
          <div className="relative grid grid-cols-[56px_1fr] gap-x-4">
            <div className="flex flex-col items-center h-full">
              <div className="w-1 bg-primary-green h-4 shrink-0"></div>
              <div className="z-10 flex flex-col items-center justify-center size-14 rounded-full border-2 border-primary-green bg-surface-green-dark text-primary-green shadow-[0_0_10px_rgba(19,236,91,0.2)]">
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>check</span>
              </div>
              <div className="w-1 bg-gradient-to-b from-primary-green to-transparent h-full grow min-h-[20px]"></div>
            </div>
            <div className="pt-3 pb-6">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center pr-2">
                  <h3 className="text-white text-lg font-bold">太阳系</h3>
                  <span className="text-primary-green font-bold text-sm">92%</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px' }}>star</span>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px' }}>star</span>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '16px' }}>star_half</span>
                  <span className="text-xs text-slate-400 ml-2 font-normal">得分: 380</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <button className="group flex items-center justify-center rounded-2xl h-14 bg-primary-green text-background-dark shadow-[0_4px_20px_rgba(19,236,91,0.4)] hover:shadow-[0_6px_25px_rgba(19,236,91,0.6)] hover:-translate-y-1 transition-all pl-4 pr-5 gap-2 overflow-hidden">
          <div className="bg-black/10 rounded-full p-1 group-hover:bg-black/20 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>bolt</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80 leading-none mb-0.5">快速</span>
            <span className="text-sm font-bold leading-none">每日挑战</span>
          </div>
        </button>
      </div>
      
      {/* Bottom Nav for Levels Page (Specific Style) */}
      <nav className="fixed bottom-0 w-full bg-[#102216]/95 backdrop-blur border-t border-white/5 pb-4 pt-2 px-6 flex justify-between items-center z-40">
        <button 
          onClick={() => navigate('/levels')}
          className="flex flex-col items-center gap-1 p-2 text-primary-green"
        >
          <span className="material-symbols-outlined icon-filled">map</span>
          <span className="text-[10px] font-medium">路径</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="text-[10px] font-medium">排行</span>
        </button>
        <div className="w-12"></div> 
        <button 
          onClick={() => navigate('/')}
          className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">book_2</span>
          <span className="text-[10px] font-medium">学习</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default Levels;