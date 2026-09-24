import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  Bookmark,
  Award,
  Sparkles,
  Share2,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  FileCheck,
  BookMarked,
  ArrowLeft,
  ArrowRight,
  Layers,
  ZoomIn,
  ZoomOut,
  Copy,
  Check,
  Bot,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LessonViewPage: React.FC = () => {
  const { lessons, chapters, subjects, classes, quizzes, pageParams, navigate, isItemSaved, toggleSaveItem } = useApp();

  const lessonId = pageParams.lessonId || (lessons[0] ? lessons[0].id : '');
  const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];

  const chapter = chapters.find((c) => c.id === lesson?.chapterId);
  const subject = subjects.find((s) => s.id === lesson?.subjectId && s.classId === lesson?.classId);
  const classObj = classes.find((c) => c.id === lesson?.classId);

  // Associated chapter quiz if available
  const chapterQuiz = quizzes.find(
    (q) => q.chapterId === lesson?.chapterId || (q.subjectId === lesson?.subjectId && q.classId === lesson?.classId)
  );

  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'explanation' | 'keyPoints' | 'examples' | 'qa' | 'examTips' | 'notes'>('all');

  if (!lesson) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-slate-500">পাঠটি খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={() => navigate('classes')}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
        >
          শ্রেণিসমূহে ফিরে যান
        </button>
      </div>
    );
  }

  const isSaved = isItemSaved('lesson', lesson.id);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFontClass = () => {
    switch (fontSizeLevel) {
      case 'large':
        return 'text-base sm:text-lg leading-relaxed';
      case 'xlarge':
        return 'text-lg sm:text-xl leading-loose';
      case 'normal':
      default:
        return 'text-sm sm:text-base leading-relaxed';
    }
  };

  return (
    <div id="lesson-view-page" className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Breadcrumb navigation */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <button onClick={() => navigate('home')} className="hover:text-emerald-600">
          হোম
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => navigate('chapters', { classId: lesson.classId, subjectId: lesson.subjectId })}
          className="hover:text-emerald-600"
        >
          {classObj?.name}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => navigate('chapters', { classId: lesson.classId, subjectId: lesson.subjectId })}
          className="hover:text-emerald-600"
        >
          {subject?.name}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[180px]">
          {chapter?.title}
        </span>
      </div>

      {/* Lesson Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              {classObj?.name}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {subject?.name}
            </span>
            <span className="text-xs text-slate-400">পড়ার সময়: ~{lesson.readTimeMinutes} মিনিট</span>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5">
            {/* Font size toggles */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-xs text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setFontSizeLevel('normal')}
                title="সাধারণ ফন্ট সাইজ"
                className={`px-2 py-1 rounded-lg transition ${
                  fontSizeLevel === 'normal' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : ''
                }`}
              >
                ক
              </button>
              <button
                onClick={() => setFontSizeLevel('large')}
                title="মাঝারি ফন্ট সাইজ"
                className={`px-2 py-1 rounded-lg transition ${
                  fontSizeLevel === 'large' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : ''
                }`}
              >
                ক+
              </button>
              <button
                onClick={() => setFontSizeLevel('xlarge')}
                title="বড় ফন্ট সাইজ"
                className={`px-2 py-1 rounded-lg transition ${
                  fontSizeLevel === 'xlarge' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : ''
                }`}
              >
                ক++
              </button>
            </div>

            {/* AI Assistant button */}
            <button
              id="lesson-ai-assistant-btn"
              onClick={() =>
                navigate('ai_chat', {
                  classId: lesson.classId,
                  subjectId: lesson.subjectId,
                  chapterId: lesson.chapterId,
                  query: `"${lesson.title}" পাঠটি সহজ ভাষায় মূল পয়েন্ট ও উদাহরণসহ আমাকে বুঝিয়ে দাও।`,
                })
              }
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
              title="এই পাঠ নিয়ে AI-কে প্রশ্ন করুন"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI সহায়তায় বুঝুন</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => toggleSaveItem('lesson', lesson.id)}
              className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs font-semibold ${
                isSaved
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'সংরক্ষিত' : 'সংরক্ষণ করুন'}</span>
            </button>

            {/* Share button */}
            <button
              onClick={handleCopyLink}
              title="লিংক কপি করুন"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 block">
            {chapter?.title}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {lesson.title}
          </h1>
        </div>

        {/* Quick Tabs Navigator */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            সম্পূর্ণ পাঠ
          </button>
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              activeTab === 'explanation'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            সহজ ব্যাখ্যা
          </button>
          <button
            onClick={() => setActiveTab('keyPoints')}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              activeTab === 'keyPoints'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            গুরুত্বপূর্ণ তথ্য
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              activeTab === 'examples'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            উদাহরণ
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              activeTab === 'qa'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            প্রশ্ন ও উত্তর
          </button>
          <button
            onClick={() => setActiveTab('examTips')}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              activeTab === 'examTips'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            পরীক্ষার প্রস্তুতি
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              activeTab === 'notes'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            সংক্ষিপ্ত নোট
          </button>
        </div>
      </div>

      {/* 1. সহজ ভাষায় ব্যাখ্যা (Explanation) */}
      {(activeTab === 'all' || activeTab === 'explanation') && (
        <section
          id="lesson-explanation-section"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              সহজ ভাষায় ব্যাখ্যা
            </h2>
          </div>
          <div
            className={`text-slate-700 dark:text-slate-300 whitespace-pre-line ${getFontClass()}`}
          >
            {lesson.explanation}
          </div>
        </section>
      )}

      {/* 2. গুরুত্বপূর্ণ তথ্য (Key Points) */}
      {(activeTab === 'all' || activeTab === 'keyPoints') && (
        <section
          id="lesson-keypoints-section"
          className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              গুরুত্বপূর্ণ তথ্যসমূহ
            </h2>
          </div>
          <ul className="space-y-3">
            {lesson.keyPoints.map((pt, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 3. উদাহরণ (Examples) */}
      {(activeTab === 'all' || activeTab === 'examples') && lesson.examples.length > 0 && (
        <section
          id="lesson-examples-section"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              বাস্তব উদাহরণ ও বিশ্লেষণ
            </h2>
          </div>
          <div className="space-y-4">
            {lesson.examples.map((ex, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 space-y-2"
              >
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {ex.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {ex.explanation}
                </p>
                {ex.solution && (
                  <div className="pt-2 mt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {ex.solution}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. প্রশ্ন ও উত্তর (Q&A Practice) */}
      {(activeTab === 'all' || activeTab === 'qa') && lesson.qaList.length > 0 && (
        <section
          id="lesson-qa-section"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5 text-sky-600 dark:text-sky-400">
            <HelpCircle className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              প্রশ্ন ও উত্তর অনুশীলন
            </h2>
          </div>
          <div className="space-y-3">
            {lesson.qaList.map((qa, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 shrink-0">
                    প্রশ্ন {idx + 1}
                  </span>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {qa.question}
                  </h5>
                </div>
                <div className="pl-9 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-emerald-600 block mb-0.5">উত্তর:</span>
                  {qa.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. পরীক্ষার প্রস্তুতি (Exam Tips) */}
      {(activeTab === 'all' || activeTab === 'examTips') && (lesson.examTips?.length ?? 0) > 0 && (
        <section
          id="lesson-examtips-section"
          className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5 text-purple-700 dark:text-purple-400">
            <FileCheck className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              পরীক্ষার প্রস্তুতি ও বিশেষ কৌশল
            </h2>
          </div>
          <ul className="space-y-2.5">
            {lesson.examTips?.map((tip, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 6. সংক্ষিপ্ত নোট (Quick Notes) */}
      {(activeTab === 'all' || activeTab === 'notes') && (lesson.quickNotes?.length ?? 0) > 0 && (
        <section
          id="lesson-notes-section"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <BookMarked className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              সংক্ষিপ্ত রিভিশন নোট
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lesson.quickNotes?.map((note, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA for Quiz */}
      {chapterQuiz && (
        <div
          id="lesson-quiz-cta"
          className="rounded-3xl p-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
        >
          <div>
            <h4 className="text-lg font-bold">পাঠটি ভালো করে পড়েছো?</h4>
            <p className="text-xs text-purple-100 mt-0.5">
              এখনই {chapterQuiz.questions.length}টি বহুনির্বাচনী প্রশ্ন সমাধান করে নিজেকে যাচাই করো!
            </p>
          </div>
          <button
            onClick={() => navigate('quiz_play', { quizId: chapterQuiz.id })}
            className="px-6 py-3 rounded-2xl bg-white text-purple-700 font-bold text-xs shadow-md hover:bg-purple-50 transition shrink-0 flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>কুইজে অংশ নিন</span>
          </button>
        </div>
      )}
    </div>
  );
};
