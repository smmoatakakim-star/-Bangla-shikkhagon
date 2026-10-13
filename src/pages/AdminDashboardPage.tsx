import React, { useState } from 'react';
import {
  Shield,
  Layers,
  BookOpen,
  HelpCircle,
  FileText,
  Megaphone,
  Globe,
  Sparkles,
  Users,
  AlertTriangle,
  Lock,
  ExternalLink,
  ChevronRight,
  LogOut,
  Sparkle,
  Compass,
  PenTool,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminLoginGate } from '../components/admin/AdminLoginGate';
import { AdminDashboardOverview } from '../components/admin/AdminDashboardOverview';
import { AdminContentMap } from '../components/admin/AdminContentMap';
import { AdminClassManager } from '../components/admin/AdminClassManager';
import { AdminSubjectManager } from '../components/admin/AdminSubjectManager';
import { AdminChapterManager } from '../components/admin/AdminChapterManager';
import { AdminQuestionManager } from '../components/admin/AdminQuestionManager';
import { AdminNotesManager } from '../components/admin/AdminNotesManager';
import { AdminNoticeManager } from '../components/admin/AdminNoticeManager';
import { AdminSeoManager } from '../components/admin/AdminSeoManager';
import { AdminAiGenerator } from '../components/admin/AdminAiGenerator';
import { AdminAiCommandCenter } from '../components/admin/AdminAiCommandCenter';
import { AdminPreviewModal } from '../components/admin/AdminPreviewModal';
import { AdminSyllabusManager } from '../components/admin/AdminSyllabusManager';
import { AdminWritingGuideManager } from '../components/admin/AdminWritingGuideManager';

type AdminTab =
  | 'overview'
  | 'ai_command_center'
  | 'content_map'
  | 'syllabuses'
  | 'writing_guides'
  | 'classes'
  | 'subjects'
  | 'chapters'
  | 'questions'
  | 'notes'
  | 'notices'
  | 'seo'
  | 'ai_generator'
  | 'reports'
  | 'users';

