import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  GraduationCap,
  Award,
  Sparkles,
  Calculator,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Layers,
  ChevronRight,
  TrendingUp,
  Brain,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId, SubjectId, SubjectInfo, ChapterInfo } from '../types';
import { ALL_CLASSES, ALL_SUBJECTS, ALL_CHAPTERS } from '../data/curriculumData';
import { getCreativeQuestions } from '../data/creativeQuestionData';
import { FORMULA_BANK } from '../data/formulaBankData';
import { getPlatformMcqsByClass } from '../data/academyMcqData';

export const ClassDashboardPage: React.FC = () => {
  const { pageParams, navigate } = useApp();

  const targetClass = (pageParams?.classId as ClassId) || 'class-8';
  const [activeClass, setActiveClass] = useState<ClassId>(targetClass);
  const [activeTab, setActiveTab] = useState<
    'subjects' | 'chapters' | 'formulas' | 'mcqs' | 'quizzes' | 'cq' | 'exams'
  >('subjects');

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Class Metadata
  const currentClassInfo = useMemo(() => {
    return (
      ALL_CLASSES.find((c) => c.id === activeClass) || {
        id: activeClass,
        name: `${activeClass.replace('class-', '')}ম শ্রেণি`,
        numericGrade: 8,
        description: 'পাঠ্যক্রমের পূর্ণাঙ্গ প্রস্তুতি',
        iconName: 'BookOpen',
        colorClass: 'from-emerald-600 to-teal-700',
        totalChapters: 35,
        totalQuizzes: 40,
      }
    );
  }, [activeClass]);

  // Subjects for this class
  const classSubjects = useMemo(() => {
    return ALL_SUBJECTS.filter((s) => s.classId === activeClass);
  }, [activeClass]);

  // Chapters for this class
  const classChapters = useMemo(() => {
    return ALL_CHAPTERS.filter((c) => c.classId === activeClass);
  }, [activeClass]);

  // Formulas for this class
  const classFormulas = useMemo(() => {
    return FORMULA_BANK.filter((f) => {
      const matchClass = f.classId === activeClass;
      const matchSubject = selectedSubjectId === 'all' || f.subjectId === selectedSubjectId;
      const matchSearch =
        !searchFilter ||
        f.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        f.formula.toLowerCase().includes(searchFilter.toLowerCase());
      return matchClass && matchSubject && matchSearch;
    });
  }, [activeClass, selectedSubjectId, searchFilter]);

  // MCQs for this class
  const classMcqs = useMemo(() => {
    const list = getPlatformMcqsByClass(activeClass);
    return list.slice(0, 30); // sample showcase
  }, [activeClass]);

  // Creative Questions for this class
  const classCQs = useMemo(() => {
    const res = getCreativeQuestions({
      classId: activeClass,
      subjectId: selectedSubjectId === 'all' ? undefined : selectedSubjectId,
      pageSize: 10,
    });
    return res.items;
  }, [activeClass, selectedSubjectId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Class Selection Switcher Bar */}
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-2 shrink-0">
            শিক্ষাস্তর পরিবর্তন:
          </span>
          {ALL_CLASSES.map((cls) => {
            const isActive = cls.id === activeClass;
            return (
              <button
                key={cls.id}
                onClick={() => {
                  setActiveClass(cls.id);
                  setSelectedSubjectId('all');
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cls.name}
              </button>
            );
          })}
        </div>

        {/* Dashboard Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-10 text-white shadow-xl">
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>অফিসিয়াল NCTB শিক্ষাক্রমের পূর্ণাঙ্গ ড্যাশবোর্ড</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {currentClassInfo.name} — স্মার্ট একাডেমি হাব
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                {currentClassInfo.description}। বিষয়ভিত্তিক অধ্যায়, সূত্র, ২০,০০০+ MCQ, সৃজনশীল প্রশ্ন
                ও মডেল টেস্টের সমন্বিত ড্যাশবোর্ড।
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-300">
                  {classSubjects.length || 8}
                </div>
                <div className="text-[11px] text-emerald-200">মূল বিষয়</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-center">
                <div className="text-xl sm:text-2xl font-black text-cyan-300">
                  {classChapters.length || 35}
                </div>
                <div className="text-[11px] text-emerald-200">অধ্যায়</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-300">২,৫০০+</div>
                <div className="text-[11px] text-emerald-200">MCQ প্রশ্ন</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-center">
                <div className="text-xl sm:text-2xl font-black text-rose-300">৫,০০০+</div>
                <div className="text-[11px] text-emerald-200">সৃজনশীল (CQ)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'subjects', label: 'বিষয়সমূহ (Subjects)', icon: BookOpen },
            { id: 'chapters', label: 'অধ্যায় তালিকা (Chapters)', icon: Layers },
            { id: 'formulas', label: 'সূত্র ভাণ্ডার (Formulas)', icon: Calculator },
            { id: 'mcqs', label: 'MCQ ব্যাংক', icon: CheckCircle2 },
            { id: 'quizzes', label: 'কুইজ ও পরীক্ষা (Quizzes)', icon: Clock },
            { id: 'cq', label: 'সৃজনশীল প্রশ্ন (CQ)', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SUBJECTS */}
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {currentClassInfo.name}-এর অন্তর্ভুক্ত বিষয়সমূহ
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  যেকোনো বিষয়ে ক্লিক করে অধ্যায়, লেসন ও কুইজ চর্চা শুরু করুন
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {classSubjects.map((sub) => {
                const subChapters = classChapters.filter((c) => c.subjectId === sub.id);
                return (
                  <div
                    key={sub.id}
                    onClick={() => {
                      navigate('chapters', { classId: activeClass, subjectId: sub.id });
                    }}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 p-5 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold border ${sub.badgeColor}`}
                        >
                          {sub.banglaName || sub.name}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          {subChapters.length}টি অধ্যায়
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {sub.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span>অধ্যায়গুলো দেখুন</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CHAPTERS */}
        {activeTab === 'chapters' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  অধ্যায়ভিত্তিক পাঠ্যক্রম তালিকা
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  প্রতিটি অধ্যায়ের ব্যাখ্যা, গুরুত্বপূর্ণ পয়েন্ট ও অনুশীলন
                </p>
              </div>

              {/* Subject Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">বিষয়:</span>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">সকল বিষয় ({classChapters.length})</option>
                  {classSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {classChapters
                .filter((c) => selectedSubjectId === 'all' || c.subjectId === selectedSubjectId)
                .map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => {
                      navigate('lesson', { chapterId: ch.id });
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl hover:border-emerald-500 transition-all cursor-pointer shadow-xs group"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {ch.subjectId}
                      </span>
                      <span>{ch.lessonCount || 4}টি পাঠ</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {ch.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {ch.description || 'অধ্যায়ের বিশদ আলোচনা ও মডেল প্রশ্ন।'}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: FORMULAS */}
        {activeTab === 'formulas' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {currentClassInfo.name}-এর সূত্র ভাণ্ডার ({classFormulas.length}টি সূত্র)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  গণিত, পদার্থ, রসায়ন ও অন্যান্য বিষয়ের প্রয়োজনীয় সূত্র
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="সূত্র অনুসন্ধান..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={() => navigate('formula_bank', { targetClass: activeClass })}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs shrink-0 shadow-sm hover:bg-amber-700 transition"
                >
                  পূর্ণাঙ্গ সূত্র ভাণ্ডার ➔
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classFormulas.slice(0, 8).map((f) => (
                <div
                  key={f.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-900">
                      {f.subjectName || f.subjectId}
                    </span>
                    <span className="text-xs text-slate-400">{f.chapterTitle}</span>
                  </div>
                  <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">{f.name}</h4>
                  <div className="p-3 bg-amber-50/50 dark:bg-slate-800/80 rounded-xl font-mono text-sm font-bold text-amber-950 dark:text-amber-200 border border-amber-200/50 dark:border-slate-700">
                    {f.formula}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-800 dark:text-slate-200">কখন ব্যবহার করবেন:</strong>{' '}
                    {f.whenToUse}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MCQS */}
        {activeTab === 'mcqs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {currentClassInfo.name}-এর বহুনিবার্চনী প্রশ্ন (MCQ Master)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  বোর্ড পরীক্ষার স্ট্যান্ডার্ড অনুযায়ী নির্ভুল উত্তর ও ব্যাখ্যা
                </p>
              </div>
              <button
                onClick={() => navigate('quiz', { classId: activeClass })}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-sm hover:bg-emerald-700 transition"
              >
                লাইভ কুইজ খেলুন ➔
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classMcqs.slice(0, 6).map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-emerald-600">{q.subjectId}</span>
                    <span>প্রশ্ন #{idx + 1}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{q.question}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-xl border ${
                          oIdx === q.correctAnswerIndex
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
                    💡 <strong>ব্যাখ্যা:</strong> {q.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: QUIZZES */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  কুইজ ও মডেল টেস্ট মোড
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  ১০, ২০, ৩০, ৫০ বা ১০০ প্রশ্নের ইনস্ট্যান্ট স্পিড টেস্ট
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { count: 10, time: '১০ মিনিট', color: 'from-blue-600 to-cyan-600', type: 'কুইক স্পিড টেস্ট' },
                { count: 20, time: '২০ মিনিট', color: 'from-emerald-600 to-teal-600', type: 'স্ট্যান্ডার্ড কুইজ' },
                { count: 50, time: '৫০ মিনিট', color: 'from-amber-600 to-orange-600', type: 'অধ্যায়ভিত্তিক পূর্ণাঙ্গ টেস্ট' },
                { count: 100, time: '১০০ মিনিট', color: 'from-rose-600 to-pink-600', type: 'বোর্ড ফাইনাল মডেল টেস্ট' },
              ].map((test) => (
                <div
                  key={test.count}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${test.color} flex items-center justify-center text-white font-black text-lg shadow-md`}
                    >
                      {test.count}
                    </div>
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{test.type}</h3>
                    <p className="text-xs text-slate-500">
                      মোট {test.count}টি প্রশ্ন • সময়: {test.time}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate('daily_quiz', { classId: activeClass, count: test.count });
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>শুরু করুন</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CREATIVE QUESTIONS (CQ) */}
        {activeTab === 'cq' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {currentClassInfo.name}-এর সৃজনশীল প্রশ্ন (CQ Master — ৫,০০০+ প্রশ্ন)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  উদ্দীপক, ক-খ-গ-ঘ এবং নম্বরভিত্তিক পূর্ণাঙ্গ আদর্শ সমাধান
                </p>
              </div>
              <button
                onClick={() => navigate('creative_questions', { targetClass: activeClass })}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-sm hover:bg-rose-700 transition"
              >
                পূর্ণাঙ্গ সৃজনশীল হাব ➔
              </button>
            </div>

            <div className="space-y-4">
              {classCQs.slice(0, 3).map((cq) => (
                <div
                  key={cq.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900">
                      {cq.subjectName || cq.subjectId} • {cq.chapterTitle}
                    </span>
                    <span className="text-slate-400 font-medium">১০ নম্বর</span>
                  </div>

                  {/* Stimulus */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                    <strong className="text-emerald-700 dark:text-emerald-400">উদ্দীপক:</strong>{' '}
                    {cq.stimulus}
                  </div>

                  {/* 4 Parts */}
                  <div className="space-y-2 text-sm text-slate-800 dark:text-slate-200">
                    <div className="p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <strong className="text-blue-600">ক.</strong> {cq.questionKa}{' '}
                      <span className="text-xs text-slate-400 ml-1">(১ নম্বর)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <strong className="text-blue-600">খ.</strong> {cq.questionKha}{' '}
                      <span className="text-xs text-slate-400 ml-1">(২ নম্বর)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <strong className="text-blue-600">গ.</strong> {cq.questionGa}{' '}
                      <span className="text-xs text-slate-400 ml-1">(৩ নম্বর)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <strong className="text-blue-600">ঘ.</strong> {cq.questionGha}{' '}
                      <span className="text-xs text-slate-400 ml-1">(৪ নম্বর)</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{cq.stepByStepExplanation}</span>
                    <button
                      onClick={() => navigate('creative_questions', { targetClass: activeClass, cqId: cq.id })}
                      className="text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>সম্পূর্ণ আদর্শ উত্তর দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
