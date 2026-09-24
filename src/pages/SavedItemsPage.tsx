import React from 'react';
import { Bookmark, BookOpen, MessageSquare, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SavedItemsPage: React.FC = () => {
  const { currentUser, lessons, posts, navigate, toggleSaveItem } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          সংরক্ষিত আইটেম দেখতে লগইন করুন
        </h2>
        <p className="text-xs text-slate-500">
          তোমার সেভ করা গুরুত্বপূর্ণ পাঠ ও পোস্টগুলো দেখতে লগইন প্রয়োজন।
        </p>
        <button
          onClick={() => navigate('login')}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
        >
          লগইন পাতায় যান
        </button>
      </div>
    );
  }

  const savedLessons = lessons.filter((l) => currentUser.savedLessonIds.includes(l.id));
  const savedPosts = posts.filter((p) => currentUser.savedPostIds.includes(p.id));

  return (
    <div id="saved-items-page" className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
          <Bookmark className="w-3.5 h-3.5" />
          <span>বুকমার্ক করা সংগ্রহ</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          আমার সংরক্ষিত পাঠ ও পোস্টসমূহ
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          যেসব পাঠ বা পোস্ট তুমি পরবর্তীতে পড়ার জন্য সংরক্ষণ করে রেখেছো।
        </p>
      </div>

      {/* Saved Lessons */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>সংরক্ষিত পাঠসমূহ ({savedLessons.length})</span>
        </h3>

        {savedLessons.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
            এখনো কোনো পাঠ সংরক্ষণ করা হয়নি। পাঠ পড়ার সময় বুকমার্ক বাটনে ক্লিক করুন।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedLessons.map((les) => (
              <div
                key={les.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {les.classId}
                    </span>
                    <button
                      onClick={() => toggleSaveItem('lesson', les.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 transition"
                      title="সংরক্ষণ বাতিল"
                    >
                      সরান
                    </button>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {les.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {les.explanation}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">~{les.readTimeMinutes} মিনিট</span>
                  <button
                    onClick={() => navigate('lesson', { lessonId: les.id })}
                    className="text-emerald-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>পড়ুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Posts */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-600" />
          <span>সংরক্ষিত পোস্টসমূহ ({savedPosts.length})</span>
        </h3>

        {savedPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
            এখনো কোনো পোস্ট সংরক্ষণ করা হয়নি।
          </div>
        ) : (
          <div className="space-y-3">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {post.authorName} ({post.authorClass || 'শিক্ষার্থী'})
                  </span>
                  <button
                    onClick={() => toggleSaveItem('post', post.id)}
                    className="text-xs text-slate-400 hover:text-rose-600 transition"
                  >
                    সরান
                  </button>
                </div>
                <p
                  onClick={() => navigate('post_detail', { postId: post.id })}
                  className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed cursor-pointer hover:text-emerald-600"
                >
                  {post.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