export const AdminDashboardPage: React.FC = () => {
  const {
    currentUser,
    users,
    classes,
    subjects,
    chapters,
    managedQuestions,
    lessons,
    managedNotices,
    adminDrafts,
    syllabusList,
    writingGuideList,
    reports,
    resolveReport,
    updateUserRole,
    adminToggleBanUser,
    isAdminAuthenticated,
    adminLogout,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Preview Modal state
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    type: any;
    data: any;
  }>({
    isOpen: false,
    type: 'question',
    data: null,
  });

  const handleOpenPreview = (type: any, data: any) => {
    setPreviewState({
      isOpen: true,
      type,
      data,
    });
  };

  // Protected Admin Gate: Must have valid authenticated admin session and verified access code
  const isAuthorized = isAdminAuthenticated;

  if (!isAuthorized) {
    return <AdminLoginGate />;
  }

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div id="admin-dashboard-page" className="space-y-6 pb-20">
      {/* Top Admin Header Bar */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-950 text-white p-5 sm:p-7 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>নিরাপদ প্রশাসনিক নিয়ন্ত্রণ কেন্দ্র</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firebase Live Sync</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            বাংলা শিক্ষাগর — কন্টেন্ট অ্যাডমিন প্যানেল
          </h1>
          <p className="text-xs text-purple-200 mt-1 max-w-xl">
            Google AI Studio বা GitHub কোড পরিবর্তন ছাড়াই সম্পূর্ণ সিলেবাস, প্রশ্নব্যাংক ও সাইট কন্টেন্ট নিয়ন্ত্রণ করুন।
          </p>
        </div>

        {/* User Identity & Logout */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-purple-300 block">লগইনরত অ্যাডমিন:</span>
            <span className="text-xs font-bold text-white">
              {currentUser?.name || 'Administrator'}
            </span>
          </div>

          <button
            onClick={() => navigate('home')}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            title="লাইভ সাইট দেখুন"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ওয়েবসাইট</span>
          </button>

          <button
            onClick={adminLogout}
            className="px-3 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
            title="অ্যাডমিন প্যানেল লক ও লগআউট করুন"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Navigation Tab Bar (Mobile-friendly horizontal scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800 text-xs">
        {/* 1. Overview */}
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>সারসংক্ষেপ</span>
        </button>

        {/* 2. AI Command Center */}
        <button
          onClick={() => setActiveTab('ai_command_center')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'ai_command_center'
              ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-md'
              : 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/60 dark:to-indigo-950/60 text-purple-700 dark:text-purple-300 hover:opacity-95 border border-purple-300 dark:border-purple-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>⚡ AI Command Center</span>
        </button>

        {/* Content Map (Where Published?) */}
        <button
          onClick={() => setActiveTab('content_map')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'content_map'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>কন্টেন্ট ম্যাপ (Where Published?)</span>
        </button>

        {/* Official Syllabus & Curriculum */}
        <button
          onClick={() => setActiveTab('syllabuses')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'syllabuses'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-slate-800 border border-teal-200 dark:border-teal-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>📚 সিলেবাস ({syllabusList.length})</span>
        </button>

        {/* Writing Guide (Phase 2 CMS) */}
        <button
          onClick={() => setActiveTab('writing_guides')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'writing_guides'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60'
          }`}
        >
          <PenTool className="w-4 h-4 text-amber-300" />
          <span>✍️ লেখার গাইড ({writingGuideList.length})</span>
        </button>

        {/* 2. Classes */}
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'classes'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>শ্রেণি ({classes.length})</span>
        </button>

        {/* 3. Subjects */}
        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'subjects'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>বিষয় ({subjects.length})</span>
        </button>

        {/* 4. Chapters */}
        <button
          onClick={() => setActiveTab('chapters')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'chapters'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>অধ্যায় ({chapters.length})</span>
        </button>

        {/* 5. Questions (MCQ/CQ) */}
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'questions'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>প্রশ্ন ও MCQ ({managedQuestions.length})</span>
        </button>

        {/* 6. Notes & Study Materials */}
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'notes'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>পাঠ ও নোট ({lessons.length})</span>
        </button>

        {/* 7. Notices */}
        <button
          onClick={() => setActiveTab('notices')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'notices'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>নোটিস ({managedNotices.length})</span>
        </button>

        {/* 8. SEO Config */}
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'seo'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>SEO সেটিংস</span>
        </button>

        {/* 9. AI Generator */}
        <button
          onClick={() => setActiveTab('ai_generator')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'ai_generator'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI কন্টেন্ট ({adminDrafts.length})</span>
        </button>

        {/* 10. Reports */}
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'reports'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>রিপোর্ট ({pendingReportsCount})</span>
        </button>

        {/* 11. Users */}
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ব্যবহারকারী ({users.length})</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <AdminDashboardOverview
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewModal={(modal) => setActiveTab(modal === 'class' ? 'classes' : modal === 'subject' ? 'subjects' : modal === 'chapter' ? 'chapters' : modal === 'question' ? 'questions' : modal === 'note' ? 'notes' : 'notices')}
          />
        )}

        {activeTab === 'ai_command_center' && (
          <AdminAiCommandCenter onPreview={(type, item) => handleOpenPreview(type, item)} />
        )}

        {activeTab === 'content_map' && <AdminContentMap />}

        {activeTab === 'syllabuses' && <AdminSyllabusManager />}

        {activeTab === 'writing_guides' && (
          <AdminWritingGuideManager onPreview={(type, item) => handleOpenPreview(type, item)} />
        )}

        {activeTab === 'classes' && (
          <AdminClassManager onPreview={(type, item) => handleOpenPreview(type, item)} />
        )}

        {activeTab === 'subjects' && (
          <AdminSubjectManager onPreview={(type, item) => handleOpenPreview(type, item)} />
        )}

        {activeTab === 'chapters' && (
          <AdminChapterManager onPreview={(type, item) => handleOpenPreview(type, item)} />
        )}

        {activeTab === 'questions' && (
          <AdminQuestionManager onPreview={(type, item) => handleOpenPreview(type, item)} />
        )}

        {activeTab === 'notes' && (
          <AdminNotesManager onPreview={(type, item) => handleOpenPreview(type, item)} />
        )}

        {activeTab === 'notices' && (
          <AdminNoticeManager onPreview={(type, item) => handleOpenPreview(type, item)} />
        )}

        {activeTab === 'seo' && <AdminSeoManager />}

        {activeTab === 'ai_generator' && (
          <AdminAiGenerator onPreview={(type, item) => handleOpenPreview(type, item)} />
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              মডারেশন ও রিপোর্ট ব্যবস্থাপনা ({reports.length})
            </h3>
            {reports.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-xs text-slate-400">
                বর্তমানে কোনো পেন্ডিং রিপোর্ট নেই।
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-600 uppercase">{r.reason}</span>
                      <span className="text-[10px] text-slate-400">{r.createdAt}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      <strong>রিপোর্টার:</strong> {r.reporterName} • <strong>ধরন:</strong> {r.targetType}
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {r.targetPreview || 'কোনো টেক্সট পাওয়া যায়নি'}
                    </div>
                    {r.status === 'pending' ? (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => resolveReport(r.id, 'dismiss')}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold transition"
                        >
                          খারিজ করুন
                        </button>
                        <button
                          onClick={() => resolveReport(r.id, 'delete_target')}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition"
                        >
                          কন্টেন্ট মুছে দিন
                        </button>
                      </div>
                    ) : (
                      <span className="text-emerald-600 font-bold">✓ নিষ্পত্তি সম্পন্ন ({r.status})</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              নিবন্ধিত ব্যবহারকারী তালিকা ({users.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full bg-slate-100 object-cover"
                    />
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-slate-100">{u.name}</h5>
                      <span className="text-[11px] text-slate-400">@{u.username} • {u.email}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      {u.role}
                    </span>

                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u.id, e.target.value as any)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-bold"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Universal Preview Modal */}
      <AdminPreviewModal
        isOpen={previewState.isOpen}
        onClose={() => setPreviewState({ ...previewState, isOpen: false })}
        type={previewState.type}
        data={previewState.data}
      />
    </div>
  );
};
