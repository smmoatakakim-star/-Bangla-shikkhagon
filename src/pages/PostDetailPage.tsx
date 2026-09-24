import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Flag,
  ArrowLeft,
  Send,
  CornerDownRight,
  Check,
  Clock,
  Pin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Post, Comment } from '../types';
import { ReportModal } from '../components/ReportModal';

export const PostDetailPage: React.FC = () => {
  const {
    posts,
    currentUser,
    pageParams,
    navigate,
    toggleLikePost,
    isItemSaved,
    toggleSaveItem,
    addComment,
    addReply,
    getCommentsByPostId,
  } = useApp();

  const postId = pageParams.postId || (posts[0] ? posts[0].id : '');
  const post = posts.find((p) => p.id === postId) || posts[0];

  const postComments = post ? getCommentsByPostId(post.id) : [];

  const [commentText, setCommentText] = useState('');
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  if (!post) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-slate-500">পোস্টটি খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={() => navigate('posts')}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
        >
          পোস্ট ফিডে ফিরুন
        </button>
      </div>
    );
  }

  const isSaved = isItemSaved('post', post.id);
  const isLiked = currentUser ? post.likedByUserIds.includes(currentUser.id) : false;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!currentUser) {
      navigate('login');
      return;
    }

    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleReplySubmit = (commentId: string) => {
    if (!replyText.trim()) return;

    if (!currentUser) {
      navigate('login');
      return;
    }

    addReply(commentId, replyText.trim());
    setReplyText('');
    setReplyingCommentId(null);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="post-detail-page" className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Back button */}
      <button
        onClick={() => navigate('posts')}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 transition font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>পোস্ট তালিকায় ফিরে যান</span>
      </button>

      {/* Main Post Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        {/* Author Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              onClick={() => navigate('profile', { userId: post.authorId })}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700 cursor-pointer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span
                  onClick={() => navigate('profile', { userId: post.authorId })}
                  className="font-bold text-base text-slate-900 dark:text-slate-100 cursor-pointer hover:text-emerald-600 transition"
                >
                  {post.authorName}
                </span>
                {post.authorRole === 'teacher' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    শিক্ষক
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span>@{post.authorUsername}</span>
                <span>•</span>
                <span>{post.authorClass || 'শিক্ষার্থী'}</span>
                <span>•</span>
                <span>{post.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {post.isPinned && (
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
                <Pin className="w-3.5 h-3.5" />
                পিন করা
              </span>
            )}
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              {post.subjectName}
            </span>
          </div>
        </div>

        {/* Post Text */}
        <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line pt-2">
          {post.text}
        </p>

        {/* Optional Image */}
        {post.imageUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <img src={post.imageUrl} alt="পোস্টের ছবি" className="w-full h-auto max-h-96 object-cover" />
          </div>
        )}

        {/* 6 Actions Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-6">
            <button
              onClick={() => toggleLikePost(post.id)}
              className={`flex items-center gap-1.5 transition ${
                isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
              <span>{post.likes} পছন্দ</span>
            </button>

            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <MessageSquare className="w-4 h-4" />
              <span>{post.commentCount} মন্তব্য</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              title="শেয়ার করুন"
              className="hover:text-emerald-600 transition flex items-center gap-1"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'কপি হয়েছে!' : 'শেয়ার'}</span>
            </button>

            <button
              onClick={() => toggleSaveItem('post', post.id)}
              title={isSaved ? 'সংরক্ষণ বাতিল' : 'সংরক্ষণ করুন'}
              className={`hover:text-emerald-600 transition flex items-center gap-1 ${
                isSaved ? 'text-emerald-600' : ''
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-600' : ''}`} />
              <span>{isSaved ? 'সংরক্ষিত' : 'সংরক্ষণ'}</span>
            </button>

            <button
              onClick={() => setIsReportOpen(true)}
              title="রিপোর্ট করুন"
              className="hover:text-rose-600 transition"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          <span>মন্তব্য ও আলোচনা ({postComments.length})</span>
        </h3>

        {/* Comment input form */}
        <form
          onSubmit={handleCommentSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3"
        >
          {currentUser && (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
          )}
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              currentUser
                ? 'তোমার মতামত বা উত্তর লিখুন...'
                : 'মন্তব্য করতে অনুগ্রহ করে লগইন করুন'
            }
            className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              commentText.trim()
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>পাঠান</span>
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {postComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3"
            >
              {/* Comment author */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-2.5 cursor-pointer"
                  onClick={() => navigate('profile', { userId: comment.authorId })}
                >
                  <img
                    src={comment.authorAvatar}
                    alt={comment.authorName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                      {comment.authorName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {comment.createdAt}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setReplyingCommentId(
                      replyingCommentId === comment.id ? null : comment.id
                    )
                  }
                  className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                  <span>উত্তর দিন (Reply)</span>
                </button>
              </div>

              {/* Comment text */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-10">
                {comment.content}
              </p>

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pl-10 pt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
                  {comment.replies.map((rep) => (
                    <div
                      key={rep.id}
                      className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl space-y-1 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={rep.authorAvatar}
                          alt={rep.authorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {rep.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {rep.createdAt}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 pl-8">
                        {rep.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline Reply Input Box */}
              {replyingCommentId === comment.id && (
                <div className="pl-10 pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`${comment.authorName}-কে রিপ্লাই দিন...`}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleReplySubmit(comment.id)}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shrink-0"
                  >
                    রিপ্লাই
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="post"
        targetId={post.id}
        targetPreview={post.text.slice(0, 100)}
      />
    </div>
  );
};
