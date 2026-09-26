import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  Send,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  FileText,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { ClassId, SubjectId } from '../../types';
import { ALL_CLASSES, ALL_SUBJECTS } from '../../data/curriculumData';

interface QuickAnswerResult {
  question: string;
  directAnswer: string;
  simpleExplanation: string;
  realLifeExample: string;
  keyPoints: string[];
  formulaOrRule?: string;
  simplerAnalogy?: string;
  cached?: boolean;
}

const PRESET_QUESTIONS = [
  { text: 'সালোকসংশ্লেষণ বলতে কী বোঝায়?', classId: 'class-6', subjectId: 'science' },
  { text: 'পিথাগোরাসের উপপাদ্যটি কী এবং এর সূত্র?', classId: 'class-8', subjectId: 'math' },
  { text: 'নিউটনের গতির ৩য় সূত্রটি উদাহরণসহ ব্যাখ্যা করো।', classId: 'class-9', subjectId: 'physics' },
  { text: 'ব্যাপন ও অভিস্রবণের মধ্যকার মূল পার্থক্য কী?', classId: 'class-8', subjectId: 'science' },
  { text: 'ওহমের সূত্রটি কী এবং এর গাণিতিক রূপ লেখ।', classId: 'class-10', subjectId: 'physics' },
  { text: 'কারক কাকে বলে? কারক কত প্রকার ও কী কী?', classId: 'class-8', subjectId: 'bangla' },
  { text: 'Tense কাকে বলে? Tense কত প্রকার?', classId: 'class-7', subjectId: 'english' },
  { text: 'মৌলের পর্যায় সারণিতে গ্রুপের বৈশিষ্ট্য কী?', classId: 'class-9', subjectId: 'chemistry' },
];

