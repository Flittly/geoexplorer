import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { levelId } = useParams<{ levelId: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isFinished, setIsFinished] = useState(false);

  // Mock questions
  const questions: Question[] = [
    {
      id: '1',
      question: '下列哪种岩石是由岩浆冷却凝固形成的？',
      options: ['花岗岩', '石灰�ite', '大理岩', '页岩'],
      correctAnswer: 0,
      explanation: '花岗岩是典型的岩浆岩，由岩浆在地下深处缓慢冷却凝固形成。',
    },
    {
      id: '2',
      question: '石灰岩属于哪一类岩石？',
      options: ['岩浆岩', '沉积岩', '变质岩', '火山岩'],
      correctAnswer: 1,
      explanation: '石灰�ite是由�ite酸钙沉积物经过压实和胶结作用形成的沉积岩。',
    },
    {
      id: '3',
      question: '大理岩是由哪种岩石变质形成的？',
      options: ['花岗岩', '玄武岩', '石灰岩', '砂岩'],
      correctAnswer: 2,
      explanation: '大理岩是由石灰岩在高温高压条件下变质形成的变质岩。',
    },
    {
      id: '4',
      question: '下列哪种地质作用属于内力作用？',
      options: ['风化作用', '侵蚀作用', '地壳运动', '搬运作用'],
      correctAnswer: 2,
      explanation: '地壳运动是地球内部能量引起的地质作用，属于内力作用。',
    },
    {
      id: '5',
      question: '沉积岩的典型特征是什么？',
      options: ['有气孔构造', '有层理构造', '有片理构造', '有块状构造'],
      correctAnswer: 1,
      explanation: '沉积岩具有层理构造，这是沉积物逐层堆积形成的典型特征。',
    },
  ];

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleFinish();
    }
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  const handleBackToLevels = () => {
    navigate('/levels');
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const stars = percentage >= 80 ? 3 : percentage >= 60 ? 2 : percentage >= 40 ? 1 : 0;

    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <div className="size-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-5xl">
              {percentage >= 60 ? 'emoji_events' : 'school'}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {percentage >= 80 ? '太棒了！' : percentage >= 60 ? '做得不错！' : '继续努力！'}
          </h1>
          <p className="text-slate-500">你已完成本轮答题</p>
        </div>

        <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg mb-6">
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-primary mb-2">{score}/{questions.length}</p>
            <p className="text-slate-500">答对题数</p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {[...Array(3)].map((_, i) => (
              <span 
                key={i}
                className={`material-symbols-outlined text-4xl ${i < stars ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-600'}`}
              >
                star
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-xl font-bold">{percentage}%</p>
              <p className="text-xs text-slate-500">正确率</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-xl font-bold">{formatTime(300 - timeLeft)}</p>
              <p className="text-xs text-slate-500">用时</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <button 
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer(null);
              setShowResult(false);
              setScore(0);
              setTimeLeft(300);
              setIsFinished(false);
            }}
            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
          >
            再试一次
          </button>
          <button 
            onClick={handleBackToLevels}
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            返回关卡
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between">
          <button 
            onClick={() => navigate('/levels')}
            className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          
          <div className="flex-1 mx-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">第 {currentQuestion + 1}/{questions.length} 题</span>
              <span className={`font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-yellow-500">star</span>
            <span className="font-bold">{score}</span>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 p-4 flex flex-col">
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg mb-6 flex-1">
          <h2 className="text-xl font-bold mb-6 leading-relaxed">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              let buttonClass = "w-full p-4 rounded-xl border-2 text-left transition-all ";
              
              if (showResult) {
                if (index === question.correctAnswer) {
                  buttonClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400";
                } else if (index === selectedAnswer && index !== question.correctAnswer) {
                  buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
                } else {
                  buttonClass += "border-slate-200 dark:border-slate-700 opacity-50";
                }
              } else {
                if (selectedAnswer === index) {
                  buttonClass += "border-primary bg-primary/10 text-primary";
                } else {
                  buttonClass += "border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <span className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedAnswer === index && !showResult 
                        ? 'bg-primary text-white' 
                        : showResult && index === question.correctAnswer
                        ? 'bg-emerald-500 text-white'
                        : showResult && index === selectedAnswer && index !== question.correctAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && index === question.correctAnswer && (
                      <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    )}
                    {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                      <span className="material-symbols-outlined text-red-500">cancel</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showResult && (
          <div className={`p-4 rounded-xl mb-4 ${
            selectedAnswer === question.correctAnswer 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-3">
              <span className={`material-symbols-outlined ${
                selectedAnswer === question.correctAnswer ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {selectedAnswer === question.correctAnswer ? 'check_circle' : 'cancel'}
              </span>
              <div>
                <p className={`font-bold mb-1 ${
                  selectedAnswer === question.correctAnswer 
                    ? 'text-emerald-700 dark:text-emerald-400' 
                    : 'text-red-700 dark:text-red-400'
                }`}>
                  {selectedAnswer === question.correctAnswer ? '回答正确！' : '回答错误'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Action */}
      <div className="p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        {!showResult ? (
          <button 
            onClick={handleConfirm}
            disabled={selectedAnswer === null}
            className={`w-full py-4 font-bold rounded-xl transition-all ${
              selectedAnswer === null 
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98]'
            }`}
          >
            确认答案
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                下一题
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            ) : (
              <>
                查看结果
                <span className="material-symbols-outlined">assessment</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
