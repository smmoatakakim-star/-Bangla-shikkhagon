import React from 'react';
import {
  Users,
  BookOpen,
  HelpCircle,
  Megaphone,
  Sparkles,
  Plus,
  Layers,
  FileText,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PenTool,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminDashboardOverviewProps {
  onNavigateTab: (tab: any) => void;
  onOpenNewModal: (modal: any) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onNavigateTab,
  onOpenNewModal,
}) => {
  const {
    classes,
    subjects,
    chapters,
    managedQuestions,
    lessons,
    managedNotices,
    adminDrafts,
    syllabusList,
    writingGuideList,
    users,
    reports,
    navigate,
  } = useApp();

  return (
    <div className="space-y-6">
      {/* Firebase Realtime Connection Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>Firebase Firestore লাইভ ডেটাবেজ সংযুক্ত</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                রিয়েলটাইম সিঙ্ক সক্রিয়
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              প্যানেল থেকে যে কোনো কন্টেন্ট যুক্ত, এডিট বা ডিলিট করলে তা তাৎক্ষণিকভাবে ওয়েবসাইটের ব্যবহারকারীদের নিকট আপডেট হবে।
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('home')}
          className="px-3.5 py-1.5 rounded-xl border border-emerald-600/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          লাইভ ওয়েবসাইট দেখুন
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Classes */}
        <div
          onClick={() => onNavigateTab('classes')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-emerald-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <Layers className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-[10px] font-bold uppercase tracking-wider">শ্রেণি</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {classes.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">সক্রিয় শ্রেণি ও গ্রেড</p>
        </div>

        {/* Subjects */}
        <div
          onClick={() => onNavigateTab('subjects')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-blue-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <BookOpen className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-[10px] font-bold uppercase tracking-wider">বিষয়</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {subjects.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">সকল শ্রেণির বিষয়</p>
        </div>

        {/* Chapters */}
        <div
          onClick={() => onNavigateTab('chapters')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-purple-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <BookOpen className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-[10px] font-bold uppercase tracking-wider">অধ্যায়</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {chapters.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">সিলেবাসের অধ্যায়</p>
        </div>

        {/* Official Syllabus */}
        <div
          onClick={() => onNavigateTab('syllabuses')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-teal-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-teal-600 mb-2">
            <BookOpen className="w-5 h-5 group-hover:scale-110 transition text-teal-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">📚 সিলেবাস</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {syllabusList.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">NCTB অফিসিয়াল সিলেবাস</p>
        </div>

        {/* Writing Guide (Phase 2 CMS) */}
        <div
          onClick={() => onNavigateTab('writing_guides')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-emerald-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <PenTool className="w-5 h-5 group-hover:scale-110 transition text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">✍️ লেখার গাইড</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {writingGuideList.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">প্রবন্ধ, চিঠি, অনুচ্ছেদ ও সারাংশ</p>
        </div>

        {/* Questions & MCQs */}
        <div
          onClick={() => onNavigateTab('questions')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-amber-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <HelpCircle className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-[10px] font-bold uppercase tracking-wider">প্রশ্ন ও MCQ</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {managedQuestions.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">ম্যানেজড প্রশ্নব্যাংক</p>
        </div>

        {/* Notes */}
        <div
          onClick={() => onNavigateTab('notes')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-teal-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-teal-600 mb-2">
            <FileText className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-[10px] font-bold uppercase tracking-wider">পাঠ ও নোট</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {lessons.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">রিভিশন ও স্টাডি নোট</p>
        </div>

        {/* Notices */}
        <div
          onClick={() => onNavigateTab('notices')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-indigo-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <Megaphone className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-[10px] font-bold uppercase tracking-wider">নোটিস</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {managedNotices.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">ঘোষণা ও ব্যানার নোটিস</p>
        </div>

        {/* AI Drafts */}
        <div
          onClick={() => onNavigateTab('ai_generator')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-rose-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-[10px] font-bold uppercase tracking-wider">AI ড্রাফট</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {adminDrafts.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">অনুমোদনের অপেক্ষায়</p>
        </div>

        {/* Users */}
        <div
          onClick={() => onNavigateTab('users')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <Users className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-[10px] font-bold uppercase tracking-wider">ব্যবহারকারী</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {users.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">নিবন্ধিত অ্যাকাউন্ট</p>
        </div>
      </div>

      {/* Staged AI Drafts Alert if any pending */}
      {adminDrafts.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/10 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                {adminDrafts.length}টি AI-জেনারেটেড কন্টেন্ট ড্রাফট অবস্থায় রয়েছে
              </h5>
              <p className="text-[11px] text-slate-500">
                নিরাপত্তার স্বার্থে AI কন্টেন্ট সরাসরি লাইভ হয় না। অ্যাডমিন প্যানেল থেকে প্রিভিউ ও অনুমোদনের পর তা প্রকাশিত হবে।
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('ai_generator')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shrink-0"
          >
            ড্রাফট দেখুন
          </button>
        </div>
      )}

      {/* Prominent AI Command Center Shortcut Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-purple-700/40">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Command Center</span>
          </div>
          <h4 className="text-base font-bold text-white">
            স্বাভাবিক বাংলায় চ্যাট করে যেকোনো কন্টেন্ট পরিচালনা করুন
          </h4>
          <p className="text-xs text-purple-200 max-w-xl">
            আলাদা ফরম পূরণ না করে সরাসরি লিখুন: “ক্লাস ৮ বিজ্ঞান ১ম অধ্যায়ের ৫টি MCQ তৈরি করো” বা “ক্লাস ৭ গণিত ৩ নম্বর অধ্যায় যোগ করো”।
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('ai_command_center')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white text-xs font-bold shadow-md transition flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>কমান্ড সেন্টার খুলুন</span>
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          দ্রুত কন্টেন্ট তৈরি ও সম্পাদনা অ্যাকশন:
        </h3>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onOpenNewModal('class')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন শ্রেণি</span>
          </button>

          <button
            onClick={() => onOpenNewModal('subject')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন বিষয়</span>
          </button>

          <button
            onClick={() => onOpenNewModal('chapter')}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন অধ্যায়</span>
          </button>

          <button
            onClick={() => onOpenNewModal('question')}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন প্রশ্ন (MCQ/CQ)</span>
          </button>

          <button
            onClick={() => onNavigateTab('writing_guides')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <PenTool className="w-4 h-4" />
            <span>নতুন রচনা / লেখার গাইড</span>
          </button>

          <button
            onClick={() => onOpenNewModal('note')}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন নোট / লেকচার</span>
          </button>

          <button
            onClick={() => onOpenNewModal('notice')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Megaphone className="w-4 h-4" />
            <span>নতুন সাইট নোটিস</span>
          </button>

          <button
            onClick={() => onNavigateTab('ai_generator')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI কন্টেন্ট তৈরি</span>
          </button>

          <button
            onClick={() => onNavigateTab('seo')}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Globe className="w-4 h-4" />
            <span>SEO সেটিংস</span>
          </button>
        </div>
      </div>
    </div>
  );
};
