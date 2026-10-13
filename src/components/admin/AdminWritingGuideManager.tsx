import React, { useState, useMemo } from 'react';
import {
  PenTool,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Trash2,
  Edit3,
  Layers,
  BookOpen,
  FileText,
  Lightbulb,
  Mail,
  Award,
  MessageSquare,
  Globe,
  Sparkles,
  BookMarked,
  X,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  WritingGuideItem,
  WritingCategory,
  ContentLifecycleStatus,
} from '../../types';

interface AdminWritingGuideManagerProps {
  onPreview: (type: string, item: any) => void;
}

const CATEGORY_OPTIONS: { id: WritingCategory; label: string; group: 'bn' | 'en' }[] = [
  // Bangla
  { id: 'probondho', label: '১. প্রবন্ধ (Probondho)', group: 'bn' },
  { id: 'rochona', label: '২. রচনা (Rochona)', group: 'bn' },
  { id: 'paragraph', label: '৩. অনুচ্ছেদ (Paragraph)', group: 'bn' },
  { id: 'bhabshomprosharon', label: '৪. ভাবসম্প্রসারণ', group: 'bn' },
  { id: 'sarongsho', label: '৫. সারাংশ (গদ্যাংশ)', group: 'bn' },
  { id: 'sarmormo', label: '৬. সারমর্ম (কবিতাংশ)', group: 'bn' },
  { id: 'letter', label: '৭. চিঠি (Letter)', group: 'bn' },
  { id: 'personal_letter', label: '৮. ব্যক্তিগত চিঠি', group: 'bn' },
  { id: 'application', label: '৯. আবেদনপত্র (Application)', group: 'bn' },
  { id: 'report', label: '১০. প্রতিবেদন (Report)', group: 'bn' },
  { id: 'dialogue', label: '১১. সংলাপ (Dialogue)', group: 'bn' },
  { id: 'story', label: '১২. গল্প লেখা (Story Writing)', group: 'bn' },
  { id: 'completing_story', label: '১৩. গল্প সম্পূর্ণকরণ', group: 'bn' },
  { id: 'essay_writing', label: '১৪. রচনামূলক লেখা', group: 'bn' },
  { id: 'exam_writing_topics', label: '১৫. পরীক্ষার গুরুত্বপূর্ণ বিষয়', group: 'bn' },

  // English
  { id: 'english_paragraph', label: '১৬. English Paragraph', group: 'en' },
  { id: 'english_composition', label: '১৭. English Composition', group: 'en' },
  { id: 'english_application', label: '১৮. English Application', group: 'en' },
  { id: 'english_letter', label: '১৯. English Letter', group: 'en' },
  { id: 'english_email', label: '২০. English Email', group: 'en' },
  { id: 'english_dialogue', label: '২১. English Dialogue', group: 'en' },
  { id: 'english_story', label: '২২. English Story', group: 'en' },
  { id: 'english_completing_story', label: '২৩. English Completing Story', group: 'en' },
];

