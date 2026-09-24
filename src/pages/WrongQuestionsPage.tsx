import React, { useState } from 'react';
import {
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Play,
  Bookmark,
  BookmarkCheck,
  Award,
  ChevronDown,
  ChevronUp,
  Bot,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getWrongQuestionsQuiz } from '../data/questionBankEngine';

export const WrongQuestionsPage: React.FC = () => {
  const {
    wrongQuestions,
    clearAllWrongQuestions,
    startCustomQuiz,
    toggleBookmarkQuestion,
    isQuestionBookmarked,
    navigate,
  } = useApp();

  const [expandedExplanation, setExpandedExplanation] = useState<Record<string, boolean>>({});

  const toggleExp = (id: string) => {
    setExpandedExplanation((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartRetryQuiz = () => {
    if (wrongQuestions.length === 0) return;
    const retryQuiz = getWrongQuestionsQuiz(wrongQuestions);
    startCustomQuiz(retryQuiz);
  };

  const optionLetters = ['ক', 'খ', 'গ', 'ঘ'];

  return (
    <div id="wrong-questions-page" className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-rose-700 via-rose-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-rose-200 border border-white/20">
            <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>ভুল থেকে সঠিক শেখার বিশেষ কর্নার</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            ভুল প্রশ্ন অনুশীলন ও রিভিশন
          </h1>

          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
            কুইজ বা টেস্টে যে প্রশ্নগুলোতে আপনার ভুল হয়েছিল, সেগুলো এখানে সংরক্ষিত থাকে যাতে সঠিক উত্তর ও ব্যাখ্যা পড়ার মাধ্যমে দুর্বলতা কাটিয়ে ওঠা যায়।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleStartRetryQuiz}
              disabled={wrongQuestions.length === 0}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>ভুল প্রশ্নগুলোর স্পেশাল রিটেস্ট দিন ({wrongQuestions.length}টি)</span>
            </button>

            {wrongQuestions.length > 0 && (
              <button
                onClick={clearAllWrongQuestions}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>তালিকা খালি করুন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {wrongQuestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                চমৎকার! আপনার কোনো ভুল প্রশ্ন জমা নেই
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                আপনি কুইজ বা মডেল টেস্ট দেওয়ার সময় কোনো প্রশ্ন ভুল হলে স্বয়ংক্রিয়ভাবে এখানে যুক্ত হবে।
              </p>
            </div>
            <button
              onClick={() => navigate('question_bank')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
            >
              প্রশ্নব্যাংক অনুশীলন করুন
            </button>
          </div>
        ) : (
          wrongQuestions.map((q, idx) => {
            const isBookmarked = isQuestionBookmarked(q.id);
            const isExpanded = expandedExplanation[q.id] !== false; // expanded by default

            return (
              <div
                key={q.id || idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {q.question}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleBookmarkQuestion(q)}
                    className={`p-2 rounded-xl transition shrink-0 ${
                      isBookmarked
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="বুকমার্ক করুন"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Options view */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctAnswerIndex;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-md bg-black/5 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold">
                            {optionLetters[optIdx]}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isCorrect && (
                          <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                            সঠিক
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => toggleExp(q.id)}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 mb-2"
                  >
                    <span>{isExpanded ? 'ব্যাখ্যা সংক্ষেপ করুন' : 'বিস্তারিত ব্যাখ্যা দেখুন'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isExpanded && (
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                        <span className="font-bold block mb-1">💡 সমাধান ও ব্যাখ্যা:</span>
                        {q.explanation}
                      </div>

                      <button
                        onClick={() =>
                          navigate('ai_chat', {
                            classId: q.classId,
                            subjectId: q.subjectId,
                            chapterId: q.chapterId,
                            query: `এই বহুনির্বাচনী প্রশ্নটি এবং এর সঠিক উত্তর আমাকে বাস্তব উদাহরণসহ বুঝিয়ে দাও:\n\nপ্রশ্ন: "${q.question}"\nবিকল্পসমূহ: ${q.options.join(', ')}\nসঠিক উত্তর: "${q.options[q.correctAnswerIndex]}"\nবর্তমান ব্যাখ্যা: "${q.explanation}"`,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold transition"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>🤖 এই প্রশ্নে AI শিক্ষকের সাহায্য নিন</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
