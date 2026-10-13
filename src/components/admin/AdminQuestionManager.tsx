import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, Edit2, Eye, Search, Filter, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ManagedQuestion, ClassId, SubjectId } from '../../types';

interface AdminQuestionManagerProps {
  onPreview: (type: 'question', item: any) => void;
}

export const AdminQuestionManager: React.FC<AdminQuestionManagerProps> = ({ onPreview }) => {
  const { classes, subjects, chapters, managedQuestions, saveQuestion, deleteQuestion } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'mcq' | 'cq'>('all');
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formType, setFormType] = useState<'mcq' | 'cq'>('mcq');
  const [formClassId, setFormClassId] = useState<ClassId>('class-8');
  const [formSubjectId, setFormSubjectId] = useState<SubjectId>('science');
  const [formChapterId, setFormChapterId] = useState<string>('ch-general');
  const [questionText, setQuestionText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [source, setSource] = useState('ঢাকা বোর্ড');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isSaving, setIsSaving] = useState(false);

  const availableSubjectsForForm = subjects.filter((s) => s.classId === formClassId);
  const availableChaptersForForm = chapters.filter(
    (c) => c.classId === formClassId && c.subjectId === formSubjectId
  );

  const resetForm = () => {
    setQuestionText('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setCorrectIndex(0);
    setExplanation('');
    setSource('NCTB পাঠ্যবই');
    setStatus('published');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (q: ManagedQuestion) => {
    setEditingId(q.id);
    setFormType(q.type || 'mcq');
    setFormClassId(q.classId as ClassId);
    setFormSubjectId(q.subjectId as SubjectId);
    setFormChapterId(q.chapterId || 'ch-general');
    setQuestionText(q.question);
    setOpt0(q.options?.[0] || '');
    setOpt1(q.options?.[1] || '');
    setOpt2(q.options?.[2] || '');
    setOpt3(q.options?.[3] || '');
    setCorrectIndex(q.correctAnswerIndex ?? 0);
    setExplanation(q.explanation || '');
    setSource(q.source || '');
    setStatus(q.status);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setIsSaving(true);
    const qId = editingId || `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const options = formType === 'mcq' ? [opt0, opt1, opt2, opt3].filter(Boolean) : [];

    try {
      await saveQuestion({
        id: qId,
        classId: formClassId,
        subjectId: formSubjectId,
        chapterId: formChapterId || 'ch-general',
        question: questionText.trim(),
        options,
        correctAnswerIndex: correctIndex,
        explanation: explanation.trim(),
        source: source.trim(),
        type: formType,
        status,
      });
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving question:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (q: ManagedQuestion) => {
    const nextStatus = q.status === 'draft' ? 'published' : 'draft';
    await saveQuestion({
      ...q,
      status: nextStatus,
    });
  };

  const handleDelete = async (questionId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি ডেটাবেজ থেকে মুছে ফেলতে চান?')) {
      await deleteQuestion(questionId);
    }
  };

  const filtered = managedQuestions.filter((q) => {
    if (selectedClassId !== 'all' && q.classId !== selectedClassId) return false;
    if (selectedSubjectId !== 'all' && q.subjectId !== selectedSubjectId) return false;
    if (selectedType !== 'all' && q.type !== selectedType) return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      return (
        q.question.toLowerCase().includes(query) ||
        (q.explanation && q.explanation.toLowerCase().includes(query)) ||
        (q.source && q.source.toLowerCase().includes(query))
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

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">সকল টাইপ (MCQ ও CQ)</option>
            <option value="mcq">বহুনির্বাচনী (MCQ)</option>
            <option value="cq">সৃজনশীল (CQ)</option>
          </select>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="প্রশ্ন বা কীওয়ার্ড খুঁজুন..."
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
          <span>নতুন প্রশ্ন যোগ করুন</span>
        </button>
      </div>

      {/* Questions List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            কোনো ম্যানেজড প্রশ্ন পাওয়া যায়নি
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            আপনার ওয়েবসাইটে নতুন MCQ বা সৃজনশীল প্রশ্ন যুক্ত করতে উপরের বোতামে ক্লিক করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => {
            const isPublished = q.status === 'published';
            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 hover:border-purple-300 dark:hover:border-purple-800 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 uppercase">
                      {q.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {q.classId} • {q.subjectId}
                    </span>
                    {q.source && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        {q.source}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(q)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                        isPublished
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {isPublished ? 'Published (লাইভ)' : 'Draft (ড্রাফট)'}
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {q.question}
                </h4>

                {/* MCQ Options Display */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    {q.options.map((opt, idx) => {
                      const isCorrect = q.correctAnswerIndex === idx;
                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl border flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center">
                              {['ক', 'খ', 'গ', 'ঘ'][idx] || idx + 1}
                            </span>
                            <span>{opt}</span>
                          </span>
                          {isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.explanation && (
                  <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <strong className="text-slate-700 dark:text-slate-300">ব্যাখ্যা: </strong>
                    {q.explanation}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[10px] font-mono">{q.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPreview('question', q)}
                      className="px-2.5 py-1 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 font-bold flex items-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>প্রিভিউ</span>
                    </button>
                    <button
                      onClick={() => handleOpenEdit(q)}
                      className="px-2.5 py-1 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-bold flex items-center gap-1 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>সম্পাদনা</span>
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold flex items-center gap-1 transition"
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

      {/* Add / Edit Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {editingId ? 'প্রশ্ন সম্পাদনা করুন' : 'নতুন প্রশ্ন যোগ করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    টাইপ:
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="mcq">বহুনির্বাচনী প্রশ্ন (MCQ)</option>
                    <option value="cq">সৃজনশীল প্রশ্ন (CQ)</option>
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
                    <option value="published">Published (সরাসরি লাইভ)</option>
                    <option value="draft">Draft (ড্রাফট হিসেবে সংরক্ষণ)</option>
                  </select>
                </div>
              </div>

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
                  প্রশ্ন:
                </label>
                <textarea
                  rows={2}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="প্রশ্নের মূল বক্তব্য লিখুন..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Options for MCQ */}
              {formType === 'mcq' && (
                <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="block font-bold text-slate-700 dark:text-slate-300">
                    অপশনসমূহ ও সঠিক উত্তর নির্বাচন:
                  </span>
                  {[
                    { label: 'ক', val: opt0, set: setOpt0, idx: 0 },
                    { label: 'খ', val: opt1, set: setOpt1, idx: 1 },
                    { label: 'গ', val: opt2, set: setOpt2, idx: 2 },
                    { label: 'ঘ', val: opt3, set: setOpt3, idx: 3 },
                  ].map((item) => (
                    <div key={item.idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct-opt"
                        checked={correctIndex === item.idx}
                        onChange={() => setCorrectIndex(item.idx)}
                        className="text-emerald-600 focus:ring-emerald-500"
                        title="সঠিক উত্তর হিসেবে চিহ্নিত করুন"
                      />
                      <span className="w-5 text-center font-bold text-slate-500">{item.label}</span>
                      <input
                        type="text"
                        value={item.val}
                        onChange={(e) => item.set(e.target.value)}
                        placeholder={`অপশন ${item.label}...`}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-purple-500"
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সঠিক উত্তরের বিশদ ব্যাখ্যা:
                </label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="শিক্ষার্থীদের জন্য সহজ ব্যাখ্যা..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  উৎস / পরীক্ষার ট্যাগ:
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="যেমন: ঢাকা বোর্ড ২০২৩, পাঠ্যবই পৃষ্ঠা ৪২"
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