export const AdminWritingGuideManager: React.FC<AdminWritingGuideManagerProps> = ({
  onPreview,
}) => {
  const {
    writingGuideList,
    saveWritingGuide,
    deleteWritingGuide,
    realContentCounts,
  } = useApp();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WritingGuideItem | null>(null);

  // Form Fields
  const [formCategory, setFormCategory] = useState<WritingCategory>('probondho');
  const [formTitle, setFormTitle] = useState('');
  const [formClassId, setFormClassId] = useState('class-9');
  const [formClassName, setFormClassName] = useState('৯ম ও ১০ম শ্রেণি');
  const [formSubjectId, setFormSubjectId] = useState('bangla');
  const [formExam, setFormExam] = useState('২০২৬ বার্ষিক পরীক্ষা');
  const [formAcademicYear, setFormAcademicYear] = useState('২০২৬');
  const [formLanguage, setFormLanguage] = useState<'bn' | 'en'>('bn');
  const [formStatus, setFormStatus] = useState<ContentLifecycleStatus>('published');

  const [formIntroduction, setFormIntroduction] = useState('');
  const [formStructure, setFormStructure] = useState('');
  const [formMainPointsText, setFormMainPointsText] = useState('');
  const [formOriginalExample, setFormOriginalExample] = useState('');
  const [formImportantTipsText, setFormImportantTipsText] = useState('');
  const [formCommonMistakesText, setFormCommonMistakesText] = useState('');
  const [formPracticeText, setFormPracticeText] = useState('');
  const [formExamTipsText, setFormExamTipsText] = useState('');

  // Special Category Fields
  const [formMoolBhab, setFormMoolBhab] = useState('');
  const [formSomprosharithoBhab, setFormSomprosharithoBhab] = useState('');
  const [formShikkhonioBishoy, setFormShikkhonioBishoy] = useState('');
  const [formSourceText, setFormSourceText] = useState('');
  const [formExplanation, setFormExplanation] = useState('');
  const [formLetterType, setFormLetterType] = useState('');
  const [formSituation, setFormSituation] = useState('');
  const [formMoral, setFormMoral] = useState('');

  // Open Create Modal
  const handleOpenCreateModal = (category: WritingCategory = 'probondho') => {
    setEditingItem(null);
    setFormCategory(category);
    setFormTitle('');
    setFormClassId('class-9');
    setFormClassName('৯ম ও ১০ম শ্রেণি');
    setFormSubjectId(category.startsWith('english_') ? 'english' : 'bangla');
    setFormExam('২০২৬ বার্ষিক পরীক্ষা');
    setFormAcademicYear('২০২৬');
    setFormLanguage(category.startsWith('english_') ? 'en' : 'bn');
    setFormStatus('draft'); // Default new items to Draft as required by lifecycle

    setFormIntroduction('');
    setFormStructure('');
    setFormMainPointsText('');
    setFormOriginalExample('');
    setFormImportantTipsText('');
    setFormCommonMistakesText('');
    setFormPracticeText('');
    setFormExamTipsText('');
    setFormMoolBhab('');
    setFormSomprosharithoBhab('');
    setFormShikkhonioBishoy('');
    setFormSourceText('');
    setFormExplanation('');
    setFormLetterType('');
    setFormSituation('');
    setFormMoral('');

    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: WritingGuideItem) => {
    setEditingItem(item);
    setFormCategory(item.category);
    setFormTitle(item.title);
    setFormClassId(item.classId);
    setFormClassName(item.className || '');
    setFormSubjectId(item.subjectId);
    setFormExam(item.exam);
    setFormAcademicYear(item.academicYear);
    setFormLanguage(item.language);
    setFormStatus(item.status);

    setFormIntroduction(item.introduction || '');
    setFormStructure(item.structure || item.reportStructure || item.storyStructure || '');
    setFormMainPointsText((item.mainPoints || item.keyPoints || []).join('\n'));
    setFormOriginalExample(item.originalExample);
    setFormImportantTipsText((item.importantTips || []).join('\n'));
    setFormCommonMistakesText((item.commonMistakes || []).join('\n'));
    setFormPracticeText((item.practice || []).join('\n'));
    setFormExamTipsText((item.examWritingTips || []).join('\n'));
    setFormMoolBhab(item.moolBhab || '');
    setFormSomprosharithoBhab(item.somprosharithoBhab || '');
    setFormShikkhonioBishoy(item.shikkhonioBishoy || '');
    setFormSourceText(item.sourceText || '');
    setFormExplanation(item.explanation || '');
    setFormLetterType(item.letterType || item.applicationType || '');
    setFormSituation(item.situation || '');
    setFormMoral(item.moral || '');

    setIsModalOpen(true);
  };

  // Save / Update Handler
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formOriginalExample.trim()) {
      alert('অনুগ্রহ করে শিরোনাম এবং আদর্শ নমুনা লেখার বিবরণ দিন।');
      return;
    }

    const selectedCatObj = CATEGORY_OPTIONS.find((c) => c.id === formCategory);
    const categoryLabel = selectedCatObj ? selectedCatObj.label.split('. ')[1] : formCategory;

    const mainPoints = formMainPointsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const importantTips = formImportantTipsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const commonMistakes = formCommonMistakesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const practice = formPracticeText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const examWritingTips = formExamTipsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const guideItem: WritingGuideItem = {
      id: editingItem ? editingItem.id : `wg-${formCategory}-${Date.now()}`,
      title: formTitle.trim(),
      classId: formClassId,
      className: formClassName,
      subjectId: formSubjectId,
      exam: formExam,
      academicYear: formAcademicYear,
      category: formCategory,
      categoryLabel,
      language: formLanguage,
      status: formStatus,
      introduction: formIntroduction.trim() || undefined,
      structure: formStructure.trim() || undefined,
      mainPoints: mainPoints.length > 0 ? mainPoints : undefined,
      originalExample: formOriginalExample.trim(),
      importantTips: importantTips.length > 0 ? importantTips : undefined,
      commonMistakes: commonMistakes.length > 0 ? commonMistakes : undefined,
      practice: practice.length > 0 ? practice : undefined,
      examWritingTips: examWritingTips.length > 0 ? examWritingTips : undefined,

      moolBhab: formMoolBhab.trim() || undefined,
      somprosharithoBhab: formSomprosharithoBhab.trim() || undefined,
      shikkhonioBishoy: formShikkhonioBishoy.trim() || undefined,
      sourceText: formSourceText.trim() || undefined,
      explanation: formExplanation.trim() || undefined,
      letterType: formLetterType.trim() || undefined,
      applicationType: formLetterType.trim() || undefined,
      situation: formSituation.trim() || undefined,
      moral: formMoral.trim() || undefined,
      updatedAt: new Date().toISOString(),
      createdAt: editingItem?.createdAt || new Date().toISOString(),
    };

    await saveWritingGuide(guideItem);
    setIsModalOpen(false);
  };

  // Quick Status Transition
  const handleQuickStatusChange = async (
    item: WritingGuideItem,
    newStatus: ContentLifecycleStatus
  ) => {
    const updated: WritingGuideItem = {
      ...item,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    await saveWritingGuide(updated);
  };

  // Delete Handler
  const handleDeleteItem = async (item: WritingGuideItem) => {
    if (confirm(`আপনি কি নিশ্চিত যে '${item.title}' ডিলিট করতে চান?`)) {
      await deleteWritingGuide(item.id);
    }
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return writingGuideList.filter((item) => {
      // Category Filter
      if (selectedCategoryFilter === 'bn_all') {
        if (item.category.startsWith('english_')) return false;
      } else if (selectedCategoryFilter === 'en_all') {
        if (!item.category.startsWith('english_')) return false;
      } else if (selectedCategoryFilter !== 'all') {
        if (item.category !== selectedCategoryFilter) return false;
      }

      // Status Filter
      if (selectedStatusFilter !== 'all') {
        if (item.status !== selectedStatusFilter) return false;
      }

      // Class Filter
      if (selectedClassFilter !== 'all') {
        if (item.classId !== selectedClassFilter) return false;
      }

      // Search
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
  }, [
    writingGuideList,
    selectedCategoryFilter,
    selectedStatusFilter,
    selectedClassFilter,
    searchQuery,
  ]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Real Database Counts */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white shadow-lg border border-teal-700/40 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-1.5">
              <PenTool className="w-3.5 h-3.5" />
              <span>বাংলা ও ইংরেজি লেখার গাইড ব্যবস্থাপনা (CMS)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              সব ধরনের রচনা, চিঠি, সারাংশ ও গাইডের প্রশাসনিক নিয়ন্ত্রণ
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              প্রবন্ধ, রচনা, অনুচ্ছেদ, ভাবসম্প্রসারণ, সারাংশ, সারমর্ম, চিঠি, আবেদনপত্র, প্রতিবেদন, সংলাপ, গল্প লেখা
              ও English Writing সরাসরি যোগ, সম্পাদনা, ড্রাফট ও অনুমোদন করুন।
            </p>
          </div>

          <button
            onClick={() => handleOpenCreateModal('probondho')}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন বিষয় যোগ করুন</span>
          </button>
        </div>

        {/* Real Content Counts Bar */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400">লাইভ ডেটাবেজ কাউন্ট:</span>
          <span className="px-2.5 py-1 rounded-xl bg-white/10 text-emerald-200 font-bold">
            প্রবন্ধ: {realContentCounts.totalProbondho}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white/10 text-blue-200 font-bold">
            রচনা: {realContentCounts.totalRochona}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white/10 text-amber-200 font-bold">
            অনুচ্ছেদ: {realContentCounts.totalParagraph}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white/10 text-purple-200 font-bold">
            ভাবসম্প্রসারণ: {realContentCounts.totalBhabshomprosharon}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white/10 text-teal-200 font-bold">
            সারাংশ: {realContentCounts.totalSarongsho}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white/10 text-rose-200 font-bold">
            সারমর্ম: {realContentCounts.totalSarmormo}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white/10 text-cyan-200 font-bold">
            চিঠি: {realContentCounts.totalLetters}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white/10 text-indigo-200 font-bold">
            আবেদনপত্র: {realContentCounts.totalApplications}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white/10 text-orange-200 font-bold">
            প্রতিবেদন: {realContentCounts.totalReports}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white/10 text-lime-200 font-bold">
            সংলাপ: {realContentCounts.totalDialogues}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white/10 text-fuchsia-200 font-bold">
            গল্প: {realContentCounts.totalStories}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white/10 text-sky-200 font-bold">
            English Writing: {realContentCounts.totalEnglishWriting}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Category Filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-400">বিভাগ ফিল্টার</label>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">সব বিষয় ({writingGuideList.length})</option>
              <option value="bn_all">সকল বাংলা গাইড</option>
              <option value="en_all">সকল ইংরেজি গাইড</option>
              <optgroup label="বাংলা গাইড">
                {CATEGORY_OPTIONS.filter((c) => c.group === 'bn').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="English Writing">
                {CATEGORY_OPTIONS.filter((c) => c.group === 'en').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-400">স্ট্যাটাস ফিল্টার</label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="draft">খসড়া (Draft)</option>
              <option value="review">পর্যালোচনা (Review)</option>
              <option value="approved">অনুমোদিত (Approved)</option>
              <option value="published">প্রকাশিত (Published)</option>
            </select>
          </div>

          {/* Class Filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-400">শ্রেণি</label>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">সকল শ্রেণি</option>
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

          {/* Search */}
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-400">অনুসন্ধান</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শিরোনাম বা শব্দ দিয়ে খুঁজুন..."
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

      {/* Items List Table / Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>মোট পাওয়া গেছে: {filteredList.length}টি বিষয়</span>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-xs text-slate-400 space-y-2">
            <PenTool className="w-8 h-8 text-slate-300 mx-auto" />
            <p>কোনো কন্টেন্ট খুঁজে পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredList.map((item) => {
              const statusColors: Record<ContentLifecycleStatus, string> = {
                draft: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300',
                review: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300',
                approved: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300',
                published: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300',
              };

              const statusLabels: Record<ContentLifecycleStatus, string> = {
                draft: 'খসড়া (Draft)',
                review: 'পর্যালোচনা (Review)',
                approved: 'অনুমোদিত (Approved)',
                published: 'প্রকাশিত (Live)',
              };

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs hover:border-emerald-500/60 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                        {item.categoryLabel}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-lg font-bold border text-[10.5px] ${statusColors[item.status]}`}
                      >
                        {statusLabels[item.status]}
                      </span>

                      <span className="text-slate-400 font-medium">
                        {item.className || 'সকল শ্রেণি'} • {item.exam}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 truncate">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {item.introduction || item.moolBhab || item.originalExample.slice(0, 100)}...
                    </p>
                  </div>

                  {/* Action Buttons & Status Workflow */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-end md:self-center">
                    {/* Lifecycle Transitions */}
                    {item.status === 'draft' && (
                      <button
                        onClick={() => handleQuickStatusChange(item, 'review')}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[11px] font-bold transition flex items-center gap-1 border border-amber-200"
                        title="পর্যালোচনার জন্য জমা দিন"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>রিভিউতে দিন</span>
                      </button>
                    )}

                    {item.status === 'review' && (
                      <button
                        onClick={() => handleQuickStatusChange(item, 'approved')}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-[11px] font-bold transition flex items-center gap-1 border border-blue-200"
                        title="অনুমোদন করুন"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>অনুমোদন করুন</span>
                      </button>
                    )}

                    {item.status === 'approved' && (
                      <button
                        onClick={() => handleQuickStatusChange(item, 'published')}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                        title="প্রকাশ করুন"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>প্রকাশ করুন</span>
                      </button>
                    )}

                    {item.status === 'published' && (
                      <button
                        onClick={() => handleQuickStatusChange(item, 'draft')}
                        className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-[11px] font-bold transition"
                        title="আনপাবলিশ (খসড়ায় ফেরত নিন)"
                      >
                        আনপাবলিশ
                      </button>
                    )}

                    {/* Preview Button */}
                    <button
                      onClick={() => onPreview('writing', item)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="শিক্ষার্থী প্রিভিউ দেখুন"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                      title="সম্পাদনা করুন"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="ডিলিট করুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Modal for Add / Edit Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {editingItem ? 'লেখার বিষয় সম্পাদনা করুন' : 'নতুন লেখার বিষয় যোগ করুন'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    NCTB কারিকুলাম ও বোর্ড পরীক্ষার নির্ধারিত কাঠামো অনুযায়ী নির্ভুল তথ্য দিন।
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form onSubmit={handleSaveForm} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Category, Status, Language */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    বিভাগ (Category) *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const newCat = e.target.value as WritingCategory;
                      setFormCategory(newCat);
                      if (newCat.startsWith('english_')) {
                        setFormLanguage('en');
                        setFormSubjectId('english');
                      } else {
                        setFormLanguage('bn');
                        setFormSubjectId('bangla');
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <optgroup label="বাংলা গাইড">
                      {CATEGORY_OPTIONS.filter((c) => c.group === 'bn').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="English Writing">
                      {CATEGORY_OPTIONS.filter((c) => c.group === 'en').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    কন্টেন্ট স্ট্যাটাস (Workflow) *
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ContentLifecycleStatus)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="draft">Draft (খসড়া)</option>
                    <option value="review">Review (পর্যালোচনাধীন)</option>
                    <option value="approved">Approved (অনুমোদিত)</option>
                    <option value="published">Published (সরাসরি লাইভ)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">ভাষা</label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value as 'bn' | 'en')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="bn">বাংলা (Bangla)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  শিরোনাম বা বিষয় (Title / Topic) *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="যেমন: স্বদেশপ্রেম ও দেশগঠন / A Winter Morning"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  required
                />
              </div>

              {/* Class, Exam, Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">শ্রেণি (Class)</label>
                  <select
                    value={formClassId}
                    onChange={(e) => {
                      setFormClassId(e.target.value);
                      const labels: Record<string, string> = {
                        'class-5': '৫ম শ্রেণি',
                        'class-6': '৬ষ্ঠ শ্রেণি',
                        'class-7': '৭ম শ্রেণি',
                        'class-8': '৮ম শ্রেণি',
                        'class-9': '৯ম শ্রেণি',
                        'class-10': '১০ম শ্রেণি',
                        ssc: 'এসএসসি (SSC)',
                        hsc: 'এইচএসসি (HSC)',
                      };
                      setFormClassName(labels[e.target.value] || 'সকল শ্রেণি');
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  >
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

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">পরীক্ষা (Exam)</label>
                  <select
                    value={formExam}
                    onChange={(e) => setFormExam(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  >
                    <option value="২০২৬ বার্ষিক পরীক্ষা">২০২৬ বার্ষিক পরীক্ষা</option>
                    <option value="এসএসসি বোর্ড পরীক্ষা">এসএসসি বোর্ড পরীক্ষা</option>
                    <option value="এইচএসসি বোর্ড পরীক্ষা">এইচএসসি বোর্ড পরীক্ষা</option>
                    <option value="টেস্ট ও নির্বাচনী পরীক্ষা">টেস্ট ও নির্বাচনী পরীক্ষা</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">শিক্ষাবর্ষ</label>
                  <input
                    type="text"
                    value={formAcademicYear}
                    onChange={(e) => setFormAcademicYear(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Category-Specific Form Sections */}
              {/* भावসম্প্রসারণ fields */}
              {formCategory === 'bhabshomprosharon' && (
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-3">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>ভাবসম্প্রসারণের বিশেষ ক্ষেত্রসমূহ:</span>
                  </h4>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">১. মূল ভাব *</label>
                    <textarea
                      rows={2}
                      value={formMoolBhab}
                      onChange={(e) => setFormMoolBhab(e.target.value)}
                      placeholder="পঙ্‌ক্তিটির ভেতরের নিগূঢ় মূল অর্থ সংক্ষেপে লিখুন..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      ২. সম্প্রসারিত ভাব *
                    </label>
                    <textarea
                      rows={4}
                      value={formSomprosharithoBhab}
                      onChange={(e) => setFormSomprosharithoBhab(e.target.value)}
                      placeholder="যুক্তি, বাস্তব উদাহরণ ও তুলনার মাধ্যমে বিস্তারিত ভাব সম্প্রসারণ করুন..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      ৩. শিক্ষণীয় বিষয় / নীতিশিক্ষা
                    </label>
                    <input
                      type="text"
                      value={formShikkhonioBishoy}
                      onChange={(e) => setFormShikkhonioBishoy(e.target.value)}
                      placeholder="এই ভাবসম্প্রসারণ থেকে শিক্ষার্থীদের জন্য মূল বার্তা..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* সারাংশ / সারমর্ম fields */}
              {(formCategory === 'sarongsho' || formCategory === 'sarmormo') && (
                <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/60 space-y-3">
                  <h4 className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-teal-600" />
                    <span>
                      {formCategory === 'sarongsho' ? 'সারাংশ (গদ্যাংশ)' : 'সারমর্ম (পদ্য)'} বিশেষ ক্ষেত্র:
                    </span>
                  </h4>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      মূল অনুচ্ছেদ বা কবিতার পঙ্‌ক্তি (Source Text) *
                    </label>
                    <textarea
                      rows={3}
                      value={formSourceText}
                      onChange={(e) => setFormSourceText(e.target.value)}
                      placeholder="পরীক্ষায় প্রদত্ত মূল গদ্যাংশ বা কবিতার লাইনসমূহ লিখুন..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-sans italic"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      ব্যাখ্যা ও তাৎপর্য (Explanation)
                    </label>
                    <textarea
                      rows={2}
                      value={formExplanation}
                      onChange={(e) => setFormExplanation(e.target.value)}
                      placeholder="মূল পাঠের অন্তর্নিহিত অর্থ ও সারাংশ লেখার সূত্র..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* চিঠি / আবেদনপত্র fields */}
              {(formCategory === 'letter' ||
                formCategory === 'personal_letter' ||
                formCategory === 'application' ||
                formCategory === 'english_application' ||
                formCategory === 'english_letter' ||
                formCategory === 'english_email') && (
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 space-y-3">
                  <h4 className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>পত্র বা আবেদনের ধরন ও প্রেক্ষাপট:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">চিঠি বা আবেদনের ধরন</label>
                      <input
                        type="text"
                        value={formLetterType}
                        onChange={(e) => setFormLetterType(e.target.value)}
                        placeholder="যেমন: ব্যক্তিগত পত্র / প্রাতিষ্ঠানিক দরখাস্ত / দাপ্তরিক আবেদন"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">প্রেক্ষাপট (Situation)</label>
                      <input
                        type="text"
                        value={formSituation}
                        onChange={(e) => setFormSituation(e.target.value)}
                        placeholder="যেমন: অসুস্থতাজনিত ছুটির জন্য প্রধান শিক্ষকের নিকট আবেদন"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* গল্প fields */}
              {(formCategory === 'story' ||
                formCategory === 'completing_story' ||
                formCategory === 'english_story' ||
                formCategory === 'english_completing_story') && (
                <div className="p-4 rounded-2xl bg-fuchsia-50/60 dark:bg-fuchsia-950/20 border border-fuchsia-200 dark:border-fuchsia-800/60 space-y-2">
                  <h4 className="font-bold text-fuchsia-900 dark:text-fuchsia-200 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-fuchsia-600" />
                    <span>গল্পের নীতিশিক্ষা (Moral):</span>
                  </h4>
                  <input
                    type="text"
                    value={formMoral}
                    onChange={(e) => setFormMoral(e.target.value)}
                    placeholder="যেমন: সততাই সর্বোৎকৃষ্ট পন্থা / Where there is a will, there is a way"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              )}

              {/* Introduction & Structure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    ভূমিকা বা সারসংক্ষেপ (Introduction)
                  </label>
                  <textarea
                    rows={2}
                    value={formIntroduction}
                    onChange={(e) => setFormIntroduction(e.target.value)}
                    placeholder="কন্টেন্টটির প্রাথমিক ভূমিকা..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    লেখার কাঠামো ও ধাপসমূহ (Structure)
                  </label>
                  <textarea
                    rows={2}
                    value={formStructure}
                    onChange={(e) => setFormStructure(e.target.value)}
                    placeholder="১. ভূমিকা → ২. মূল বিষয় → ৩. উপসংহার"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Main Full Example (Core Content) */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>আদর্শ নমুনা উত্তর / সম্পূর্ণ লেখা (Original Example) *</span>
                  <span className="text-slate-400 font-normal">নমুনার মূল টেক্সট</span>
                </label>
                <textarea
                  rows={8}
                  value={formOriginalExample}
                  onChange={(e) => setFormOriginalExample(e.target.value)}
                  placeholder="সম্পূর্ণ আদর্শ প্রবন্ধ, অনুচ্ছেদ, চিঠি বা সারাংশের পাঠ এখানে লিখুন..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans leading-relaxed"
                  required
                />
              </div>

              {/* Main Points & Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    মূল পয়েন্টসমূহ (প্রতি লাইনে ১টি)
                  </label>
                  <textarea
                    rows={3}
                    value={formMainPointsText}
                    onChange={(e) => setFormMainPointsText(e.target.value)}
                    placeholder="পয়েন্ট ১&#10;পয়েন্ট ২&#10;পয়েন্ট ৩"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    পরীক্ষায় বেশি নম্বর পাওয়ার টিপস (প্রতি লাইনে ১টি)
                  </label>
                  <textarea
                    rows={3}
                    value={formImportantTipsText}
                    onChange={(e) => setFormImportantTipsText(e.target.value)}
                    placeholder="টিপ ১&#10;টিপ ২"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Common Mistakes & Practice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    সাধারণ ভুলসমূহ (Common Mistakes)
                  </label>
                  <textarea
                    rows={2}
                    value={formCommonMistakesText}
                    onChange={(e) => setFormCommonMistakesText(e.target.value)}
                    placeholder="যে ভুলগুলো এড়িয়ে চলতে হবে..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    অনুশীলনমূলক কাজ (Practice Prompts)
                  </label>
                  <textarea
                    rows={2}
                    value={formPracticeText}
                    onChange={(e) => setFormPracticeText(e.target.value)}
                    placeholder="শিক্ষার্থীদের জন্য হোমওয়ার্ক বা অনুশীলনী..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingItem ? 'আপডেট সম্পন্ন করুন' : 'সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
