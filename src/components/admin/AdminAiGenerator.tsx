import React, { useState } from 'react';
import { Sparkles, Eye, CheckCircle2, Trash2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { chatWithAiTeacher } from '../../services/aiService';
import { AdminDraftItem, ClassId, SubjectId } from '../../types';

interface AdminAiGeneratorProps {
  onPreview: (type: 'draft', item: any) => void;
}

export const AdminAiGenerator: React.FC<AdminAiGeneratorProps> = ({ onPreview }) => {
  const { classes, subjects, adminDrafts, saveDraft, deleteDraft, approveAndPublishDraft } = useApp();

  const [generationType, setGenerationType] = useState<'mcq' | 'lesson' | 'notice'>('mcq');
  const [targetClass, setTargetClass] = useState<ClassId>('class-8');
  const [targetSubject, setTargetSubject] = useState<SubjectId>('science');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const availableSubjects = subjects.filter((s) => s.classId === targetClass);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('অনুগ্রহ করে একটি বিষয় বা টপিক উল্লেখ করুন');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let prompt = '';
      if (generationType === 'mcq') {
        prompt = `শ্রেণি: ${targetClass}, বিষয়: ${targetSubject}, অধ্যায়/টপিক: "${topic}"।
অনুগ্রহ করে NCTB সিলেবাস অনুযায়ী ৪টি অপশন (ক, খ, গ, ঘ) সহ একটি মানসম্মত বহুনির্বাচনী প্রশ্ন, সঠিক উত্তরের ইনডেক্স (০ থেকে ৩) এবং সঠিক উত্তরের বিস্তারিত ব্যাখ্যা তৈরি করুন।
ফরম্যাট:
প্রশ্ন: [প্রশ্নের বক্তব্য]
ক) [অপশন ১]
খ) [অপশন ২]
গ) [অপশন ৩]
ঘ) [অপশন ৪]
সঠিক উত্তর: [ক/খ/গ/ঘ]
ব্যাখ্যা: [ধাপভিত্তিক নির্ভুল ব্যাখ্যা]`;
      } else if (generationType === 'lesson') {
        prompt = `শ্রেণি: ${targetClass}, বিষয়: ${targetSubject}, অধ্যায়/টপিক: "${topic}"।
অনুগ্রহ করে শিক্ষার্থীদের জন্য একটি আকর্ষণীয়, সহজ ও বিস্তারিত স্টাডি নোট তৈরি করুন।
এতে অন্তর্ভুক্ত করুন:
১. মূল পাঠের ব্যাখ্যা
২. ৩টি গুরুত্বপূর্ণ পয়েন্ট
৩. দ্রুত রিভিশন সামারি`;
      } else {
        prompt = `বাংলা শিক্ষাগার ওয়েবসাইটের জন্য "${topic}" বিষয়ে শিক্ষার্থীদের উদ্দেশ্যে একটি নোটিস ও ঘোষণা তৈরি করুন।`;
      }

      const reply = await chatWithAiTeacher(prompt, {
        classId: targetClass,
        subjectId: targetSubject,
      });

      // Parse MCQ structure if generated
      let parsedData: any = null;
      if (generationType === 'mcq') {
        parsedData = {
          question: `${topic}: মূল প্রশ্ন`,
          options: ['অপশন ক', 'অপশন খ', 'অপশন গ', 'অপশন ঘ'],
          correctAnswerIndex: 0,
          explanation: reply,
        };

        const lines = reply.split('\n');
        const qLine = lines.find((l) => l.includes('প্রশ্ন:'));
        if (qLine) {
          parsedData.question = qLine.replace('প্রশ্ন:', '').trim();
        }
      } else if (generationType === 'lesson') {
        parsedData = {
          title: topic,
          explanation: reply,
          keyPoints: ['মৌলিক সংজ্ঞা ও শর্ত', 'বাস্তব প্রয়োগ', 'পরীক্ষার প্রস্তুতি টিপস'],
          quickNotes: 'নিয়মিত অনুশীলনের মাধ্যমে স্পষ্ট ধারণা রাখুন।',
        };
      }

      const draftId = `draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newDraft: AdminDraftItem = {
        id: draftId,
        type: generationType,
        topic: topic.trim(),
        targetClass,
        targetSubject,
        content: reply,
        parsedData,
        status: 'draft',
        createdAt: new Date().toISOString(),
      };

      await saveDraft(newDraft);
      setSuccessMsg('AI কন্টেন্ট সফলভাবে জেনারেট হয়ে ড্রাফট কিউতে জমা হয়েছে। নিচে প্রিভিউ ও অনুমোদন করুন।');
      setTopic('');
    } catch (err: any) {
      console.error('AI Generation error:', err);
      setErrorMsg('AI কন্টেন্ট তৈরিতে সাময়িক সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async (draft: AdminDraftItem) => {
    try {
      await approveAndPublishDraft(draft);
      setSuccessMsg(`'${draft.topic}' ড্রাফটটি সফলভাবে লাইভ ওয়েবসাইটে পাবলিশ করা হয়েছে!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error approving draft:', err);
    }
  };

  const handleDiscard = async (draftId: string) => {
    if (window.confirm('আপনি কি এই ড্রাফটটি বাতিল ও মুছে ফেলতে চান?')) {
      await deleteDraft(draftId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-lg space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Gemini AI কন্টেন্ট জেনারেটর ও সিকিউর স্টেজ</span>
        </div>
        <h3 className="text-lg font-bold">AI দিয়ে কন্টেন্ট তৈরি ও ড্রাফট অনুমোদন</h3>
        <p className="text-xs text-purple-200 leading-relaxed max-w-2xl">
          নিরাপত্তা নিশ্চিত করতে AI দ্বারা তৈরিকৃত কোনো কন্টেন্ট সরাসরি লাইভ হবে না। এটি প্রথমে এখানে <strong>ড্রাফট (Draft)</strong> হিসেবে সংরক্ষিত থাকবে। আপনি প্রিভিউ দেখে সন্তুষ্ট হলে <strong>“অনুমোদন ও প্রকাশ”</strong> বোতামে চাপ দিলে তা লাইভ ওয়েবসাইটে যুক্ত হবে।
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Generator Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          নতুন শিক্ষামূলক কন্টেন্ট জেনারেট করুন:
        </h4>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                কন্টেন্টের ধরন:
              </label>
              <select
                value={generationType}
                onChange={(e) => setGenerationType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
              >
                <option value="mcq">বহুনির্বাচনী প্রশ্ন (MCQ Quiz)</option>
                <option value="lesson">স্টাডি নোট ও পাঠ (Study Lesson)</option>
                <option value="notice">সাইট নোটিস ও ঘোষণা (Site Notice)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                লক্ষ্য শ্রেণি:
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value as any)}
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
                পাঠ্য বিষয়:
              </label>
              <select
                value={targetSubject}
                onChange={(e) => setTargetSubject(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {availableSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.banglaName || s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              টপিক / বিষয়বস্তুর নাম বা নির্দেশনা:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="যেমন: সালোকসংশ্লেষণ প্রক্রিয়ার রাসায়নিক সমীকরণ, পিথাগোরাসের উপপাদ্যের বাস্তব প্রয়োগ, ইত্যাদি..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI কন্টেন্ট জেনারেট হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI দিয়ে ড্রাফট তৈরি করুন</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Staged Drafts Review Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>অনুমোদনের অপেক্ষায় থাকা ড্রাফটসমূহ</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              {adminDrafts.length}
            </span>
          </h4>
        </div>

        {adminDrafts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-xs text-slate-400">
            বর্তমানে কোনো পেন্ডিং ড্রাফট নেই। নতুন কন্টেন্ট তৈরি করতে উপরের ফর্মটি পূরণ করুন।
          </div>
        ) : (
          <div className="space-y-3">
            {adminDrafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      {draft.type}
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {draft.topic}
                    </h5>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {draft.targetClass} • {draft.targetSubject}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 whitespace-pre-line">
                  {draft.content}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => onPreview('draft', draft)}
                    className="px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-bold flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>প্রিভিউ দেখুন</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDiscard(draft.id)}
                      className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>বাতিল করুন</span>
                    </button>

                    <button
                      onClick={() => handleApprove(draft)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>অনুমোদন ও প্রকাশ করুন</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
