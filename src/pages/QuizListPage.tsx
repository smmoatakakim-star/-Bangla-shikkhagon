import React, { useState } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  Zap,
  Filter,
  Layers,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId, SubjectId } from '../types';

export const QuizListPage: React.FC = () => {
  const { quizzes, classes, subjects, pageParams, navigate } = useApp();

  const [selectedClass, setSelectedClass] = useState<ClassId | 'all'>(
    pageParams.classId || 'all'
  );
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>(
    pageParams.subjectId || 'all'
  );

  const filteredQuizzes = quizzes.filter((q) => {
    if (selectedClass !== 'all' && q.classId !== selectedClass) return false;
    if (selectedSubject !== 'all' && q.subjectId !== selectedSubject) return false;
    return true;
  });

  const availableSubjects =
    selectedClass === 'all'
      ? subjects
      : subjects.filter((s) => s.classId === selectedClass);

  // Get distinct subjects for filter
  const distinctSubjects = Array.from(new Set(subjects.map((s) => s.id))).map((id) =>
    subjects.find((s) => s.id === id)!
  );

  return (
    <div id="quiz-list-page" className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>বহুনির্বাচনী কুইজ ব্যাংক</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            অনলাইন এমসিকিউ (MCQ) কুইজ
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            শ্রেণি, বিষয় ও অধ্যায়ভিত্তিক মডেল কুইজ সমাধান করে সঠিক উত্তর ও বিস্তারিত ব্যাখ্যাসহ নিজের প্রস্তুতি যাচাই করো।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('question_bank')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
          >
            প্রশ্নব্যাংক অনুসন্ধান
          </button>
          <button
            onClick={() => navigate('model_tests')}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
          >
            মডেল টেস্ট
          </button>
          <button
            onClick={() => navigate('daily_quiz')}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm"
          >
            ডেইলি কুইজ
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-500 shrink-0">শ্রেণি:</span>
            <button
              onClick={() => setSelectedClass('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                selectedClass === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              সকল শ্রেণি
            </button>
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedClass(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  selectedClass === c.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 shrink-0">বিষয়:</span>
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                selectedSubject === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              সকল বিষয়
            </button>
            {distinctSubjects.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  selectedSubject === s.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quizzes List: Compact Modern Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredQuizzes.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-3">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-500">নির্বাচিত ক্যাটাগরিতে এখনো কোনো কুইজ নেই।</p>
            <button
              onClick={() => {
                setSelectedClass('all');
                setSelectedSubject('all');
              }}
              className="text-xs text-purple-600 font-semibold hover:underline"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          filteredQuizzes.map((quiz) => {
            const classObj = classes.find((c) => c.id === quiz.classId);
            const subjectObj = subjects.find((s) => s.id === quiz.subjectId && s.classId === quiz.classId);

            return (
              <div
                key={quiz.id}
                id={`quiz-card-${quiz.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-purple-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                      {classObj ? classObj.name.split(' ')[0] : ''}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {quiz.timeLimitMinutes || 10} মি.
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-600 block">
                    {subjectObj?.name || 'বিষয়'}
                  </span>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 line-clamp-1">
                    {quiz.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {quiz.questions.length}টি প্রশ্ন
                    </span>
                    <span className="text-slate-400">ব্যাখ্যাসহ</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => navigate('quiz_play', { quizId: quiz.id })}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>কুইজ শুরু করুন</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
