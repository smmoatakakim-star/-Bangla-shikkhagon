import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Search,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Layers,
  Tag,
  BookOpen,
  ArrowRight,
  Filter,
  GraduationCap,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FORMULA_BANK } from '../data/formulaBankData';
import { FormulaItem, ClassId, AcademicGroup } from '../types';

export const FormulaBankPage: React.FC = () => {
  const { pageParams, navigate } = useApp();
  const initialClass = pageParams?.targetClass as ClassId | 'all' || 'all';

  const [selectedClass, setSelectedClass] = useState<ClassId | 'all'>(initialClass);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('formula_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('formula_bookmarks', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleCopy = (formulaText: string, id: string) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter formulas
  const filteredFormulas = useMemo(() => {
    return FORMULA_BANK.filter((item) => {
      const matchesClass = selectedClass === 'all' || item.classId === selectedClass;
      const matchesSubject = selectedSubject === 'all' || item.subjectId === selectedSubject;
      const matchesSearch =
        searchTerm.trim() === '' ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.formula && item.formula.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.chapterTitle && item.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.whenToUse && item.whenToUse.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

      return matchesClass && matchesSubject && matchesSearch;
    });
  }, [selectedClass, selectedSubject, searchTerm]);

  // Subject list from data
  const subjectOptions = useMemo(() => {
    const subs = new Map<string, string>();
    FORMULA_BANK.forEach((f) => {
      if (selectedClass === 'all' || f.classId === selectedClass) {
        subs.set(f.subjectId, f.subjectId);
      }
    });
    return Array.from(subs.keys());
  }, [selectedClass]);

  const subjectNamesBangla: Record<string, string> = {
    math: 'সাধারণ গণিত',
    higher_math: 'উচ্চতর গণিত (SSC)',
    higher_math_1st: 'উচ্চতর গণিত ১ম পত্র (HSC)',
    higher_math_2nd: 'উচ্চতর গণিত ২য় পত্র (HSC)',
    physics: 'পদার্থবিজ্ঞান (SSC)',
    physics_1st: 'পদার্থবিজ্ঞান ১ম পত্র (HSC)',
    physics_2nd: 'পদার্থবিজ্ঞান ২য় পত্র (HSC)',
    chemistry: 'রসায়ন (SSC)',
    chemistry_1st: 'রসায়ন ১ম পত্র (HSC)',
    chemistry_2nd: 'রসায়ন ২য় পত্র (HSC)',
    finance_1st: 'ফিন্যান্স ও ব্যাংকিং',
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 text-white p-6 md:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-amber-100 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-200" /> ডিজিটাল সূত্রভাণ্ডার ও সমীকরণ কোষ
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              এসএসসি ও এইচএসসি সূত্রভাণ্ডার
            </h1>
            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              গণিত, উচ্চতর গণিত, পদার্থবিজ্ঞান, রসায়ন ও ফিন্যান্সের সকল গুরুত্বপূর্ণ সূত্র, চলকের ব্যাখ্যা ও বাস্তব গাণিতিক প্রয়োগ এক প্ল্যাটফর্মে সাজানো।
            </p>

            <div className="flex flex-wrap gap-4 pt-1 text-xs sm:text-sm">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-200" />
                <span>{FORMULA_BANK.length}টি যাচাইকৃত সূত্র</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-200" />
                <span>{bookmarkedIds.size}টি বুকমার্ককৃত</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px]">
            <button
              onClick={() => navigate('ssc_dashboard')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-orange-900 font-bold shadow-lg hover:bg-amber-50 transition-all text-sm"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              এসএসসি ড্যাশবোর্ড
            </button>
            <button
              onClick={() => navigate('hsc_dashboard')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-semibold backdrop-blur-md border border-white/30 transition-all text-sm"
            >
              <Award className="w-4 h-4 text-blue-200" />
              এইচএসসি ড্যাশবোর্ড
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Class Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">শ্রেণি:</span>
            {[
              { id: 'all', label: 'সকল শ্রেণি' },
              { id: 'ssc', label: 'SSC (৯ম-১০ম)' },
              { id: 'hsc', label: 'HSC (১১শ-১২শ)' },
            ].map((cls) => (
              <button
                key={cls.id}
                onClick={() => {
                  setSelectedClass(cls.id as any);
                  setSelectedSubject('all');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedClass === cls.id
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cls.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="সূত্র বা কীওয়ার্ড অনুসন্ধান..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">বিষয়:</span>
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1 rounded-lg shrink-0 font-medium transition-all ${
              selectedSubject === 'all'
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            সকল বিষয়
          </button>
          {subjectOptions.map((subId) => (
            <button
              key={subId}
              onClick={() => setSelectedSubject(subId)}
              className={`px-3 py-1 rounded-lg shrink-0 font-medium transition-all ${
                selectedSubject === subId
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {subjectNamesBangla[subId] || subId}
            </button>
          ))}
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            সূত্রের তালিকা ({filteredFormulas.length})
          </h2>
          <span className="text-xs text-slate-700 dark:text-slate-300">
            ক্লিক করে সূত্র কপি করুন
          </span>
        </div>

        {filteredFormulas.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">কোনো সূত্র পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 max-w-sm mx-auto">
              অনুগ্রহ করে অন্য শব্দ বা ফিল্টার দিয়ে পুনরায় চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSubject('all');
                setSelectedClass('all');
              }}
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFormulas.map((item) => {
              const isCopied = copiedId === item.id;
              const isBookmarked = bookmarkedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.classId === 'ssc'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : item.classId === 'hsc'
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            {item.classId === 'ssc' ? 'SSC' : item.classId === 'hsc' ? 'HSC' : item.classId}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {item.subjectName || subjectNamesBangla[item.subjectId] || item.subjectId}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                          {item.name}
                        </h3>
                        {item.chapterTitle && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {item.chapterTitle}
                          </p>
                        )}
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark(item.id)}
                        className={`p-2 rounded-xl transition-all ${
                          isBookmarked
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                            : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={isBookmarked ? 'বুকমার্ক সরানো' : 'বুকমার্কে যোগ করুন'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-5 h-5 fill-amber-500" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Formula Display Box */}
                    <div className="relative group bg-amber-50/60 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-900/40 rounded-xl p-4 text-center font-mono text-base sm:text-lg font-bold text-amber-950 dark:text-amber-200 tracking-wide overflow-x-auto shadow-inner">
                      {item.formula}

                      {/* Copy Action button */}
                      <button
                        onClick={() => handleCopy(item.formula, item.id)}
                        className="absolute right-2 top-2 p-1.5 rounded-lg bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 text-xs flex items-center gap-1 shadow-xs transition-all opacity-80 group-hover:opacity-100"
                        title="সূত্র কপি করুন"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[10px] text-emerald-600 font-sans">কপি হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-sans">কপি</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* When To Use / Explanation */}
                    {item.whenToUse && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">কখন ব্যবহার করবেন: </span>
                        {item.whenToUse}
                      </p>
                    )}

                    {/* Symbols & Meanings */}
                    {item.symbols && item.symbols.length > 0 && (
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          চলক পরিচিতি ও একক: {item.unit && <span className="font-normal text-slate-500">(একক: {item.unit})</span>}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                          {item.symbols.map((s, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded text-[10px]">
                                {s.symbol}
                              </span>
                              <span className="truncate">= {s.meaning}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Worked Example */}
                    {item.example && (
                      <div className="text-xs text-slate-700 dark:text-slate-300 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 space-y-1">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                          উদাহরণ প্রয়োগ:
                        </span>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{item.example.problem}</p>
                        {item.example.given && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            <span className="font-semibold">দেওয়া আছে:</span> {item.example.given}
                          </p>
                        )}
                        {item.example.solution && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            <span className="font-semibold">সমাধান:</span> {item.example.solution}
                          </p>
                        )}
                        <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                          উত্তর: {item.example.answer}
                        </p>
                      </div>
                    )}

                    {/* Warning or Common Mistake */}
                    {item.warningOrMistake && (
                      <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/40">
                        <span className="font-bold">সতর্কতা: </span>
                        {item.warningOrMistake}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {item.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
