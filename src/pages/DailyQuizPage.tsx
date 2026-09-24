import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Flame,
  Award,
  Play,
  CheckCircle2,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId } from '../types';
import { getDailyQuiz } from '../data/questionBankEngine';

export const DailyQuizPage: React.FC = () => {
  const { classes, currentUser, startCustomQuiz, navigate } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<ClassId>(
    currentUser?.classGrade || 'class-6'
  );

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const today = new Date().toLocaleDateString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleStartDailyQuiz = () => {
    const dailyQuiz = getDailyQuiz(selectedClassId);
    startCustomQuiz(dailyQuiz);
  };

  return (
    <div id="daily-quiz-page" className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Daily Banner */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-100 border border-white/20">
            <Calendar className="w-3.5 h-3.5" />
            <span>{today}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            আজকের ডেইলি কুইজ (Daily Quiz)
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            প্রতিদিন নতুন ১০টি বহুনির্বাচনী প্রশ্ন সমাধান করো, জ্ঞান বৃদ্ধি করো এবং তোমার পড়াশোনার ধারাবাহিকতা বজায় রাখো।
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-300" />
              <span>ডেইলি স্ট্রিক: ৩ দিন 🔥</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 text-xs font-bold">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>পয়েন্ট রিওয়ার্ড: +২০ XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Class Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 shrink-0">তোমার শ্রেণি:</span>
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedClassId === cls.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
            {currentClass?.name} • আজকের চ্যালেঞ্জ
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            ১০টি নির্বাচিত প্রশ্ন • সময় ১০ মিনিট
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            বিভিন্ন অধ্যায় থেকে বাছাইকৃত প্রশ্ন। উত্তর দেওয়ার পরপরই সঠিক উত্তর ও বিস্তারিত ব্যাখ্যা জানতে পারবে।
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            ১০ মিনিট সময়সীমা
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            প্রতি প্রশ্নে ১ নম্বর
          </span>
        </div>

        <div className="pt-2">
          <button
            onClick={handleStartDailyQuiz}
            className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-black shadow-md transition flex items-center gap-2 mx-auto"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>আজকের কুইজ শুরু করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
