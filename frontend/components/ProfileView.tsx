import React, { useEffect } from 'react';

interface ProfileViewProps {
  isOpen: boolean;
  onClose: () => void;
  landform: {
    name: string;
    description: string;
    knowledgeContent: string;
    type: string;
    elevation: number | null;
    imageUrl: string | null;
  } | null;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ isOpen, onClose, landform }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl rounded-t-3xl shadow-xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '85vh' }}
        role="dialog"
        aria-modal="true"
        aria-label={landform?.name ?? '\u5730\u8C8C\u4FE1\u606F'}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>
        <div className="absolute top-3 right-4">
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            aria-label="\u5173\u95ED"
          >
            <span className="material-symbols-outlined text-lg text-slate-500 dark:text-slate-300">close</span>
          </button>
        </div>
        {landform && (
          <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: 'calc(85vh - 48px)' }}>
            {landform.imageUrl && (
              <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                <img src={landform.imageUrl} alt={landform.name} className="w-full h-full object-cover" />
              </div>
            )}
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {landform.name}
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                {landform.type}
              </span>
              {landform.elevation !== null && (
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">terrain</span>
                  {'\u6D77\u62D4'}: {landform.elevation}m
                </span>
              )}
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-700 mb-4" />
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              {landform.knowledgeContent.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileView;
