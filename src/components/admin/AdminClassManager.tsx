import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit2, Eye, CheckCircle2, XCircle, Search, ExternalLink, Sliders } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ManagedClass } from '../../types';

interface AdminClassManagerProps {
  onPreview: (type: 'class', item: any) => void;
}

export const AdminClassManager: React.FC<AdminClassManagerProps> = ({ onPreview }) => {
  const { classes, managedClasses, saveClass, deleteClass, bulkUpdateClassesRange, navigate } = useApp();

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Range Configuration states
  const [rangeStart, setRangeStart] = useState<number>(6);
  const [rangeEnd, setRangeEnd] = useState<number>(10);
  const [isUpdatingRange, setIsUpdatingRange] = useState<boolean>(false);
  const [rangeSuccessMsg, setRangeSuccessMsg] = useState<string>('');

  // Form states
  const [id, setId] = useState('class-5');
  const [name, setName] = useState('');
  const [numericGrade, setNumericGrade] = useState(5);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setId(`class-${Date.now().toString().slice(-4)}`);
    setName('');
    setNumericGrade(6);
    setDescription('');
    setStatus('published');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (cls: any) => {
    setEditingId(cls.id);
    setId(cls.id);
    setName(cls.name);
    setNumericGrade(cls.numericGrade || 6);
    setDescription(cls.description || '');
    setStatus(cls.status || 'published');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await saveClass({
        id: editingId || id.trim(),
        name: name.trim(),
        numericGrade: Number(numericGrade),
        description: description.trim(),
        iconName: 'BookOpen',
        status,
      });
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving class:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (cls: any) => {
    const nextStatus = cls.status === 'draft' ? 'published' : 'draft';
    await saveClass({
      ...cls,
      status: nextStatus,
    });
  };

  const handleDelete = async (classId: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে '${classId}' শ্রেণিটি ডেটাবেজ থেকে মুছে ফেলতে চান?`)) {
      await deleteClass(classId);
    }
  };

  const handleBulkRangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rangeStart > rangeEnd) {
      alert('প্রারম্ভিক শ্রেণি শেষ শ্রেণির চেয়ে বড় হতে পারে না।');
      return;
    }
    setIsUpdatingRange(true);
    setRangeSuccessMsg('');
    try {
      await bulkUpdateClassesRange(rangeStart, rangeEnd);
      setRangeSuccessMsg(`সফলভাবে ${rangeStart}ম থেকে ${rangeEnd}তম শ্রেণি কনফিগার ও ডেটাবেজে সংরক্ষণ করা হয়েছে!`);
      setTimeout(() => setRangeSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error updating class range:', err);
    } finally {
      setIsUpdatingRange(false);
    }
  };

  // Merge built-in classes with firestore managed classes
  const combinedClasses = classes.map((c) => {
    const managed = managedClasses.find((m) => m.id === c.id);
    return {
      ...c,
      status: managed ? managed.status : 'published',
      isManagedInFirestore: Boolean(managed),
    };
  });

  const filtered = combinedClasses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Bulk Class Range Configurator */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 dark:from-slate-900 dark:via-purple-950/40 dark:to-slate-900 border border-purple-200 dark:border-purple-800/50 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-600" />
              <span>শ্রেণি কাঠামো পরিসীমা কনফিগার করুন (Bulk Class Range Generator)</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              যেমন: ৬ষ্ঠ থেকে ১০ম শ্রেণি, অথবা ৬ষ্ঠ থেকে ১৪তম শ্রেণি নির্ধারণ করুন। এটি স্বয়ংক্রিয়ভাবে ডাটাবেজে সেভ হয়ে পাবলিক ওয়েবসাইটে দৃশ্যমান হবে।
            </p>
          </div>
          {rangeSuccessMsg && (
            <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{rangeSuccessMsg}</span>
            </span>
          )}
        </div>

        <form onSubmit={handleBulkRangeSubmit} className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">প্রারম্ভিক শ্রেণি:</span>
          <select
            value={rangeStart}
            onChange={(e) => setRangeStart(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
          >
            <option value={1}>১ম শ্রেণি (Grade 1)</option>
            <option value={5}>৫ম শ্রেণি (Grade 5)</option>
            <option value={6}>৬ষ্ঠ শ্রেণি (Grade 6)</option>
          </select>

          <span className="font-bold text-slate-700 dark:text-slate-300">থেকে শেষ শ্রেণি:</span>
          <select
            value={rangeEnd}
            onChange={(e) => setRangeEnd(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
          >
            <option value={8}>৮ম শ্রেণি (Grade 8)</option>
            <option value={10}>১০ম শ্রেণি (Grade 10)</option>
            <option value={12}>১২তম শ্রেণি (Grade 12)</option>
            <option value={14}>১৪তম শ্রেণি (Grade 14)</option>
          </select>

          <button
            type="submit"
            disabled={isUpdatingRange}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isUpdatingRange ? 'সংরক্ষণ হচ্ছে...' : 'শ্রেণি কাঠামো আপডেট ও সংরক্ষণ করুন'}</span>
          </button>
        </form>
      </div>

      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="শ্রেণি খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন শ্রেণি যোগ করুন</span>
        </button>
      </div>

      {/* Class List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cls) => {
          const isPublished = cls.status === 'published';
          return (
            <div
              key={cls.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black dark:text-white">
                      {cls.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {cls.id}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStatus(cls)}
                  className={`px-2.5 py-1 rounded-full text-xs font-black transition ${
                    isPublished
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                  title="স্ট্যাটাস পরিবর্তন করুন"
                >
                  {isPublished ? 'Published' : 'Draft'}
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {cls.description || 'পাঠ্যক্রম অনুযায়ী সাধারণ শ্রেণি বর্ণনা।'}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold">গ্রেড: {cls.numericGrade}</span>

                <div className="flex items-center gap-1.5">
                  {isPublished && (
                    <button
                      onClick={() => navigate('subjects', { classId: cls.id })}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1 transition shadow-xs"
                      title="পাবলিক ওয়েবসাইটে এই শ্রেণি দেখুন"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View on Website</span>
                    </button>
                  )}
                  <button
                    onClick={() => onPreview('class', cls)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition"
                    title="প্রিভিউ দেখুন"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                    title="সম্পাদনা করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cls.id)}
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

      {/* Add / Edit Class Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {editingId ? 'শ্রেণি সম্পাদনা করুন' : 'নতুন শ্রেণি যোগ করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  শ্রেণি আইডি (Class ID):
                </label>
                <input
                  type="text"
                  disabled={Boolean(editingId)}
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="e.g. class-5, class-11, ssc"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  শ্রেণির নাম (বাংলায়):
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: ৫ম শ্রেণি, একাদশ শ্রেণি"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    সংখ্যাগত গ্রেড (Numeric Grade):
                  </label>
                  <input
                    type="number"
                    value={numericGrade}
                    onChange={(e) => setNumericGrade(Number(e.target.value))}
                    min={1}
                    max={12}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    স্ট্যাটাস (Status):
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="published">Published (প্রকাশিত)</option>
                    <option value="draft">Draft (ড্রাফট)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিবরণ:
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="শ্রেণির সংক্ষিপ্ত পরিচিতি..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
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
