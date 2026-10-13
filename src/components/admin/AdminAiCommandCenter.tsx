import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  ArrowRight,
  Clock,
  History,
  AlertTriangle,
  HelpCircle,
  FileText,
  Megaphone,
  Globe,
  Layers,
  Check,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { executeAiCommand, AICommandDraft } from '../../services/aiCommandEngine';
import { AICommandHistoryItem, ManagedQuestion, ManagedNote, ManagedChapter, ManagedNotice } from '../../types';
import { AdminPublishDirectoryModal } from './AdminPublishDirectoryModal';

interface AdminAiCommandCenterProps {
  onPreview: (type: any, item: any) => void;
}

const STORAGE_KEY_CMD_HISTORY = 'bsh_v1_admin_cmd_history';

export const AdminAiCommandCenter: React.FC<AdminAiCommandCenterProps> = ({ onPreview }) => {
  const {
    saveClass,
    saveSubject,
    saveQuestion,
    saveNote,
    saveChapter,
    saveNotice,
    saveSeo,
  } = useApp();

  const [inputCommand, setInputCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDraft, setActiveDraft] = useState<AICommandDraft | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState('');
  const [errorNotice, setErrorNotice] = useState('');
  const [isPublishDirectoryOpen, setIsPublishDirectoryOpen] = useState(false);

  // Editable draft states if admin chooses to edit before publishing
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedText, setEditedText] = useState('');

  // Persistent Command History
  const [history, setHistory] = useState<AICommandHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CMD_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CMD_HISTORY, JSON.stringify(history));
    } catch {}
  }, [history]);

  const quickPrompts = [
    'ক্লাস ৮ বিজ্ঞান ১ম অধ্যায়ের ৫টি MCQ তৈরি করো',
    'ক্লাস ৭ গণিত ৩ নম্বর অধ্যায় যোগ করো',
    'ক্লাস ৬ বিজ্ঞানের জন্য একটি রিভিশন স্টাডি নোট তৈরি করো',
    'বার্ষিক পরীক্ষা প্রস্তুতি সংক্রান্ত একটি সাইট নোটিশ জারি করো',
    'ওয়েবসাইটের এসইও টাইটেল ও মেটা বিবরণ আপডেট করো',
    'ক্লাস ৯ জীববিজ্ঞানের ১ নম্বর অধ্যায়ের সংক্ষিপ্ত নোট তৈরি করো',
  ];

  const handleSendCommand = async (cmdText?: string) => {
    const textToRun = (cmdText || inputCommand).trim();
    if (!textToRun) return;

    setIsProcessing(true);
    setErrorNotice('');
    setPublishSuccess('');
    setIsEditingDraft(false);

    try {
      const draftResult = await executeAiCommand(textToRun);

      if (draftResult.status === 'failed') {
        setErrorNotice(draftResult.errorMessage || 'কমান্ড সম্পন্ন করতে ব্যর্থ হয়েছে।');
      } else {
        setActiveDraft(draftResult);
        // Pre-fill editable state
        if (draftResult.payload.note) {
          setEditedTitle(draftResult.payload.note.title);
          setEditedText(draftResult.payload.note.explanation);
        } else if (draftResult.payload.notice) {
          setEditedTitle(draftResult.payload.notice.title);
          setEditedText(draftResult.payload.notice.text);
        } else if (draftResult.payload.chapter) {
          setEditedTitle(draftResult.payload.chapter.title);
          setEditedText(draftResult.payload.chapter.description || '');
        }
      }

      // Add to command history
      const newHistoryItem: AICommandHistoryItem = {
        id: draftResult.id,
        command: textToRun,
        timestamp: draftResult.timestamp,
        actionType: draftResult.intent.actionType,
        targetEntity: `${draftResult.intent.targetClass} • ${draftResult.intent.targetSubject}`,
        status: draftResult.status,
        summary: draftResult.summary,
        draftData: draftResult,
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]);
      if (!cmdText) setInputCommand('');
    } catch (err: any) {
      console.error('Command center error:', err);
      setErrorNotice('কমান্ড প্রসেস করতে অপ্রত্যাশিত সমস্যা হয়েছে।');
    } finally {
      setIsProcessing(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Final Publish Handler:
   * Commits the reviewed draft directly into Firebase Firestore!
   */
  const handleApproveAndPublish = async () => {
    if (!activeDraft) return;

    setIsPublishing(true);
    setErrorNotice('');

    try {
      const { actionType } = activeDraft.intent;
      const { questions, note, chapter, notice, seo } = activeDraft.payload;

      // 1. Bulk or Single MCQ publishing
      if (actionType === 'mcq' && questions && questions.length > 0) {
        for (const q of questions) {
          await saveQuestion({
            ...q,
            status: 'published',
          });
        }
        setPublishSuccess(`সফলভাবে ${questions.length}টি বহুনির্বাচনী প্রশ্ন সরাসরি Firebase-এ লাইভ প্রকাশ করা হয়েছে!`);
      }
      // 2. Study Note / Lesson publishing
      else if (actionType === 'lesson' && note) {
        await saveNote({
          ...note,
          title: editedTitle.trim() || note.title,
          explanation: editedText.trim() || note.explanation,
          status: 'published',
        });
        setPublishSuccess(`স্টাডি নোট "${editedTitle || note.title}" সফলভাবে লাইভ প্রকাশিত হয়েছে!`);
      }
      // 3. Chapter publishing
      else if (actionType === 'chapter' && chapter) {
        await saveChapter({
          ...chapter,
          title: editedTitle.trim() || chapter.title,
          description: editedText.trim() || chapter.description,
          status: 'published',
        });
        setPublishSuccess(`নতুন অধ্যায় "${editedTitle || chapter.title}" সফলভাবে সিলেবাসে যুক্ত হয়েছে!`);
      }
      // 4. Site Notice publishing
      else if (actionType === 'notice' && notice) {
        await saveNotice({
          ...notice,
          title: editedTitle.trim() || notice.title,
          text: editedText.trim() || notice.text,
          status: 'published',
        });
        setPublishSuccess(`সাইট নোটিস "${editedTitle || notice.title}" সফলভাবে প্রকাশিত ও ব্যানারে যুক্ত হয়েছে!`);
      }
      // 5. SEO Config publishing
      else if (actionType === 'seo' && seo) {
        await saveSeo(seo);
        setPublishSuccess('ওয়েবসাইটের এসইও ও মেটা ট্যাগ সফলভাবে আপডেট ও কার্যকর করা হয়েছে!');
      }
      // 6. Class publishing
      else if (actionType === 'class' && (activeDraft.payload as any).managedClass) {
        const cls = (activeDraft.payload as any).managedClass;
        await saveClass(cls);
        setPublishSuccess(`নতুন শ্রেণি "${cls.name}" সফলভাবে যুক্ত হয়েছে!`);
      }
      // 7. Subject publishing
      else if (actionType === 'subject' && (activeDraft.payload as any).managedSubject) {
        const sub = (activeDraft.payload as any).managedSubject;
        await saveSubject(sub);
        setPublishSuccess(`নতুন বিষয় "${sub.name}" সফলভাবে যুক্ত হয়েছে!`);
      }

      // Update history status
      setHistory((prev) =>
        prev.map((item) =>
          item.id === activeDraft.id ? { ...item, status: 'published' } : item
        )
      );

      // Clear active draft after successful publishing
      setActiveDraft(null);
      setIsEditingDraft(false);
      setTimeout(() => setPublishSuccess(''), 4000);
    } catch (err: any) {
      console.warn('Publish note:', err);
      setErrorNotice('প্রকাশ করার সময় সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCancelDraft = () => {
    if (activeDraft) {
      setHistory((prev) =>
        prev.map((item) =>
          item.id === activeDraft.id ? { ...item, status: 'cancelled' } : item
        )
      );
    }
    setActiveDraft(null);
    setIsEditingDraft(false);
  };

  const handleClearHistory = () => {
    if (window.confirm('আপনি কি পূর্ববর্তী কমান্ডের সমস্ত হিস্ট্রি মুছে ফেলতে চান?')) {
      setHistory([]);
      try {
        localStorage.removeItem(STORAGE_KEY_CMD_HISTORY);
      } catch {}
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Command Center Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>বাংলা শিক্ষাগর • AI Command Center</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              স্মার্ট এআই কমান্ড ও ম্যানেজমেন্ট সেন্টার
            </h2>
            <p className="text-xs text-purple-200 mt-1 max-w-2xl leading-relaxed">
              স্বাভাবিক বাংলায় লিখুন—ক্লাস, বিষয়, অধ্যায়, MCQ প্রশ্ন, নোট কিংবা নোটিস পরিচালনা করুন একটি মাত্র চ্যাট কমান্ডে। কোনো পরিবর্তন সরাসরি লাইভ হবে না; প্রথমে ড্রাফট তৈরি হবে এবং আপনার অনুমোদনের পর চূড়ান্তভাবে ফায়ারবেসে প্রকাশিত হবে।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsPublishDirectoryOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>📂 Publish Directory</span>
            </button>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>নিরাপদ ড্রাফট মোড সক্রিয়</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Command Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>স্বাভাবিক বাংলায় কমান্ড বা নির্দেশনা লিখুন:</span>
          </label>
          <span className="text-[11px] text-slate-400">এন্টার চাপুন বা সেন্ড বোতামে ক্লিক করুন</span>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendCommand();
              }
            }}
            placeholder="যেমন: ‘ক্লাস ৮ বিজ্ঞান ১ম অধ্যায়ের ৫টি MCQ তৈরি করো’ অথবা ‘ক্লাস ৭ গণিত ৩ নম্বর অধ্যায় যোগ করো’..."
            className="w-full p-4 pr-24 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed transition"
          />

          <button
            type="button"
            disabled={isProcessing || !inputCommand.trim()}
            onClick={() => handleSendCommand()}
            className="absolute right-3 bottom-4 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>প্রসেস হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>এক্সিকিউট</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 block">কুইক প্রম্পট পরামর্শ:</span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputCommand(prompt);
                  handleSendCommand(prompt);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 text-xs font-medium border border-slate-200 dark:border-slate-700/60 transition text-left"
              >
                💡 {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {publishSuccess && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/50 text-emerald-900 dark:text-emerald-100 text-xs font-bold space-y-2.5 animate-in fade-in shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-100">
                  ✅ সফলভাবে Publish হয়েছে
                </h4>
                <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  {publishSuccess}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPublishDirectoryOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0"
            >
              <FolderOpen className="w-4 h-4" />
              <span>📂 Publish Directory খুলুন</span>
            </button>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-200">
            <span className="font-medium">
              প্রকাশিত কনটেন্ট দেখতে Publish Directory-তে যান
            </span>
            <button
              type="button"
              onClick={() => setIsPublishDirectoryOpen(true)}
              className="underline font-bold hover:text-emerald-950 dark:hover:text-white cursor-pointer"
            >
              ডিরেক্টরি দেখুন →
            </button>
          </div>
        </div>
      )}

      {errorNotice && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Active Staged Draft Review Card (Approve / Edit / Publish / Cancel) */}
      {activeDraft && (
        <div className="bg-white dark:bg-slate-900 border-2 border-purple-500/40 rounded-3xl p-6 shadow-xl space-y-5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                {activeDraft.intent.actionType === 'mcq'
                  ? 'বহুনির্বাচনী প্রশ্ন ড্রাফট'
                  : activeDraft.intent.actionType === 'lesson'
                  ? 'স্টাডি নোট ড্রাফট'
                  : activeDraft.intent.actionType === 'chapter'
                  ? 'অধ্যায় ড্রাফট'
                  : activeDraft.intent.actionType === 'notice'
                  ? 'নোটিস ড্রাফট'
                  : activeDraft.intent.actionType === 'class'
                  ? 'শ্রেণি ড্রাফট'
                  : activeDraft.intent.actionType === 'subject'
                  ? 'বিষয় ড্রাফট'
                  : 'এসইও ড্রাফট'}
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {activeDraft.intent.targetClass} • {activeDraft.intent.targetSubject}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
                ⚠️ স্টেজড ড্রাফট (লাইভ হয়নি)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              প্রস্তাবিত সারসংক্ষেপ:
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              {activeDraft.summary}
            </p>
          </div>

          {/* Staged MCQ Preview */}
          {activeDraft.intent.actionType === 'mcq' && activeDraft.payload.questions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>তৈরিকৃত MCQ তালিকা ({activeDraft.payload.questions.length}টি):</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {activeDraft.payload.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-700 dark:text-purple-300">
                        প্রশ্ন {idx + 1}:
                      </span>
                      <button
                        onClick={() => onPreview('question', q)}
                        className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>প্রিভিউ</span>
                      </button>
                    </div>

                    <p className="font-bold text-slate-900 dark:text-slate-100">{q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg text-[11px] ${
                            q.correctAnswerIndex === oIdx
                              ? 'bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-800'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {['ক', 'খ', 'গ', 'ঘ'][oIdx]}) {opt}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <p className="text-[11px] text-slate-500 pt-1">
                        <strong>ব্যাখ্যা: </strong>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staged Lesson Note or Notice or Chapter or Class or Subject Preview */}
          {(activeDraft.intent.actionType === 'lesson' ||
            activeDraft.intent.actionType === 'notice' ||
            activeDraft.intent.actionType === 'chapter' ||
            activeDraft.intent.actionType === 'class' ||
            activeDraft.intent.actionType === 'subject') && (
            <div className="space-y-3">
              {isEditingDraft ? (
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      শিরোনাম সম্পাদনা করুন:
                    </label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      মূল কন্টেন্ট সম্পাদনা করুন:
                    </label>
                    <textarea
                      rows={5}
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {editedTitle || activeDraft.intent.topic}
                    </h5>
                    <button
                      onClick={() =>
                        onPreview(
                          activeDraft.intent.actionType === 'notice'
                            ? 'notice'
                            : activeDraft.intent.actionType === 'chapter'
                            ? 'chapter'
                            : 'note',
                          activeDraft.payload.note || activeDraft.payload.notice || activeDraft.payload.chapter
                        )
                      }
                      className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>প্রিভিউ দেখুন</span>
                    </button>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line line-clamp-6">
                    {editedText ||
                      activeDraft.payload.note?.explanation ||
                      activeDraft.payload.notice?.text ||
                      activeDraft.payload.chapter?.description}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Decision Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingDraft(!isEditingDraft)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditingDraft ? 'সম্পাদনা সম্পন্ন' : 'কন্টেন্ট এডিট করুন'}</span>
              </button>

              <button
                type="button"
                onClick={handleCancelDraft}
                className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>ড্রাফট বাতিল করুন</span>
              </button>
            </div>

            <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
              <button
                type="button"
                id="admin-ai-publish-btn"
                disabled={isPublishing}
                onClick={handleApproveAndPublish}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Firebase-এ পাবলিশ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>অনুমোদন ও চূড়ান্ত পাবলিশ করুন (Publish to Live)</span>
                  </>
                )}
              </button>

              {/* Requirement 1: New button directly below Publish button */}
              <button
                type="button"
                id="admin-ai-publish-directory-btn"
                onClick={() => setIsPublishDirectoryOpen(true)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <FolderOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>📂 Publish Directory (প্রকাশিত কনটেন্ট দেখুন)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Command Execution History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              এআই কমান্ড হিস্ট্রি (Command History)
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {history.length}টি
            </span>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-[11px] text-slate-400 hover:text-rose-600 transition"
            >
              হিস্ট্রি পরিষ্কার করুন
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            এখনও কোনো কমান্ড এক্সিকিউট করা হয়নি। উপরে স্বাভাবিক বাংলায় প্রথম কমান্ডটি লিখুন।
          </div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      “{item.command}”
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold uppercase">
                      {item.actionType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.summary}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      item.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : item.status === 'draft_ready'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : item.status === 'cancelled'
                        ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {item.status === 'published'
                      ? 'Published'
                      : item.status === 'draft_ready'
                      ? 'Draft Ready'
                      : item.status === 'cancelled'
                      ? 'Cancelled'
                      : 'Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div ref={chatEndRef} />

      {/* Requirement 3: Publish Directory Modal */}
      <AdminPublishDirectoryModal
        isOpen={isPublishDirectoryOpen}
        onClose={() => setIsPublishDirectoryOpen(false)}
      />
    </div>
  );
};
