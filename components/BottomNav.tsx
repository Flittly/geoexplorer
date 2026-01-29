import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex items-center justify-between max-w-md mx-auto h-14">
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center gap-1 w-16 transition-colors ${isActive('/') ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
        >
          <span className={`material-symbols-outlined text-[26px] ${isActive('/') ? 'icon-filled' : ''}`}>home</span>
          <span className={`text-[10px] ${isActive('/') ? 'font-bold' : 'font-medium'}`}>首页</span>
        </button>
        
        <button 
          onClick={() => navigate('/levels')}
          className={`flex flex-col items-center justify-center gap-1 w-16 transition-colors ${isActive('/levels') ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
        >
          <span className={`material-symbols-outlined text-[26px] ${isActive('/levels') ? 'icon-filled' : ''}`}>school</span>
          <span className={`text-[10px] ${isActive('/levels') ? 'font-bold' : 'font-medium'}`}>课程</span>
        </button>
        
        <button className="flex flex-col items-center justify-center gap-1 w-16 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
          <span className="material-symbols-outlined text-[26px]">groups</span>
          <span className="text-[10px] font-medium">社区</span>
        </button>
        
        <button className="flex flex-col items-center justify-center gap-1 w-16 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
          <span className="material-symbols-outlined text-[26px]">person</span>
          <span className="text-[10px] font-medium">我的</span>
        </button>
      </div>
      <div className="h-4 w-full"></div>
    </nav>
  );
};

export default BottomNav;