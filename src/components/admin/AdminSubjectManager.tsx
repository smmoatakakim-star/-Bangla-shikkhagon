import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Eye, Search, Filter, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ManagedSubject, ClassId } from '../../types';

interface AdminSubjectManagerProps {
  onPreview: (type: 'subject', item: any) => void;
}

export const AdminSubjectManager: React.FC<AdminSubjectManagerProps> = ({ onPreview }) => {
  const { classes, subjects, managedSubjects, saveSubject, deleteSubject, navigate } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [subId, setSubId] = useState('sub-custom-1');
  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [classId, setClassId] = useState<ClassId>('class-6');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setSubId(`sub-${Date.now().toString().slice(-4)}`);
    setName('');
    setBanglaName('');
    setClassId((selectedClassId !== 'all' ? selectedClassId : 'class-6') as ClassId);
    setDescription('');
    setStatus('published');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (sub: any) => {
    setEditingId(sub.id);
    setSubId(sub.id);
    setName(sub.name);
    setBanglaName(sub.banglaName || sub.name);
    setClassId(sub.classId);
    setDescription(sub.description || '');
    setStatus(sub.status || 'published');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await saveSubject({
        id: editingId || subId.trim(),
        name: name.trim(),
        banglaName: banglaName.trim() || name.trim(),
        classId: classId.trim(),
        description: description.trim(),
        iconName: 'BookOpen',
        status,
      });
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving subject:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (sub: any) => {
    const nextStatus = sub.status === 'draft' ? 'published' : 'draft';
    await saveSubject({
      ...sub,
      status: nextStatus,
    });
  };

  const handleDelete = async (subjectId: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে '${subjectId}' বিষয়টি মুছে ফেলতে চান?`)) {
      await deleteSubject(subjectId);
    }
  };

  // Combine subjects with managed status
  const combined = subjects.map((s) => {
    const managed = managedSubjects.find((m) => m.id === s.id);
    return {
      ...s,
      status: managed ? managed.status : 'published',
    };
  });

  const filtered = combined.filter((s) => {
    if (selectedClassId !== 'all' && s.classId !== selectedClassId) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.banglaName && s.banglaName.toLowerCase().includes(q)) ||
        s.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">সকল শ্রেণি ({subjects.length})</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="বিষয় খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বিষয় যোগ করুন</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sub) => {
          const isPublished = sub.status === 'published';
          const parentClass = classes.find((c) => c.id === sub.classId);

          return (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {sub.banglaName || sub.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {parentClass?.name || sub.classId} • ID: {sub.id}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStatus(sub)}
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
                {sub.description || 'বোর্ড পাঠ্যক্রম অনুযায়ী নির্ধারিত সাধারণ পাঠ্য বিষয়।'}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold">ইংরেজি: {sub.name}</span>

                <div className="flex items-center gap-1.5">
                  {isPublished && (
                    <button
                      onClick={() => navigate('chapters', { classId: sub.classId, subjectId: sub.id })}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1 transition shadow-xs"
                      title="পাবলিক ওয়েবসাইটে এই বিষয় দেখুন"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View on Website</span>
                    </button>
                  )}
                  <button
                    onClick={() => onPreview('subject', sub)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition"
                    title="প্রিভিউ দেখুন"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(sub)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                    title="সম্পাদনা করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
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

      {/* Add / Edit Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {editingId ? 'বিষয় সম্পাদনা করুন' : 'নতুন বিষয় যোগ করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  শ্রেণি নির্বাচন করুন:
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিষয়ের নাম (বাংলায়):
                </label>
                <input
                  type="text"
                  value={banglaName}
                  onChange={(e) => setBanglaName(e.target.value)}
                  placeholder="যেমন: বাংলা প্রথম পত্র, উচ্চতর গণিত, বিজ্ঞান"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ইংরেজি নাম:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Higher Math, Science"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
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
                  বিবরণ:
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="বিষয়টির সংক্ষিপ্ত রূপরেখা..."
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
