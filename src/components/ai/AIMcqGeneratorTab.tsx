import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Award,
  Zap,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { ClassId, SubjectId, AIGeneratedQuizItem } from '../../types';
import { ALL_CLASSES, ALL_SUBJECTS, ALL_CHAPTERS } from '../../data/curriculumData';
import { useApp } from '../../context/AppContext';

export const AIMcqGeneratorTab: React.FC = () => {
  const { navigate } = useApp();

  const [selectedClass, setSelectedClass] = useState<ClassId>('class-8');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('science');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Result state
  const [mcqs, setMcqs] = useState<AIGeneratedQuizItem[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  // Available subjects and chapters
  const availableSubjects = ALL_SUBJECTS.filter((s) => s.classId === selectedClass);
  const availableChapters = ALL_CHAPTERS.filter(
    (c) => c.classId === selectedClass && c.subjectId === selectedSubject
  );

  const handleGenerateMCQs = async () => {
    const chapterObj = availableChapters.find((c) => c.id === selectedChapterId);
    const chapterTitle = chapterObj ? chapterObj.title : (availableChapters[0]?.title || 'অধ্যায় ১');

    setLoading(true);
    setUserAnswers({});
    setShowResult(false);

    try {
      const res = await fetch('/api/ai/generate-mcqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass,
          subjectId: selectedSubject,
          chapterTitle,
          count: questionCount,
          difficulty,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate MCQs');
      const data = await res.json();
      setMcqs(data.mcqs || data.questions || []);
    } catch (err) {
      console.error(err);
      // Fallback MCQs
      setMcqs([
        {
          question: `উদ্ভিদের খাদ্য তৈরির প্রধান প্রক্রিয়ার নাম কী?`,
          options: ['শ্বসন', 'সালোকসংশ্লেষণ', 'প্রস্বেদন', 'ব্যাপন'],
          correctAnswerIndex: 1,
          explanation: 'উদ্ভিদ সূর্যালোক ও ক্লোরোফিলের সহায়তায় সালোকসংশ্লেষণ প্রক্রিয়ায় শর্করা জাতীয় খাদ্য তৈরি করে।',
        },
        {
          question: `পিথাগোরাসের উপপাদ্যটি কোন ধরণের ত্রিভুজের ক্ষেত্রে প্রযোজ্য?`,
          options: ['সমবাহু ত্রিভুজ', 'সূক্ষ্মকোণী ত্রিভুজ', 'সমকোণী ত্রিভুজ', 'স্থূলকোণী ত্রিভুজ'],
          correctAnswerIndex: 2,
          explanation: 'সমকোণী ত্রিভুজের অতিভুজের ওপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফল অপর দুই বাহুর ওপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফলের সমষ্টির সমান।',
        },
        {
          question: `বস্তুর ওপর প্রযুক্ত বলের সমীকরণ নিচের কোনটি?`,
          options: ['F = ma', 'W = Fs', 'v = u + at', 'P = W/t'],
          correctAnswerIndex: 0,
          explanation: 'নিউটনের গতির দ্বিতীয় সূত্র অনুসারে বল = ভর × ত্বরণ (F = ma)।',
        },
        {
          question: `বাংলা ব্যাকরণের প্রধান আলোচ্য বিষয় কয়টি?`,
          options: ['২টি', '৩টি', '৪টি', '৫টি'],
          correctAnswerIndex: 2,
          explanation: 'বাংলা ব্যাকরণের ৪টি প্রধান আলোচ্য বিষয়: ধ্বনিতত্ত্ব, রূপতত্ত্ব (শব্দতত্ত্ব), বাক্যতত্ত্ব ও অর্থতত্ত্ব।',
        },
        {
          question: `কোনটি সার্বজনীন দ্রাবক হিসেবে পরিচিত?`,
          options: ['অ্যালকোহল', 'পানি', 'কেরোসিন', 'অ্যাসিটোন'],
          correctAnswerIndex: 1,
          explanation: 'পানি বেশিরভাগ অজৈব ও বহু জৈব যৌগকে দ্রবীভূত করতে পারে বলে একে সার্বজনীন দ্রাবক বলা হয়।',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCopyAll = () => {
    if (mcqs.length === 0) return;
    const formatted = mcqs
      .map((m, idx) => {
        return `প্রশ্ন ${idx + 1}: ${m.question}\n` +
          m.options.map((o, i) => `(${['ক', 'খ', 'গ', 'ঘ'][i]}) ${o}`).join('\n') +
          `\nসঠিক উত্তর: (${['ক', 'খ', 'গ', 'ঘ'][m.correctAnswerIndex]})\nব্যাখ্যা: ${m.explanation}\n`;
      })
      .join('\n---\n\n');

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateScore = () => {
    let score = 0;
    mcqs.forEach((m, idx) => {
      if (userAnswers[idx] === m.correctAnswerIndex) score++;
    });
    return score;
  };

  return (
    <div id="ai-mcq-generator-tab-root" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white inline-block mb-1">
              🎯 Automatic Board Standard MCQ Generator
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              AI দিয়ে তাৎক্ষণিক MCQ তৈরি করুন (AI MCQ Generator)
            </h2>
            <p className="text-teal-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              যেকোনো অধ্যায়ের ওপর বহুনির্বাচনী প্রশ্ন, নির্ভুল বিকল্প ও বিশদ ব্যাখ্যাসহ সেট তৈরি করুন এবং সরাসরি সাইটেই পরীক্ষা দিন।
            </p>
          </div>
        </div>
      </div>

      {/* Generator Configuration Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-200 font-medium"
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
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-200 font-medium"
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
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="">অধ্যায় নির্বাচন করুন...</option>
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              প্রশ্নের সংখ্যা
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value={5}>৫টি প্রশ্ন</option>
              <option value={10}>১০টি প্রশ্ন</option>
              <option value={15}>১৫টি প্রশ্ন</option>
              <option value={20}>২০টি প্রশ্ন</option>
            </select>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            কাঠিন্য মাত্রা (Difficulty)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'easy', label: 'সহজ (মৌলিক ও জ্ঞানমূলক)' },
              { id: 'medium', label: 'মাঝারি (অনুধাবন ও প্রয়োগ)' },
              { id: 'hard', label: 'কঠিন (উচ্চতর দক্ষতা)' },
            ].map((diff) => (
              <button
                key={diff.id}
                type="button"
                onClick={() => setDifficulty(diff.id as any)}
                className={`py-2 text-xs font-bold rounded-xl transition text-center border ${
                  difficulty === diff.id
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-200 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Action Button */}
        <button
          onClick={handleGenerateMCQs}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>AI শিক্ষক প্রশ্ন তৈরি করছেন...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>MCQ সেট তৈরি করুন (Generate MCQs)</span>
            </>
          )}
        </button>
      </div>

      {/* Generated MCQs Display & Live Interactive Quiz */}
      {mcqs.length > 0 && (
        <div
          id="generated-mcq-list-root"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-200"
        >
          {/* Header & Controls */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-3">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold">
                মোট {mcqs.length}টি প্রশ্ন
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                বহুনির্বাচনী প্রশ্নমালা ও লাইভ পরীক্ষা
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAll}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'সব কপি হয়েছে' : 'সব কপি করুন'}</span>
              </button>

              <button
                onClick={() => {
                  setUserAnswers({});
                  setShowResult(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট</span>
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {mcqs.map((q, qIdx) => {
              const selectedOpt = userAnswers[qIdx];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.correctAnswerIndex;

              return (
                <div
                  key={qIdx}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      {q.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle =
                        'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-teal-400';
                      if (isAnswered) {
                        if (optIdx === q.correctAnswerIndex) {
                          btnStyle =
                            'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                        } else if (optIdx === selectedOpt) {
                          btnStyle =
                            'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleOptionSelect(qIdx, optIdx)}
                          className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                              {['ক', 'খ', 'গ', 'ঘ'][optIdx]}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isAnswered && optIdx === q.correctAnswerIndex && (
                            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          )}
                          {isAnswered && optIdx === selectedOpt && optIdx !== q.correctAnswerIndex && (
                            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after answered */}
                  {isAnswered && (
                    <div
                      className={`ml-8 p-3 rounded-xl text-xs border ${
                        isCorrect
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200'
                          : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-200'
                      }`}
                    >
                      <span className="font-bold block mb-1">
                        {isCorrect ? '✓ সঠিক উত্তর!' : '✗ ভুল হয়েছে!'}
                      </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission / Score Summary */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              উত্তর দেওয়া হয়েছে: <strong>{Object.keys(userAnswers).length}</strong> / {mcqs.length}
            </div>
            {Object.keys(userAnswers).length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800/60">
                  অর্জিত স্কোর: {calculateScore()} / {mcqs.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
