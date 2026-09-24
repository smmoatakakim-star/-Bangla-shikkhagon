import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Award,
  Search,
  Sparkles,
  ChevronRight,
  Layers,
  ArrowRight,
  Calculator,
  Compass,
  FileText,
  Clock,
  CheckCircle2,
  Atom,
  Briefcase,
  Users,
  Check,
  RotateCcw,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  BookMarked,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SSC_SUBJECTS } from '../data/curriculum/sscSubjects';
import { SSC_CHAPTERS } from '../data/curriculum/sscChapters';
import { SSC_LESSONS, SSC_QUIZZES } from '../data/curriculum/sscLessonsQuizzes';
import { FORMULA_BANK } from '../data/formulaBankData';
import { getFilteredAcademyMcqs } from '../data/academyMcqData';
import { InteractiveMCQPractice } from '../components/academy/InteractiveMCQPractice';
import { AcademicGroup, SubjectInfo, ChapterInfo, Lesson, Quiz } from '../types';

export type AcademyTabType =
  | 'chapters'
  | 'lessons'
  | 'mcq'
  | 'quiz'
  | 'formula'
  | 'questions'
  | 'revision';

const toBengaliDigits = (num: number): string => {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bn[parseInt(d, 10)]);
};

export const SSCDashboardPage: React.FC = () => {
  const { navigate, pageParams } = useApp();

  const [selectedGroup, setSelectedGroup] = useState<AcademicGroup | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'hub' | 'grid'>('hub');

  // Filter subjects based on group and search query
  const filteredSubjects = useMemo(() => {
    return SSC_SUBJECTS.filter((sub) => {
      const matchesGroup =
        selectedGroup === 'all' ||
        sub.group === selectedGroup ||
        sub.group === 'general';

      const matchesSearch =
        searchTerm.trim() === '' ||
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.banglaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.code && sub.code.includes(searchTerm));

      return matchesGroup && matchesSearch;
    });
  }, [selectedGroup, searchTerm]);

  // Selected active subject
  const [activeSubjectId, setActiveSubjectId] = useState<string>(
    pageParams.subjectId || 'physics'
  );

  // When pageParams change, update active subject
  useEffect(() => {
    if (pageParams?.subjectId) {
      setActiveSubjectId(pageParams.subjectId);
      setViewMode('hub');
    }
  }, [pageParams]);

  // Ensure activeSubject is valid
  const currentSubject: SubjectInfo = useMemo(() => {
    const found = SSC_SUBJECTS.find((s) => s.id === activeSubjectId);
    return found || filteredSubjects[0] || SSC_SUBJECTS[0];
  }, [activeSubjectId, filteredSubjects]);

  // Chapters for current subject
  const subjectChapters: ChapterInfo[] = useMemo(() => {
    return SSC_CHAPTERS.filter((ch) => ch.subjectId === currentSubject.id);
  }, [currentSubject.id]);

  // Selected chapter ('all' or chapterId)
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');

  // Reset chapter when subject changes if not found
  useEffect(() => {
    setSelectedChapterId('all');
  }, [currentSubject.id]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AcademyTabType>('chapters');

  // Active Chapter Object
  const currentChapter = useMemo(() => {
    if (selectedChapterId === 'all') return subjectChapters[0];
    return subjectChapters.find((ch) => ch.id === selectedChapterId) || subjectChapters[0];
  }, [selectedChapterId, subjectChapters]);

  // Lessons for current subject & chapter
  const currentLessons: Lesson[] = useMemo(() => {
    return SSC_LESSONS.filter((l) => {
      if (l.subjectId !== currentSubject.id) return false;
      if (selectedChapterId !== 'all') {
        return l.chapterId === selectedChapterId;
      }
      return true;
    });
  }, [currentSubject.id, selectedChapterId]);

  // Quizzes for current subject & chapter
  const currentQuizzes: Quiz[] = useMemo(() => {
    return SSC_QUIZZES.filter((q) => {
      if (q.subjectId !== currentSubject.id) return false;
      if (selectedChapterId !== 'all') {
        return q.chapterId === selectedChapterId;
      }
      return true;
    });
  }, [currentSubject.id, selectedChapterId]);

  // Formulas for current subject
  const currentFormulas = useMemo(() => {
    return FORMULA_BANK.filter((f) => {
      if (f.classId !== 'ssc') return false;
      const fSub = (f.subjectId || '').toLowerCase();
      const sSub = currentSubject.id.toLowerCase();
      return (
        fSub === sSub ||
        (sSub === 'physics' && fSub.includes('physics')) ||
        (sSub === 'chemistry' && fSub.includes('chemistry')) ||
        (sSub === 'higher_math' && fSub.includes('higher_math')) ||
        (sSub === 'math' && fSub.includes('math')) ||
        (sSub === 'accounting' && fSub.includes('acc')) ||
        (sSub === 'finance' && fSub.includes('fin'))
      );
    });
  }, [currentSubject.id]);

  // Real MCQs for current subject & chapter
  const currentMCQs = useMemo(() => {
    return getFilteredAcademyMcqs('ssc', currentSubject.id, selectedChapterId);
  }, [currentSubject.id, selectedChapterId]);

  // Overall counts for banner
  const totalCQs = useMemo(() => {
    return SSC_CHAPTERS.reduce((acc, ch) => acc + (ch.creativeQuestions?.length || 0), 0);
  }, []);

  const totalFormulas = useMemo(() => {
    return FORMULA_BANK.filter((f) => f.classId === 'ssc').length;
  }, []);

  const totalAllSscMcqs = useMemo(() => {
    return getFilteredAcademyMcqs('ssc').length;
  }, []);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-cyan-950 text-white p-5 sm:p-8 md:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-emerald-400/30">
              <GraduationCap className="w-4 h-4" /> SSC / দাখিল একাডেমি (৯ম-১০ম শ্রেণি)
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              এসএসসি পূর্ণাঙ্গ ডিজিটাল একাডেমি
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              ১৭টি বিষয়ের পূর্ণাঙ্গ অধ্যায়ভিত্তিক পাঠ, গুরুত্বপূর্ণ সংজ্ঞা, মূল ধারণা, সহজ ব্যাখ্যা, বাস্তব MCQ প্র্যাকটিস, অধ্যায়ভিত্তিক কুইজ ও রিভিশন হাব।
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap gap-2.5 pt-1 text-xs">
              <div className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                <span>১৭টি বিষয়</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
                <span>{toBengaliDigits(totalAllSscMcqs)}+ বাস্তব MCQ</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-300" />
                <span>{toBengaliDigits(totalCQs)}+ সৃজনশীল CQ</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-amber-300" />
                <span>{toBengaliDigits(totalFormulas)}+ সূত্রভাণ্ডার</span>
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => navigate('model_tests', { classId: 'ssc' })}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold shadow-md hover:bg-emerald-50 transition-all text-xs sm:text-sm"
            >
              <Award className="w-4 h-4 text-yellow-600" />
              <span>বোর্ড মডেল টেস্ট</span>
            </button>
            <button
              onClick={() => navigate('formula_bank', { targetClass: 'ssc' })}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/70 hover:bg-emerald-600 text-white font-semibold backdrop-blur-md border border-emerald-400/40 transition-all text-xs sm:text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>সূত্রভাণ্ডার</span>
            </button>
          </div>
        </div>
      </div>

      {/* Group & View Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Group Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x pb-1">
            <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0 hidden sm:inline">শাখা:</span>
            {[
              { id: 'all', label: 'সকল শাখা (১৭)', icon: Layers },
              { id: 'science', label: 'বিজ্ঞান শাখা', icon: Atom },
              { id: 'humanities', label: 'মানবিক শাখা', icon: Users },
              { id: 'business_studies', label: 'ব্যবসায় শিক্ষা', icon: Briefcase },
            ].map((grp) => {
              const Icon = grp.icon;
              const isActive = selectedGroup === grp.id;
              return (
                <button
                  key={grp.id}
                  onClick={() => setSelectedGroup(grp.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {grp.label}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle & Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="বিষয় খুঁজুন..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'hub' ? 'grid' : 'hub')}
              title={viewMode === 'hub' ? '১৭টি বিষয়ের গ্রিড দেখুন' : 'পূর্ণাঙ্গ স্টাডি হাব ভিউ'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs flex items-center gap-1.5 shrink-0"
            >
              <LayoutGrid className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline font-semibold">
                {viewMode === 'hub' ? 'সকল বিষয় গ্রিড' : 'ট্যাব স্টাডি হাব'}
              </span>
            </button>
          </div>
        </div>

        {/* Horizontal Subject Touch Strip */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x pb-1">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1">বিষয় নির্বাচন:</span>
            {filteredSubjects.map((sub) => {
              const isSelected = sub.id === currentSubject.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setActiveSubjectId(sub.id);
                    setViewMode('hub');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid Mode View: If user toggled to grid */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              এসএসসি বিষয়ভিত্তিক তালিকা ({toBengaliDigits(filteredSubjects.length)}টি বিষয়)
            </h2>
            <button
              onClick={() => setViewMode('hub')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              ট্যাব হাবে ফিরে যান &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredSubjects.map((sub) => {
              const chCount = SSC_CHAPTERS.filter((ch) => ch.subjectId === sub.id).length;
              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setActiveSubjectId(sub.id);
                    setViewMode('hub');
                  }}
                  className="group bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {sub.code || '১০১'}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {sub.group === 'science'
                          ? 'বিজ্ঞান'
                          : sub.group === 'humanities'
                          ? 'মানবিক'
                          : sub.group === 'business_studies'
                          ? 'ব্যবসায়'
                          : 'আবশ্যিক'}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors line-clamp-1 mb-1">
                      {sub.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                      {sub.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{toBengaliDigits(chCount)} অধ্যায়</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                      স্টাডি হাব <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hub Mode View with Complete 7-Tab System */}
      {viewMode === 'hub' && (
        <div className="space-y-4">
          {/* Active Subject Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200 dark:border-emerald-800">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                      {currentSubject.name}
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      কোড: {currentSubject.code || '১০১'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {currentSubject.description}
                  </p>
                </div>
              </div>

              {/* Chapter selector pill/dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-slate-500">অধ্যায়:</span>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 px-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">সকল অধ্যায় ({toBengaliDigits(subjectChapters.length)})</option>
                  {subjectChapters.map((ch, idx) => (
                    <option key={ch.id} value={ch.id}>
                      {toBengaliDigits(idx + 1)}. {ch.banglaTitle || ch.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TAB SYSTEM: [অধ্যায়] [পাঠ] [MCQ] [Quiz] [সূত্র] [গুরুত্বপূর্ণ প্রশ্ন] [Revision] */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar touch-pan-x py-0.5">
                {[
                  {
                    id: 'chapters' as AcademyTabType,
                    label: 'অধ্যায়',
                    icon: BookOpen,
                    count: subjectChapters.length,
                  },
                  {
                    id: 'lessons' as AcademyTabType,
                    label: 'পাঠ',
                    icon: FileText,
                    count: currentLessons.length,
                  },
                  {
                    id: 'mcq' as AcademyTabType,
                    label: 'MCQ',
                    icon: CheckCircle2,
                    count: currentMCQs.length,
                  },
                  {
                    id: 'quiz' as AcademyTabType,
                    label: 'Quiz',
                    icon: Award,
                    count: currentQuizzes.length,
                  },
                  {
                    id: 'formula' as AcademyTabType,
                    label: 'সূত্র',
                    icon: Calculator,
                    count: currentFormulas.length,
                  },
                  {
                    id: 'questions' as AcademyTabType,
                    label: 'গুরুত্বপূর্ণ প্রশ্ন',
                    icon: HelpCircle,
                    count: currentChapter?.creativeQuestions?.length || 0,
                  },
                  {
                    id: 'revision' as AcademyTabType,
                    label: 'Revision',
                    icon: Sparkles,
                    count: currentChapter?.keyConcepts?.length || 0,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all select-none touch-manipulation ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600 scale-[1.02]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {toBengaliDigits(tab.count)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TAB 1: [অধ্যায়] Content */}
          {activeTab === 'chapters' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {currentSubject.name}-এর অধ্যায়সমূহ ({toBengaliDigits(subjectChapters.length)})
                </span>
                <span>অধ্যায়ের যেকোনো ফিচারে ট্যাপ করুন</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {subjectChapters.map((ch, idx) => (
                  <div
                    key={ch.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-2xs hover:shadow-sm transition-all space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50">
                          অধ্যায় {toBengaliDigits(idx + 1)}
                        </span>
                        {ch.paper && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {ch.paper}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {ch.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {ch.overview || ch.description}
                      </p>
                    </div>

                    {/* Key Concepts Preview */}
                    {ch.keyConcepts && ch.keyConcepts.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          মূল ধারণা:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {ch.keyConcepts.slice(0, 3).map((kc, kIdx) => (
                            <span
                              key={kIdx}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
                            >
                              {kc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Action Buttons to jump to that Tab */}
                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-1.5 text-center">
                      <button
                        onClick={() => {
                          setSelectedChapterId(ch.id);
                          setActiveTab('lessons');
                        }}
                        className="py-1 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] hover:bg-emerald-100 transition"
                      >
                        পাঠ পড়ুন
                      </button>
                      <button
                        onClick={() => {
                          setSelectedChapterId(ch.id);
                          setActiveTab('mcq');
                        }}
                        className="py-1 px-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold text-[11px] hover:bg-teal-100 transition"
                      >
                        MCQ দিন
                      </button>
                      <button
                        onClick={() => {
                          setSelectedChapterId(ch.id);
                          setActiveTab('questions');
                        }}
                        className="py-1 px-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-semibold text-[11px] hover:bg-cyan-100 transition"
                      >
                        সৃজনশীল প্রশ্ন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: [পাঠ] Content */}
          {activeTab === 'lessons' && (
            <div className="space-y-4">
              {currentChapter ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                  {/* Lesson Header */}
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      অধ্যায়ভিত্তিক পাঠ ও বিশ্লেষণ
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {currentChapter.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {currentChapter.overview || currentChapter.description}
                    </p>
                  </div>

                  {/* মূল ধারণা (Core Concepts) */}
                  {currentChapter.keyConcepts && currentChapter.keyConcepts.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        মূল ধারণাসমূহ (Core Concepts)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentChapter.keyConcepts.map((kc, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                          >
                            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {toBengaliDigits(idx + 1)}
                            </span>
                            <span>{kc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* সহজ ব্যাখ্যা (Easy Explanation) */}
                  {currentChapter.easyExplanation && (
                    <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        সহজ ব্যাখ্যা ও সারসংক্ষেপ
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {currentChapter.easyExplanation}
                      </p>
                    </div>
                  )}

                  {/* বাস্তব উদাহরণ ও গাণিতিক প্রয়োগ (Examples) */}
                  {currentLessons.some((l) => l.examples && l.examples.length > 0) && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Calculator className="w-4 h-4 text-cyan-600" />
                        বাস্তব উদাহরণ ও গাণিতিক প্রয়োগ
                      </h4>
                      {currentLessons.flatMap((l) => l.examples || []).map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                        >
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {ex.title}
                          </div>
                          {ex.explanation && (
                            <p className="text-slate-600 dark:text-slate-400">
                              {ex.explanation}
                            </p>
                          )}
                          {ex.solution && (
                            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-mono text-[11px] border border-emerald-200 dark:border-emerald-800">
                              <strong>সমাধান: </strong> {ex.solution}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* প্রশ্নোত্তর ও বিশ্লেষণ (Q&A List) */}
                  {currentLessons.some((l) => l.qaList && l.qaList.length > 0) && (
                    <div className="space-y-2.5">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-indigo-500" />
                        গুরুত্বপূর্ণ প্রশ্নোত্তর (Q&A)
                      </h4>
                      {currentLessons.flatMap((l) => l.qaList || []).map((qa, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                        >
                          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <span className="text-emerald-600 font-bold">প্র:</span> {qa.question}
                          </div>
                          <div className="text-slate-600 dark:text-slate-300 pl-4">
                            <strong className="text-slate-700 dark:text-slate-300">উ: </strong>
                            {qa.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">কোনো পাঠ পাওয়া যায়নি।</div>
              )}
            </div>
          )}

          {/* TAB 3: [MCQ] Content (Interactive Practice Component) */}
          {activeTab === 'mcq' && (
            <InteractiveMCQPractice
              questions={currentMCQs}
              subjectTitle={currentSubject.name}
              chapterTitle={currentChapter?.title}
              classNameLevel="SSC"
            />
          )}

          {/* TAB 4: [Quiz] Content */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold">অধ্যায়ভিত্তিক মডেল কুইজ</h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    টাইমার ও স্বয়ংক্রিয় স্কোরিং সহ বোর্ড কুইজে অংশ নিন।
                  </p>
                </div>
                <button
                  onClick={() => navigate('model_tests', { classId: 'ssc' })}
                  className="px-4 py-2 rounded-xl bg-white text-emerald-900 text-xs font-bold shadow hover:bg-emerald-50 transition shrink-0"
                >
                  সম্পূর্ণ মডেল টেস্ট দিন &rarr;
                </button>
              </div>

              {currentQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {currentQuizzes.map((qz) => (
                    <div
                      key={qz.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/50">
                          {toBengaliDigits(qz.questions.length)}টি প্রশ্ন
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {toBengaliDigits(qz.timeLimitMinutes || 10)} মিনিট
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {qz.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {qz.description || 'অধ্যায়ের প্রস্তুতি যাচাইয়ে সময়োপযোগী বহুনির্বাচনী কুইজ।'}
                      </p>
                      <button
                        onClick={() => navigate('quiz_play', { quizId: qz.id })}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>কুইজ শুরু করুন</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <Award className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">এই বিষয়ের সরাসরি কুইজ প্রস্তুত হচ্ছে।</p>
                  <button
                    onClick={() => setActiveTab('mcq')}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    MCQ ট্যাবে প্র্যাকটিস করুন &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: [সূত্র] Content */}
          {activeTab === 'formula' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {currentSubject.name}-এর প্রয়োজনীয় সূত্র ও সমীকরণ ({toBengaliDigits(currentFormulas.length)})
                </span>
                <button
                  onClick={() => navigate('formula_bank', { targetClass: 'ssc' })}
                  className="text-emerald-600 hover:underline font-semibold"
                >
                  সম্পূর্ণ সূত্রভাণ্ডার &rarr;
                </button>
              </div>

              {currentFormulas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {currentFormulas.map((f) => (
                    <div
                      key={f.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {f.name}
                        </span>
                        {f.unit && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            একক: {f.unit}
                          </span>
                        )}
                      </div>

                      {/* Formula Banner */}
                      <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center font-mono font-bold text-sm sm:text-base text-emerald-800 dark:text-emerald-200">
                        {f.formula}
                      </div>

                      {/* Symbols */}
                      {f.symbols && f.symbols.length > 0 && (
                        <div className="space-y-1 text-[11px]">
                          <span className="font-semibold text-slate-400">চলক ও প্রতীক:</span>
                          <div className="grid grid-cols-2 gap-1 text-slate-600 dark:text-slate-400">
                            {f.symbols.map((sym, sIdx) => (
                              <div key={sIdx}>
                                <strong>{sym.symbol}</strong> = {sym.meaning}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Solved Example */}
                      {f.example && (
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                          <strong className="text-slate-700 dark:text-slate-300">উদাহরণ সমস্যা:</strong>
                          <p className="text-slate-600 dark:text-slate-400">{f.example.problem}</p>
                          <div className="text-emerald-700 dark:text-emerald-300 font-mono font-semibold">
                            উত্তর: {f.example.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <Calculator className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">
                    এই বিষয়ের ক্ষেত্রে সরাসরি গাণিতিক সূত্রের চেয়ে সাহিত্যিক বা বিবরণমূলক তত্ত্ব প্রযোজ্য।
                  </p>
                  <button
                    onClick={() => navigate('formula_bank', { targetClass: 'ssc' })}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    গণিত ও বিজ্ঞানের সূত্রভাণ্ডার দেখুন &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: [গুরুত্বপূর্ণ প্রশ্ন] Content */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {currentChapter ? (
                <div className="space-y-4">
                  {/* জ্ঞান ও অনুধাবনমূলক প্রশ্ন */}
                  {currentChapter.shortQuestions && currentChapter.shortQuestions.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        জ্ঞানমূলক ও অনুধাবনমূলক প্রশ্নাবলি
                      </h4>
                      <div className="space-y-2.5">
                        {currentChapter.shortQuestions.map((sq, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                          >
                            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                              <span>
                                {toBengaliDigits(idx + 1)}. {sq.question}
                              </span>
                              <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold">
                                {sq.type === 'knowledge' ? 'জ্ঞানমূলক (ক)' : 'অনুধাবনমূলক (খ)'}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 pl-4 border-l-2 border-emerald-500/40">
                              <strong>উত্তর: </strong> {sq.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* সৃজনশীল CQ প্রশ্নব্যাংক */}
                  {currentChapter.creativeQuestions && currentChapter.creativeQuestions.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-teal-600" />
                        বোর্ড স্ট্যান্ডার্ড সৃজনশীল প্রশ্ন (CQ)
                      </h4>
                      {currentChapter.creativeQuestions.map((cq, idx) => (
                        <div
                          key={cq.id || idx}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                        >
                          <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                            <strong className="text-emerald-800 dark:text-emerald-300 block mb-1">
                              উদ্দীপক {toBengaliDigits(idx + 1)}:
                            </strong>
                            {cq.stem}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <span className="font-bold text-emerald-600">ক. (১ নম্বর):</span>
                              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                                {cq.partA?.question}
                              </p>
                              <p className="text-slate-500 mt-1 text-[11px]">
                                উ: {cq.partA?.answer}
                              </p>
                            </div>
                            <div className="p-2.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <span className="font-bold text-teal-600">খ. (২ নম্বর):</span>
                              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                                {cq.partB?.question}
                              </p>
                              <p className="text-slate-500 mt-1 text-[11px]">
                                উ: {cq.partB?.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">প্রশ্ন পাওয়া যায়নি।</div>
              )}
            </div>
          )}

          {/* TAB 7: [Revision] Content */}
          {activeTab === 'revision' && (
            <div className="space-y-4">
              {currentChapter ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-5">
                  <div>
                    <span className="text-xs font-bold text-emerald-600">১০ মিনিটের কুইক রিভিশন</span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {currentChapter.title} - রিভিশন নোট
                    </h3>
                  </div>

                  {/* গুরুত্বপূর্ণ সংজ্ঞাসমূহ (Key Terms) */}
                  {currentChapter.keyTerms && currentChapter.keyTerms.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                        গুরুত্বপূর্ণ সংজ্ঞা ও পারিভাষিক শব্দ:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {currentChapter.keyTerms.map((term, tIdx) => {
                          const termText = typeof term === 'string' ? term : `${term.term}: ${term.definition}`;
                          return (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200/50 dark:border-emerald-800/40"
                            >
                              {termText}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* সূত্র ও গুরুত্বপূর্ণ তথ্যাবলি */}
                  {currentChapter.formulaeOrFacts && currentChapter.formulaeOrFacts.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                        গুরুত্বপূর্ণ সূত্র ও তথ্য কণিকা:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {currentChapter.formulaeOrFacts.map((fact, fIdx) => (
                          <div
                            key={fIdx}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{fact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* পরীক্ষার জন্য বিশেষ ফোকাস */}
                  {currentChapter.examFocus && currentChapter.examFocus.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        বোর্ড পরীক্ষার জন্য জরুরি পরামর্শ
                      </h4>
                      <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                        {currentChapter.examFocus.map((ef, eIdx) => (
                          <li key={eIdx}>{ef}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">রিভিশন তথ্য পাওয়া যায়নি।</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
