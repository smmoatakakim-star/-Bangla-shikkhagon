import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Bell,
  AlertTriangle,
  GraduationCap,
  Calendar,
  Sparkles,
  Search,
  Filter,
  ArrowLeft,
  ChevronRight,
  Share2,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ManagedNotice } from '../types';

export const NoticesPage: React.FC = () => {
  const { managedNotices, settings, navigate } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'urgent' | 'exam' | 'festive' | 'info'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter only published notices
  const publishedNotices: ManagedNotice[] = useMemo(() => {
    if (managedNotices && managedNotices.length > 0) {
      return managedNotices.filter((n) => n.status === 'published');
    }
    // Fallback notice from settings if no Firestore notices exist yet
    if (settings.announcementText) {
      return [
        {
          id: 'notice-default-fallback',
          title: 'ওয়েবসাইট নোটিস ও আপডেট',
          text: settings.announcementText,
          type: 'info',
          showOnBanner: true,
          status: 'published',
          createdAt: 'আজ',
        },
      ];
    }
    return [];
  }, [managedNotices, settings]);

  const filteredNotices = useMemo(() => {
    return publishedNotices.filter((notice) => {
      if (selectedFilter !== 'all' && (notice.type || 'info') !== selectedFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = notice.title.toLowerCase().includes(query);
        const matchText = notice.text.toLowerCase().includes(query);
        return matchTitle || matchText;
      }
      return true;
    });
  }, [publishedNotices, selectedFilter, searchQuery]);

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case 'urgent':
        return {
          label: 'জরুরি নোটিস',
          bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-900',
          icon: AlertTriangle,
        };
      case 'exam':
        return {
          label: 'পরীক্ষা সংক্রান্ত',
          bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-900',
          icon: GraduationCap,
        };
      case 'festive':
        return {
          label: 'উৎসব ও ছুটি',
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-900',
          icon: Sparkles,
        };
      case 'info':
      default:
        return {
          label: 'সাধারণ তথ্য',
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-900',
          icon: Bell,
        };
    }
  };

  const handleShare = (notice: ManagedNotice) => {
    const shareText = `[বাংলা শিক্ষাগর নোটিস] ${notice.title}\n\n${notice.text}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(notice.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div id="notices-page" className="space-y-6 sm:space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={() => navigate('home')}
          className="hover:text-emerald-600 transition flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>হোম</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          অফিসিয়াল নোটিস বোর্ড
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur-xs">
            <Megaphone className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>লাইভ নোটিস ও জরুরি বিজ্ঞপ্তি</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            স্কুল নোটিস বোর্ড
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl leading-relaxed">
            এনসিটিবি পরীক্ষা সময়সূচি, অনলাইন ক্লাস আপডেট, ছুটি ও প্রাতিষ্ঠানিক গুরুত্বপূর্ণ নোটিস সরাসরি অ্যাডমিন প্যানেল থেকে হালনাগাদ করা হয়।
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'সব বিজ্ঞপ্তি' },
              { id: 'urgent', label: 'জরুরি' },
              { id: 'exam', label: 'পরীক্ষা' },
              { id: 'festive', label: 'ছুটি ও উৎসব' },
              { id: 'info', label: 'সাধারণ' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নোটিস খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              কোনো নোটিস খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedFilter !== 'all'
                ? 'আপনার বাছাইকৃত ফিল্টার বা অনুসন্ধানে কোনো নোটিস নেই।'
                : 'বর্তমানে কোনো নতুন নোটিস জারি করা হয়নি। গুরুত্বপূর্ণ ঘোষণা এলে তা এখানে প্রদর্শিত হবে।'}
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const badge = getTypeBadge(notice.type);
            const Icon = badge.icon;
            const isCopied = copiedId === notice.id;

            return (
              <div
                key={notice.id}
                id={`notice-card-${notice.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </span>

                    {notice.showOnBanner && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <Megaphone className="w-3 h-3 text-emerald-600" />
                        <span>শীর্ষ ব্যানারে সক্রিয়</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {notice.createdAt || 'হালনাগাদ'}
                    </span>
                    <button
                      onClick={() => handleShare(notice)}
                      title="কপি / শেয়ার করুন"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {notice.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {notice.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
