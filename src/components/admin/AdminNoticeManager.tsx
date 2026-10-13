import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, Edit2, Eye, Bell, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ManagedNotice } from '../../types';

interface AdminNoticeManagerProps {
  onPreview: (type: 'notice', item: any) => void;
}

export const AdminNoticeManager: React.FC<AdminNoticeManagerProps> = ({ onPreview }) => {
  const { managedNotices, saveNotice, deleteNotice } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [type, setType] = useState<'urgent' | 'info' | 'festive' | 'exam'>('info');
  const [showOnBanner, setShowOnBanner] = useState(true);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setTitle('');
    setText('');
    setType('info');
    setShowOnBanner(true);
    setStatus('published');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (notice: ManagedNotice) => {
    setEditingId(notice.id);
    setTitle(notice.title);
    setText(notice.text);
    setType(notice.type || 'info');
    setShowOnBanner(Boolean(notice.showOnBanner));
    setStatus(notice.status);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    setIsSaving(true);
    const noticeId = editingId || `notice-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    try {
      await saveNotice({
        id: noticeId,
        title: title.trim(),
        text: text.trim(),
        type,
        showOnBanner,
        status,
      });
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving notice:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleBanner = async (notice: ManagedNotice) => {
    await saveNotice({
      ...notice,
      showOnBanner: !notice.showOnBanner,
    });
  };

  const handleToggleStatus = async (notice: ManagedNotice) => {
    const nextStatus = notice.status === 'draft' ? 'published' : 'draft';
    await saveNotice({
      ...notice,
      status: nextStatus,
    });
  };

  const handleDelete = async (noticeId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই নোটিসটি মুছে ফেলতে চান?')) {
      await deleteNotice(noticeId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            সাইট নোটিস ও তাৎক্ষণিক এলার্ট
          </h3>
          <p className="text-xs text-slate-500">
            ওয়েবসাইটের শীর্ষে ব্যানার হিসেবে ঘোষণা প্রদর্শন করুন।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন নোটিস জারি করুন</span>
        </button>
      </div>

      {/* Notices List */}
      {managedNotices.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
          <Megaphone className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            কোনো নোটিস সক্রিয় নেই
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            পরীক্ষার রুটিন, নোটিফিকেশন বা শুভেচ্ছা বার্তা প্রচার করতে নতুন নোটিস যোগ করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {managedNotices.map((n) => {
            const isPublished = n.status === 'published';
            return (
              <div
                key={n.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        n.type === 'urgent'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : n.type === 'exam'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : n.type === 'festive'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {n.type}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {n.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBanner(n)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
                        n.showOnBanner
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                      }`}
                      title="ওয়েবসাইট ব্যানারে দেখানো বা বন্ধ করা"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{n.showOnBanner ? 'ব্যানারে সক্রিয়' : 'ব্যানারে নিষ্ক্রিয়'}</span>
                    </button>

                    <button
                      onClick={() => handleToggleStatus(n)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition ${
                        isPublished
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {isPublished ? 'Published' : 'Draft'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {n.text}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[10px]">{n.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPreview('notice', n)}
                      className="px-2 py-1 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 font-bold flex items-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>প্রিভিউ</span>
                    </button>
                    <button
                      onClick={() => handleOpenEdit(n)}
                      className="px-2 py-1 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-bold flex items-center gap-1 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>সম্পাদনা</span>
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {editingId ? 'নোটিস সম্পাদনা করুন' : 'নতুন নোটিস জারি করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  শিরোনাম:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: এসবিএ ও বার্ষিক মূল্যায়ন সংক্রান্ত বিশেষ নোটিস"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  নোটিসের মূল বক্তব্য:
                </label>
                <textarea
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="ঘোষণার বিবরণ লিখুন..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ধরন:
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="info">সাধারণ তথ্য (Info)</option>
                    <option value="urgent">জরুরি (Urgent)</option>
                    <option value="exam">পরীক্ষা সংক্রান্ত (Exam)</option>
                    <option value="festive">উৎসব / ছুটি (Festive)</option>
                  </select>
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

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="notice-banner-check"
                  checked={showOnBanner}
                  onChange={(e) => setShowOnBanner(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="notice-banner-check" className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  ওয়েবসাইটের শীর্ষে চলমান ব্যানারে প্রদর্শন করুন
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
