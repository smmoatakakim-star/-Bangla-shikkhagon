import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Copy,
  Check,
  RotateCcw,
  Play,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId, SubjectId, CreativeQuestion } from '../types';
import { ALL_CLASSES, ALL_SUBJECTS, ALL_CHAPTERS } from '../data/curriculumData';
import {
  getCreativeQuestions,
  CREATIVE_QUESTION_STATS,
  CREATIVE_QUESTION_GUIDE,
} from '../data/creativeQuestionData';

export const CreativeQuestionsPage: React.FC = () => {
  const { pageParams, navigate } = useApp();

  const initialClass = (pageParams?.targetClass as ClassId) || 'all';

  // Filters
  const [selectedClass, setSelectedClass] = useState<ClassId | 'all'>(initialClass);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'bank' | 'guide' | 'practice'>('bank');

  // UI State: expanded answers & copies
  const [expandedAnswerIds, setExpandedAnswerIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Timed Practice State (21 minutes countdown)
  const [practiceActive, setPracticeActive] = useState(false);
  const [practiceSecondsLeft, setPracticeSecondsLeft] = useState(21 * 60);

  // Filtered Creative Questions
  const cqResult = useMemo(() => {
    return getCreativeQuestions({
      classId: selectedClass,
      subjectId: selectedSubject,
      chapterId: selectedChapter,
      difficulty: selectedDifficulty,
      searchTerm,
      page: currentPage,
      pageSize: 6,
    });
  }, [selectedClass, selectedSubject, selectedChapter, selectedDifficulty, searchTerm, currentPage]);

  const toggleExpand = (id: string) => {
    setExpandedAnswerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = (cq: CreativeQuestion) => {
    const text = `[উদ্দীপক]\n${cq.stimulus}\n\nক. ${cq.questionKa}\nখ. ${cq.questionKha}\nগ. ${cq.questionGa}\nঘ. ${cq.questionGha}\n\n[পূর্ণাঙ্গ উত্তর]\nক: ${cq.answerKa}\nখ: ${cq.answerKha}\nগ: ${cq.answerGa}\nঘ: ${cq.answerGha}`;
    navigator.clipboard.writeText(text);
    setCopiedId(cq.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Timer logic for Practice Mode
  React.useEffect(() => {
    let timer: any = null;
    if (practiceActive && practiceSecondsLeft > 0) {
      timer = setInterval(() => {
        setPracticeSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [practiceActive, practiceSecondsLeft]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-900 via-rose-950 to-slate-900 p-6 sm:p-10 text-white shadow-xl">
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NCTB আদর্শ ৪০,০০০+ সৃজনশীল প্রশ্ন (CQ) মাস্টার হাব</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                ৪০,০০০+ সৃজনশীল প্রশ্ন ও সমাধান ব্যাংক
              </h1>
              <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed">
                ৫ম শ্রেণি থেকে এইচএসসি পর্যন্ত প্রতিটি বিষয়ের উদ্দীপক, ক-খ-গ-ঘ প্রশ্ন, ধাপে ধাপে
                নম্বরভিত্তিক আদর্শ উত্তর এবং ২১ মিনিটে ১০ নম্বর পাওয়ার লেখার গাইড।
              </p>
            </div>

            {/* Total Counters */}
            <div className="flex flex-col gap-2 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center">
                <div className="text-2xl sm:text-3xl font-black text-rose-300">৪০,০০০+</div>
                <div className="text-xs text-rose-200">মোট সৃজনশীল প্রশ্ন</div>
              </div>
              <button
                onClick={() => setActiveTab('guide')}
                className="px-4 py-2 rounded-xl bg-white text-rose-950 font-bold text-xs shadow-md hover:bg-rose-50 transition"
              >
                সৃজনশীল লেখার গাইড ➔
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          {[
            { id: 'bank', label: 'সৃজনশীল প্রশ্ন ব্যাংক (CQ Bank)', icon: FileText },
            { id: 'guide', label: 'কীভাবে লিখতে হয় (Writing Guide)', icon: Lightbulb },
            { id: 'practice', label: '২১ মিনিট প্র্যাকটিস টেস্ট (Timed Exam)', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: QUESTION BANK */}
        {activeTab === 'bank' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Class selector */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500 mr-1">শ্রেণি:</span>
                  {[
                    { id: 'all', label: 'সকল' },
                    { id: 'class-5', label: '৫ম' },
                    { id: 'class-6', label: '৬ষ্ঠ' },
                    { id: 'class-7', label: '৭ম' },
                    { id: 'class-8', label: '৮ম' },
                    { id: 'class-9', label: '৯ম' },
                    { id: 'class-10', label: '১০ম' },
                    { id: 'ssc', label: 'SSC' },
                    { id: 'hsc', label: 'HSC' },
                  ].map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => {
                        setSelectedClass(cls.id as any);
                        setSelectedSubject('all');
                        setSelectedChapter('all');
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedClass === cls.id
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {cls.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="উদ্দীপক বা বিষয় অনুসন্ধান..."
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Sub-Filters */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">কঠিন্যতা:</span>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => {
                      setSelectedDifficulty(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value="all">সকল মান</option>
                    <option value="easy">সহজ (Easy)</option>
                    <option value="medium">মধ্যম (Medium)</option>
                    <option value="hard">উচ্চতর (Hard)</option>
                  </select>
                </div>
                <div className="ml-auto text-xs text-slate-400 font-semibold">
                  প্রদর্শিত: {cqResult.totalCount.toLocaleString('bn-BD')}টির মধ্যে{' '}
                  {cqResult.items.length}টি প্রশ্ন
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {cqResult.items.map((cq) => {
                const isExpanded = expandedAnswerIds.has(cq.id);
                return (
                  <div
                    key={cq.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 rounded-3xl space-y-5 shadow-sm hover:border-rose-400/40 transition-all"
                  >
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900">
                          {cq.classId?.toUpperCase()} • {cq.subjectName || cq.subjectId}
                        </span>
                        <span className="text-slate-500 font-semibold">{cq.chapterTitle}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
                          পূর্ণমান: ১০ নম্বর
                        </span>
                        <button
                          onClick={() => handleCopy(cq)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition"
                          title="প্রশ্ন কপি করুন"
                        >
                          {copiedId === cq.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Topic */}
                    {cq.topic && (
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        বিষয়বস্তু: {cq.topic}
                      </div>
                    )}

                    {/* Stimulus (উদ্দীপক) */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-200/80 dark:border-slate-700/80 text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-serif">
                      <strong className="text-amber-800 dark:text-amber-400 font-sans">
                        উদ্দীপক:
                      </strong>{' '}
                      {cq.stimulus}
                    </div>

                    {/* Questions Part (ক, খ, গ, ঘ) */}
                    <div className="space-y-2.5 text-sm">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                        <span className="font-bold text-rose-600 shrink-0">ক.</span>
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {cq.questionKa}
                        </span>
                        <span className="ml-auto text-xs text-slate-400 font-bold shrink-0">১</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                        <span className="font-bold text-rose-600 shrink-0">খ.</span>
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {cq.questionKha}
                        </span>
                        <span className="ml-auto text-xs text-slate-400 font-bold shrink-0">২</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                        <span className="font-bold text-rose-600 shrink-0">গ.</span>
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {cq.questionGa}
                        </span>
                        <span className="ml-auto text-xs text-slate-400 font-bold shrink-0">৩</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                        <span className="font-bold text-rose-600 shrink-0">ঘ.</span>
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {cq.questionGha}
                        </span>
                        <span className="ml-auto text-xs text-slate-400 font-bold shrink-0">৪</span>
                      </div>
                    </div>

                    {/* Marking Guide Preview */}
                    <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      💡 <strong>নম্বর বণ্টন ও নির্দেশনা:</strong> {cq.markingGuide}
                    </div>

                    {/* Expand Answer Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => toggleExpand(cq.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'উত্তর লুকান' : 'সম্পূর্ণ আদর্শ উত্তর দেখুন'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Expanded Model Answer */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
                        <h4 className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>বোর্ড পরীক্ষার জন্য নির্ধারিত আদর্শ সমাধান:</span>
                        </h4>

                        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong className="text-slate-900 dark:text-white font-sans">
                              \'ক\' এর উত্তর (জ্ঞানমূলক - ১ নম্বর):
                            </strong>
                            <p className="mt-1 whitespace-pre-line">{cq.answerKa}</p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong className="text-slate-900 dark:text-white font-sans">
                              \'খ\' এর উত্তর (অনুধাবনমূলক - ২ নম্বর):
                            </strong>
                            <p className="mt-1 whitespace-pre-line">{cq.answerKha}</p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong className="text-slate-900 dark:text-white font-sans">
                              \'গ\' এর উত্তর (প্রয়োগমূলক - ৩ নম্বর):
                            </strong>
                            <p className="mt-1 whitespace-pre-line">{cq.answerGa}</p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <strong className="text-slate-900 dark:text-white font-sans">
                              \'ঘ\' এর উত্তর (উচ্চতর দক্ষতা - ৪ নম্বর):
                            </strong>
                            <p className="mt-1 whitespace-pre-line">{cq.answerGha}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {cqResult.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  পূর্ববর্তী
                </button>
                <span className="text-xs font-semibold text-slate-500 px-3">
                  পৃষ্ঠা {currentPage.toLocaleString('bn-BD')} /{' '}
                  {cqResult.totalPages.toLocaleString('bn-BD')}
                </span>
                <button
                  disabled={currentPage >= cqResult.totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(cqResult.totalPages, p + 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  পরবর্তী
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WRITING GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Guide Header */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                {CREATIVE_QUESTION_GUIDE.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {CREATIVE_QUESTION_GUIDE.subtitle}
              </p>

              {/* Time Rule Box */}
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
                <h3 className="text-base font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>২১ মিনিট রুল (Time Allocation Rule)</span>
                </h3>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                  {CREATIVE_QUESTION_GUIDE.timeRule.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                  {CREATIVE_QUESTION_GUIDE.timeRule.breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-amber-200/60 dark:border-slate-700 text-center"
                    >
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {item.part}
                      </div>
                      <div className="text-emerald-600 font-extrabold text-xs mt-1">
                        {item.time}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.mark}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* In-depth 4 Parts breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CREATIVE_QUESTION_GUIDE.partsGuide.map((part, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                      {part.part}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-bold">
                      {part.marks} নম্বর
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <strong className="text-slate-500">উত্তর দৈর্ঘ্য:</strong> {part.targetLines}
                    </div>
                    <div>
                      <strong className="text-slate-500">প্যারা সূত্র:</strong> {part.formula}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {part.description}
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs space-y-1 font-serif">
                    <strong className="text-emerald-700 dark:text-emerald-400 font-sans">
                      আদর্শ উদাহরণ:
                    </strong>
                    <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                      {part.example}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-xs text-slate-700 dark:text-slate-300">
                      গুরুত্বপূর্ণ টিপস:
                    </strong>
                    <ul className="list-disc pl-4 text-xs text-slate-500 space-y-1">
                      {part.tips.map((t, tIdx) => (
                        <li key={tIdx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Common Mistakes to Avoid */}
            <div className="bg-rose-50 dark:bg-rose-950/30 p-6 rounded-3xl border border-rose-200 dark:border-rose-900 space-y-3">
              <h3 className="text-base font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>সৃজনশীল লেখায় সচরাচর যে ভুলগুলো নম্বর কেটে দেয়:</span>
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-rose-800 dark:text-rose-300">
                {CREATIVE_QUESTION_GUIDE.commonMistakes.map((m, mIdx) => (
                  <li key={mIdx}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: TIMED PRACTICE */}
        {activeTab === 'practice' && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  ২১ মিনিট সৃজনশীল লেখা অনুশীলন সিমুলেটর
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  বোর্ড পরীক্ষার জন্য নির্ধারিত ২১ মিনিটের টাইমার চালু করে খাতায় লিখে অনুশীলন করুন
                </p>
              </div>

              {/* Countdown Display */}
              <div className="flex items-center gap-3">
                <div className="text-3xl font-mono font-black text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-4 py-2 rounded-2xl border border-rose-200 dark:border-rose-900">
                  {formatTimer(practiceSecondsLeft)}
                </div>
                <button
                  onClick={() => {
                    setPracticeActive(!practiceActive);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition ${
                    practiceActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {practiceActive ? 'পজ করুন' : 'টাইমার শুরু করুন'}
                </button>
                <button
                  onClick={() => {
                    setPracticeActive(false);
                    setPracticeSecondsLeft(21 * 60);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 transition"
                  title="রিসেট"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Random Practice CQ Display */}
            {cqResult.items[0] && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-rose-600">অনুশীলনের জন্য নির্বাচিত প্রশ্ন:</div>
                <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 font-serif text-sm">
                  <strong>উদ্দীপক:</strong> {cqResult.items[0].stimulus}
                </div>
                <div className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <div>ক. {cqResult.items[0].questionKa} (১ নম্বর)</div>
                  <div>খ. {cqResult.items[0].questionKha} (২ নম্বর)</div>
                  <div>গ. {cqResult.items[0].questionGa} (৩ নম্বর)</div>
                  <div>ঘ. {cqResult.items[0].questionGha} (৪ নম্বর)</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
