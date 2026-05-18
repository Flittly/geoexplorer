import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { questionsAPI, levelsAPI, Question, Level } from '../api';
import { useCurrentUser } from '../hooks';

type QuizState = 'loading' | 'quiz' | 'result' | 'error';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { levelId } = useParams<{ levelId: string }>();
  const { user } = useCurrentUser();

  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [level, setLevel] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [score, setScore] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!levelId) return;

    const fetchData = async () => {
      setQuizState('loading');
      try {
        const [levelData, questionsData] = await Promise.all([
          levelsAPI.getLevel(levelId),
          questionsAPI.getQuestionsByLevel(levelId),
        ]);

        if (!questionsData || questionsData.length === 0) {
          setQuizState('error');
          return;
        }

        const sorted = [...questionsData].sort((a, b) => a.order_index - b.order_index);
        setLevel(levelData);
        setQuestions(sorted);
        setAnswers(new Array(sorted.length).fill(null));
        setSubmitted(new Array(sorted.length).fill(false));
        setQuizState('quiz');
      } catch {
        setQuizState('error');
      }
    };

    fetchData();
  }, [levelId]);

  useEffect(() => {
    if (quizState !== 'quiz' || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, quizState]);

  useEffect(() => {
    if (timeLeft === 0 && quizState === 'quiz') {
      handleFinish();
    }
  }, [timeLeft, quizState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const submitCurrentAnswer = useCallback(async () => {
    if (selectedAnswer === null || !questions[currentQuestion] || !user) return;
    if (submitted[currentQuestion]) return;

    const question = questions[currentQuestion];
    try {
      await questionsAPI.submitAnswer({
        question_id: question.id,
        user_id: user.id,
        selected_answer: selectedAnswer,
        is_correct: selectedAnswer === question.correct_answer,
      });
    } catch {
      // Don't block user if submit fails
    }

    const newSubmitted = [...submitted];
    newSubmitted[currentQuestion] = true;
    setSubmitted(newSubmitted);
  }, [selectedAnswer, currentQuestion, questions, user, submitted]);

  const handleNext = async () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    await submitCurrentAnswer();

    if (currentQuestion < questions.length - 1) {
      const nextIdx = currentQuestion + 1;
      setCurrentQuestion(nextIdx);
      setSelectedAnswer(answers[nextIdx]);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      const prevIdx = currentQuestion - 1;
      setCurrentQuestion(prevIdx);
      setSelectedAnswer(answers[prevIdx]);
    }
  };

  const handleFinish = useCallback(async () => {
    const finalAnswers = [...answers];
    if (selectedAnswer !== null && finalAnswers[currentQuestion] === null) {
      finalAnswers[currentQuestion] = selectedAnswer;
      setAnswers(finalAnswers);
    }

    if (selectedAnswer !== null && !submitted[currentQuestion] && user && questions[currentQuestion]) {
      const question = questions[currentQuestion];
      try {
        await questionsAPI.submitAnswer({
          question_id: question.id,
          user_id: user.id,
          selected_answer: selectedAnswer,
          is_correct: selectedAnswer === question.correct_answer,
        });
      } catch {
        // Don't block
      }
    }

    const correctCount = questions.filter(
      (q, i) => finalAnswers[i] === q.correct_answer
    ).length;
    const accuracy = correctCount / questions.length;
    const stars = accuracy >= 0.8 ? 3 : accuracy >= 0.6 ? 2 : accuracy >= 0.4 ? 1 : 0;
    const finalScore = Math.round(accuracy * 1000);

    setScore(finalScore);
    setSaveError(null);

    if (user && levelId) {
      try {
        await levelsAPI.updateLevelProgress(user.id, levelId, {
          status: 'completed',
          score: finalScore,
          stars,
          completion_percentage: Math.round(accuracy * 100),
        });
      } catch {
        setSaveError('进度保存失败，但你的答题结果已记录');
      }
    }

    setQuizState('result');
  }, [answers, selectedAnswer, currentQuestion, questions, user, levelId, submitted]);

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(new Array(questions.length).fill(false));
    setTimeLeft(300);
    setScore(0);
    setSaveError(null);
    setQuizState('quiz');
  };

  if (quizState === 'loading') {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-slate-500">加载题目中...</p>
      </div>
    );
  }

  if (quizState === 'error') {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6">
        <span className="material-symbols-outlined text-5xl text-red-400 mb-4">error</span>
        <h2 className="text-xl font-bold mb-2">加载失败</h2>
        <p className="text-slate-500 mb-6">无法加载题目，请检查网络后重试</p>
        <div className="space-y-3 w-full max-w-sm">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
          >
            重新加载
          </button>
          <button
            onClick={() => navigate('/levels')}
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            返回关卡列表
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'result') {
    const correctCount = questions.filter(
      (q, i) => answers[i] === q.correct_answer
    ).length;
    const accuracy = correctCount / questions.length;
    const stars = accuracy >= 0.8 ? 3 : accuracy >= 0.6 ? 2 : accuracy >= 0.4 ? 1 : 0;

    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <div className="size-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-5xl">
              {accuracy >= 0.6 ? 'emoji_events' : 'school'}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {accuracy >= 0.8 ? '太棒了！' : accuracy >= 0.6 ? '做得不错！' : '继续努力！'}
          </h1>
          <p className="text-slate-500">你已完成本轮答题</p>
        </div>

        <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg mb-6">
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-primary mb-2">{correctCount}/{questions.length}</p>
            <p className="text-slate-500">答对题数</p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`material-symbols-outlined text-4xl ${
                  i < stars ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-600'
                }`}
              >
                star
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-xl font-bold">{Math.round(accuracy * 100)}%</p>
              <p className="text-xs text-slate-500">正确率</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-xl font-bold">{formatTime(300 - timeLeft)}</p>
              <p className="text-xs text-slate-500">用时</p>
            </div>
          </div>
        </div>

        {saveError && (
          <div className="w-full max-w-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            {saveError}
          </div>
        )}

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={handleRetry}
            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
          >
            再试一次
          </button>
          <button
            onClick={() => navigate('/levels')}
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            返回关卡列表
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

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
              <span className="font-medium">
                {level?.name} · 第 {currentQuestion + 1}/{questions.length} 题
              </span>
              <span
                className={`font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}
              >
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
            <span className="text-sm text-slate-500">{currentQuestion + 1}/{questions.length}</span>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 p-4 flex flex-col">
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg mb-6 flex-1">
          <h2 className="text-xl font-bold mb-6 leading-relaxed">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;

              let buttonClass = 'w-full p-4 rounded-xl border-2 text-left transition-all ';
              if (isSelected) {
                buttonClass += 'border-primary bg-primary/10 text-primary';
              } else {
                buttonClass +=
                  'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Action */}
      <div className="p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className={`py-4 px-6 font-bold rounded-xl transition-all flex items-center gap-2 ${
              currentQuestion === 0
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            上一题
          </button>
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`flex-1 py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              selectedAnswer === null
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98]'
            }`}
          >
            {isLastQuestion ? (
              <>
                查看结果
                <span className="material-symbols-outlined">assessment</span>
              </>
            ) : (
              <>
                下一题
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
