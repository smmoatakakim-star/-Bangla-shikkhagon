import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Eye, Search, Filter, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ManagedChapter, ClassId, SubjectId } from '../../types';

interface AdminChapterManagerProps {
  onPreview: (type: 'chapter', item: any) => void;
}

export const AdminChapterManager: React.FC<AdminChapterManagerProps> = ({ onPreview }) => {
  const { classes, subjects, chapters, managedChapters, saveChapter, deleteChapter } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('class-6');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [formClassId, setFormClassId] = useState<ClassId>('class-6');
  const [formSubjectId, setFormSubjectId] = useState<SubjectId>('science');
  const [description, setDescription] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isSaving, setIsSaving] = useState(false);

  const availableSubjectsForForm = subjects.filter((s) => s.classId === formClassId);
  const availableSubjectsForFilter = subjects.filter((s) => s.classId === selectedClassId);

  const resetForm = () => {
    setTitle('');
    setChapterNumber(1);
    setFormClassId(selectedClassId as ClassId);
    setFormSubjectId((availableSubjectsForFilter[0]?.id || 'bangla') as SubjectId);
    setDescription('');
    setIsPopular(false);
    setStatus('published');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (ch: any) => {
    setEditingId(ch.id);
    setTitle(ch.title);
    setChapterNumber(ch.chapterNumber || 1);
    setFormClassId(ch.classId);
    setFormSubjectId(ch.subjectId);
    setDescription(ch.description || '');
    setIsPopular(Boolean(ch.isPopular));
    setStatus(ch.status || 'published');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    const chapterId =
      editingId ||
      `ch-${formClassId}-${formSubjectId}-${Date.now().toString().slice(-4)}`;

    try {
      await saveChapter({
        id: chapterId,
        classId: formClassId,
        subjectId: formSubjectId,
        title: title.trim(),
        chapterNumber: Number(chapterNumber),
        description: description.trim(),
        isPopular,
        status,
      });
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving chapter:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (ch: any) => {
    const nextStatus = ch.status === 'draft' ? 'published' : 'draft';
    await saveChapter({
      ...ch,
      status: nextStatus,
    });
  };

  const handleDelete = async (chapterId: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে '${chapterId}' অধ্যায়টি মুছে ফেলতে চান?`)) {
      await deleteChapter(chapterId);
    }
  };

  const combined = chapters.map((c) => {
    const managed = managedChapters.find((m) => m.id === c.id);
    return {
      ...c,
      status: managed ? managed.status : 'published',
    };
  });

  const filtered = combined.filter((c) => {
    if (selectedClassId !== 'all' && c.classId !== selectedClassId) return false;
    if (selectedSubjectId !== 'all' && c.subjectId !== selectedSubjectId) return false;
    if (search.trim()) {
      return (
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Class Filter */}
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedSubjectId('all');
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">সকল বিষয়</option>
            {availableSubjectsForFilter.map((s) => (
              <option key={s.id} value={s.id}>
                {s.banglaName || s.name}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="অধ্যায়ের নাম খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full lg:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অধ্যায় যোগ করুন</span>
        </button>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ch) => {
          const isPublished = ch.status === 'published';
          const subInfo = subjects.find((s) => s.id === ch.subjectId);

          return (
            <div
              key={ch.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      অধ্যায় {(ch as any).chapterNumber || (ch as any).order || 1}
                    </span>
                    {ch.isPopular && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>জনপ্রিয়</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {ch.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {subInfo?.banglaName || ch.subjectId} • {ch.classId}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleStatus(ch)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                    isPublished
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                  }`}
                  title="স্ট্যাটাস পরিবর্তন করুন"
                >
                  {isPublished ? 'Published' : 'Draft'}
                </button>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2">
                {ch.description || 'অধ্যায়ভিত্তিক পাঠ্য ব্যাখ্যা ও অনুশীলন প্রশ্নোত্তর।'}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[10px] truncate max-w-[130px]">{ch.id}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onPreview('chapter', ch)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition"
                    title="প্রিভিউ দেখুন"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(ch)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                    title="সম্পাদনা করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ch.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Chapter Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {editingId ? 'অধ্যায় সম্পাদনা করুন' : 'নতুন অধ্যায় যোগ করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শ্রেণি:
                  </label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বিষয়:
                  </label>
                  <select
                    value={formSubjectId}
                    onChange={(e) => setFormSubjectId(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {availableSubjectsForForm.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.banglaName || s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    অধ্যায় নং:
                  </label>
                  <input
                    type="number"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    স্ট্যাটাস:
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অধ্যায়ের শিরোনাম:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: প্রাণিজগতের শ্রেণিবিন্যাস, বাস্তব সংখ্যা"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অধ্যায়ের মূল বিবরণ:
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="অধ্যায়ের বিষয়বস্তুর সংক্ষিপ্ত ব্যাখ্যা..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="ch-popular-check"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="ch-popular-check" className="text-xs text-slate-600 dark:text-slate-300">
                  হোম পেজে জনপ্রিয় অধ্যায় হিসেবে হাইলাইট করুন
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