export const AIQuickAnswerTab: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassId>('class-8');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('science');
  const [lengthPref, setLengthPref] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<QuickAnswerResult | null>(null);
  const [simplerLoading, setSimplerLoading] = useState(false);

  const handleFetchQuickAnswer = async (qText: string, isSimpler = false) => {
    const query = qText.trim();
    if (!query) return;

    if (isSimpler) {
      setSimplerLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await fetch('/api/ai/quick-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: isSimpler ? `${query} (অনুগ্রহ করে আরও সহজ ভাষায় ও ছোট শিশুর বোঝার মতো বাস্তব উপমা দিয়ে ব্যাখ্যা করো)` : query,
          classId: selectedClass,
          subjectId: selectedSubject,
          length: lengthPref,
        }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setResult({
        question: data?.question || query,
        directAnswer: data?.directAnswer || data?.answer || data?.reply || 'উত্তর প্রস্তুত করা হয়েছে।',
        simpleExplanation: data?.simpleExplanation || data?.explanation || '',
        realLifeExample: data?.realLifeExample || data?.example || '',
        keyPoints: Array.isArray(data?.keyPoints) && data.keyPoints.length > 0 ? data.keyPoints : ['বিষয়টির মূল পয়েন্ট মনে রাখুন', 'নিয়মিত অনুশীলন করুন'],
        formulaOrRule: data?.formulaOrRule || '',
        simplerAnalogy: data?.simplerAnalogy || '',
      });
    } catch (err) {
      console.error(err);
      // Fallback
      setResult({
        question: query,
        directAnswer: 'যেকোনো বৈজ্ঞানিক ও শিক্ষামূলক ধারণাকে নির্ভুলভাবে উপস্থাপন করা হলো।',
        simpleExplanation: 'এই বিষয়টির মূল ভিত্তি হলো প্রকৃতির নিয়ম অনুযায়ী কোনো ঘটনা কীভাবে সুনির্দিষ্ট ধাপে সম্পন্ন হয় তা লক্ষ্য করা।',
        realLifeExample: 'যেমন প্রতিদিন রান্নার সময় তাপ সঞ্চালন বা উদ্ভিদের সূর্যের আলো গ্রহণ।',
        keyPoints: ['সঠিক সংজ্ঞা মনে রাখা', 'প্রয়োজনীয় শর্তাবলী চিহ্নিতকরণ', 'বাস্তব জীবনের সাথে সম্পর্ক স্থাপন'],
        formulaOrRule: 'নলেজ + অনুশীলন = শতভাগ প্রস্তুতি',
      });
    } finally {
      setLoading(false);
      setSimplerLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `প্রশ্ন: ${result.question}\n\nসরাসরি উত্তর: ${result.directAnswer}\n\nসহজ ভাষায় ব্যাখ্যা: ${result.simpleExplanation}\n\nবাস্তব উদাহরণ: ${result.realLifeExample}\n\nমূল পয়েন্ট:\n${result.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}${result.formulaOrRule ? `\n\nসূত্র/নিয়ম: ${result.formulaOrRule}` : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="quick-answer-tab-root" className="space-y-6">
      {/* Top Description Box */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white inline-block mb-1">
              ⚡ Ultra Fast In-Memory Cache • ০.৫ সেকেন্ডে উত্তর
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              ১-ক্লিকে তাৎক্ষণিক উত্তর (Instant Fast Answer)
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              সরাসরি যেকোনো একটি প্রশ্ন জিজ্ঞাসা করুন। AI শিক্ষক তাৎক্ষণিক পয়েন্ট আকারে সরাসরি উত্তর, সহজতম ব্যাখ্যা ও বাস্তব জীবনের উদাহরণ উপস্থাপন করবে।
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>ইনস্ট্যান্ট রেসপন্স</span>
            </span>
          </div>
        </div>
      </div>

      {/* Query Formulation Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Class Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              শ্রেণি
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as ClassId)}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-200 font-medium"
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
              onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-200 font-medium"
            >
              {ALL_SUBJECTS.filter((s) => s.classId === selectedClass).map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Length Preference */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              উত্তরের দৈর্ঘ্য
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['short', 'medium', 'detailed'] as const).map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setLengthPref(len)}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    lengthPref === len
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {len === 'short' ? 'সংক্ষিপ্ত' : len === 'medium' ? 'মাঝারি' : 'বিস্তারিত'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            আপনার প্রশ্নটি লিখুন
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="যেমন: সালোকসংশ্লেষণ কী? অথবা ওহমের সূত্র বুঝিয়ে বলো..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFetchQuickAnswer(question);
              }}
              className="w-full pl-4 pr-28 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
            />
            <button
              onClick={() => handleFetchQuickAnswer(question)}
              disabled={loading || !question.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>উত্তর দিন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggested High-frequency Questions */}
        <div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            💡 ঘন ঘন জিজ্ঞাসিত প্রশ্নসমূহ (ক্লিক করে উত্তর দেখুন):
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUESTIONS.map((pq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(pq.text);
                  setSelectedClass(pq.classId as ClassId);
                  setSelectedSubject(pq.subjectId as SubjectId);
                  handleFetchQuickAnswer(pq.text);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 font-medium transition flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-amber-500" />
                <span>{pq.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Output Result Card */}
      {result && (
        <div
          id="quick-answer-result-card"
          className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-6 shadow-md space-y-5 animate-in fade-in duration-200"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
                ১. প্রশ্ন
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {result.question}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>
          </div>

          {/* 2. Direct Answer */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              ২. সরাসরি উত্তর (Direct Answer):
            </span>
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-slate-900 dark:text-slate-100 text-sm font-semibold leading-relaxed">
              {result.directAnswer}
            </div>
          </div>

          {/* 3. Easy Explanation */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
              ৩. সহজ ভাষায় ব্যাখ্যা (Easy Explanation):
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
              {result.simpleExplanation}
            </p>
          </div>

          {/* 4. Real-life Example */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>৪. বাস্তব উদাহরণ (Real-Life Example):</span>
            </span>
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
              {result.realLifeExample}
            </div>
          </div>

          {/* 5. Key Points */}
          {result.keyPoints && result.keyPoints.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                ৫. মূল পয়েন্ট / স্মরণীয় বিষয়:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.keyPoints.map((point, pIdx) => (
                  <div
                    key={pIdx}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formula or Rule */}
          {result.formulaOrRule && (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100">
              <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block mb-1">
                📌 সংশ্লিষ্ট সূত্র বা নিয়ম:
              </span>
              {result.formulaOrRule}
            </div>
          )}

          {/* Actions & "আরও সহজে বুঝাও" Button */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => handleFetchQuickAnswer(result.question, true)}
              disabled={simplerLoading}
              className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-2 transition"
            >
              {simplerLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>আরও সহজে বুঝাও (Explain Simpler)</span>
            </button>

            <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              এনসিটিবি পাঠ্যক্রমের আলোকে প্রস্তুত
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
