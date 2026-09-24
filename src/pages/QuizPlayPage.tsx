import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronRight,
  BookOpen,
  Share2,
  Check,
  Bookmark,
  BookmarkCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuizQuestion } from '../types';

export const QuizPlayPage: React.FC = () => {
  const {
    getQuizById,
    quizzes,
    classes,
    subjects,
    pageParams,
    navigate,
    submitQuizResult,
    recordWrongQuestion,
    toggleBookmarkQuestion,
    isQuestionBookmarked,
    startCustomQuiz,
  } = useApp();

  const quizId = pageParams.quizId || (quizzes[0] ? quizzes[0].id : '');
  const quiz = getQuizById(quizId) || quizzes.find((q) => q.id === quizId) || quizzes[0];

  const classObj = classes.find((c) => c.id === quiz?.classId);
  const subjectObj = subjects.find(
    (s) => s.id === quiz?.subjectId && s.classId === quiz?.classId
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    return (quiz?.timeLimitMinutes || 15) * 60;
  });

  // Track results
  const [userAnswers, setUserAnswers] = useState<
    {
      question: QuizQuestion;
      selectedIndex: number;
      isCorrect: boolean;
    }[]
  >([]);

  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isQuizFinished || !quiz) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isQuizFinished, quiz]);

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-slate-500">কুইজটি খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={() => navigate('quiz')}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
        >
          কুইজ তালিকায় ফিরুন
        </button>
      </div>
    );
  }

  const currentQ: QuizQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted) return; // cannot change after submission
    setSelectedOptionIndex(index);
  };

  const handleAnswerSubmit = () => {
    if (selectedOptionIndex === null) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOptionIndex === currentQ.correctAnswerIndex;
    if (!isCorrect) {
      recordWrongQuestion(currentQ);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        question: currentQ,
        selectedIndex: selectedOptionIndex,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished Quiz
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizFinished(true);

    // Calculate final results
    const correctCount = userAnswers.filter((a) => a.isCorrect).length;
    const finalScore = correctCount;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    submitQuizResult(
      quiz.id,
      quiz.title,
      quiz.classId,
      quiz.subjectId,
      totalQuestions,
      correctCount,
      totalQuestions - correctCount,
      finalScore,
      percentage
    );
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setIsQuizFinished(false);
  };

  const handleShareResult = () => {
    navigator.clipboard?.writeText(
      `আমি বাংলা শিক্ষাগরে "${quiz.title}" কুইজে ${Math.round(
        (userAnswers.filter((a) => a.isCorrect).length / totalQuestions) * 100
      )}% স্কোর পেয়েছি! তুমিও পরীক্ষা দাও: ${window.location.href}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Option letters in Bengali
  const optionLetters = ['ক', 'খ', 'গ', 'ঘ'];

  // End screen calculation
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const wrongCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  let badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
  let badgeText = 'অসাধারণ পারফরম্যান্স! 🌟';
  if (percentage < 50) {
    badgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
    badgeText = 'আরও একটু বেশি অনুশীলন প্রয়োজন! 💡';
  } else if (percentage < 80) {
    badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
    badgeText = 'খুব ভালো হয়েছে! আরও উন্নতি সম্ভব। 👍';
  }

  // Quiz Finished Result Screen
  if (isQuizFinished) {
    return (
      <div id="quiz-result-screen" className="max-w-2xl mx-auto space-y-8 pb-16">
        {/* Header summary card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${badgeColor} mb-2`}>
              {badgeText}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              কুইজ ফলাফল
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {quiz.title} • {classObj?.name}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 block">মোট প্রশ্ন</span>
              <span className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1 block">
                {totalQuestions}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block">সঠিক উত্তর</span>
              <span className="text-xl font-black text-emerald-600 mt-1 block">
                {correctCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <span className="text-[11px] text-rose-700 dark:text-rose-300 block">ভুল উত্তর</span>
              <span className="text-xl font-black text-rose-600 mt-1 block">
                {wrongCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
              <span className="text-[11px] text-purple-700 dark:text-purple-300 block">প্রাপ্ত নম্বর</span>
              <span className="text-xl font-black text-purple-600 mt-1 block">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetryQuiz}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz (পুনরায় দিন)</span>
            </button>

            {wrongCount > 0 && (
              <button
                onClick={() => navigate('wrong_questions')}
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>ভুল প্রশ্নগুলো পুনরায় অনুশীলন করুন ({wrongCount}টি)</span>
              </button>
            )}

            <button
              onClick={handleShareResult}
              className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'কপি হয়েছে!' : 'ফলাফল শেয়ার করুন'}</span>
            </button>

            <button
              onClick={() => navigate('quiz')}
              className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition"
            >
              অন্যান্য কুইজ
            </button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>প্রশ্নের বিস্তারিত পর্যালোচনা ও সঠিক উত্তর</span>
          </h3>

          <div className="space-y-4">
            {userAnswers.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {item.question.question}
                    </h4>
                  </div>
                  {item.isCorrect ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      সঠিক
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1 shrink-0">
                      <XCircle className="w-3.5 h-3.5" />
                      ভুল
                    </span>
                  )}
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.question.options.map((opt, optIdx) => {
                    const isSelected = item.selectedIndex === optIdx;
                    const isCorrectAnswer = optIdx === item.question.correctAnswerIndex;

                    let optClass = 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                    if (isCorrectAnswer) {
                      optClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold';
                    } else if (isSelected && !item.isCorrect) {
                      optClass = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 ${optClass}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center font-bold text-[11px]">
                          {optionLetters[optIdx]}
                        </span>
                        <span>{opt}</span>
                        {isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto shrink-0" />}
                        {isSelected && !item.isCorrect && <XCircle className="w-4 h-4 text-rose-600 ml-auto shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/60 text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
                  <span className="font-bold block text-purple-700 dark:text-purple-300 mb-0.5">
                    💡 সহজ ব্যাখ্যা:
                  </span>
                  {item.question.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Active Question Play Screen
  return (
    <div id="quiz-play-screen" className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Top Header with Progress and Timer */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('quiz')}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
        >
          ← কুইজ তালিকায় ফিরুন
        </button>

        <div className="flex items-center gap-3">
          {/* Timer Display */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {Math.floor(secondsRemaining / 60)}:
              {secondsRemaining % 60 < 10 ? `0${secondsRemaining % 60}` : secondsRemaining % 60}
            </span>
          </div>

          <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
            প্রশ্ন {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Category & Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
              {classObj?.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {subjectObj?.name}
            </span>
            {currentQ.difficulty && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {currentQ.difficulty === 'easy'
                  ? 'সহজ'
                  : currentQ.difficulty === 'medium'
                  ? 'মাঝারি'
                  : currentQ.difficulty === 'hard'
                  ? 'কঠিন'
                  : 'চ্যালেঞ্জ'}
              </span>
            )}
          </div>

          {/* Bookmark Question Button */}
          <button
            onClick={() => toggleBookmarkQuestion(currentQ)}
            className={`p-2 rounded-xl transition flex items-center gap-1 text-xs font-semibold ${
              isQuestionBookmarked(currentQ.id)
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="প্রশ্ন বুকমার্ক করুন"
          >
            {isQuestionBookmarked(currentQ.id) ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">বুকমার্কড</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">সেভ</span>
              </>
            )}
          </button>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {currentQ.question}
        </h2>

        {/* 4 Options */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isCorrect = idx === currentQ.correctAnswerIndex;

            let optionClass =
              'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

            if (isAnswerSubmitted) {
              if (isCorrect) {
                optionClass =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-bold';
              } else if (isSelected && !isCorrect) {
                optionClass =
                  'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200';
              }
            } else if (isSelected) {
              optionClass =
                'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-semibold ring-2 ring-purple-500/30';
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full p-4 rounded-2xl border text-left text-sm transition flex items-center justify-between ${optionClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-white dark:bg-slate-700 shadow-xs flex items-center justify-center font-bold text-xs shrink-0">
                    {optionLetters[idx]}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswerSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Explanation Banner (shown after submission) */}
        {isAnswerSubmitted && (
          <div
            className={`p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-2 animate-in fade-in zoom-in-95 duration-200 ${
              selectedOptionIndex === currentQ.correctAnswerIndex
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {selectedOptionIndex === currentQ.correctAnswerIndex ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>সঠিক উত্তর হয়েছে! 🎉 চমৎকার!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>
                    ভুল উত্তর! সঠিক উত্তর: {optionLetters[currentQ.correctAnswerIndex]}.{' '}
                    {currentQ.options[currentQ.correctAnswerIndex]}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 pt-1">
              <span className="font-semibold text-purple-700 dark:text-purple-300 block mb-0.5">
                সহজ ব্যাখ্যা:
              </span>
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {!isAnswerSubmitted ? (
            <button
              id="quiz-submit-answer-btn"
              disabled={selectedOptionIndex === null}
              onClick={handleAnswerSubmit}
              className={`w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold transition shadow-sm ${
                selectedOptionIndex !== null
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              উত্তর জমা দিন (Submit)
            </button>
          ) : (
            <button
              id="quiz-next-question-btn"
              onClick={handleNextQuestion}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{currentQuestionIndex + 1 < totalQuestions ? 'পরবর্তী প্রশ্ন' : 'ফলাফল দেখুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
