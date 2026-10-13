import React, { useState, useMemo } from 'react';
import {
  Compass,
  ExternalLink,
  Search,
  Filter,
  Layers,
  BookOpen,
  FileText,
  HelpCircle,
  Megaphone,
  Globe,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageType } from '../../types';

interface ContentMapRow {
  id: string;
  type: 'class' | 'subject' | 'chapter' | 'question' | 'note' | 'notice' | 'seo' | 'syllabus';
  typeLabel: string;
  title: string;
  classLabel: string;
  subjectLabel: string;
  chapterLabel: string;
  status: 'published' | 'draft' | 'inactive';
  publishedLocation: string;
  targetPage: PageType;
  targetParams?: Record<string, any>;
  hasValidRoute: boolean;
}

export const AdminContentMap: React.FC = () => {
  const {
    classes,
    subjects,
    chapters,
    managedQuestions,
    managedNotes,
    managedNotices,
    siteSeo,
    syllabusList,
    navigate,
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [routeError, setRouteError] = useState<string | null>(null);

  // Compile unified Content Map dataset
  const rows: ContentMapRow[] = useMemo(() => {
    const list: ContentMapRow[] = [];

    // 1. Classes
    classes.forEach((c) => {
      list.push({
        id: `class-${c.id}`,
        type: 'class',
        typeLabel: 'শ্রেণি',
        title: c.name,
        classLabel: c.name,
        subjectLabel: '—',
        chapterLabel: '—',
        status: 'published',
        publishedLocation: 'পড়াশোনা > শ্রেণি তালিকা গ্রিড ও বিষয় ড্যাশবোর্ড',
        targetPage: 'subjects',
        targetParams: { classId: c.id },
        hasValidRoute: true,
      });
    });

    // 2. Subjects
    subjects.forEach((s) => {
      const cls = classes.find((c) => c.id === s.classId);
      list.push({
        id: `sub-${s.id}`,
        type: 'subject',
        typeLabel: 'বিষয়',
        title: s.name,
        classLabel: cls ? cls.name : (s.classId || 'অনির্ধারিত'),
        subjectLabel: s.name,
        chapterLabel: '—',
        status: 'published',
        publishedLocation: `পড়াশোনা > ${cls ? cls.name : 'শ্রেণি'} > অধ্যায়সমূহ`,
        targetPage: 'chapters',
        targetParams: { classId: s.classId, subjectId: s.id },
        hasValidRoute: true,
      });
    });

    // 3. Chapters
    chapters.forEach((ch) => {
      const cls = classes.find((c) => c.id === ch.classId);
      const sub = subjects.find((s) => s.id === ch.subjectId && s.classId === ch.classId);
      list.push({
        id: `ch-${ch.id}`,
        type: 'chapter',
        typeLabel: 'অধ্যায়',
        title: ch.title,
        classLabel: cls ? cls.name : (ch.classId || 'অনির্ধারিত'),
        subjectLabel: sub ? sub.name : (ch.subjectId || 'অনির্ধারিত'),
        chapterLabel: ch.title,
        status: 'published',
        publishedLocation: `পড়াশোনা > ${cls?.name || 'শ্রেণি'} > ${sub?.name || 'বিষয়'} > অধ্যায় কার্ড`,
        targetPage: 'chapters',
        targetParams: { classId: ch.classId, subjectId: ch.subjectId },
        hasValidRoute: Boolean(ch.classId && ch.subjectId),
      });
    });

    // 4. Questions (MCQ & CQ)
    managedQuestions.forEach((q) => {
      const cls = classes.find((c) => c.id === q.classId);
      const sub = subjects.find((s) => s.id === q.subjectId);
      const ch = chapters.find((c) => c.id === q.chapterId);
      list.push({
        id: `q-${q.id}`,
        type: 'question',
        typeLabel: q.type === 'cq' ? 'সৃজনশীল প্রশ্ন' : 'MCQ প্রশ্ন',
        title: q.question,
        classLabel: cls ? cls.name : (q.classId || 'সকল শ্রেণি'),
        subjectLabel: sub ? sub.name : (q.subjectId || 'সকল বিষয়'),
        chapterLabel: ch ? ch.title : (q.chapterId || 'সাধারণ'),
        status: q.status || 'published',
        publishedLocation: 'প্রশ্নব্যাংক ও সংশ্লিষ্ট অধ্যায়ের কুইজ মডিউল',
        targetPage: 'question_bank',
        targetParams: { classId: q.classId, subjectId: q.subjectId },
        hasValidRoute: true,
      });
    });

    // 5. Notes / Lessons
    managedNotes.forEach((n) => {
      const cls = classes.find((c) => c.id === n.classId);
      const sub = subjects.find((s) => s.id === n.subjectId);
      const ch = chapters.find((c) => c.id === n.chapterId);
      list.push({
        id: `note-${n.id}`,
        type: 'note',
        typeLabel: 'লেকচার নোট',
        title: n.title,
        classLabel: cls ? cls.name : (n.classId || 'সকল শ্রেণি'),
        subjectLabel: sub ? sub.name : (n.subjectId || 'সকল বিষয়'),
        chapterLabel: ch ? ch.title : (n.chapterId || 'সাধারণ'),
        status: n.status || 'published',
        publishedLocation: `পড়াশোনা > পাঠ ভিউয়ার (Lesson Page)`,
        targetPage: 'lesson',
        targetParams: { lessonId: n.id },
        hasValidRoute: true,
      });
    });

    // 6. Notices & Announcements
    managedNotices.forEach((not) => {
      list.push({
        id: `notice-${not.id}`,
        type: 'notice',
        typeLabel: 'সাইট নোটিস',
        title: not.title,
        classLabel: 'সকল শ্রেণি (গ্লোবাল)',
        subjectLabel: 'একাডেমি বুলেটিন',
        chapterLabel: not.showOnBanner ? 'শীর্ষ ব্যানার ও নোটিশ বোর্ড' : 'নোটিশ বোর্ড',
        status: not.status || 'published',
        publishedLocation: not.showOnBanner
          ? 'হোমপেজ টপ ব্যানার এবং হোমপেজ নোটিশ বোর্ড'
          : 'হোমপেজ নোটিশ বোর্ড',
        targetPage: 'home',
        targetParams: {},
        hasValidRoute: true,
      });
    });

    // 7. SEO
    if (siteSeo) {
      list.push({
        id: 'seo-global',
        type: 'seo',
        typeLabel: 'SEO সেটিংস',
        title: siteSeo.siteTitle || 'বাংলা শিক্ষাগার গ্লোবাল মেটাডেটা',
        classLabel: 'গ্লোবাল প্ল্যাটফর্ম',
        subjectLabel: 'মেটা ট্যাগ',
        chapterLabel: 'HTML হেড ও ওপেনগ্রাফ',
        status: 'published',
        publishedLocation: 'সমগ্র ওয়েবসাইটের <head> ও সোশ্যাল প্রিভিউ',
        targetPage: 'home',
        targetParams: {},
        hasValidRoute: true,
      });
    }

    // 8. Official Syllabuses
    syllabusList.forEach((syl) => {
      list.push({
        id: `syl-${syl.id}`,
        type: 'syllabus',
        typeLabel: 'সিলেবাস',
        title: syl.title,
        classLabel: syl.className,
        subjectLabel: syl.subjectName,
        chapterLabel: `${syl.items.length}টি পাঠ`,
        status: syl.status === 'published' ? 'published' : 'draft',
        publishedLocation: `সিলেবাস ও পাঠ্যসূচি (${syl.academicYear}) > ${syl.className} > ${syl.examName}`,
        targetPage: 'syllabus',
        targetParams: {
          year: syl.academicYear,
          classId: syl.classId,
          exam: syl.examType,
          subjectId: syl.subjectId,
        },
        hasValidRoute: true,
      });
    });

    return list;
  }, [classes, subjects, chapters, managedQuestions, managedNotes, managedNotices, siteSeo, syllabusList]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchType = typeFilter === 'all' || r.type === typeFilter;
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.classLabel.toLowerCase().includes(q) ||
        r.subjectLabel.toLowerCase().includes(q) ||
        r.chapterLabel.toLowerCase().includes(q) ||
        r.publishedLocation.toLowerCase().includes(q);
      return matchType && matchStatus && matchSearch;
    });
  }, [rows, typeFilter, statusFilter, search]);

  const handleNavigateToPublicPage = (row: ContentMapRow) => {
    if (!row.hasValidRoute) {
      setRouteError(`এই content-এর Public Page/Route এখনো তৈরি হয়নি। (${row.title})`);
      setTimeout(() => setRouteError(null), 4000);
      return;
    }
    if (row.status !== 'published') {
      setRouteError('কন্টেন্টটি এখনো ড্রাফট অবস্থায় রয়েছে। ওয়েবসাইটে দেখতে প্রথমে Publish করুন।');
      setTimeout(() => setRouteError(null), 4000);
      return;
    }
    navigate(row.targetPage, row.targetParams || {});
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'subject':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'chapter':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'question':
        return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case 'note':
        return <FileText className="w-4 h-4 text-rose-600" />;
      case 'notice':
        return <Megaphone className="w-4 h-4 text-teal-600" />;
      case 'syllabus':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'seo':
      default:
        return <Globe className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 text-white shadow-xl border border-indigo-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>লাইভ কন্টেন্ট ম্যাপ ও ট্র্যাকিং</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Content Map — Where Published?
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              অ্যাডমিন প্যানেল থেকে প্রকাশিত প্রতিটি কনটেন্ট (শ্রেণি, বিষয়, অধ্যায়, প্রশ্ন, নোট, নোটিস ও এসইও) পাবলিক ওয়েবসাইটের কোথায় প্রদর্শিত হচ্ছে তা এক নজরে দেখুন এবং সরাসরি লাইভ পেজে প্রবেশ করুন।
            </p>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
            <span className="text-2xl font-black text-amber-300 block">{rows.length}</span>
            <span className="text-[11px] text-slate-300 font-medium">মোট নথিভুক্ত আইটেম</span>
          </div>
        </div>
      </div>

      {routeError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span className="font-bold">{routeError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="কন্টেন্টের নাম, শ্রেণি, বিষয় বা প্রকাশিত স্থান লিখে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="all">সব ধরন ({rows.length})</option>
              <option value="syllabus">সিলেবাস</option>
              <option value="class">শ্রেণি</option>
              <option value="subject">বিষয়</option>
              <option value="chapter">অধ্যায়</option>
              <option value="question">প্রশ্নব্যাংক</option>
              <option value="note">লেকচার নোট</option>
              <option value="notice">সাইট নোটিস</option>
              <option value="seo">এসইও</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none shrink-0"
          >
            <option value="all">সব স্ট্যাটাস</option>
            <option value="published">প্রকাশিত (Published)</option>
            <option value="draft">খসড়া (Draft)</option>
          </select>
        </div>
      </div>

      {/* Content Map Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">কন্টেন্টের ধরন</th>
                <th className="py-3.5 px-4">শ্রেণি ও বিষয়</th>
                <th className="py-3.5 px-4">শিরোনাম / বিষয়বস্তু</th>
                <th className="py-3.5 px-4">স্ট্যাটাস</th>
                <th className="py-3.5 px-4">ওয়েবসাইটে অবস্থান (Published Location)</th>
                <th className="py-3.5 px-4 text-right">লাইভ ভিউ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-normal">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    কোনো কন্টেন্ট খুঁজে পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                        {getTypeIcon(row.type)}
                        <span>{row.typeLabel}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {row.classLabel}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {row.subjectLabel}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-black text-black dark:text-white line-clamp-1">
                        {row.title}
                      </div>
                      {row.chapterLabel !== '—' && (
                        <div className="text-[10px] text-slate-500 line-clamp-1">
                          অধ্যায়: {row.chapterLabel}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {row.status === 'published' ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-black text-white shadow-xs inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-block">
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl text-[11px] border border-slate-200/60 dark:border-slate-700/60">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{row.publishedLocation}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleNavigateToPublicPage(row)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                        title="পাবলিক ওয়েবসাইটে এই কন্টেন্টটি দেখুন"
                      >
                        <span>View on Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
