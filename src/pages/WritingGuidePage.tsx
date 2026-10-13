import React, { useState, useMemo } from 'react';
import {
  PenTool,
  BookOpen,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  GraduationCap,
  Award,
  ChevronRight,
  Filter,
  FileText,
  MessageSquare,
  Mail,
  BookMarked,
  Printer,
  X,
  Share2,
  Check,
  Lightbulb,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WritingGuideItem, WritingCategory } from '../types';

export const WritingGuidePage: React.FC = () => {
  const { writingGuideList, realContentCounts, navigate } = useApp();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<WritingCategory | 'all' | 'english'>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected item modal
  const [selectedItem, setSelectedItem] = useState<WritingGuideItem | null>(null);

  // Categories list with verified labels & counts
  const categoriesList: {
    id: WritingCategory | 'all' | 'english';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count: number;
    badgeColor: string;
  }[] = [
    { id: 'all', label: 'সকল রচনা ও গাইড', icon: Layers, count: writingGuideList.filter((w) => w.status === 'published').length, badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' },
    { id: 'probondho', label: 'প্রবন্ধ', icon: BookOpen, count: realContentCounts.totalProbondho, badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
    { id: 'rochona', label: 'রচনা', icon: FileText, count: realContentCounts.totalRochona, badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
    { id: 'paragraph', label: 'অনুচ্ছেদ', icon: PenTool, count: realContentCounts.totalParagraph, badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    { id: 'bhabshomprosharon', label: 'ভাবসম্প্রসারণ', icon: Lightbulb, count: realContentCounts.totalBhabshomprosharon, badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
    { id: 'sarongsho', label: 'সারাংশ (গদ্য)', icon: BookMarked, count: realContentCounts.totalSarongsho, badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' },
    { id: 'sarmormo', label: 'সারমর্ম (পদ্য)', icon: Sparkles, count: realContentCounts.totalSarmormo, badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
    { id: 'letter', label: 'চিঠি', icon: Mail, count: realContentCounts.totalLetters, badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' },
    { id: 'personal_letter', label: 'ব্যক্তিগত চিঠি', icon: Mail, count: writingGuideList.filter((w) => w.status === 'published' && w.category === 'personal_letter').length, badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' },
    { id: 'application', label: 'আবেদনপত্র', icon: FileText, count: realContentCounts.totalApplications, badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' },
    { id: 'report', label: 'প্রতিবেদন', icon: Award, count: realContentCounts.totalReports, badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' },
    { id: 'dialogue', label: 'সংলাপ', icon: MessageSquare, count: realContentCounts.totalDialogues, badgeColor: 'bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-300' },
    { id: 'story', label: 'গল্প লেখা', icon: BookOpen, count: realContentCounts.totalStories, badgeColor: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300' },
    { id: 'completing_story', label: 'গল্প সম্পূর্ণকরণ', icon: BookOpen, count: writingGuideList.filter((w) => w.status === 'published' && w.category === 'completing_story').length, badgeColor: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300' },
    { id: 'english', label: '🇬🇧 English Writing', icon: Globe, count: realContentCounts.totalEnglishWriting, badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' },
  ];

  // Filtered writing guide items (only published items visible to students)
  const filteredItems = useMemo(() => {
    return writingGuideList.filter((item) => {
      if (item.status !== 'published') return false;

      // Category filter
      if (selectedCategory === 'english') {
        if (!item.category.startsWith('english_')) return false;
      } else if (selectedCategory === 'letter') {
        if (item.category !== 'letter' && item.category !== 'personal_letter') return false;
      } else if (selectedCategory === 'story') {
        if (item.category !== 'story' && item.category !== 'completing_story') return false;
      } else if (selectedCategory !== 'all') {
        if (item.category !== selectedCategory) return false;
      }

      // Class filter
      if (selectedClass !== 'all') {
        if (item.classId !== selectedClass) return false;
      }

      // Exam filter
      if (selectedExam !== 'all') {
        if (!item.exam.toLowerCase().includes(selectedExam.toLowerCase())) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inCategory = item.categoryLabel.toLowerCase().includes(q);
        const inContent = item.originalExample.toLowerCase().includes(q);
        const inIntro = item.introduction?.toLowerCase().includes(q) || false;
        const inMool = item.moolBhab?.toLowerCase().includes(q) || false;
        if (!inTitle && !inCategory && !inContent && !inIntro && !inMool) return false;
      }

      return true;
    });
  }, [writingGuideList, selectedCategory, selectedClass, selectedExam, searchQuery]);

  const handleAskAiAboutWriting = (item: WritingGuideItem) => {
    setSelectedItem(null);
    navigate('ai_chat', {
      query: `বাংলা লেখার গাইড থেকে '${item.title}' (${item.categoryLabel}) নিয়ে বিস্তারিত বুঝিয়ে দাও এবং পরীক্ষায় পূর্ণ নম্বর পাওয়ার জন্য বিশেষ লেখার কৌশল উল্লেখ করো।`,
    });
  };

  return (
    <div id="writing-guide-page" className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-8 rounded-3xl shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NCTB কারিকুলাম ও বোর্ড পরীক্ষার মানসম্মত গাইড</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[11px] font-semibold">
              শিক্ষাবর্ষ ২০২৬
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>✍️ বাংলা ও ইংরেজি লেখার গাইড</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            প্রবন্ধ, রচনা, অনুচ্ছেদ, ভাবসম্প্রসারণ, সারাংশ, সারমর্ম, চিঠি, আবেদনপত্র, প্রতিবেদন, সংলাপ, গল্প লেখা
            এবং English Paragraph, Application ও Dialogue-এর পূর্ণাঙ্গ পাঠ, লেখার আদর্শ কাঠামো ও ব্যবহারিক উদাহরণ।
          </p>

          {/* Quick Real Database Counts Grid */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 text-emerald-200 border border-white/10 font-bold flex items-center gap-1.5">
              <span>মোট প্রবন্ধ:</span>
              <span className="text-white font-black">{realContentCounts.totalProbondho}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 text-amber-200 border border-white/10 font-bold flex items-center gap-1.5">
              <span>অনুচ্ছেদ:</span>
              <span className="text-white font-black">{realContentCounts.totalParagraph}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 text-purple-200 border border-white/10 font-bold flex items-center gap-1.5">
              <span>ভাবসম্প্রসারণ:</span>
              <span className="text-white font-black">{realContentCounts.totalBhabshomprosharon}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 text-teal-200 border border-white/10 font-bold flex items-center gap-1.5">
              <span>সারাংশ:</span>
              <span className="text-white font-black">{realContentCounts.totalSarongsho}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 text-rose-200 border border-white/10 font-bold flex items-center gap-1.5">
              <span>সারমর্ম:</span>
              <span className="text-white font-black">{realContentCounts.totalSarmormo}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 text-sky-200 border border-white/10 font-bold flex items-center gap-1.5">
              <span>English Writing:</span>
              <span className="text-white font-black">{realContentCounts.totalEnglishWriting}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Switcher */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-emerald-600" />
            <span>লেখার বিভাগ নির্বাচন করুন:</span>
          </label>
          <span className="text-[11px] text-slate-400">প্রতিটি বিভাগ আলাদাভাবে সাজানো</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl font-bold shrink-0 transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-white/20 text-white' : cat.badgeColor
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filter Bar & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* 1. Class filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>শ্রেণি</span>
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">সকল শ্রেণি (৫ম — ১২শ)</option>
              <option value="class-5">৫ম শ্রেণি</option>
              <option value="class-6">৬ষ্ঠ শ্রেণি</option>
              <option value="class-7">৭ম শ্রেণি</option>
              <option value="class-8">৮ম শ্রেণি</option>
              <option value="class-9">৯ম শ্রেণি</option>
              <option value="class-10">১০ম শ্রেণি</option>
              <option value="ssc">এসএসসি (SSC)</option>
              <option value="hsc">এইচএসসি (HSC)</option>
            </select>
          </div>

          {/* 2. Exam filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>পরীক্ষা</span>
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">সকল পরীক্ষা</option>
              <option value="বার্ষিক">বার্ষিক পরীক্ষা ২০২৬</option>
              <option value="বোর্ড">বোর্ড পরীক্ষা (এসএসসি/এইচএসসি)</option>
              <option value="টেস্ট">টেস্ট / নির্বাচনী পরীক্ষা</option>
            </select>
          </div>

          {/* 3. Search Bar */}
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              <span>বিষয় বা শিরোনাম খুঁজুন</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="যেমন: স্বদেশপ্রেম, শীতের সকাল..."
                className="w-full p-2.5 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Writing Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>📚 রচনার তালিকা</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              {filteredItems.length}টি বিষয়
            </span>
          </h2>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <PenTool className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">
              নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো লেখার বিষয় পাওয়া যায়নি।
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedClass('all');
                setSelectedExam('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-emerald-500 transition duration-200 cursor-pointer flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200/60 dark:border-emerald-800">
                      {item.categoryLabel}
                    </span>
                    <span className="text-[10.5px] font-semibold text-slate-400">
                      {item.exam}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-1 leading-relaxed">
                      {item.introduction || item.moolBhab || item.originalExample.slice(0, 120)}...
                    </p>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold text-[11px]">
                    {item.className || 'সকল শ্রেণি'}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                    <span>সম্পূর্ণ পড়ুন</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Writing Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    {selectedItem.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {selectedItem.className || 'সকল শ্রেণি'} • {selectedItem.exam}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                  {selectedItem.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
              {/* Introduction / Overview */}
              {selectedItem.introduction && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 space-y-1.5">
                  <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-emerald-600" />
                    <span>ভূমিকা ও প্রেক্ষাপট:</span>
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                    {selectedItem.introduction}
                  </p>
                </div>
              )}

              {/* ভাবসম্প্রসারণ Specific Display */}
              {selectedItem.moolBhab && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1.5">
                    <h4 className="font-black text-xs text-amber-900 dark:text-amber-200">
                      💡 মূল ভাব:
                    </h4>
                    <p className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium">
                      {selectedItem.moolBhab}
                    </p>
                  </div>

                  {selectedItem.somprosharithoBhab && (
                    <div className="space-y-2">
                      <h4 className="font-black text-xs text-slate-700 dark:text-slate-300">
                        📖 সম্প্রসারিত ভাব:
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                        {selectedItem.somprosharithoBhab}
                      </p>
                    </div>
                  )}

                  {selectedItem.shikkhonioBishoy && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 space-y-1">
                      <h4 className="font-bold text-xs text-emerald-800 dark:text-emerald-300">
                        🎯 শিক্ষণীয় বিষয় ও মন্তব্য:
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 text-xs">
                        {selectedItem.shikkhonioBishoy}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* সারাংশ ও সারমর্ম Source Text */}
              {selectedItem.sourceText && (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
                    📜 মূল পাঠ (গদ্যাংশ / পদ্যাংশ):
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 italic whitespace-pre-line text-xs sm:text-sm">
                    "{selectedItem.sourceText}"
                  </p>
                </div>
              )}

              {/* Structure / Outline */}
              {selectedItem.structure && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>লেখার কাঠামো ও ধারাবাহিকতা:</span>
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">
                    {selectedItem.structure}
                  </p>
                </div>
              )}

              {/* Original Full Example */}
              <div className="space-y-2">
                <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>আদর্শ নমুনা উত্তর:</span>
                </h4>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 whitespace-pre-line text-xs sm:text-sm leading-relaxed font-sans">
                  {selectedItem.originalExample}
                </div>
              </div>

              {/* Tips & Common Mistakes */}
              {(selectedItem.importantTips?.length || selectedItem.commonMistakes?.length) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {selectedItem.importantTips && selectedItem.importantTips.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 space-y-1.5">
                      <h5 className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>পরীক্ষায় বেশি নম্বর পাওয়ার টিপস:</span>
                      </h5>
                      <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4">
                        {selectedItem.importantTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedItem.commonMistakes && selectedItem.commonMistakes.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/60 space-y-1.5">
                      <h5 className="font-bold text-xs text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>যে ভুলগুলো এড়িয়ে চলবেন:</span>
                      </h5>
                      <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4">
                        {selectedItem.commonMistakes.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Practice Prompts */}
              {selectedItem.practice && selectedItem.practice.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1.5">
                  <h5 className="font-bold text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-indigo-600" />
                    <span>নিজে নিজে অনুশীলন করো:</span>
                  </h5>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4">
                    {selectedItem.practice.map((pr, i) => (
                      <li key={i}>{pr}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
              <button
                onClick={() => handleAskAiAboutWriting(selectedItem)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI শিক্ষকের সাথে এটি আলোচনা করুন</span>
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
