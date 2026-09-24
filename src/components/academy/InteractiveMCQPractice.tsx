import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Check,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { QuizQuestion } from '../../types';

interface InteractiveMCQPracticeProps {
  questions: QuizQuestion[];
  subjectTitle?: string;
  chapterTitle?: string;
  classNameLevel?: 'SSC' | 'HSC';
}

const BENGALI_OPTION_PREFIX = ['ক', 'খ', 'গ', 'ঘ'];
const toBengaliDigits = (num: number): string => {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bn[parseInt(d, 10)]);
};

export const InteractiveMCQPractice: React.FC<InteractiveMCQPracticeProps> = ({
  questions,
  subjectTitle,
  chapterTitle,
  classNameLevel = 'SSC',
}) => {
  // State: selected option index per question ID
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  // State: submitted questions
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  // Filter state
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');

  const handleSelect = (questionId: string, optionIndex: number) => {
    // If already submitted, allow changing if not locked, or keep locked
    if (submittedAnswers[questionId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = (questionId: string) => {
    if (selectedAnswers[questionId] === undefined) return;
    setSubmittedAnswers((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmittedAnswers({});
  };

  // Stats
  const totalQuestions = questions.length;
  const totalAnswered = Object.keys(submittedAnswers).length;

  const { correctCount, incorrectCount } = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    questions.forEach((q) => {
      if (submittedAnswers[q.id]) {
        const userChoice = selectedAnswers[q.id];
        if (userChoice === q.correctAnswerIndex) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });
    return { correctCount: correct, incorrectCount: incorrect };
  }, [questions, submittedAnswers, selectedAnswers]);

  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  // Filter questions
  const displayedQuestions = useMemo(() => {
    if (filterMode === 'all') return questions;
    return questions.filter((q) => {
      const isSubmitted = submittedAnswers[q.id];
      if (!isSubmitted) return false;
      const isCorrect = selectedAnswers[q.id] === q.correctAnswerIndex;
      return filterMode === 'correct' ? isCorrect : !isCorrect;
    });
  }, [questions, filterMode, submittedAnswers, selectedAnswers]);

  if (questions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
          এই অধ্যায়ের জন্য কোনো MCQ পাওয়া যায়নি
        </h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          উপরে অন্য অধ্যায় বা বিষয় নির্বাচন করুন অথবা সম্পূর্ণ বিষয়ের সকল অধ্যায়ের MCQ অনুশীলন করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Live Score Tracker Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                {classNameLevel} রিয়েল MCQ অনুশীলন
              </span>
              {subjectTitle && (
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {subjectTitle}
                </span>
              )}
            </div>
            {chapterTitle && (
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
                {chapterTitle}
              </h3>
            )}
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>রিসেট / পুনরায় চেষ্টা</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-2 pt-3 text-center">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {toBengaliDigits(totalQuestions)}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">মোট প্রশ্ন</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/40 p-2 rounded-xl border border-blue-100 dark:border-blue-900/40">
            <div className="text-base sm:text-lg font-bold text-blue-700 dark:text-blue-300">
              {toBengaliDigits(totalAnswered)}
            </div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400">উত্তর সম্পন্ন</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
            <div className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-300">
              {toBengaliDigits(correctCount)}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">সঠিক</div>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/40 p-2 rounded-xl border border-rose-100 dark:border-rose-900/40">
            <div className="text-base sm:text-lg font-bold text-rose-700 dark:text-rose-300">
              {toBengaliDigits(incorrectCount)}
            </div>
            <div className="text-[10px] text-rose-600 dark:text-rose-400">ভুল</div>
          </div>
        </div>

        {/* Progress bar */}
        {totalAnswered > 0 && (
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              <span>অগ্রগতি: {toBengaliDigits(totalAnswered)}/{toBengaliDigits(totalQuestions)} সম্পন্ন</span>
              <span>নির্ভুলতা: {toBengaliDigits(accuracy)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(correctCount / totalQuestions) * 100}%` }}
                className="h-full bg-emerald-500 transition-all duration-300"
              />
              <div
                style={{ width: `${(incorrectCount / totalQuestions) * 100}%` }}
                className="h-full bg-rose-500 transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 pt-3 overflow-x-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition ${
              filterMode === 'all'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            সকল প্রশ্ন ({toBengaliDigits(questions.length)})
          </button>
          <button
            onClick={() => setFilterMode('correct')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition ${
              filterMode === 'correct'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
            }`}
          >
            সঠিক উত্তরসমূহ ({toBengaliDigits(correctCount)})
          </button>
          <button
            onClick={() => setFilterMode('incorrect')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition ${
              filterMode === 'incorrect'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
            }`}
          >
            ভুল উত্তরগুলো ({toBengaliDigits(incorrectCount)})
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3.5">
        {displayedQuestions.map((q, qIndex) => {
          const isSelected = selectedAnswers[q.id] !== undefined;
          const userChoice = selectedAnswers[q.id];
          const isSubmitted = submittedAnswers[q.id];
          const isCorrect = isSubmitted && userChoice === q.correctAnswerIndex;

          return (
            <div
              key={q.id}
              id={`mcq-item-${q.id}`}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/60 shadow-xs dark:border-emerald-500/40'
                    : 'border-rose-500/60 shadow-xs dark:border-rose-500/40'
                  : isSelected
                  ? 'border-emerald-400 dark:border-emerald-600'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Question Header & Meta */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/40">
                    {toBengaliDigits(qIndex + 1)}
                  </span>
                  {q.topic && (
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      টপিক: {q.topic}
                    </span>
                  )}
                  {q.source && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200/40">
                      {q.source}
                    </span>
                  )}
                </div>

                {isSubmitted && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>সঠিক</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>ভুল</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 leading-relaxed">
                {q.question}
              </h4>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {q.options.map((optText, optIndex) => {
                  const isUserPick = userChoice === optIndex;
                  const isCorrectOption = optIndex === q.correctAnswerIndex;

                  let optionStyle =
                    'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:border-emerald-300 dark:hover:border-emerald-700';

                  if (isSubmitted) {
                    if (isCorrectOption) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isUserPick && !isCorrect) {
                      optionStyle =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through';
                    } else {
                      optionStyle =
                        'border-slate-200 dark:border-slate-800 opacity-60 text-slate-500';
                    }
                  } else if (isUserPick) {
                    optionStyle =
                      'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500';
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, optIndex)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all text-xs select-none touch-manipulation ${optionStyle}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md font-bold flex items-center justify-center shrink-0 text-[11px] ${
                          isSubmitted && isCorrectOption
                            ? 'bg-emerald-600 text-white'
                            : isSubmitted && isUserPick && !isCorrect
                            ? 'bg-rose-600 text-white'
                            : isUserPick
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {isSubmitted && isCorrectOption ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : isSubmitted && isUserPick && !isCorrect ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          BENGALI_OPTION_PREFIX[optIndex]
                        )}
                      </span>
                      <span className="flex-1 leading-snug">{optText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Submit / Action Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                {!isSubmitted ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={userChoice === undefined}
                      onClick={() => handleSubmit(q.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                        userChoice !== undefined
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>উত্তর সাবমিট করুন</span>
                    </button>
                    {userChoice === undefined && (
                      <span className="text-[11px] text-slate-400">
                        যেকোনো একটি অপশন নির্বাচন করুন
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-full space-y-2">
                    {/* Explanation Card */}
                    <div
                      className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1 ${
                        isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                          : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>
                          সঠিক উত্তর: ({BENGALI_OPTION_PREFIX[q.correctAnswerIndex]}){' '}
                          {q.options[q.correctAnswerIndex]}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-normal">
                        <strong className="font-semibold text-slate-800 dark:text-slate-200">
                          ব্যাখ্যা:{' '}
                        </strong>
                        {q.explanation || 'বোর্ড পাঠ্যবই অনুযায়ী এই উত্তরটি প্রমিত ও সঠিক।'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
