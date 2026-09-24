import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  FileText,
  MessageSquare,
  User as UserIcon,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SearchPage: React.FC = () => {
  const {
    classes,
    subjects,
    chapters,
    lessons,
    posts,
    quizzes,
    users,
    searchQuery,
    setSearchQuery,
    navigate,
  } = useApp();

  const [inputVal, setInputVal] = useState(searchQuery);
  const [filterTab, setFilterTab] = useState<'all' | 'lessons' | 'quizzes' | 'posts' | 'users'>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal.trim());
  };

  const query = (inputVal || searchQuery || '').toLowerCase().trim();

  // Search results calculation
  const results = useMemo(() => {
    if (!query) {
      return {
        matchedLessons: [],
        matchedChapters: [],
        matchedQuizzes: [],
        matchedPosts: [],
        matchedUsers: [],
        total: 0,
      };
    }

    const matchedLessons = lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        l.explanation.toLowerCase().includes(query) ||
        l.keyPoints.some((p) => p.toLowerCase().includes(query)) ||
        (l.quickNotes?.some((n) => n.toLowerCase().includes(query)) ?? false)
    );

    const matchedChapters = chapters.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
    );

    const matchedQuizzes = quizzes.filter(
      (q) =>
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.questions.some((qu) => qu.question.toLowerCase().includes(query))
    );

    const matchedPosts = posts.filter(
      (p) =>
        p.text.toLowerCase().includes(query) ||
        p.subjectName.toLowerCase().includes(query) ||
        p.authorName.toLowerCase().includes(query)
    );

    const matchedUsers = users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query) ||
        (u.schoolName && u.schoolName.toLowerCase().includes(query))
    );

    const total =
      matchedLessons.length +
      matchedChapters.length +
      matchedQuizzes.length +
      matchedPosts.length +
      matchedUsers.length;

    return {
      matchedLessons,
      matchedChapters,
      matchedQuizzes,
      matchedPosts,
      matchedUsers,
      total,
    };
  }, [query, lessons, chapters, quizzes, posts, users]);

  // Quick search keywords
  const popularKeywords = ['সালোকসংশ্লেষণ', 'প্যাটার্ন', 'ভগ্নাংশ', 'English Grammar', 'বিজ্ঞান', 'কোষ'];

  return (
    <div id="search-results-page" className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Search Header and Input */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          অনুসন্ধান (Search)
        </h1>
        <p className="text-xs text-slate-500">
          যেকোনো শ্রেণি, বিষয়, অধ্যায়, সহজ পাঠ, কুইজ, পোস্ট বা শিক্ষকের নাম দিয়ে খুঁজুন
        </p>

        <form onSubmit={handleSearch} className="pt-2">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setSearchQuery(e.target.value);
              }}
              placeholder="কী শিখতে চান লিখুন... (যেমন: জ্যামিতি, ব্যাকরণ, সালোকসংশ্লেষণ)"
              className="w-full pl-5 pr-28 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>খুঁজুন</span>
            </button>
          </div>
        </form>

        {/* Popular query chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-slate-400">জনপ্রিয় খোঁজ:</span>
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => {
                setInputVal(kw);
                setSearchQuery(kw);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      {query && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
              filterTab === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            সকল ফলাফল ({results.total})
          </button>
          <button
            onClick={() => setFilterTab('lessons')}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              filterTab === 'lessons'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            পাঠ ও অধ্যায় ({results.matchedLessons.length + results.matchedChapters.length})
          </button>
          <button
            onClick={() => setFilterTab('quizzes')}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              filterTab === 'quizzes'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            কুইজ ({results.matchedQuizzes.length})
          </button>
          <button
            onClick={() => setFilterTab('posts')}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              filterTab === 'posts'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            পোস্ট ({results.matchedPosts.length})
          </button>
          <button
            onClick={() => setFilterTab('users')}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              filterTab === 'users'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            ব্যবহারকারী ও শিক্ষক ({results.matchedUsers.length})
          </button>
        </div>
      )}

      {/* Results Content */}
      {!query ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <Search className="w-12 h-12 mx-auto text-slate-300" />
          <p>উপরে কিছু লিখে অনুসন্ধান করুন।</p>
        </div>
      ) : results.total === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
          <p className="text-base font-semibold">"{query}" এর জন্য কোনো ফলাফল পাওয়া যায়নি।</p>
          <p className="text-xs text-slate-400">বানান সঠিক আছে কিনা দেখুন বা সাধারণ শব্দ দিয়ে আবার চেষ্টা করুন।</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section: Lessons & Chapters */}
          {(filterTab === 'all' || filterTab === 'lessons') &&
            (results.matchedLessons.length > 0 || results.matchedChapters.length > 0) && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>পাঠ ও অধ্যায়সমূহ ({results.matchedLessons.length + results.matchedChapters.length})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.matchedLessons.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => navigate('lesson', { lessonId: l.id })}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          সহজ পাঠ
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors mt-2">
                          {l.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {l.explanation}
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 font-semibold">
                        <span>পাঠটি পড়ুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}

                  {results.matchedChapters.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => navigate('chapters', { classId: c.classId, subjectId: c.subjectId })}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                          অধ্যায়
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors mt-2">
                          {c.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {c.description}
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 font-semibold">
                        <span>অধ্যায়ের পাঠগুলো দেখুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Section: Quizzes */}
          {(filterTab === 'all' || filterTab === 'quizzes') && results.matchedQuizzes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                <span>মডেল কুইজ ({results.matchedQuizzes.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.matchedQuizzes.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => navigate('quiz_play', { quizId: q.id })}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500 transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                        কুইজ ব্যাংক
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-600 transition-colors mt-2">
                        {q.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {q.description}
                      </p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-purple-600 font-semibold">
                      <span>কুইজ শুরু করুন</span>
                      <span>{q.questions.length}টি প্রশ্ন</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Posts */}
          {(filterTab === 'all' || filterTab === 'posts') && results.matchedPosts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <span>পোস্টসমূহ ({results.matchedPosts.length})</span>
              </h3>

              <div className="space-y-3">
                {results.matchedPosts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate('post_detail', { postId: p.id })}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 transition cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {p.authorName} ({p.authorClass || 'শিক্ষার্থী'})
                      </span>
                      <span className="text-xs text-slate-400">{p.subjectName}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Users */}
          {(filterTab === 'all' || filterTab === 'users') && results.matchedUsers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <UserIcon className="w-4 h-4 text-blue-600" />
                <span>ব্যবহারকারী ও শিক্ষক ({results.matchedUsers.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.matchedUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => navigate('profile', { userId: u.id })}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 transition cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {u.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {u.role === 'teacher' ? 'শিক্ষক' : u.classGrade || 'শিক্ষার্থী'} • @{u.username}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
