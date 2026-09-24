import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Award,
  ArrowLeft,
  FileText,
  Bot,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId, SubjectId } from '../types';

export const ChaptersPage: React.FC = () => {
  const { classes, subjects, chapters, lessons, quizzes, pageParams, navigate } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<ClassId>(
    pageParams.classId || 'class-6'
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>(
    pageParams.subjectId || 'science'
  );

  // Available subjects for this class
  const classSubjects = subjects.filter((s) => s.classId === selectedClassId);

  const effectiveSubjectId = classSubjects.some((s) => s.id === selectedSubjectId)
    ? selectedSubjectId
    : (classSubjects[0]?.id || selectedSubjectId);

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const currentSubject = subjects.find(
    (s) => s.id === effectiveSubjectId && s.classId === selectedClassId
  );

  const filteredChapters = chapters.filter(
    (ch) => ch.classId === selectedClassId && ch.subjectId === effectiveSubjectId
  );

  return (
    <div id="chapters-page" className="space-y-8 pb-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <button onClick={() => navigate('home')} className="hover:text-emerald-600">
          হোম
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate('classes')} className="hover:text-emerald-600">
          শ্রেণিসমূহ
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-600 font-semibold">{currentClass?.name}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-slate-200 font-medium">{currentSubject?.name || 'বিষয়'}</span>
      </div>

      {/* Class & Subject Selector Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        {/* Class Selection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 shrink-0">শ্রেণি:</span>
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => {
                setSelectedClassId(cls.id);
                const subSubs = subjects.filter((s) => s.classId === cls.id);
                if (subSubs.length > 0 && !subSubs.some((s) => s.id === selectedSubjectId)) {
                  setSelectedSubjectId(subSubs[0].id);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedClassId === cls.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>

        {/* Subject Selection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 dark:border-slate-800 pt-3">
          <span className="text-xs font-semibold text-slate-500 shrink-0">বিষয়:</span>
          {classSubjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                effectiveSubjectId === sub.id
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Title Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {currentClass?.name} — {currentSubject?.banglaName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {currentSubject?.name} অধ্যায়সমূহ
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {currentSubject?.description}
          </p>
        </div>

        <button
          onClick={() => navigate('quiz', { classId: selectedClassId, subjectId: selectedSubjectId })}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm shrink-0"
        >
          <Award className="w-4 h-4" />
          <span>এই বিষয়ের কুইজসমূহ</span>
        </button>
      </div>

      {/* Chapters Listing */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          উপলব্ধ অধ্যায়সমূহ ({filteredChapters.length})
        </h3>

        {filteredChapters.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500">
            <p>এই বিষয়ের জন্য পাঠ্যক্রম অনুযায়ী অধ্যায় লোড করা হচ্ছে। অনুগ্রহ করে অন্য বিষয় নির্বাচন করুন।</p>
          </div>
        ) : (
          filteredChapters.map((chapter) => {
            const chapterLessons = lessons.filter((l) => l.chapterId === chapter.id);
            const chapterQuiz = quizzes.find((q) => q.chapterId === chapter.id);
            const hasCQs = chapter.creativeQuestions && chapter.creativeQuestions.length > 0;

            return (
              <div
                key={chapter.id}
                id={`chapter-card-${chapter.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {chapter.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {chapter.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                    <button
                      id={`ai-help-btn-${chapter.id}`}
                      onClick={() =>
                        navigate('ai_chat', {
                          classId: selectedClassId,
                          subjectId: selectedSubjectId,
                          chapterId: chapter.id,
                          query: `"${chapter.title}" অধ্যায়ের মূল ধারণা, সূত্র ও সংক্ষিপ্ত নোট আমাকে বুঝিয়ে দাও।`,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition flex items-center gap-1.5"
                    >
                      <Bot className="w-3.5 h-3.5 text-emerald-600" />
                      <span>AI সহায়ক</span>
                    </button>

                    {chapterQuiz && (
                      <button
                        onClick={() => navigate('quiz_play', { quizId: chapterQuiz.id })}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold hover:bg-purple-100 transition flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>অধ্যায় কুইজ</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Key Concepts / Overview if present */}
                {chapter.keyConcepts && chapter.keyConcepts.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      মূল আলোচ্য বিষয়:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                      {chapter.keyConcepts.slice(0, 3).map((concept, idx) => (
                        <li key={idx} className="line-clamp-1">{concept}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Creative Questions (CQ) Bank section if present */}
                {hasCQs && (
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        বোর্ড সৃজনশীল প্রশ্নব্যাংক ({chapter.creativeQuestions?.length}টি CQ)
                      </span>
                    </div>
                    {chapter.creativeQuestions?.slice(0, 1).map((cq, idx) => (
                      <div key={cq.id || idx} className="text-xs space-y-1.5 bg-white dark:bg-slate-800 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                          উদ্দীপক: {cq.stimulus}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                          {cq.questions && cq.questions.length > 0 ? (
                            cq.questions.map((subQ, qIdx) => (
                              <div key={qIdx}>
                                <span className="font-bold text-emerald-700 dark:text-emerald-400">({subQ.level})</span> {subQ.text}
                              </div>
                            ))
                          ) : (
                            <div>
                              <span className="font-bold text-emerald-700 dark:text-emerald-400">(ক)</span> জ্ঞানমূলক ও ব্যাখ্যামূলক প্রশ্ন
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lessons in this Chapter */}
                <div className="pt-2 space-y-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    অধ্যায়ের পাঠসমূহ:
                  </h5>

                  {chapterLessons.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {chapterLessons.map((les) => (
                        <div
                          key={les.id}
                          onClick={() => navigate('lesson', { lessonId: les.id })}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <h6 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                                {les.title}
                              </h6>
                              <span className="text-[10px] text-slate-600 dark:text-slate-300">
                                পড়া শেষ করতে {les.readTimeMinutes} মিনিট
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                      <span>এই অধ্যায়ের মূল ধারণা ও সূত্রগুলো উপরের তালিকায় অন্তর্ভুক্ত রয়েছে।</span>
                      <button
                        onClick={() =>
                          navigate('ai_chat', {
                            classId: selectedClassId,
                            subjectId: selectedSubjectId,
                            chapterId: chapter.id,
                            query: `"${chapter.title}" অধ্যায়ের পূর্ণাঙ্গ বিশ্লেষণ ও পাঠ আমাকে বুঝিয়ে দিন।`,
                          })
                        }
                        className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Bot className="w-3.5 h-3.5" /> AI ব্যাখ্যা দেখুন
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
