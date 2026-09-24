import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Bookmark,
  BookmarkCheck,
  Search,
  Filter,
  Play,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId, SubjectId, QuestionDifficulty, QuizQuestion } from '../types';
import { ALL_CLASSES, ALL_SUBJECTS, ALL_CHAPTERS } from '../data/curriculumData';
import { getChapterQuestionBank, getRandomQuiz } from '../data/questionBankEngine';

export const QuestionBankPage: React.FC = () => {
  const {
    classes,
    subjects,
    chapters,
    pageParams,
    navigate,
    startCustomQuiz,
    toggleBookmarkQuestion,
    isQuestionBookmarked,
    recordWrongQuestion,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<ClassId>(
    pageParams.classId || 'class-6'
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | 'all'>(
    pageParams.subjectId || 'all'
  );
  const [selectedChapterId, setSelectedChapterId] = useState<string | 'all'>(
    pageParams.chapterId || 'all'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Revealed answers map: questionId -> selected index
  const [userSelectedOptions, setUserSelectedOptions] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  // Subjects available for selected class
  const classSubjects = useMemo(() => {
    return subjects.filter((s) => s.classId === selectedClassId);
  }, [subjects, selectedClassId]);

  const [currentPageNum, setCurrentPageNum] = useState(1);
  const pageSize = 20;

  // Chapters available for selected subject & class
  const availableChapters = useMemo(() => {
    return chapters.filter(
      (c) => c.classId === selectedClassId && (selectedSubjectId === 'all' || c.subjectId === selectedSubjectId)
    );
  }, [chapters, selectedClassId, selectedSubjectId]);

  // Collect all questions for the current filter
  const filteredQuestions = useMemo(() => {
    let pool: QuizQuestion[] = [];

    const targetChapters = chapters.filter((c) => {
      if (c.classId !== selectedClassId) return false;
      if (selectedSubjectId !== 'all' && c.subjectId !== selectedSubjectId) return false;
      if (selectedChapterId !== 'all' && c.id !== selectedChapterId) return false;
      return true;
    });

    targetChapters.forEach((ch) => {
      pool.push(...getChapterQuestionBank(ch.id));
    });

    if (selectedDifficulty !== 'all') {
      pool = pool.filter((q) => q.difficulty === selectedDifficulty);
    }

    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      pool = pool.filter(
        (q) =>
          q.question.toLowerCase().includes(qLower) ||
          q.options.some((opt) => opt.toLowerCase().includes(qLower)) ||
          q.explanation.toLowerCase().includes(qLower)
      );
    }

    return pool;
  }, [chapters, selectedClassId, selectedSubjectId, selectedChapterId, selectedDifficulty, searchQuery]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPageNum(1);
  }, [selectedClassId, selectedSubjectId, selectedChapterId, selectedDifficulty, searchQuery]);

  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPageNum - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPageNum, pageSize]);

  const handleClassChange = (cId: ClassId) => {
    setSelectedClassId(cId);
    setSelectedSubjectId('all');
    setSelectedChapterId('all');
    setCurrentPageNum(1);
  };

  const handleOptionSelect = (q: QuizQuestion, optIdx: number) => {
    setUserSelectedOptions((prev) => ({ ...prev, [q.id]: optIdx }));
    setRevealedExplanations((prev) => ({ ...prev, [q.id]: true }));

    if (optIdx !== q.correctAnswerIndex) {
      recordWrongQuestion(q);
    }
  };

  const toggleExplanation = (qId: string) => {
    setRevealedExplanations((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const startQuizFromPool = (count: number) => {
    if (filteredQuestions.length === 0) return;
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    const currentClassObj = classes.find((c) => c.id === selectedClassId);
    const customQuiz = {
      id: `quiz-custom-qb-${Date.now()}`,
      title: `${currentClassObj?.name} — প্রশ্নব্যাংক ভিত্তিক কুইজ (${selected.length}টি প্রশ্ন)`,
      classId: selectedClassId,
      subjectId: (selectedSubjectId !== 'all' ? selectedSubjectId : 'science') as SubjectId,
      chapterId: selectedChapterId !== 'all' ? selectedChapterId : '',
      chapterTitle: 'প্রশ্নব্যাংক কাস্টম নির্বাচন',
      description: `প্রশ্নব্যাংক থেকে ফিল্টারকৃত ${selected.length}টি বহুনির্বাচনী প্রশ্ন নিয়ে সময় নিয়ন্ত্রিত পরীক্ষা।`,
      questions: selected,
      timeLimitMinutes: Math.ceil(selected.length * 1.0),
      quizMode: 'random' as const,
      totalBankCount: filteredQuestions.length,
    };

    startCustomQuiz(customQuiz);
  };

  const optionLetters = ['ক', 'খ', 'গ', 'ঘ'];

  return (
    <div id="question-bank-page" className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-purple-200 border border-white/20">
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>NCTB কারিকুলাম ভিত্তিক অল-ইন-ওয়ান প্রশ্নভাণ্ডার</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            বহুনির্বাচনী প্রশ্নব্যাংক (Question Bank)
          </h1>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            ৬ষ্ঠ থেকে ১০ম শ্রেণির অধ্যায়ভিত্তিক গুরুত্বপূর্ণ বহুনির্বাচনী প্রশ্ন, সঠিক উত্তর ও গভীর বিশ্লেষণধর্মী সহজ ব্যাখ্যা। সরাসরি উত্তর যাচাই করুন অথবা রিয়েল-টাইম কুইজ দিন।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => startQuizFromPool(15)}
              disabled={filteredQuestions.length === 0}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>১৫টি প্রশ্নের কুইজ শুরু করুন</span>
            </button>

            <button
              onClick={() => startQuizFromPool(25)}
              disabled={filteredQuestions.length === 0}
              className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Award className="w-4 h-4" />
              <span>২৫টি প্রশ্নের পূর্ণাঙ্গ টেস্ট</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Matrix Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Class Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 shrink-0">শ্রেণি:</span>
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => handleClassChange(cls.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedClassId === cls.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>

        {/* Subject Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 dark:border-slate-800 pt-3">
          <span className="text-xs font-bold text-slate-500 shrink-0">বিষয়:</span>
          <button
            onClick={() => {
              setSelectedSubjectId('all');
              setSelectedChapterId('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              selectedSubjectId === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            সকল বিষয়
          </button>
          {classSubjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubjectId(sub.id);
                setSelectedChapterId('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                selectedSubjectId === sub.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Chapter & Search controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
          {/* Chapter Select */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">অধ্যায় ফিল্টার:</label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">সকল অধ্যায় ({availableChapters.length}টি)</option>
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Select */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">কাঠিন্য মাত্রা:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">সকল মাত্রা (সহজ, মাঝারি, কঠিন, চ্যালেঞ্জ)</option>
              <option value="easy">সহজ (Easy)</option>
              <option value="medium">মাঝারি (Medium)</option>
              <option value="hard">কঠিন (Hard)</option>
              <option value="challenge">চ্যালেঞ্জ (Challenge)</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">প্রশ্ন অনুসন্ধান:</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শব্দ বা বিষয় দিয়ে খুঁজুন..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>প্রশ্ন তালিকা</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              মোট {filteredQuestions.length}টি প্রশ্ন
            </span>
          </h3>
          {totalPages > 1 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              (পৃষ্ঠা {currentPageNum} / {totalPages})
            </span>
          )}
        </div>

        {filteredQuestions.length > 0 && (
          <button
            onClick={() => startQuizFromPool(Math.min(20, filteredQuestions.length))}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>এই তালিকা দিয়ে কুইজ খেলুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Questions Interactive List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500">
              নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো প্রশ্ন পাওয়া যায়নি।
            </p>
            <button
              onClick={() => {
                setSelectedSubjectId('all');
                setSelectedChapterId('all');
                setSelectedDifficulty('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-purple-600 hover:underline"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          paginatedQuestions.map((q, localIdx) => {
            const idx = (currentPageNum - 1) * pageSize + localIdx;
            const userChoice = userSelectedOptions[q.id];
            const isAnswered = userChoice !== undefined;
            const isCorrect = userChoice === q.correctAnswerIndex;
            const isBookmarked = isQuestionBookmarked(q.id);
            const isExplanationOpen = revealedExplanations[q.id] || false;

            return (
              <div
                key={q.id || idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition"
              >
                {/* Question Header & Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-snug">
                        {q.question}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {q.difficulty && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {q.difficulty === 'easy'
                              ? 'সহজ'
                              : q.difficulty === 'medium'
                              ? 'মাঝারি'
                              : q.difficulty === 'hard'
                              ? 'কঠিন'
                              : 'চ্যালেঞ্জ'}
                          </span>
                        )}
                        {q.category && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                            {q.category === 'basic'
                              ? 'মৌলিক ধারণা'
                              : q.category === 'understanding'
                              ? 'অনুধাবনমূলক'
                              : q.category === 'application'
                              ? 'প্রয়োগমূলক'
                              : q.category === 'exam_style'
                              ? 'পরীক্ষা উপযোগী'
                              : 'গুরুত্বপূর্ণ'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmarkQuestion(q)}
                    className={`p-2 rounded-xl transition shrink-0 ${
                      isBookmarked
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={isBookmarked ? 'বুকমার্ক সরানো' : 'বুকমার্ক করুন'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* 4 Interactive Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === optIdx;
                    const isTheCorrectOne = optIdx === q.correctAnswerIndex;

                    let optClass =
                      'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';

                    if (isAnswered) {
                      if (isTheCorrectOne) {
                        optClass =
                          'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optClass =
                          'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(q, optIdx)}
                        className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${optClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center font-bold text-[11px] shrink-0">
                            {optionLetters[optIdx]}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isAnswered && isTheCorrectOne && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Toggle & Content */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <span>{isExplanationOpen ? 'ব্যাখ্যা লুকান' : 'সঠিক উত্তর ও সহজ ব্যাখ্যা দেখুন'}</span>
                      {isExplanationOpen ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {isAnswered && (
                      <span
                        className={`text-xs font-bold ${
                          isCorrect ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isCorrect ? '✓ আপনার উত্তর সঠিক হয়েছে' : '✕ ভুল উত্তর'}
                      </span>
                    )}
                  </div>

                  {isExplanationOpen && (
                    <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/60 text-xs text-purple-950 dark:text-purple-200 leading-relaxed animate-in fade-in duration-150">
                      <span className="font-bold text-purple-800 dark:text-purple-300 block mb-1">
                        💡 সঠিক উত্তর: {optionLetters[q.correctAnswerIndex]} ({q.options[q.correctAnswerIndex]})
                      </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
          <button
            onClick={() => {
              setCurrentPageNum((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            disabled={currentPageNum === 1}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            পূর্ববর্তী পৃষ্ঠা
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageToShow = i + 1;
              if (totalPages > 7) {
                if (currentPageNum > 4 && currentPageNum < totalPages - 3) {
                  pageToShow = currentPageNum - 3 + i;
                } else if (currentPageNum >= totalPages - 3) {
                  pageToShow = totalPages - 6 + i;
                }
              }

              return (
                <button
                  key={pageToShow}
                  onClick={() => {
                    setCurrentPageNum(pageToShow);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                    currentPageNum === pageToShow
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {pageToShow}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setCurrentPageNum((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            disabled={currentPageNum === totalPages}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            পরবর্তী পৃষ্ঠা
          </button>
        </div>
      )}
    </div>
  );
};
