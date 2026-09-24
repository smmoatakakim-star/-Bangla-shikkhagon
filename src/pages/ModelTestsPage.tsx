import React, { useState } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  FileCheck,
  Zap,
  Play,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId, SubjectId } from '../types';
import { ALL_CLASSES, ALL_SUBJECTS } from '../data/curriculumData';
import { getModelTest } from '../data/questionBankEngine';

export const ModelTestsPage: React.FC = () => {
  const { classes, subjects, startCustomQuiz, navigate } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<ClassId>('class-6');

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const classSubjects = subjects.filter((s) => s.classId === selectedClassId);

  const startTest = (subjectId?: SubjectId, count: number = 30) => {
    const modelTest = getModelTest(selectedClassId, subjectId, count);
    startCustomQuiz(modelTest);
  };

  return (
    <div id="model-tests-page" className="space-y-8 pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-purple-800 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-purple-200 border border-white/20">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>বোর্ড ও স্কুল পরীক্ষা উপযোগী সিমুলেশন</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            মডেল টেস্ট পরীক্ষা (Model Tests)
          </h1>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            বার্ষিক ও সমাপনী পরীক্ষার অনুরূপ সময় নিয়ন্ত্রিত পূর্ণাঙ্গ মডেল টেস্ট। বিষয়ভিত্তিক ও সামগ্রিক মূল্যায়নের মাধ্যমে পরীক্ষার জন্য নিজেকে শতভাগ প্রস্তুত করুন।
          </p>

          <div className="pt-2">
            <button
              onClick={() => startTest(undefined, 30)}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{currentClass?.name} পূর্ণাঙ্গ অল-ইন-ওয়ান মডেল টেস্ট শুরু করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 shrink-0">শ্রেণি পরিবর্তন:</span>
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedClassId === cls.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* Full Class Test Card */}
      <div className="bg-white dark:bg-slate-900 border-2 border-purple-500/40 dark:border-purple-600/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
              {currentClass?.name} • সমন্বিত সিলেবাস
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2">
              অল-ইন-ওয়ান গ্র্যান্ড মডেল টেস্ট (৩০টি বহুনির্বাচনী প্রশ্ন)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              সকল পাঠ্যবই থেকে সংগৃহীত গুরুত্বপূর্ণ প্রশ্নাবলি দিয়ে প্রস্তুতকৃত রিয়েল-টাইম পরীক্ষা।
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                ৩০ মিনিট সময়সীমা
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                পূর্ণমান ৩০ নম্বর
              </span>
            </div>
          </div>

          <button
            onClick={() => startTest(undefined, 30)}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>টেস্ট শুরু করুন</span>
          </button>
        </div>
      </div>

      {/* Subject-Wise Model Tests */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-indigo-600" />
          <span>{currentClass?.name}-এর বিষয়ভিত্তিক স্পেশাল মডেল টেস্ট</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classSubjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-purple-400 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {currentClass?.name}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ২০ মিনিট
                  </span>
                </div>

                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {sub.name} মডেল টেস্ট
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {sub.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ২০টি বহুনির্বাচনী প্রশ্ন
                  </span>
                  <span>•</span>
                  <span>মানসম্মত বিশ্লেষণ</span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => startTest(sub.id, 20)}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>মডেল টেস্ট দিন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
