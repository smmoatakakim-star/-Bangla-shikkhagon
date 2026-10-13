import React, { useState, useMemo } from 'react';
import {
  FolderOpen,
  X,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  FileText,
  Megaphone,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageType } from '../../types';

interface PublishDirectoryItem {
  id: string;
  type: 'syllabus' | 'question' | 'note' | 'chapter' | 'notice' | 'class' | 'subject';
  typeLabel: string;
  title: string;
  classLabel: string;
  subjectLabel: string;
  targetLocation: string;
  targetPage: PageType;
  targetParams?: Record<string, any>;
  status: 'published' | 'live';
  updatedAt?: string;
  details?: string;
}

interface AdminPublishDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightItemId?: string;
}

export const AdminPublishDirectoryModal: React.FC<AdminPublishDirectoryModalProps> = ({
  isOpen,
  onClose,
  highlightItemId,
}) => {
  const {
    classes,
    subjects,
    chapters,
    managedQuestions,
    managedNotes,
    managedNotices,
    syllabusList,
    navigate,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Build unified published directory
  const items: PublishDirectoryItem[] = useMemo(() => {
    const list: PublishDirectoryItem[] = [];

    // 1. Official Syllabuses
    syllabusList.forEach((syl) => {
      list.push({
        id: syl.id,
        type: 'syllabus',
        typeLabel: 'সিলেবাস ও পাঠ্যসূচি',
        title: syl.title,
        classLabel: syl.className,
        subjectLabel: syl.subjectName,
        targetLocation: `সিলেবাস ও পাঠ্যসূচি (${syl.academicYear}) > ${syl.className} > ${syl.examName}`,
        targetPage: 'syllabus',
        targetParams: {
          year: syl.academicYear,
          classId: syl.classId,
          exam: syl.examType,
          subjectId: syl.subjectId,
        },
        status: 'published',
        updatedAt: syl.updatedAt,
        details: `${syl.items.length}টি পাঠ্যসূচি অধ্যায় • পূর্ণমান: ${syl.marksDistribution.totalMarks}`,
      });
    });

    // 2. Questions & MCQs
    managedQuestions.forEach((q) => {
      const cls = classes.find((c) => c.id === q.classId);
      const sub = subjects.find((s) => s.id === q.subjectId);
      list.push({
        id: q.id,
        type: 'question',
        typeLabel: q.type === 'cq' ? 'সৃজনশীল প্রশ্ন' : 'MCQ প্রশ্ন',
        title: q.question,
        classLabel: cls ? cls.name : q.classId,
        subjectLabel: sub ? sub.name : q.subjectId,
        targetLocation:
          q.type === 'cq'
            ? `সৃজনশীল প্রশ্ন ব্যাংক > ${cls ? cls.name : 'শ্রেণি'} > ${sub ? sub.name : 'বিষয়'}`
            : `বহুনির্বাচনী প্রশ্ন ব্যাংক > ${cls ? cls.name : 'শ্রেণি'} > ${sub ? sub.name : 'বিষয়'}`,
        targetPage: q.type === 'cq' ? 'creative_questions' : 'question_bank',
        targetParams: { classId: q.classId, subjectId: q.subjectId },
        status: 'published',
        updatedAt: q.createdAt,
        details: q.explanation ? `ব্যাখ্যা সহ যুক্ত` : `অপশন: ${q.options?.length || 4}টি`,
      });
    });

    // 3. Study Notes & Lessons
    managedNotes.forEach((n) => {
      const cls = classes.find((c) => c.id === n.classId);
      const sub = subjects.find((s) => s.id === n.subjectId);
      list.push({
        id: n.id,
        type: 'note',
        typeLabel: 'স্টাডি নোট ও পাঠ',
        title: n.title,
        classLabel: cls ? cls.name : n.classId,
        subjectLabel: sub ? sub.name : n.subjectId,
        targetLocation: `পড়াশোনা ও পাঠ > ${cls ? cls.name : 'শ্রেণি'} > ${sub ? sub.name : 'বিষয়'}`,
        targetPage: 'chapters',
        targetParams: { classId: n.classId, subjectId: n.subjectId },
        status: 'published',
        updatedAt: n.createdAt,
        details: n.keyPoints?.length ? `${n.keyPoints.length}টি গুরুত্বপূর্ণ পয়েন্ট` : undefined,
      });
    });

    // 4. Chapters
    chapters.forEach((ch) => {
      const cls = classes.find((c) => c.id === ch.classId);
      const sub = subjects.find((s) => s.id === ch.subjectId);
      list.push({
        id: `ch-${ch.id}`,
        type: 'chapter',
        typeLabel: 'অধ্যায়',
        title: ch.title,
        classLabel: cls ? cls.name : ch.classId,
        subjectLabel: sub ? sub.name : (ch.subjectId || 'বিষয়'),
        targetLocation: `শ্রেণি পাঠ্যসূচি > ${cls ? cls.name : 'শ্রেণি'} > ${sub ? sub.name : 'বিষয়'} > অধ্যায় তালিকা`,
        targetPage: 'chapters',
        targetParams: { classId: ch.classId, subjectId: ch.subjectId },
        status: 'published',
        details: ch.description,
      });
    });

    // 5. Notices
    managedNotices.forEach((not) => {
      list.push({
        id: not.id,
        type: 'notice',
        typeLabel: 'সাইট নোটিস',
        title: not.title,
        classLabel: 'সকল শ্রেণি',
        subjectLabel: 'সাধারণ বিজ্ঞপ্তি',
        targetLocation: not.showOnBanner
          ? 'হোম পেজ শীর্ষ ব্যানার ও নোটিস বোর্ড পেজ'
          : 'নোটিস বোর্ড পেজ (/notices)',
        targetPage: 'notices',
        targetParams: {},
        status: 'published',
        updatedAt: not.createdAt,
        details: not.showOnBanner ? '🔔 শীর্ষ ব্যানারে লাইভ দৃশ্যমান' : 'নোটিস বোর্ডে প্রকাশিত',
      });
    });

    // 6. Classes
    classes.forEach((c) => {
      list.push({
        id: `cls-${c.id}`,
        type: 'class',
        typeLabel: 'শ্রেণি',
        title: c.name,
        classLabel: c.name,
        subjectLabel: '—',
        targetLocation: 'শ্রেণি নির্বাচন গ্রিড ও হোম পেজ',
        targetPage: 'subjects',
        targetParams: { classId: c.id },
        status: 'published',
      });
    });

    // 7. Subjects
    subjects.forEach((s) => {
      const cls = classes.find((c) => c.id === s.classId);
      list.push({
        id: `sub-${s.id}`,
        type: 'subject',
        typeLabel: 'বিষয়',
        title: s.name,
        classLabel: cls ? cls.name : s.classId,
        subjectLabel: s.name,
        targetLocation: `পড়াশোনা > ${cls ? cls.name : 'শ্রেণি'} > বিষয় ড্যাশবোর্ড`,
        targetPage: 'chapters',
        targetParams: { classId: s.classId, subjectId: s.id },
        status: 'published',
      });
    });

    return list;
  }, [classes, subjects, chapters, managedQuestions, managedNotes, managedNotices, syllabusList]);

  // Filtering
  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchLoc = item.targetLocation.toLowerCase().includes(q);
        const matchClass = item.classLabel.toLowerCase().includes(q);
        const matchSub = item.subjectLabel.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchClass && !matchSub) return false;
      }
      return true;
    });
  }, [items, selectedType, search]);

  const handleNavigateToLive = (item: PublishDirectoryItem) => {
    onClose();
    navigate(item.targetPage, item.targetParams);
  };

  if (!isOpen) return null;

  return (
    <div
      id="publish-directory-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div
        id="publish-directory-modal-container"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white flex items-start justify-between gap-4 border-b border-emerald-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <FolderOpen className="w-5 h-5 text-emerald-400" />
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                📂 Publish Directory — প্রকাশিত কনটেন্ট ডিরেক্টরি
              </h3>
            </div>
            <p className="text-xs text-emerald-200/90 max-w-2xl">
              অ্যাডমিন প্যানেল থেকে লাইভ Firebase-এ প্রকাশিত সমস্ত কনটেন্টের অবস্থান জানুন এবং বাস্তব সাইটে এক ক্লিকে যাচাই করুন।
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="শিরোনাম, বিষয়, শ্রেণি বা প্রকাশের অবস্থান দিয়ে খুঁজুন..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  মুছুন
                </button>
              )}
            </div>

            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1.5">
              <span>মোট প্রকাশিত:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                {items.length}টি
              </span>
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {[
              { id: 'all', label: 'সকল কনটেন্ট', count: items.length },
              { id: 'syllabus', label: '📚 সিলেবাস', count: syllabusList.length },
              { id: 'question', label: '❓ প্রশ্ন ও MCQ', count: managedQuestions.length },
              { id: 'note', label: '📝 পাঠ ও নোট', count: managedNotes.length },
              { id: 'chapter', label: '📖 অধ্যায়', count: chapters.length },
              { id: 'notice', label: '📢 সাইট নোটিস', count: managedNotices.length },
              { id: 'class', label: '🎓 শ্রেণি', count: classes.length },
              { id: 'subject', label: '📘 বিষয়', count: subjects.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  selectedType === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedType === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5 max-h-[60vh]">
          {filtered.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Compass className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                কোনো প্রকাশিত কনটেন্ট খুঁজে পাওয়া যায়নি
              </p>
              <p className="text-[11px] text-slate-400">
                অন্য কোনো ফিল্টার বা অনুসন্ধান শব্দ ব্যবহার করুন
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const isHighlighted = highlightItemId && item.id.includes(highlightItemId);

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isHighlighted
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-400/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800">
                        {item.typeLabel}
                      </span>

                      {item.classLabel && item.classLabel !== '—' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.classLabel}
                        </span>
                      )}

                      {item.subjectLabel && item.subjectLabel !== '—' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.subjectLabel}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Live on Firebase</span>
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                      {item.title}
                    </h4>

                    {/* Published Location Information */}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        📍 প্রকাশের অবস্থান:
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800">
                        {item.targetLocation}
                      </span>
                    </div>

                    {item.details && (
                      <p className="text-[10.5px] text-slate-400 line-clamp-1">{item.details}</p>
                    )}
                  </div>

                  {/* Direct Action: View Live on Website */}
                  <div className="shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleNavigateToLive(item)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer group"
                    >
                      <span>লাইভ সাইটে দেখুন</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            যেকোনো কনটেন্টে ক্লিক করে সরাসরি শিক্ষার্থীর ভিউতে নিয়ে যাওয়া হবে।
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
