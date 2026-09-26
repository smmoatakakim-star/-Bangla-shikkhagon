import React from 'react';
import { BookOpen, GraduationCap, Award, ArrowRight, CheckCircle2, Layers, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId } from '../types';
import { getPlatformMcqsByClass } from '../data/academyMcqData';
import { toBengaliDigits } from '../utils/banglaUtils';

export const ClassesPage: React.FC = () => {
  const { classes, subjects, chapters, quizzes, navigate } = useApp();

  const getClassIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Award':
      default:
        return <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <div id="classes-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>NCTB কারিকুলাম ভিত্তিক শ্রেণি কাঠামো</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          শ্রেণিসমূহ (৬ষ্ঠ — ১০ম শ্রেণি)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          প্রতিটি শ্রেণির মূল পাঠ্যবিষয়, অধ্যায়ভিত্তিক হ্যান্ডনোট, এবং ১০০০+ বহুনির্বাচনী প্রশ্নব্যাংক।
        </p>
      </div>

      {/* Compact Modern Classes Grid: 2 columns on mobile, 3 on tablet, 3-5 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {classes.map((cls) => {
          const classSubjects = subjects.filter((s) => s.classId === cls.id);
          const classChapters = chapters.filter((c) => c.classId === cls.id);

          return (
            <div
              key={cls.id}
              id={`class-card-${cls.id}`}
              onClick={() => navigate('subjects', { classId: cls.id })}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Top Row: Icon + Grade Badge */}
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:scale-105 transition-transform">
                    {getClassIcon(cls.iconName)}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                    গ্রেড {cls.numericGrade}
                  </span>
                </div>

                {/* Class Title */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                    {cls.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {cls.description}
                  </p>
                </div>

                {/* Quick Stats / Info */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {classChapters.length || cls.totalChapters} অধ্যায়
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                    {toBengaliDigits(getPlatformMcqsByClass(cls.id).length)}+ MCQ
                  </span>
                </div>

                {/* Subject tags preview */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {classSubjects.slice(0, 3).map((sub) => (
                    <span
                      key={sub.id}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800"
                    >
                      {sub.name}
                    </span>
                  ))}
                  {classSubjects.length > 3 && (
                    <span className="text-[10px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      +{classSubjects.length - 3}টি
                    </span>
                  )}
                </div>
              </div>

              {/* Action Tap Bar */}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="text-[11px] sm:text-xs">প্রবেশ করুন</span>
                <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
