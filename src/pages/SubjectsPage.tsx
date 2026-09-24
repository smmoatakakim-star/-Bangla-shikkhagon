import React, { useState } from 'react';
import {
  BookOpen,
  Languages,
  Globe,
  Calculator,
  Atom,
  Landmark,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId, SubjectId } from '../types';

export const SubjectsPage: React.FC = () => {
  const { classes, subjects, chapters, pageParams, navigate } = useApp();

  const [selectedClassFilter, setSelectedClassFilter] = useState<ClassId | 'all'>(
    pageParams.classId || 'all'
  );

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Languages':
        return <Languages className="w-6 h-6 text-rose-500" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-sky-500" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-amber-500" />;
      case 'Atom':
        return <Atom className="w-6 h-6 text-emerald-500" />;
      case 'Landmark':
      default:
        return <Landmark className="w-6 h-6 text-indigo-500" />;
    }
  };

  const filteredSubjects =
    selectedClassFilter === 'all'
      ? subjects
      : subjects.filter((s) => s.classId === selectedClassFilter);

  return (
    <div id="subjects-page" className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            পাঠ্য বিষয়সমূহ
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            যে কোনো বিষয় নির্বাচন করে সংশ্লিষ্ট অধ্যায় ও পাঠগুলোতে প্রবেশ করো।
          </p>
        </div>

        {/* Class Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setSelectedClassFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedClassFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            সব শ্রেণি
          </button>
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassFilter(cls.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedClassFilter === cls.id
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects Grid: Compact Modern Grid (2 col mobile, 3 tablet, 4 desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredSubjects.map((sub, index) => {
          const classObj = classes.find((c) => c.id === sub.classId);
          const subjectChapters = chapters.filter(
            (ch) => ch.subjectId === sub.id && ch.classId === sub.classId
          );

          return (
            <div
              key={`${sub.id}-${sub.classId}-${index}`}
              id={`subject-item-${sub.id}-${sub.classId}`}
              onClick={() => navigate('chapters', { subjectId: sub.id, classId: sub.classId })}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:scale-105 transition-transform">
                    {getSubjectIcon(sub.iconName)}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {classObj ? classObj.name.split(' ')[0] : ''}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                  {sub.name}
                </h3>
                <h4 className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-0.5 truncate">
                  {sub.banglaName}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug line-clamp-2">
                  {sub.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  {subjectChapters.length || 4}টি অধ্যায়
                </span>
                <span className="text-emerald-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  পাঠ দেখুন <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
