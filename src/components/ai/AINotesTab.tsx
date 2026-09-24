import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Send,
  Copy,
  Check,
  Download,
  BookOpen,
  Bookmark,
  Share2,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { ClassId, SubjectId } from '../../types';
import { ALL_CLASSES, ALL_SUBJECTS, ALL_CHAPTERS } from '../../data/curriculumData';

export const AINotesTab: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<ClassId>('class-8');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('science');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [customTopic, setCustomTopic] = useState('');
  const [noteStyle, setNoteStyle] = useState<'bullet' | 'summary' | 'formula' | 'suggestion'>('summary');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null);

  // Available subjects and chapters
  const availableSubjects = ALL_SUBJECTS.filter((s) => s.classId === selectedClass);
  const availableChapters = ALL_CHAPTERS.filter(
    (c) => c.classId === selectedClass && c.subjectId === selectedSubject
  );

  const handleGenerateNotes = async () => {
    const chapterObj = availableChapters.find((c) => c.id === selectedChapterId);
    const chapterTitle = chapterObj ? chapterObj.title : (availableChapters[0]?.title || 'অধ্যায় ১');

    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass,
          subjectId: selectedSubject,
          chapterTitle: customTopic.trim() ? `${chapterTitle} — ${customTopic.trim()}` : chapterTitle,
          style: noteStyle,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate notes');
      const data = await res.json();
      setGeneratedNotes(data.notes);
    } catch (err) {
      console.error(err);
      // Fallback
      setGeneratedNotes(
        `# ${chapterTitle} — পূর্ণাঙ্গ পরীক্ষার রিভিশন নোট\n\n` +
        `### ১. মূল প্রতিপাদ্য বিষয়\n` +
        `- পাঠ্যপুস্তকের নির্ধারিত তত্ত্ব ও নিয়মাবলীর সঠিক প্রয়োগ শিখতে হবে।\n` +
        `- প্রতিটি সূত্রের ভৌত তাৎপর্য এবং একক জানা জরুরি।\n\n` +
        `### ২. পরীক্ষার জন্য অতি গুরুত্বপূর্ণ প্রশ্নোত্তর\n` +
        `১. **জ্ঞানমূলক:** অধ্যায়ের প্রারম্ভিক সংজ্ঞা ও মৌলিক একক মুখস্থ রাখতে হবে।\n` +
        `২. **অনুধাবনমূলক:** ঘটনার কারণ ও ফলাফল ব্যাখ্যা করার দক্ষতা অর্জন করতে হবে।\n\n` +
        `### ৩. বাস্তব প্রয়োগ ও সতর্কতা\n` +
        `- অঙ্ক করার সময় একক রূপান্তরে সতর্ক থাকতে হবে।\n` +
        `- পরিচ্ছন্ন চিত্র ও লেবেলিং সর্বোচ্চ নম্বর অর্জনে সহায়ক।`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedNotes) return;
    navigator.clipboard.writeText(generatedNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedNotes) return;
    const blob = new Blob([generatedNotes], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NCTB_Notes_${selectedClass}_${selectedSubject}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="ai-notes-tab-root" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white inline-block mb-1">
              📝 Smart Study Revision Note Generator
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              AI দিয়ে তাৎক্ষণিক নোট তৈরি করুন (AI Notes Generator)
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              এনসিটিবি পাঠ্যক্রমের যেকোনো অধ্যায়ের সারসংক্ষেপ, পয়েন্টভিত্তিক নোট, সূত্রের তালিকা বা পরীক্ষার সাজেশন এক ক্লিকে জেনারেট করুন।
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Class Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              শ্রেণি
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value as ClassId);
                setSelectedChapterId('');
              }}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
            >
              {ALL_CLASSES.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              বিষয়
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value as SubjectId);
                setSelectedChapterId('');
              }}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
            >
              {availableSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chapter Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              অধ্যায়
            </label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="">অধ্যায় নির্বাচন করুন...</option>
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Note Style Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            নোটের ধরন ও শৈলী নির্বাচন করুন
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'summary', label: 'পূর্ণাঙ্গ সারসংক্ষেপ' },
              { id: 'bullet', label: 'পয়েন্টভিত্তিক নোট' },
              { id: 'formula', label: 'সূত্রের তালিকা ও ব্যাখ্যা' },
              { id: 'suggestion', label: 'পরীক্ষার সাজেশন ও Q&A' },
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setNoteStyle(style.id as any)}
                className={`p-2.5 rounded-xl text-xs font-bold transition text-center border ${
                  noteStyle === style.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Custom Topic Focus */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            নির্দিষ্ট কোনো বিষয়ে বিশেষ জোর দিতে চাইলে লিখুন (ঐচ্ছিক)
          </label>
          <input
            type="text"
            placeholder="যেমন: গাণিতিক সূত্রাবলী, চিত্র চিহ্নিতকরণ, সৃজনশীল প্রশ্ন 'খ' ও 'গ'..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerateNotes}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>AI শিক্ষক নোট তৈরি করছেন...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>নোট তৈরি করুন (Generate Notes)</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Notes Output */}
      {generatedNotes && (
        <div
          id="generated-notes-display-card"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                প্রস্তুতকৃত পাঠ্য নোট
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ডাউনলোড (.md)</span>
              </button>
            </div>
          </div>

          {/* Notes Content Display */}
          <div className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 whitespace-pre-wrap leading-relaxed font-sans text-slate-800 dark:text-slate-200">
            {generatedNotes}
          </div>
        </div>
      )}
    </div>
  );
};
