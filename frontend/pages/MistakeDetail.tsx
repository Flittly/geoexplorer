import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface MistakeQuestion {
  id: string;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
  options: string[];
  correctIndex: number;
  yourIndex: number;
}

const MistakeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { mistakeId } = useParams<{ mistakeId: string }>();
  const [showExplanation, setShowExplanation] = useState(true);

  // Mock mistake data
  const mistakeData = {
    id: mistakeId || '1',
    title: '大气环流',
    category: '自然地理',
    masteryLevel: 'low',
    addedDate: '10月24日',
    questionCount: 3,
    correctRate: 0,
  };

  const questions: MistakeQuestion[] = [
    {
      id: '1',
      question: '北半球的气旋中心气压特征是什么？',
      yourAnswer: '高压中心',
      correctAnswer: '低压中心',
      explanation: '气旋是指在同一高度上中心气压低于四周的水平空气涡旋。在北半球，气旋内的空气作逆时针方向旋转（从上往下看），气流从四周向中心辐合。',
      options: ['高压中心', '低压中心', '气压相等', '无法确定'],
      correctIndex: 1,
      yourIndex: 0,
    },
  ];

  const question = questions[0];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between">
          <button 
            onClick={() => navigate('/mistakes')}
            className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">错题详情</h1>
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">bookmark</span>
          </button>
        </div>
      </header>

      <main className="p-4 pb-32">
        {/* Info Card */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              mistakeData.masteryLevel === 'low' 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : mistakeData.masteryLevel === 'medium'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
            }`}>
              掌握度: {mistakeData.masteryLevel === 'low' ? '低' : mistakeData.masteryLevel === 'medium' ? '中' : '关键'}
            </span>
            <span className="text-sm text-slate-500">{mistakeData.category}</span>
          </div>
          <h2 className="text-xl font-bold mb-2">{mistakeData.title}</h2>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              {mistakeData.addedDate}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">quiz</span>
              {mistakeData.questionCount} 题
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">percent</span>
              正确率 {mistakeData.correctRate}%
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">第 1 题</span>
            <span className="text-xs text-slate-500">共 {mistakeData.questionCount} 题</span>
          </div>
          
          <h3 className="text-lg font-bold mb-6 leading-relaxed">{question.question}</h3>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              let buttonClass = "w-full p-4 rounded-xl border-2 text-left ";
              
              if (index === question.correctIndex) {
                buttonClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
              } else if (index === question.yourIndex) {
                buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20";
              } else {
                buttonClass += "border-slate-200 dark:border-slate-700 opacity-50";
              }

              return (
                <div key={index} className={buttonClass}>
                  <div className="flex items-center gap-3">
                    <span className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === question.correctIndex 
                        ? 'bg-emerald-500 text-white' 
                        : index === question.yourIndex
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {index === question.correctIndex && (
                      <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    )}
                    {index === question.yourIndex && index !== question.correctIndex && (
                      <span className="material-symbols-outlined text-red-500">cancel</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Answer Comparison */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700 mb-6">
          <h3 className="text-lg font-bold mb-4">答案对比</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">你的答案</p>
              <p className="font-bold text-red-700 dark:text-red-300">{question.yourAnswer}</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">正确答案</p>
              <p className="font-bold text-emerald-700 dark:text-emerald-300">{question.correctAnswer}</p>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              解析
            </h3>
            <span className="material-symbols-outlined text-slate-400">
              {showExplanation ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          
          {showExplanation && (
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Related Knowledge */}
        <div className="mt-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-5 border border-primary/20">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">school</span>
            相关知识点
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">arrow_right</span>
              <span>气旋与反气旋的区别</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">arrow_right</span>
              <span>地转偏向力对风向的影响</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">arrow_right</span>
              <span>高低气压系统的天气特征</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/quiz/retry')}
            className="flex-1 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">refresh</span>
            重新练习
          </button>
          <button 
            onClick={() => navigate('/mistakes')}
            className="py-4 px-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MistakeDetail;
