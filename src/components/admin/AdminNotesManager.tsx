import React, { useState } from 'react';
import { FileText, Plus, Trash2, Edit2, Eye, Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ManagedNote, ClassId, SubjectId } from '../../types';

interface AdminNotesManagerProps {
  onPreview: (type: 'note', item: any) => void;
}

export const AdminNotesManager: React.FC<AdminNotesManagerProps> = ({ onPreview }) => {
  const { classes, subjects, chapters, managedNotes, saveNote, deleteNote, lessons } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formClassId, setFormClassId] = useState<ClassId>('class-8');
  const [formSubjectId, setFormSubjectId] = useState<SubjectId>('science');
  const [formChapterId, setFormChapterId] = useState<string>('ch-general');
  const [title, setTitle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [keyPointsText, setKeyPointsText] = useState('');
  const [quickNotes, setQuickNotes] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isSaving, setIsSaving] = useState(false);

  const availableSubjectsForForm = subjects.filter((s) => s.classId === formClassId);
  const availableChaptersForForm = chapters.filter(
    (c) => c.classId === formClassId && c.subjectId === formSubjectId
  );

  const resetForm = () => {
    setTitle('');
    setExplanation('');
    setKeyPointsText('');
    setQuickNotes('');
    setStatus('published');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (note: ManagedNote) => {
    setEditingId(note.id);
    setFormClassId(note.classId as ClassId);
    setFormSubjectId(note.subjectId as SubjectId);
    setFormChapterId(note.chapterId || 'ch-general');
    setTitle(note.title);
    setExplanation(note.explanation);
    setKeyPointsText((note.keyPoints || []).join('\n'));
    setQuickNotes(note.quickNotes || '');
    setStatus(note.status);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !explanation.trim()) return;

    setIsSaving(true);
    const noteId = editingId || `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const keyPoints = keyPointsText.split('\n').map((s) => s.trim()).filter(Boolean);

    try {
      await saveNote({
        id: noteId,
        classId: formClassId,
        subjectId: formSubjectId,
        chapterId: formChapterId || 'ch-general',
        title: title.trim(),
        explanation: explanation.trim(),
        keyPoints,
        quickNotes: quickNotes.trim(),
        status,
      });
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (note: ManagedNote) => {
    const nextStatus = note.status === 'draft' ? 'published' : 'draft';
    await saveNote({
      ...note,
      status: nextStatus,
    });
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই স্টাডি নোটটি মুছে ফেলতে চান?')) {
      await deleteNote(noteId);
    }
  };

  const filtered = managedNotes.filter((n) => {
    if (selectedClassId !== 'all' && n.classId !== selectedClassId) return false;
    if (selectedSubjectId !== 'all' && n.subjectId !== selectedSubjectId) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.explanation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Actions */}
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
            <option value="all">সকল শ্রেণি</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নোট বা অধ্যায় খুঁজুন..."
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
          <span>নতুন নোট যোগ করুন</span>
        </button>
      </div>

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
          <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            কোনো ম্যানেজড নোট পাওয়া যায়নি
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            পরীক্ষার প্রস্তুতি বা অধ্যায়ের বিশদ ব্যাখ্যার জন্য নতুন স্টাডি নোট যুক্ত করতে উপরের বোতামে ক্লিক করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((note) => {
            const isPublished = note.status === 'published';
            return (
              <div
                key={note.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      {note.classId} • {note.subjectId}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {note.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(note)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                      isPublished
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                    }`}
                  >
                    {isPublished ? 'Published' : 'Draft'}
                  </button>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {note.explanation}
                </p>

                {note.keyPoints && note.keyPoints.length > 0 && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ {note.keyPoints.length}টি মূল পয়েন্ট অন্তর্ভুক্ত
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[10px] font-mono">{note.id}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onPreview('note', note)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition"
                      title="প্রিভিউ দেখুন"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                      title="সম্পাদনা করুন"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
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
      )}

      {/* Add / Edit Note Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {editingId ? 'নোট সম্পাদনা করুন' : 'নতুন স্টাডি নোট যোগ করুন'}
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

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  নোটের শিরোনাম:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: সালোকসংশ্লেষণ প্রক্রিয়ার মূল ব্যাখ্যা ও সমীকরণ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিস্তারিত ব্যাখ্যা / মূল কন্টেন্ট:
                </label>
                <textarea
                  rows={4}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="পাঠের বিশদ আলোচনা ও ব্যাখ্যা..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মূল পয়েন্টসমূহ (প্রতি লাইনে একটি করে পয়েন্ট লিখুন):
                </label>
                <textarea
                  rows={3}
                  value={keyPointsText}
                  onChange={(e) => setKeyPointsText(e.target.value)}
                  placeholder="পয়েন্ট ১&#10;পয়েন্ট ২&#10;পয়েন্ট ৩"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    দ্রুত রিভিশন সামারি:
                  </label>
                  <input
                    type="text"
                    value={quickNotes}
                    onChange={(e) => setQuickNotes(e.target.value)}
                    placeholder="এক লাইনে রিভিশন সূত্র..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
