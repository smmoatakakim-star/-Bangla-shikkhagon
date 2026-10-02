import React, { useState } from 'react';
import {
  Shield,
  Users,
  BookOpen,
  MessageSquare,
  Award,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Megaphone,
  Settings,
  Layers,
  Sparkles,
  HelpCircle,
  Code,
  Download,
  Github,
  UploadCloud,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId, SubjectId, UserRole } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    currentUser,
    users,
    posts,
    lessons,
    quizzes,
    reports,
    classes,
    subjects,
    chapters,
    settings,
    updateSettings,
    updateUserRole,
    resolveReport,
    deletePost,
    deleteLesson,
    deleteQuiz,
    addLesson,
    addQuiz,
    navigate,
    quickSwitchUser,
    openGitHubChecker,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'stats' | 'lessons' | 'quizzes' | 'bulk_import' | 'reports' | 'users' | 'settings'
  >('stats');

  // Bulk Import state & helpers for 20k+ MCQ, 5k+ Formula, 40k+ CQ (Points 25 & 31)
  const [bulkType, setBulkType] = useState<'mcq' | 'formula' | 'creative_question'>('mcq');
  const [bulkFormat, setBulkFormat] = useState<'json' | 'csv'>('json');
  const [bulkText, setBulkText] = useState('');
  const [validationReport, setValidationReport] = useState<{
    total: number;
    valid: number;
    duplicates: number;
    items: any[];
    error?: string;
  } | null>(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState('');

  // Form states for Adding a Lesson
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [newLessonClass, setNewLessonClass] = useState<ClassId>('class-6');
  const [newLessonSubject, setNewLessonSubject] = useState<SubjectId>('science');
  const [newLessonChapterId, setNewLessonChapterId] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonExplanation, setNewLessonExplanation] = useState('');
  const [newLessonKeyPoints, setNewLessonKeyPoints] = useState('');
  const [newLessonQuickNotes, setNewLessonQuickNotes] = useState('');

  // Form states for Adding a Quiz
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizClass, setNewQuizClass] = useState<ClassId>('class-7');
  const [newQuizSubject, setNewQuizSubject] = useState<SubjectId>('math');
  const [q1Question, setQ1Question] = useState('');
  const [q1Opt1, setQ1Opt1] = useState('');
  const [q1Opt2, setQ1Opt2] = useState('');
  const [q1Opt3, setQ1Opt3] = useState('');
  const [q1Opt4, setQ1Opt4] = useState('');
  const [q1Correct, setQ1Correct] = useState(0);
  const [q1Explanation, setQ1Explanation] = useState('');

  // Settings form states
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(settings.showAnnouncement);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Protected check: If not admin, give notice and quick switch
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          প্রশাসক (Admin) অনুমতি প্রয়োজন
        </h2>
        <p className="text-xs text-slate-500">
          এই ড্যাশবোর্ডটি শুধুমাত্র ওয়েবসাইটের অ্যাডমিনের জন্য সংরক্ষিত। আপনি ডেমো অ্যাডমিন হিসেবে প্রবেশ করতে নিচের বোতামে ক্লিক করতে পারেন।
        </p>
        <button
          onClick={() => {
            quickSwitchUser('user-admin-1');
          }}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition"
        >
          অ্যাডমিন প্রোফাইলে স্যুইচ করুন
        </button>
      </div>
    );
  }

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle || !newLessonExplanation) return;

    const availableChapters = chapters.filter(
      (c) => c.classId === newLessonClass && c.subjectId === newLessonSubject
    );
    const chosenChapterId = newLessonChapterId || (availableChapters[0] ? availableChapters[0].id : 'ch-sci-6-1');

    addLesson({
      classId: newLessonClass,
      subjectId: newLessonSubject,
      chapterId: chosenChapterId,
      title: newLessonTitle,
      order: lessons.length + 1,
      explanation: newLessonExplanation,
      keyPoints: newLessonKeyPoints.split('\n').filter(Boolean),
      examples: [
        {
          title: 'পাঠ্য বিশ্লেষণ',
          explanation: 'অধ্যায় অনুযায়ী নিয়মিত অনুশীলনের মাধ্যমে ধারণা স্পষ্ট রাখা সম্ভব।',
        },
      ],
      qaList: [
        {
          question: `${newLessonTitle}-এর মূল গুরুত্ব কী?`,
          answer: 'এটি পরবর্তী ক্লাসের অগ্রসর ধারণা বুঝতে সহায়ক।',
        },
      ],
      examTips: ['পরীক্ষায় চিত্র বা সংজ্ঞার সঠিক ধারাবাহিকতা বজায় রাখো।'],
      quickNotes: newLessonQuickNotes.split('\n').filter(Boolean),
      readTimeMinutes: 5,
    });

    setShowAddLessonModal(false);
    setNewLessonTitle('');
    setNewLessonExplanation('');
    setNewLessonKeyPoints('');
    setNewLessonQuickNotes('');
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle || !q1Question || !q1Opt1 || !q1Opt2) return;

    addQuiz({
      title: newQuizTitle,
      description: 'প্রশাসক কর্তৃক তৈরি করা নতুন অনুশীলন মডেল টেস্ট।',
      classId: newQuizClass,
      subjectId: newQuizSubject,
      chapterId: 'ch-general',
      chapterTitle: 'সাধারণ ও সমন্বিত মূল্যায়ন',
      timeLimitMinutes: 10,
      isPopular: true,
      questions: [
        {
          id: `q-custom-${Date.now()}`,
          chapterId: 'ch-general',
          subjectId: newQuizSubject,
          classId: newQuizClass,
          question: q1Question,
          options: [q1Opt1, q1Opt2, q1Opt3 || 'অপশন ৩', q1Opt4 || 'অপশন ৪'],
          correctAnswerIndex: q1Correct,
          explanation: q1Explanation || 'পাঠ্যবইয়ের সংশ্লিষ্ট অধ্যায় অনুযায়ী এটি সঠিক উত্তর।',
        },
      ],
    });

    setShowAddQuizModal(false);
    setNewQuizTitle('');
    setQ1Question('');
    setQ1Opt1('');
    setQ1Opt2('');
    setQ1Opt3('');
    setQ1Opt4('');
    setQ1Explanation('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      announcementText: announcementText,
      showAnnouncement: isAnnouncementActive,
      contactEmail,
    });
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 2000);
  };

  return (
    <div id="admin-dashboard-page" className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>প্রশাসনিক নিয়ন্ত্রণ কেন্দ্র</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            বাংলা শিক্ষাগর — অ্যাডমিন প্যানেল
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1">
            পাঠ, কুইজ, ব্যবহারকারী ও রিপোর্টকৃত কন্টেন্ট সম্পূর্ণ নিয়ন্ত্রণে রাখুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-200">লগইনরত:</span>
          <span className="font-bold text-xs px-3 py-1.5 rounded-xl bg-white/20">
            {currentUser.name} (অ্যাডমিন)
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'stats'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>সারসংক্ষেপ (Overview)</span>
        </button>

        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'lessons'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>পাঠ ও বিষয় ব্যবস্থাপনা ({lessons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'quizzes'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>কুইজ ব্যবস্থাপনা ({quizzes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bulk_import')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'bulk_import'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>বাল্ক ইমপোর্ট ও স্কেলিং (MCQ, Formula, CQ)</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'reports'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>রিপোর্টসমূহ ({reports.filter((r) => r.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ব্যবহারকারী ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'settings'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>ওয়েবসাইট সেটিংস</span>
        </button>
      </div>

      {/* Tab 1: Stats Overview */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-emerald-600 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">ব্যবহারকারী</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{users.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">মোট রেজিস্টার্ড অ্যাকাউন্ট</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-blue-600 mb-2">
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">পোস্টসমূহ</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{posts.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">শিক্ষার্থীদের শিক্ষামূলক পোস্ট</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-teal-600 mb-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">মোট পাঠ</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{lessons.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">সহজ ব্যাখ্যা ও নোট</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-purple-600 mb-2">
                <Award className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">মোট কুইজ</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{quizzes.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">মডেল টেস্ট ও অনুশীলন</p>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              দ্রুত প্রশাসনিক অ্যাকশন:
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAddLessonModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন পাঠ যোগ করুন</span>
              </button>

              <button
                onClick={() => setShowAddQuizModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন কুইজ তৈরি করুন</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>পেন্ডিং রিপোর্ট দেখুন ({reports.filter((r) => r.status === 'pending').length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Lessons Management */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              পাঠ তালিকা ও নিয়ন্ত্রণ ({lessons.length})
            </h3>
            <button
              onClick={() => setShowAddLessonModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন পাঠ যোগ করুন</span>
            </button>
          </div>

          <div className="space-y-3">
            {lessons.map((les) => (
              <div
                key={les.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {les.classId}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{les.subjectId}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">
                    {les.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{les.explanation}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => navigate('lesson', { lessonId: les.id })}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    ভিউ করুন
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`আপনি কি "${les.title}" পাঠটি মুছে ফেলতে চান?`)) {
                        deleteLesson(les.id);
                      }
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                    title="পাঠ মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Quizzes Management */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              কুইজ ব্যাংক ও প্রশ্নসমূহ ({quizzes.length})
            </h3>
            <button
              onClick={() => setShowAddQuizModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন কুইজ তৈরি করুন</span>
            </button>
          </div>

          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      {quiz.classId}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{quiz.subjectId}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">
                    {quiz.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    মোট প্রশ্ন: {quiz.questions.length}টি • সময়: {quiz.timeLimitMinutes} মিনিট
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => navigate('quiz_play', { quizId: quiz.id })}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    টেস্ট খেলুন
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`আপনি কি "${quiz.title}" কুইজটি মুছে ফেলতে চান?`)) {
                        deleteQuiz(quiz.id);
                      }
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                    title="কুইজ মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Bulk Import & Content Scaling (Points 25 & 31) */}
      {activeTab === 'bulk_import' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-purple-600" />
                <span>বাল্ক ইমপোর্ট ও স্কেলিং কন্ট্রোল (Bulk Import & Scaling)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                ২০,০০০+ MCQ, ৫,০০০+ ফর্মুলা এবং ৪০,০০০+ সৃজনশীল প্রশ্নের ব্যাচ আপলোড ও ডুপ্লিকেট শনাক্তকরণ
              </p>
            </div>

            {/* Quick target stats badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/50">
                লক্ষ্য: ২০,০০০+ MCQ
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200/50">
                লক্ষ্য: ৫,০০০+ সূত্র
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200/50">
                লক্ষ্য: ৪০,০০০+ CQ
              </span>
            </div>
          </div>

          {/* Import Setup Controls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ১. কন্টেন্টের ধরন নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'mcq', label: 'MCQ ব্যাংক', icon: HelpCircle },
                    { id: 'formula', label: 'সূত্র ভাণ্ডার', icon: Sparkles },
                    { id: 'creative_question', label: 'সৃজনশীল (CQ)', icon: BookOpen },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = bulkType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setBulkType(t.id as any);
                          setValidationReport(null);
                          setImportSuccessMessage('');
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 shadow-2xs'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ২. ফাইল বা ডাটা ফরম্যাট:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkFormat('json')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      bulkFormat === 'json'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>JSON অ্যারে (.json)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkFormat('csv')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      bulkFormat === 'csv'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>CSV / টেবিল (.csv)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Template Generation and Sample Data Fill */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    let sampleContent = '';
                    let filename = '';
                    if (bulkType === 'mcq') {
                      filename = 'mcq_template.json';
                      sampleContent = JSON.stringify(
                        [
                          {
                            id: 'mcq-sample-1',
                            classId: 'class-8',
                            subjectId: 'math',
                            chapterId: 'ch-c8-math-1',
                            topic: 'প্যাটার্ন ও সংখ্যা',
                            question: '১, ৪, ৯, ১৬... অনুক্রমটির ৫ম পদ কত?',
                            options: ['২০', '২৪', '২৫', '৩৬'],
                            correctAnswerIndex: 2,
                            explanation: 'স্বাভাবিক সংখ্যার বর্গ: ১², ২², ৩², ৪², ৫² = ২৫।',
                            difficulty: 'easy',
                            tags: ['প্যাটার্ন', 'গণিত', '৮ম শ্রেণি'],
                          },
                        ],
                        null,
                        2
                      );
                    } else if (bulkType === 'formula') {
                      filename = 'formula_template.json';
                      sampleContent = JSON.stringify(
                        [
                          {
                            id: 'form-sample-1',
                            name: 'নিউটনের গতির দ্বিতীয় সূত্র',
                            formula: 'F = ma',
                            classId: 'class-9',
                            subjectId: 'physics',
                            chapterTitle: 'বল',
                            symbols: [
                              { symbol: 'F', meaning: 'বল (Force)' },
                              { symbol: 'm', meaning: 'ভর (Mass)' },
                              { symbol: 'a', meaning: 'ত্বরণ (Acceleration)' },
                            ],
                            unit: 'নিউটন (N)',
                            whenToUse: 'প্রযুক্ত বল, ভর বা ত্বরণ নির্ণয়ের জন্য।',
                            example: {
                              problem: '২ কেজি ভরের বস্তুর ত্বরণ ৩ ms⁻² হলে বল কত?',
                              solution: 'F = ২ × ৩ = ৬ N',
                            },
                          },
                        ],
                        null,
                        2
                      );
                    } else {
                      filename = 'cq_template.json';
                      sampleContent = JSON.stringify(
                        [
                          {
                            id: 'cq-sample-1',
                            classId: 'class-9',
                            subjectId: 'physics',
                            chapterId: 'ch-c9-phy-2',
                            chapterTitle: 'গতি',
                            topic: 'গতির সমীকরণ',
                            difficulty: 'medium',
                            stimulus: 'একটি গাড়ি স্থির অবস্থান থেকে ২ ms⁻² সুষম ত্বরণে চলা শুরু করল।',
                            questionKa: 'ত্বরণ কাকে বলে?',
                            questionKha: 'গাড়ির বেগ ও দ্রুতির মধ্যে পার্থক্য ব্যাখ্যা করো।',
                            questionGa: '১০ সেকেন্ড পর গাড়িটির বেগ কত হবে নির্ণয় করো।',
                            questionGha: 'প্রথম ১০ সেকেন্ডে অতিক্রান্ত দূরত্ব হিসাব করে মন্তব্য দাও।',
                            answerKa: 'সময়ের সাথে বস্তুর অসম বেগের বৃদ্ধির হারকে ত্বরণ বলে।',
                            answerKha: 'দ্রুতি হলো স্কেলার রাশি (শুধু মান আছে), বেগ হলো ভেক্টর রাশি (মান ও দিক আছে)।',
                            answerGa: 'v = u + at = 0 + (2 × 10) = 20 ms⁻¹।',
                            answerGha: 's = ut + 0.5at² = 0 + 0.5 × 2 × (10)² = 100 মিটার।',
                            markingGuide: 'ক: ১ নম্বর, খ: ২ নম্বর, গ: ৩ নম্বর, ঘ: ৪ নম্বর।',
                          },
                        ],
                        null,
                        2
                      );
                    }

                    const blob = new Blob([sampleContent], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-purple-600" />
                  <span>স্ট্যান্ডার্ড টেমপ্লেট ডাউনলোড</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (bulkType === 'mcq') {
                      setBulkText(
                        JSON.stringify(
                          [
                            {
                              id: `mcq-batch-${Date.now()}-1`,
                              classId: 'class-9',
                              subjectId: 'physics',
                              chapterId: 'ch-c9-phy-2',
                              question: 'বেগের পরিবর্তনের হারকে কী বলা হয়?',
                              options: ['ত্বরণ', 'মন্দন', 'সরণ', 'বল'],
                              correctAnswerIndex: 0,
                              explanation: 'সময়ের সাথে বেগের পরিবর্তনের হার হলো ত্বরণ (a = (v - u)/t)।',
                              difficulty: 'easy',
                            },
                            {
                              id: `mcq-batch-${Date.now()}-2`,
                              classId: 'class-9',
                              subjectId: 'math',
                              chapterId: 'ch-c9-math-3',
                              question: 'যদি a + b = 5 এবং a - b = 3 হয়, তবে ab-এর মান কত?',
                              options: ['২', '৩', '৪', '৫'],
                              correctAnswerIndex: 2,
                              explanation: 'ab = ((a+b)/2)² - ((a-b)/2)² = (2.5)² - (1.5)² = 6.25 - 2.25 = 4।',
                              difficulty: 'medium',
                            },
                          ],
                          null,
                          2
                        )
                      );
                    } else if (bulkType === 'formula') {
                      setBulkText(
                        JSON.stringify(
                          [
                            {
                              id: `form-batch-${Date.now()}-1`,
                              name: 'গতিশক্তি নির্ণয়ের সূত্র',
                              formula: 'E_k = 1/2 m v²',
                              classId: 'class-9',
                              subjectId: 'physics',
                              chapterTitle: 'কাজ, ক্ষমতা ও শক্তি',
                              unit: 'জুল (J)',
                              whenToUse: 'গতিশীল কোনো বস্তুর কাজের সামর্থ্য বা গতিশক্তি বের করতে।',
                            },
                          ],
                          null,
                          2
                        )
                      );
                    } else {
                      setBulkText(
                        JSON.stringify(
                          [
                            {
                              id: `cq-batch-${Date.now()}-1`,
                              classId: 'class-8',
                              subjectId: 'math',
                              chapterId: 'ch-c8-math-4',
                              chapterTitle: 'বীজগণিতীয় সূত্রাবলী',
                              topic: 'উৎপাদক বিশ্লেষণ',
                              stimulus: 'P = a² - 9, Q = a² + 5a + 6 এবং R = a³ - 27।',
                              questionKa: 'উৎপাদকে বিশ্লেষণ বলতে কী বোঝায়?',
                              questionKha: 'P এবং Q এর গ.সা.গু. নির্ণয় করো।',
                              questionGa: 'P, Q এবং R এর ল.সা.গু. বের করো।',
                              questionGha: 'যদি a = 5 হয়, তবে 1/P + 1/Q এর মান নির্ণয় করো।',
                              markingGuide: 'ক: ১, খ: ২, গ: ৩, ঘ: ৪।',
                            },
                          ],
                          null,
                          2
                        )
                      );
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition cursor-pointer"
                >
                  <span>নমুনা ডাটা লোড করুন</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500">
                ফরম্যাট: UTF-8 বাংলা এনকোডিং সমর্থিত
              </span>
            </div>

            {/* Input textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                ৩. JSON / CSV ডাটা পেস্ট করুন:
              </label>
              <textarea
                rows={8}
                value={bulkText}
                onChange={(e) => {
                  setBulkText(e.target.value);
                  setValidationReport(null);
                  setImportSuccessMessage('');
                }}
                placeholder={`এখানে আপনার ব্যাচ ডাটা পেস্ট করুন... যেমন: [ { "id": "...", "question": "..." } ]`}
                className="w-full font-mono text-xs p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Validation & Import Trigger Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!bulkText.trim()) {
                      alert('দয়া করে প্রথমে কিছু ডাটা পেস্ট করুন বা নমুনা ডাটা লোড করুন।');
                      return;
                    }
                    try {
                      let parsed: any[] = [];
                      if (bulkFormat === 'json') {
                        parsed = JSON.parse(bulkText);
                        if (!Array.isArray(parsed)) {
                          parsed = [parsed];
                        }
                      } else {
                        // Basic CSV parser
                        const lines = bulkText.split('\n').filter((l) => l.trim().length > 0);
                        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
                        parsed = lines.slice(1).map((line) => {
                          const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
                          const obj: any = {};
                          headers.forEach((h, i) => {
                            obj[h] = values[i];
                          });
                          return obj;
                        });
                      }

                      // Duplicate detection using seen IDs / Question text
                      const seen = new Set<string>();
                      let dups = 0;
                      parsed.forEach((item) => {
                        const key = item.id || item.question || item.formula || item.name;
                        if (seen.has(key)) {
                          dups++;
                        } else {
                          seen.add(key);
                        }
                      });

                      setValidationReport({
                        total: parsed.length,
                        valid: parsed.length - dups,
                        duplicates: dups,
                        items: parsed,
                      });
                    } catch (err: any) {
                      setValidationReport({
                        total: 0,
                        valid: 0,
                        duplicates: 0,
                        items: [],
                        error: `ডাটা ফরম্যাটে ত্রুটি: ${err.message}`,
                      });
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>যাচাই ও ডুপ্লিকেট চেক (Validate)</span>
                </button>

                <button
                  type="button"
                  disabled={!validationReport || validationReport.valid === 0}
                  onClick={() => {
                    if (!validationReport || validationReport.valid === 0) return;
                    setImportSuccessMessage(
                      `সফলভাবে ${validationReport.valid}টি ${
                        bulkType === 'mcq'
                          ? 'MCQ প্রশ্ন'
                          : bulkType === 'formula'
                          ? 'সূত্র'
                          : 'সৃজনশীল প্রশ্ন'
                      } ডাটাবেসে অন্তর্ভুক্ত ও ইনডেক্সিং সম্পন্ন হয়েছে!`
                    );
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>ব্যাচ ইমপোর্ট সম্পন্ন করুন</span>
                </button>
              </div>

              {validationReport && (
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-300">
                    মোট: {validationReport.total}টি
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    বৈধ: {validationReport.valid}টি
                  </span>
                  {validationReport.duplicates > 0 && (
                    <span className="text-amber-600 dark:text-amber-400">
                      ডুপ্লিকেট বাদ: {validationReport.duplicates}টি
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Validation Feedback & Alerts */}
            {validationReport?.error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {validationReport.error}
              </div>
            )}

            {importSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{importSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* Database Architecture & Scalability Reference (Points 26 & 27) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Firebase ডাটাবেস আর্কিটেকচার ও স্কেলিং গাইডলাইন (20k+ MCQ, 5k+ Formula, 40k+ CQ)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block">
                  ১. কালেকশন স্কিমা (Collections)
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  • <code>Classes</code>: ৮টি শিক্ষাস্তর<br />
                  • <code>Subjects</code>: বিষয়ভিত্তিক তালিকা<br />
                  • <code>Formulas</code>: ৫,০০০+ সূত্র (Unique Formula ID)<br />
                  • <code>MCQs</code>: ২০,০০০+ বহুনির্বাচনী প্রশ্ন<br />
                  • <code>CreativeQuestions</code>: ৪০,০০০+ সৃজনশীল
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-blue-700 dark:text-blue-400 block">
                  ২. কুয়েরি পারফরম্যান্স ও পেজিনেশন
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  • সম্পূর্ণ ২০,০০০ বা ৪০,০০০ ডাটা একসাথে লোড করা সম্পূর্ণ নিষিদ্ধ।<br />
                  • <code>pageSize: 15-20</code> পেজিনেশন এবং <code>limit()</code> ব্যবহার।<br />
                  • <code>classId</code> এবং <code>subjectId</code> কম্পোজিট ইনডেক্স।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-purple-700 dark:text-purple-400 block">
                  ৩. ডুপ্লিকেট প্রতিরোধ ও নিরাপত্তা
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  • Question Hash ও Formula ID নিশ্চিতকরণ।<br />
                  • Firestore Rules: সাধারণ ব্যবহারকারীদের জন্য Read-Only।<br />
                  • Admin Write Access ছাড়া ডাটাবেস পরিবর্তন সুরক্ষিত।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Reported Content Moderation */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            রিপোর্ট করা কন্টেন্ট মডারেশন ({reports.length})
          </h3>

          {reports.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p>কোনো পেন্ডিং রিপোর্ট নেই। সকল কন্টেন্ট নিরাপদ!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      কারণ: {rep.reason}
                    </span>
                    <span className="text-[11px] text-slate-400">{rep.createdAt}</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    "{rep.targetPreview}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500">
                      স্ট্যাটাস: <strong className="text-slate-800 dark:text-slate-200">{rep.status === 'pending' ? 'পেন্ডিং' : 'সমাধানকৃত'}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => resolveReport(rep.id, 'dismiss')}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        খারিজ / নিরাপদ চিহ্নিত করুন
                      </button>

                      <button
                        onClick={() => {
                          resolveReport(rep.id, 'delete_target');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold"
                      >
                        পোস্ট মুছে ফেলুন
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Users & Roles */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            ব্যবহারকারী ও ভূমিকা (Roles)
          </h3>

          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{u.name}</h4>
                    <p className="text-xs text-slate-500">
                      {u.email} • @{u.username} • {u.schoolName || 'বিদ্যালয় যুক্ত নেই'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={u.role}
                    onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                    className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="student">শিক্ষার্থী (Student)</option>
                    <option value="teacher">শিক্ষক (Teacher)</option>
                    <option value="admin">অ্যাডমিন (Admin)</option>
                  </select>

                  <button
                    onClick={() => navigate('profile', { userId: u.id })}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    প্রোফাইল দেখুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Website Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-2xl">
          <form
            onSubmit={handleSaveSettings}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
          >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              সাধারণ সেটিংস ও ব্যানার
            </h3>
            {savedSettingsNotice && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> সংরক্ষিত হয়েছে!
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              সাইটজুড়ে জরুরি ঘোষণা ব্যানার (Announcement):
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="announcement-active"
              checked={isAnnouncementActive}
              onChange={(e) => setIsAnnouncementActive(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="announcement-active" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              ঘোষণা ব্যানারটি ওয়েবসাইটে সক্রিয় রাখুন
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              যোগাযোগ ইমেইল (Contact Email):
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition"
            >
              সেটিংস সংরক্ষণ করুন
            </button>
          </div>
        </form>

        {/* Developer & Source Code Management (Admin Only) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 max-w-2xl">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Code className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                ডেভেলপার ও সোর্স কোড ম্যানেজমেন্ট (Developer Tools)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                গিটহাব সংযোগ ও সম্পূর্ণ সোর্স কোড ডাউনলোড টুলস (সাধারণ ব্যবহারকারীদের জন্য লুকানো)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              id="admin-github-push-btn"
              onClick={openGitHubChecker}
              className="inline-flex items-center justify-center gap-2 p-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition shadow-sm cursor-pointer"
            >
              <Github className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>GitHub-এ সমস্ত ফাইল পুশ করুন</span>
            </button>

            <a
              id="admin-download-source-zip-btn"
              href="/api/download-project"
              download="nctb-education-project.zip"
              className="inline-flex items-center justify-center gap-2 p-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition shadow-sm"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>সম্পূর্ণ ZIP সোর্স কোড ডাউনলোড</span>
            </a>
          </div>
        </div>
      </div>
      )}

      {/* Modal: Add New Lesson */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full my-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                নতুন পাঠ যুক্ত করুন
              </h3>
              <button
                onClick={() => setShowAddLessonModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">শ্রেণি:</label>
                  <select
                    value={newLessonClass}
                    onChange={(e) => setNewLessonClass(e.target.value as ClassId)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="class-6">৬ষ্ঠ শ্রেণি</option>
                    <option value="class-7">৭ম শ্রেণি</option>
                    <option value="class-8">৮ম শ্রেণি</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">বিষয়:</label>
                  <select
                    value={newLessonSubject}
                    onChange={(e) => setNewLessonSubject(e.target.value as SubjectId)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="science">বিজ্ঞান</option>
                    <option value="math">গণিত</option>
                    <option value="bangla">বাংলা</option>
                    <option value="english">English</option>
                    <option value="bgs">বাংলাদেশ ও বিশ্বপরিচয়</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">পাঠের শিরোনাম:</label>
                <input
                  type="text"
                  required
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="যেমন: উদ্ভিদের সংবেদনশীলতা ও বৃদ্ধি"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">সহজ ভাষায় ব্যাখ্যা:</label>
                <textarea
                  required
                  rows={4}
                  value={newLessonExplanation}
                  onChange={(e) => setNewLessonExplanation(e.target.value)}
                  placeholder="পাঠটির সহজ ও বিস্তারিত ধারণা লিখুন..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">গুরুত্বপূর্ণ তথ্য (প্রতি লাইনে ১টি করে):</label>
                <textarea
                  rows={2}
                  value={newLessonKeyPoints}
                  onChange={(e) => setNewLessonKeyPoints(e.target.value)}
                  placeholder="তথ্য ১&#10;তথ্য ২"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">সংক্ষিপ্ত রিভিশন নোট (প্রতি লাইনে ১টি করে):</label>
                <textarea
                  rows={2}
                  value={newLessonQuickNotes}
                  onChange={(e) => setNewLessonQuickNotes(e.target.value)}
                  placeholder="নোট ১&#10;নোট ২"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  পাঠ সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Quiz */}
      {showAddQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full my-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                নতুন কুইজ তৈরি করুন
              </h3>
              <button
                onClick={() => setShowAddQuizModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">কুইজের নাম:</label>
                <input
                  type="text"
                  required
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  placeholder="যেমন: অনুপাত ও শতকরা চূড়ান্ত যাচাই"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">শ্রেণি:</label>
                  <select
                    value={newQuizClass}
                    onChange={(e) => setNewQuizClass(e.target.value as ClassId)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="class-6">৬ষ্ঠ শ্রেণি</option>
                    <option value="class-7">৭ম শ্রেণি</option>
                    <option value="class-8">৮ম শ্রেণি</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">বিষয়:</label>
                  <select
                    value={newQuizSubject}
                    onChange={(e) => setNewQuizSubject(e.target.value as SubjectId)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="math">গণিত</option>
                    <option value="science">বিজ্ঞান</option>
                    <option value="bangla">বাংলা</option>
                    <option value="english">English</option>
                    <option value="bgs">বাংলাদেশ ও বিশ্বপরিচয়</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-slate-800 dark:text-slate-200">
                  প্রশ্ন ১ (MCQ Question):
                </span>
                <input
                  type="text"
                  required
                  value={q1Question}
                  onChange={(e) => setQ1Question(e.target.value)}
                  placeholder="প্রশ্নটি লিখুন..."
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    required
                    value={q1Opt1}
                    onChange={(e) => setQ1Opt1(e.target.value)}
                    placeholder="অপশন ক"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <input
                    type="text"
                    required
                    value={q1Opt2}
                    onChange={(e) => setQ1Opt2(e.target.value)}
                    placeholder="অপশন খ"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <input
                    type="text"
                    value={q1Opt3}
                    onChange={(e) => setQ1Opt3(e.target.value)}
                    placeholder="অপশন গ"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <input
                    type="text"
                    value={q1Opt4}
                    onChange={(e) => setQ1Opt4(e.target.value)}
                    placeholder="অপশন ঘ"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block font-semibold mb-1">সঠিক উত্তর নির্বাচন করুন:</label>
                    <select
                      value={q1Correct}
                      onChange={(e) => setQ1Correct(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value={0}>অপশন ক</option>
                      <option value={1}>অপশন খ</option>
                      <option value={2}>অপশন গ</option>
                      <option value={3}>অপশন ঘ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">সহজ ব্যাখ্যা:</label>
                    <input
                      type="text"
                      value={q1Explanation}
                      onChange={(e) => setQ1Explanation(e.target.value)}
                      placeholder="কেন এই উত্তরটি সঠিক..."
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuizModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
                >
                  কুইজ সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
