import React, { useState } from 'react';
import {
  BookmarkCheck,
  Bookmark,
  Play,
  Trash2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuizQuestion } from '../types';

export const BookmarkedQuestionsPage: React.FC = () => {
  const {
    bookmarkedQuestions,
    toggleBookmarkQuestion,
    startCustomQuiz,
    navigate,
  } = useApp();

  const [expandedExplanation, setExpandedExplanation] = useState<Record<string, boolean>>({});

  const toggleExp = (id: string) => {
    setExpandedExplanation((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartBookmarkQuiz = () => {
    if (bookmarkedQuestions.length === 0) return;
    const customQuiz = {
      id: `quiz-bookmarks-${Date.now()}`,
      title: `বুকমার্ক করা গুরুত্বপূর্ণ প্রশ্নাবলি (${bookmarkedQuestions.length}টি প্রশ্ন)`,
      classId: 'class-6' as any,
      subjectId: 'science' as any,
      chapterId: '',
      chapterTitle: 'বুকমার্কড রিভিশন',
      description: 'আপনার সংরক্ষিত গুরুত্বপূর্ণ বহুনির্বাচনী প্রশ্নসমূহের বিশেষ কুইজ।',
      questions: bookmarkedQuestions,
      timeLimitMinutes: Math.max(5, Math.ceil(bookmarkedQuestions.length * 1.2)),
      quizMode: 'random' as const,
      totalBankCount: bookmarkedQuestions.length,
    };
    startCustomQuiz(customQuiz);
  };

  const optionLetters = ['ক', 'খ', 'গ', 'ঘ'];

  return (
    <div id="bookmarked-questions-page" className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-amber-200 border border-white/20">
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>সংরক্ষিত প্রশ্নাবলি</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            বুকমার্ক করা প্রশ্নভাণ্ডার
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            যে প্রশ্নগুলো পরবর্তীতে রিভিশন বা পড়ার সুবিধার্থে আপনি স্টার/বুকমার্ক করে রেখেছেন।
          </p>

          <div className="pt-2">
            <button
              onClick={handleStartBookmarkQuiz}
              disabled={bookmarkedQuestions.length === 0}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>বুকমার্ক করা প্রশ্নের টেস্ট দিন ({bookmarkedQuestions.length}টি)</span>
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {bookmarkedQuestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                এখনো কোনো প্রশ্ন বুকমার্ক করেননি
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                কুইজ বা প্রশ্নব্যাংক পড়ার সময় যেকোনো গুরুত্বপূর্ণ প্রশ্নের বুকমার্ক বাটনে ক্লিক করলে তা এখানে সেভ হবে।
              </p>
            </div>
            <button
              onClick={() => navigate('question_bank')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
            >
              প্রশ্নব্যাংক ব্রাউজ করুন
            </button>
          </div>
        ) : (
          bookmarkedQuestions.map((q, idx) => {
            const isExpanded = expandedExplanation[q.id] !== false;

            return (
              <div
                key={q.id || idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {q.question}
                    </h4>
                  </div>

                  <button
                    onClick={() => toggleBookmarkQuestion(q)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0"
                    title="বুকমার্ক মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

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

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => toggleExp(q.id)}
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-2"
                  >
                    <span>{isExpanded ? 'ব্যাখ্যা লুকান' : 'সহজ ব্যাখ্যা দেখুন'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isExpanded && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                      <span className="font-bold block mb-1">💡 ব্যাখ্যা:</span>
                      {q.explanation}
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
