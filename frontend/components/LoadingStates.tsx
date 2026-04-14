import React from 'react';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = '加载中...' }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400">{message}</p>
      </div>
    </div>
  );
};

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorProps> = ({ 
  message = '加载失败，请重试',
  onRetry 
}) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl text-red-500">error</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">出错了</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            重试
          </button>
        )}
      </div>
    </div>
  );
};

interface EmptyProps {
  message?: string;
  icon?: string;
}

export const EmptyState: React.FC<EmptyProps> = ({ 
  message = '暂无数据',
  icon = 'inbox'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl text-slate-400">{icon}</span>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-center">{message}</p>
    </div>
  );
};
