import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  GraduationCap,
  Award,
  Search,
  Sparkles,
  ArrowRight,
  Heart,
  MessageSquare,
  Bookmark,
  CheckCircle,
  CheckCircle2,
  XCircle,
  RotateCw,
  HelpCircle,
  Clock,
  Compass,
  Zap,
  TrendingUp,
  Languages,
  Globe,
  Calculator,
  Atom,
  Landmark,
  RotateCcw,
  Bot,
  Play,
  Video as VideoIcon,
  Moon,
  Users,
  Share2,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useVoiceGuide } from '../context/VoiceGuideContext';
import { ClassId, SubjectId, QuizQuestion } from '../types';
import { allNctbMcqList } from '../data/mcq';
import {
  getAllPlatformMcqs,
  getTotalPlatformMcqCount,
  getPlatformMcqsByClass,
  getAllSscMcqs,
  getAllHscMcqs,
} from '../data/academyMcqData';

const toBengaliDigits = (num: number): string => {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bn[parseInt(d, 10)]);
};

export const HomePage: React.FC = () => {
  const {
    classes,
    subjects,
    chapters,
    lessons,
    quizzes,
    posts,
    navigate,
    toggleLikePost,
    isItemSaved,
    toggleSaveItem,
    setSearchQuery,
    toggleBookmarkQuestion,
    isQuestionBookmarked,
    recordWrongQuestion,
  } = useApp();

  const { isSpeaking, replay, isVoiceEnabled } = useVoiceGuide();

  const [searchInput, setSearchInput] = useState('');
  const [showEidModal, setShowEidModal] = useState(false);

  // Live MCQ Showcase State
  const [mcqCategory, setMcqCategory] = useState<'featured' | 'middle' | 'secondary' | 'ssc' | 'hsc'>('featured');
  const [mcqPageOffset, setMcqPageOffset] = useState(0);
  const [selectedHomeAnswers, setSelectedHomeAnswers] = useState<Record<string, number>>({});

  // Dynamic calculations across all NCTB, SSC & HSC MCQs
  const totalPlatformMcqs = useMemo(() => getTotalPlatformMcqCount(), []);

  const categoryQuestions = useMemo(() => {
    switch (mcqCategory) {
      case 'middle':
        return allNctbMcqList.filter((q) => ['class-6', 'class-7', 'class-8'].includes(q.classId));
      case 'secondary':
        return allNctbMcqList.filter((q) => ['class-9', 'class-10'].includes(q.classId));
      case 'ssc':
        return getAllSscMcqs();
      case 'hsc':
        return getAllHscMcqs();
      case 'featured':
      default:
        return getAllPlatformMcqs();
    }
  }, [mcqCategory]);

  const displayedHomeQuestions = useMemo(() => {
    if (!categoryQuestions || categoryQuestions.length === 0) return [];
    const count = 3;
    const startIndex = (mcqPageOffset * count) % categoryQuestions.length;
    let slice = categoryQuestions.slice(startIndex, startIndex + count);
    if (slice.length < count) {
      slice = [...slice, ...categoryQuestions.slice(0, count - slice.length)];
    }
    return slice;
  }, [categoryQuestions, mcqPageOffset]);

  const handleSelectHomeOption = (q: QuizQuestion, optIndex: number) => {
    if (selectedHomeAnswers[q.id] !== undefined) return;
    setSelectedHomeAnswers((prev) => ({ ...prev, [q.id]: optIndex }));
    if (optIndex !== q.correctAnswerIndex) {
      recordWrongQuestion(q);
    }
  };

  const handleNextHomeQuestions = () => {
    setMcqPageOffset((prev) => prev + 1);
  };

  const getSubjectName = (subId?: string) => {
    if (!subId) return 'সাধারণ বিষয়';
    const sub = subjects.find((s) => s.id === subId);
    if (sub) return sub.name;
    const map: Record<string, string> = {
      bangla: 'বাংলা',
      english: 'ইংরেজি',
      math: 'সাধারণ গণিত',
      science: 'বিজ্ঞান',
      bgs: 'বাংলাদেশ ও বিশ্বপরিচয়',
      ict: 'তথ্য ও যোগাযোগ প্রযুক্তি',
      physics: 'পদার্থবিজ্ঞান',
      chemistry: 'রসায়ন',
      biology: 'জীববিজ্ঞান',
      higher_math: 'উচ্চতর গণিত',
      accounting: 'হিসাববিজ্ঞান',
      finance: 'ফিন্যান্স ও ব্যাংকিং',
      economics: 'অর্থনীতি',
      civics: 'পৌরনীতি ও সুশাসন',
    };
    return map[subId.toLowerCase()] || subId;
  };

  const getClassName = (clsId?: string) => {
    if (!clsId) return '';
    if (clsId === 'ssc') return 'এসএসসি (SSC)';
    if (clsId === 'hsc') return 'এইচএসসি (HSC)';
    return clsId.replace('class-', '') + 'ম শ্রেণি';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      navigate('search', { q: searchInput.trim() });
    }
  };

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Languages':
        return <Languages className="w-4.5 h-4.5 text-rose-500" />;
      case 'Globe':
        return <Globe className="w-4.5 h-4.5 text-sky-500" />;
      case 'Calculator':
        return <Calculator className="w-4.5 h-4.5 text-amber-500" />;
      case 'Atom':
        return <Atom className="w-4.5 h-4.5 text-emerald-500" />;
      case 'Landmark':
      default:
        return <Landmark className="w-4.5 h-4.5 text-indigo-500" />;
    }
  };

  const getClassIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Award':
      default:
        return <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  const popularChapters = chapters.filter((c) => c.isPopular).slice(0, 4);
  const popularQuizzes = quizzes.filter((q) => q.isPopular).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  // Group unique subjects for compact display
  const uniqueSubjects = [
    {
      id: 'bangla' as SubjectId,
      name: 'বাংলা',
      subtitle: 'সাহিত্য ও ব্যাকরণ',
      icon: 'Languages',
      color: 'hover:border-rose-400 bg-rose-50/50 dark:bg-rose-950/20',
    },
    {
      id: 'english' as SubjectId,
      name: 'English',
      subtitle: 'Grammar & Writing',
      icon: 'Globe',
      color: 'hover:border-sky-400 bg-sky-50/50 dark:bg-sky-950/20',
    },
    {
      id: 'math' as SubjectId,
      name: 'গণিত',
      subtitle: 'পাটি, বীজ ও জ্যামিতি',
      icon: 'Calculator',
      color: 'hover:border-amber-400 bg-amber-50/50 dark:bg-amber-950/20',
    },
    {
      id: 'science' as SubjectId,
      name: 'বিজ্ঞান',
      subtitle: 'অনুসন্ধানী বিজ্ঞান',
      icon: 'Atom',
      color: 'hover:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20',
    },
    {
      id: 'bgs' as SubjectId,
      name: 'বি ও বি প',
      subtitle: 'বাংলাদেশ ও বিশ্বপরিচয়',
      icon: 'Landmark',
      color: 'hover:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20',
    },
    {
      id: 'physics' as SubjectId,
      name: 'পদার্থবিজ্ঞান',
      subtitle: 'বলবিদ্যা ও আলো',
      icon: 'Atom',
      color: 'hover:border-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20',
    },
    {
      id: 'chemistry' as SubjectId,
      name: 'রসায়ন',
      subtitle: 'গঠন ও বিক্রিয়া',
      icon: 'Atom',
      color: 'hover:border-teal-400 bg-teal-50/50 dark:bg-teal-950/20',
    },
    {
      id: 'biology' as SubjectId,
      name: 'জীববিজ্ঞান',
      subtitle: 'কোষ ও জিনতত্ত্ব',
      icon: 'Languages',
      color: 'hover:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-full overflow-x-hidden touch-pan-y">
      {/* 1. Welcome Hero Banner - Compact & Clean */}
      <section
        id="home-hero-banner"
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white shadow-md shadow-emerald-900/10 px-4 py-5 sm:px-8 sm:py-7"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto text-center space-y-4">
          {/* Controller Identity Badge (At the top of hero banner as marked by user) */}
          <div className="flex items-center justify-center">
            <div
              id="hero-controller-identity"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/40 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-[11px] sm:text-xs font-medium tracking-wide shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="font-bold text-white tracking-wide">Controller — Mustakim</span>
              <span className="text-emerald-200/90 text-[10px] sm:text-[11px]">| কন্ট্রোলার — মুস্তাকিম</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-emerald-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>৬ষ্ঠ থেকে ১২শ শ্রেণির পূর্ণাঙ্গ ডিজিটাল স্কুল প্ল্যাটফর্ম</span>
            </div>

            <button
              id="hero-voice-guide-btn"
              onClick={replay}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 hover:bg-emerald-950/60 backdrop-blur-md text-[11px] sm:text-xs font-bold text-amber-300 border border-amber-300/30 transition shadow-xs cursor-pointer"
              title="বাংলা ভয়েস গাইড শুনুন"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-amber-200' : ''}`} />
              <span>{isSpeaking ? 'ভয়েস চলছে...' : '🔊 ভয়েস গাইড শুনুন'}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            বাংলা শিক্ষাগর — সহজে শিখি, জ্ঞান বাড়াই
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            NCTB কারিকুলাম ও বোর্ড সিলেবাস অনুযায়ী অধ্যায়ভিত্তিক পাঠ, {toBengaliDigits(totalPlatformMcqs)}+ প্রশ্নব্যাংক, স্বয়ংক্রিয় মডেল টেস্ট ও লাইভ কুইজ।
          </p>

          {/* Compact Search box */}
          <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto pt-1">
            <div className="relative flex items-center">
              <input
                id="hero-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="যেকোনো বিষয় খুঁজুন... (যেমন: সালোকসংশ্লেষণ, ত্রিকোণমিতি)"
                className="w-full pl-4 pr-24 py-2.5 rounded-xl bg-white text-slate-800 placeholder-slate-400 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-xs sm:text-sm font-medium"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>অনুসন্ধান</span>
              </button>
            </div>
          </form>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 pt-3 max-w-xs sm:max-w-sm mx-auto text-center border-t border-white/15">
            <div>
              <div className="text-lg sm:text-xl font-bold">{toBengaliDigits(classes.length)}টি</div>
              <div className="text-[10px] text-emerald-200">শ্রেণি (৬ষ্ঠ-১২শ)</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold">{toBengaliDigits(totalPlatformMcqs)}+</div>
              <div className="text-[10px] text-emerald-200">প্রশ্ন ও ব্যাখ্যা</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold">{toBengaliDigits(chapters.length)}+</div>
              <div className="text-[10px] text-emerald-200">অধ্যায় ও টেস্ট</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Education Assistant Spotlight Banner - Compact */}
      <section
        id="home-ai-assistant-spotlight"
        className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-emerald-500/20 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI শিক্ষা সহায়ক (Gemini Powered)</span>
            </div>
            <h2 className="text-base sm:text-xl font-bold tracking-tight">
              পড়াশোনার যেকোনো কঠিন বিষয়ে তাৎক্ষণিক AI সহায়তা নাও
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              সালোকসংশ্লেষণ, পিথাগোরাস, নিউটনের গতিসূত্র কিংবা গ্রামার—সহজ বাংলায় সমাধান ও রিভিশন নোট তৈরি করো।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              id="home-open-ai-chat-btn"
              onClick={() => navigate('ai_chat')}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI শিক্ষককে প্রশ্ন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="home-open-ai-notes-btn"
              onClick={() =>
                navigate('ai_chat', {
                  query: '৬ষ্ঠ থেকে ১২শ শ্রেণির জন্য গুরুত্বপূর্ণ অধ্যায়ের রিভিশন নোট তৈরি করে দাও',
                })
              }
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition"
            >
              নোট তৈরি
            </button>
          </div>
        </div>
      </section>

      {/* Front Feature Cards: SSC Hub, HSC Hub, Formula Bank, Eid Special - Compact 2-column mobile */}
      <section id="front-feature-cards-section" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <GraduationCap className="w-4.5 h-4.5 text-emerald-600" />
            <span>স্পেশাল একাডেমি ও ফিচার হাব</span>
          </h2>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            মোবাইল ফ্রেন্ডলি ভিউ
          </span>
        </div>

        {/* 2-column card grid on mobile, 4-column on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {/* 1. SSC Academy (SSC Hub) */}
          <div
            id="home-ssc-hub-card"
            onClick={() => navigate('ssc_dashboard')}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-3 sm:p-3.5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between min-h-[135px] sm:min-h-[150px]"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/20 backdrop-blur-xs border border-white/20">
                  ৯ম ও ১০ম শ্রেণি
                </span>
                <GraduationCap className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:translate-x-0.5 transition-transform leading-snug">
                এসএসসি একাডেমি
              </h3>
              <p className="text-[10px] text-emerald-100 leading-tight line-clamp-2">
                ১৭টি বিষয়, বিজ্ঞান/মানবিক/ব্যবসা, CQ প্রশ্ন ও মডেল টেস্ট।
              </p>
            </div>
            <div className="pt-2 mt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-bold text-emerald-100 group-hover:text-white">
              <span>প্রবেশ করুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 2. HSC Academy (HSC Hub) */}
          <div
            id="home-hsc-hub-card"
            onClick={() => navigate('hsc_dashboard')}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-700 to-blue-900 text-white p-3 sm:p-3.5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between min-h-[135px] sm:min-h-[150px]"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/20 backdrop-blur-xs border border-white/20">
                  ১১শ ও ১২শ শ্রেণি
                </span>
                <Award className="w-5 h-5 text-blue-200 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:translate-x-0.5 transition-transform leading-snug">
                এইচএসসি একাডেমি
              </h3>
              <p className="text-[10px] text-blue-100 leading-tight line-clamp-2">
                ২১টি বিষয়ের ১ম ও ২য় পত্র, উচ্চতর গণিত, বিজ্ঞান ও এডমিশন।
              </p>
            </div>
            <div className="pt-2 mt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-bold text-blue-100 group-hover:text-white">
              <span>প্রবেশ করুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 3. Formula Bank / Digital Formula Book */}
          <div
            id="home-formula-hub-card"
            onClick={() => navigate('formula_bank')}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 text-white p-3 sm:p-3.5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between min-h-[135px] sm:min-h-[150px]"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/20 backdrop-blur-xs border border-white/20">
                  ফর্মুলা বুক
                </span>
                <Calculator className="w-5 h-5 text-amber-200 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:translate-x-0.5 transition-transform leading-snug">
                ডিজিটাল সূত্রভাণ্ডার
              </h3>
              <p className="text-[10px] text-amber-100 leading-tight line-clamp-2">
                গণিত, উচ্চতর গণিত, পদার্থ ও রসায়নের সকল সূত্র ও চলক।
              </p>
            </div>
            <div className="pt-2 mt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-bold text-amber-100 group-hover:text-white">
              <span>সূত্র দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 4. Eid Special (ঈদ স্পেশাল) - Compact & Festive */}
          <div
            id="home-eid-special-card"
            onClick={() => setShowEidModal(true)}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-600 via-pink-600 to-purple-700 text-white p-3 sm:p-3.5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between min-h-[135px] sm:min-h-[150px]"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/25 backdrop-blur-xs border border-white/25 text-amber-200 flex items-center gap-1">
                  <Moon className="w-2.5 h-2.5 fill-amber-200" />
                  ঈদ আয়োজন
                </span>
                <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:translate-x-0.5 transition-transform leading-snug">
                স্পেশাল
              </h3>
              <p className="text-[10px] text-rose-100 leading-tight line-clamp-2">
                উৎসবকালীন রিভিশন, স্পেশাল মডেল টেস্ট ও কুইজ চ্যালেঞ্জ।
              </p>
            </div>
            <div className="pt-2 mt-2 border-t border-white/20 flex items-center justify-between text-[10px] font-bold text-amber-200 group-hover:text-white">
              <span>অংশ নিন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 লাইভ MCQ প্রশ্নব্যাংক ও তাৎক্ষণিক প্র্যাকটিস শোকেস */}
      <section id="home-live-mcq-showcase" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>লাইভ MCQ প্রশ্নব্যাংক ও অনুশীলন</span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 mt-0.5">
              <span>বাছাইকৃত MCQ প্রশ্ন ও তাৎক্ষণিক যাচাই</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-800">
                {toBengaliDigits(totalPlatformMcqs)}+ টি প্রশ্ন
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              সরাসরি অপশনে ক্লিক করে উত্তর মেলাও এবং প্রতিটি প্রশ্নের সঠিক ব্যাখ্যা শিখে নাও।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('question_bank')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>সম্পূর্ণ প্রশ্নব্যাংক ({toBengaliDigits(totalPlatformMcqs)}+)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Tabs: [বাছাইকৃত সেরা] [৬ষ্ঠ-৮ম] [৯ম-১০ম] [এসএসসি একাডেমি (১১৫০+)] [এইচএসসি একাডেমি (৬৯৩+)] */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'featured', label: 'বাছাইকৃত সেরা', count: totalPlatformMcqs },
            { id: 'middle', label: '৬ষ্ঠ — ৮ম শ্রেণি', count: 636 },
            { id: 'secondary', label: '৯ম — ১০ম শ্রেণি', count: 430 },
            { id: 'ssc', label: 'এসএসসি (SSC)', count: 1150 },
            { id: 'hsc', label: 'এইচএসসি (HSC)', count: 693 },
          ].map((tab) => {
            const isActive = mcqCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setMcqCategory(tab.id as any);
                  setMcqPageOffset(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {toBengaliDigits(tab.count)}+
                </span>
              </button>
            );
          })}
        </div>

        {/* 3 Interactive Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {displayedHomeQuestions.map((q, idx) => {
            const userChoice = selectedHomeAnswers[q.id];
            const isAnswered = userChoice !== undefined;
            const isCorrect = userChoice === q.correctAnswerIndex;
            const isBookmarked = isQuestionBookmarked(q.id);
            const bengaliLetters = ['ক', 'খ', 'গ', 'ঘ'];

            return (
              <div
                key={q.id || `home-q-${idx}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {/* Badge header */}
                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                        {getSubjectName(q.subjectId)}
                      </span>
                      <span className="px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40">
                        {getClassName(q.classId)}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleBookmarkQuestion(q)}
                      title={isBookmarked ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন'}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                    </button>
                  </div>

                  {/* Question Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    <span className="text-emerald-600 dark:text-emerald-400 mr-1.5">
                      {toBengaliDigits(idx + 1)}.
                    </span>
                    {q.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userChoice === optIdx;
                      const isRightOption = optIdx === q.correctAnswerIndex;

                      let btnStyle = 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40';

                      if (isAnswered) {
                        if (isSelected && isCorrect) {
                          btnStyle = 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold ring-1 ring-emerald-500';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-800 dark:text-rose-200 font-bold ring-1 ring-rose-500';
                        } else if (isRightOption) {
                          btnStyle = 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                        } else {
                          btnStyle = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectHomeOption(q, optIdx)}
                          className={`w-full p-2 rounded-xl border text-left text-xs transition flex items-center justify-between gap-2 cursor-pointer disabled:cursor-default ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0 border border-slate-200 dark:border-slate-600">
                              {bengaliLetters[optIdx]}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </div>

                          {isAnswered && isRightOption && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {isAnswered && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1 animate-in fade-in">
                      <div className="font-bold flex items-center gap-1.5">
                        {isCorrect ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> চমৎকার! সঠিক উত্তর।
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> সঠিক উত্তর: {bengaliLetters[q.correctAnswerIndex]}. {q.options[q.correctAnswerIndex]}
                          </span>
                        )}
                      </div>
                      {q.explanation && (
                        <p className="text-slate-600 dark:text-slate-300 leading-snug">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>উৎস: {q.source || 'NCTB কারিকুলাম'}</span>
                  <button
                    onClick={() => navigate('question_bank', { classId: q.classId, subjectId: q.subjectId })}
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>এই বিষয়ের আরও প্রশ্ন</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer controls for MCQ showcase */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 border border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>প্রতিদিন নতুন নতুন প্রশ্ন চর্চা করে বোর্ড পরীক্ষার জন্য প্রস্তুত হও।</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNextHomeQuestions}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>অন্য প্রশ্ন দেখুন</span>
            </button>
            <button
              onClick={() => navigate('question_bank', { classId: mcqCategory === 'featured' ? 'class-6' : mcqCategory === 'middle' ? 'class-8' : mcqCategory === 'secondary' ? 'class-10' : mcqCategory })}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>প্রশ্নব্যাংকে আরও অনুশীলন</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Class Selection Section - Compact 2-col on mobile */}
      <section id="class-selection-section" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-emerald-600" />
              <span>শ্রেণি নির্বাচন করুন</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              তোমার শ্রেণি অনুযায়ী পাঠ ও কুইজ চর্চা করো
            </p>
          </div>
          <button
            onClick={() => navigate('classes')}
            className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>সবগুলো শ্রেণি</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Compact 2-col on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {classes.map((cls) => {
            return (
              <div
                key={cls.id}
                id={`class-card-${cls.id}`}
                onClick={() => navigate('subjects', { classId: cls.id })}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 sm:p-3 shadow-xs hover:shadow-sm hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:scale-105 transition-transform">
                      {getClassIcon(cls.iconName)}
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                      গ্রেড {cls.numericGrade}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                      {cls.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {cls.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                    <span className="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[9px]">
                      {toBengaliDigits(chapters.filter((c) => c.classId === cls.id).length || cls.totalChapters)} অধ্যায়
                    </span>
                    <span className="px-1 py-0.2 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[9px]">
                      {toBengaliDigits(getPlatformMcqsByClass(cls.id).length)}+ MCQ
                    </span>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>প্রবেশ করুন</span>
                  <div className="w-4 h-4 rounded bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2.5 Exam & Question Hub - Compact 2-column mobile */}
      <section id="exam-hub-section" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Zap className="w-4.5 h-4.5 text-amber-500" />
              <span>পরীক্ষা ও প্রশ্নব্যাংক হাব</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              প্রশ্নব্যাংক, মডেল টেস্ট ও প্রতিদিনের কুইজ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {/* Question Bank Card */}
          <div
            onClick={() => navigate('question_bank')}
            className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                  <HelpCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[9px] font-bold bg-white/25 px-1 py-0.5 rounded">
                  {toBengaliDigits(totalPlatformMcqs)}+ প্রশ্ন
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold">প্রশ্নব্যাংক</h3>
              <p className="text-[10px] text-indigo-100 line-clamp-1 leading-tight">
                অধ্যায়ভিত্তিক MCQ ও সঠিক ব্যাখ্যা।
              </p>
            </div>
            <div className="pt-2 mt-2 flex items-center justify-between text-[10px] font-bold text-white border-t border-white/20">
              <span>অনুশীলন</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Model Tests Card */}
          <div
            onClick={() => navigate('model_tests')}
            className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 text-white shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[9px] font-bold bg-white/25 px-1 py-0.5 rounded">
                  বোর্ড অনুরূপ
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold">মডেল টেস্ট</h3>
              <p className="text-[10px] text-purple-100 line-clamp-1 leading-tight">
                সময়নিয়ন্ত্রিত পূর্ণাঙ্গ মূল্যায়ন।
              </p>
            </div>
            <div className="pt-2 mt-2 flex items-center justify-between text-[10px] font-bold text-white border-t border-white/20">
              <span>টেস্ট দিন</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Daily Quiz Card */}
          <div
            onClick={() => navigate('daily_quiz')}
            className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[9px] font-bold bg-white/25 px-1 py-0.5 rounded">
                  প্রতিদিন নতুন
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold">ডেইলি কুইজ</h3>
              <p className="text-[10px] text-amber-100 line-clamp-1 leading-tight">
                ১০টি বাছাইকৃত প্রশ্নে মেধা যাচাই।
              </p>
            </div>
            <div className="pt-2 mt-2 flex items-center justify-between text-[10px] font-bold text-white border-t border-white/20">
              <span>আজকের কুইজ</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Wrong Questions Practice Card */}
          <div
            onClick={() => navigate('wrong_questions')}
            className="p-3 rounded-xl bg-gradient-to-br from-rose-600 to-rose-800 text-white shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                  <RotateCcw className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[9px] font-bold bg-white/25 px-1 py-0.5 rounded">
                  রিকভারি
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold">ভুল প্রশ্ন অনুশীলন</h3>
              <p className="text-[10px] text-rose-100 line-clamp-1 leading-tight">
                ব্যাখ্যাসহ পুনর্বার পরীক্ষা ও সংশোধন।
              </p>
            </div>
            <div className="pt-2 mt-2 flex items-center justify-between text-[10px] font-bold text-white border-t border-white/20">
              <span>সংশোধন</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Subjects Section - Compact 2-column mobile */}
      <section id="subjects-section" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-emerald-600" />
              <span>বিষয়সমূহ</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              বাংলা, ইংরেজি, গণিত, বিজ্ঞান ও অন্যান্য
            </p>
          </div>
          <button
            onClick={() => navigate('subjects')}
            className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>সকল বিষয়</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
          {uniqueSubjects.map((sub) => (
            <div
              key={sub.id}
              id={`subject-card-${sub.id}`}
              onClick={() => navigate('chapters', { subjectId: sub.id })}
              className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${sub.color} shadow-2xs hover:shadow-sm cursor-pointer transition text-center flex flex-col items-center justify-center gap-1.5 group`}
            >
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-2xs group-hover:scale-110 transition-transform">
                {getSubjectIcon(sub.icon)}
              </div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                {sub.name}
              </h4>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">
                {sub.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Popular Chapters - Compact 2-column mobile */}
      <section id="popular-chapters-section" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-amber-500" />
              <span>জনপ্রিয় অধ্যায়সমূহ</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              শিক্ষার্থীরা সবচেয়ে বেশি যে অধ্যায়গুলো চর্চা করছে
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {popularChapters.map((ch) => {
            const classObj = classes.find((c) => c.id === ch.classId);
            const lesson = lessons.find((l) => l.chapterId === ch.id);

            return (
              <div
                key={ch.id}
                id={`popular-chapter-${ch.id}`}
                onClick={() => {
                  if (lesson) {
                    navigate('lesson', { lessonId: lesson.id });
                  } else {
                    navigate('chapters', { subjectId: ch.subjectId, classId: ch.classId });
                  }
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs hover:shadow-xs hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {classObj ? classObj.name : 'শ্রেণি'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {ch.lessonCount} পাঠ
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-1 mt-1">
                    {ch.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-snug">
                    {ch.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between text-[10px] text-emerald-600 font-semibold">
                  <span>পাঠ শুরু</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Popular Quizzes - Compact */}
      <section id="popular-quizzes-section" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-purple-600" />
              <span>জনপ্রিয় কুইজসমূহ</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              নিজের পড়াশোনা যাচাই করে পরীক্ষার প্রস্তুতি নাও
            </p>
          </div>
          <button
            onClick={() => navigate('quiz')}
            className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>সব কুইজ</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {popularQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              id={`popular-quiz-${quiz.id}`}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                    {quiz.classId === 'class-6'
                      ? '৬ষ্ঠ শ্রেণি'
                      : quiz.classId === 'class-7'
                      ? '৭ম শ্রেণি'
                      : '৮ম শ্রেণি'}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {quiz.timeLimitMinutes || 10} মিনিট
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                  {quiz.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {quiz.description}
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  <span>{quiz.questions.length}টি প্রশ্ন</span>
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => navigate('quiz_play', { quizId: quiz.id })}
                  className="w-full py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Zap className="w-3 h-3" />
                  <span>কুইজ শুরু করুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Facebook / Social Community Callout Card (Requirement 13) */}
      <section
        id="community-social-card"
        className="rounded-2xl p-3.5 sm:p-4.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 dark:from-slate-900 dark:via-blue-950/25 dark:to-slate-900 border border-blue-200/70 dark:border-blue-900/40 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#1877F2] dark:text-blue-400">
              <Users className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wide">
                কমিউনিটি ও ফেসবুক গ্রুপ
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              বাংলা শিক্ষাগর অফিসিয়াল স্টাডি গ্রুপে যুক্ত হও
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
              সহপাঠী ও শিক্ষকদের সাথে প্রশ্ন শেয়ার করো, গুরুত্বপূর্ণ পরীক্ষার আপডেট ও পিডিএফ নোট ফ্রিতে সংগ্রহ করো।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#1877F2] hover:bg-blue-600 text-white text-[11px] font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <Share2 className="w-3 h-3" />
              <span>ফেসবুক গ্রুপ</span>
            </a>
            <button
              onClick={() => navigate('create_post')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-3 h-3" />
              <span>প্রশ্ন পোস্ট করুন</span>
            </button>
            <button
              onClick={() => navigate('posts')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition"
            >
              সব আলোচনা
            </button>
          </div>
        </div>
      </section>

      {/* 7. Latest Educational Posts Feed Snapshot - Compact */}
      <section id="latest-posts-section" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <MessageSquare className="w-4.5 h-4.5 text-teal-600" />
              <span>সর্বশেষ শিক্ষামূলক আলোচনা</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              সহপাঠী ও শিক্ষকদের টিপস ও জিজ্ঞাসা
            </p>
          </div>
          <button
            onClick={() => navigate('posts')}
            className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>সব পোস্ট</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {latestPosts.map((post) => {
            const isSaved = isItemSaved('post', post.id);

            return (
              <div
                key={post.id}
                id={`latest-post-${post.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  {/* Author line */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => navigate('profile', { userId: post.authorId })}
                    >
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block leading-tight">
                          {post.authorName}
                        </span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400">
                          {post.authorRole === 'teacher'
                            ? 'শিক্ষক'
                            : post.authorClass || 'শিক্ষার্থী'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {post.subjectName}
                    </span>
                  </div>

                  {/* Post content preview */}
                  <div
                    className="cursor-pointer space-y-1.5"
                    onClick={() => navigate('post_detail', { postId: post.id })}
                  >
                    {post.text && (
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug line-clamp-2 whitespace-pre-line">
                        {post.text}
                      </p>
                    )}

                    {/* Media preview */}
                    {(post.mediaType === 'video' || !!post.videoUrl) && (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <img
                          src={
                            post.videoThumbnail ||
                            post.imageUrl ||
                            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80'
                          }
                          alt="Video poster"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <Play className="w-3 h-3 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    )}

                    {(post.mediaType === 'image' || (!post.videoUrl && post.imageUrl)) && post.imageUrl && (
                      <div className="aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <img
                          src={post.imageUrl}
                          alt="Post preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Actions Bar */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className="flex items-center gap-1 hover:text-rose-500 transition"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          post.likes > 0 ? 'text-rose-500 fill-rose-500' : ''
                        }`}
                      />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => navigate('post_detail', { postId: post.id })}
                      className="flex items-center gap-1 hover:text-emerald-600 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.commentCount}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => toggleSaveItem('post', post.id)}
                    title={isSaved ? 'সংরক্ষণ বাতিল' : 'পোস্ট সংরক্ষণ করুন'}
                    className={`hover:text-emerald-600 transition ${
                      isSaved ? 'text-emerald-600' : ''
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Discreet & Professional Homepage Identity Section (Only on Homepage) */}
      <section
        id="homepage-controller-identity"
        className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center text-center pb-2"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 text-xs shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 tracking-wide">
            Controller — Mustakim
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
            • কন্ট্রোলার — মুস্তাকিম
          </span>
        </div>
      </section>

      {/* Eid Special Festive Interactive Modal (Requirement 12) */}
      {showEidModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden space-y-4">
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Moon className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    ঈদ মোবারক — বিশেষ আয়োজন
                  </h3>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                    উৎসবকালীন স্পেশাল ফ্রি রিভিশন প্যাক
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowEidModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ছুটির দিনে পড়াশোনার গতি ধরে রাখতে বাংলা শিক্ষাগরের পক্ষ থেকে থাকছে ঈদ স্পেশাল দ্রুত রিভিশন কুইজ, বিশেষ মডেল টেস্ট এবং সম্পূর্ণ সূত্রভাণ্ডার।
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowEidModal(false);
                  navigate('model_tests');
                }}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-between shadow-xs transition"
              >
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-200" />
                  <span>ঈদ স্পেশাল মেগা মডেল টেস্ট</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setShowEidModal(false);
                  navigate('daily_quiz');
                }}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold flex items-center justify-between shadow-xs transition"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>দৈনিক স্পেশাল কুইজ চ্যালেঞ্জ</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setShowEidModal(false);
                  navigate('formula_bank');
                }}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold flex items-center justify-between shadow-xs transition"
              >
                <span className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-200" />
                  <span>১০ মিনিটের সূত্র রিভিশন বুক</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => setShowEidModal(false)}
                className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
              >
                পরে অংশগ্রহণ করব
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
