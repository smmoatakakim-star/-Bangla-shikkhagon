import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Flag,
  Edit2,
  Trash2,
  Plus,
  Filter,
  Check,
  MoreVertical,
  Layers,
  Sparkles,
  Pin,
  Play,
  Video as VideoIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubjectId, Post } from '../types';
import { ReportModal } from '../components/ReportModal';
import { MediaViewerModal } from '../components/MediaViewerModal';
import { CreatePostModal } from '../components/CreatePostModal';

export const PostsFeedPage: React.FC = () => {
  const {
    posts,
    subjects,
    currentUser,
    navigate,
    toggleLikePost,
    isItemSaved,
    toggleSaveItem,
    deletePost,
    editPost,
  } = useApp();

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<SubjectId | 'all'>('all');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Report Modal state
  const [reportingPost, setReportingPost] = useState<Post | null>(null);
  const [viewingMediaPost, setViewingMediaPost] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPosts = posts.filter((p) => {
    if (selectedSubjectFilter !== 'all' && p.subjectId !== selectedSubjectFilter) return false;
    return true;
  });

  const handleStartEdit = (post: Post) => {
    setEditingPostId(post.id);
    setEditText(post.text);
  };

  const handleSaveEdit = (postId: string) => {
    if (editText.trim()) {
      editPost(postId, editText.trim());
      setEditingPostId(null);
    }
  };

  const handleShare = (post: Post) => {
    navigator.clipboard?.writeText(
      `বাংলা শিক্ষাগরের পোস্ট দেখুন: "${post.text.slice(0, 50)}..."`
    );
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="posts-feed-page" className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            শিক্ষামূলক পোস্ট ও আলোচনা
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            পড়াশোনার কোনো সমস্যা, গণিতের শর্টকাট বা পাঠ্য বিষয় নিয়ে সহপাঠীদের সাথে মুক্ত আলোচনা করো।
          </p>
        </div>

        <button
          id="feed-create-post-btn"
          onClick={() => {
            if (currentUser) {
              setIsCreateModalOpen(true);
            } else {
              navigate('login');
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পোস্ট লিখুন</span>
        </button>
      </div>

      {/* Quick Subject Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
        <button
          onClick={() => setSelectedSubjectFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
            selectedSubjectFilter === 'all'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          সকল বিষয়
        </button>
        <button
          onClick={() => setSelectedSubjectFilter('math')}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
            selectedSubjectFilter === 'math'
              ? 'bg-amber-600 text-white font-bold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          গণিত
        </button>
        <button
          onClick={() => setSelectedSubjectFilter('science')}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
            selectedSubjectFilter === 'science'
              ? 'bg-teal-600 text-white font-bold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          বিজ্ঞান
        </button>
        <button
          onClick={() => setSelectedSubjectFilter('bangla')}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
            selectedSubjectFilter === 'bangla'
              ? 'bg-rose-600 text-white font-bold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          বাংলা
        </button>
        <button
          onClick={() => setSelectedSubjectFilter('english')}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
            selectedSubjectFilter === 'english'
              ? 'bg-sky-600 text-white font-bold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setSelectedSubjectFilter('bgs')}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
            selectedSubjectFilter === 'bgs'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          বাংলাদেশ ও বিশ্বপরিচয়
        </button>
      </div>

      {/* Posts Listing */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
            <p>এই বিষয়ে এখনো কোনো পোস্ট নেই।</p>
            <button
              onClick={() => navigate('create_post')}
              className="text-xs text-emerald-600 font-bold hover:underline"
            >
              প্রথম পোস্টটি তুমিই করো!
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isSaved = isItemSaved('post', post.id);
            const isAuthor = currentUser?.id === post.authorId || currentUser?.role === 'admin';
            const isLiked = currentUser ? post.likedByUserIds.includes(currentUser.id) : false;

            return (
              <div
                key={post.id}
                id={`post-card-${post.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                {/* Author row & tags */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      onClick={() => navigate('profile', { userId: post.authorId })}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-90 transition"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => navigate('profile', { userId: post.authorId })}
                          className="font-bold text-sm text-slate-900 dark:text-slate-100 cursor-pointer hover:text-emerald-600 transition"
                        >
                          {post.authorName}
                        </span>
                        {post.authorRole === 'teacher' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            শিক্ষক
                          </span>
                        )}
                        {post.authorRole === 'admin' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                            মডারেটর
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

                  {/* Subject Tag & Actions */}
                  <div className="flex items-center gap-2">
                    {post.isPinned && (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
                        <Pin className="w-3 h-3" />
                        পিন করা
                      </span>
                    )}
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {post.subjectName}
                    </span>
                  </div>
                </div>

                {/* Post Body (or Edit Form) */}
                {editingPostId === post.id ? (
                  <div className="space-y-3 pt-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={4}
                      className="w-full text-sm p-3 rounded-2xl border border-emerald-500 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-800 dark:text-slate-100"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingPostId(null)}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={() => handleSaveEdit(post.id)}
                        className="px-4 py-1.5 text-xs bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {post.text && (
                      <p
                        onClick={() => navigate('post_detail', { postId: post.id })}
                        className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line cursor-pointer"
                      >
                        {post.text}
                      </p>
                    )}

                    {/* Video Post Card */}
                    {(post.mediaType === 'video' || !!post.videoUrl) && (
                      <div
                        onClick={() => setViewingMediaPost(post)}
                        className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer group"
                      >
                        <div className="aspect-video w-full max-h-72 overflow-hidden flex items-center justify-center relative">
                          <img
                            src={
                              post.videoThumbnail ||
                              post.imageUrl ||
                              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
                            }
                            alt="Video Thumbnail"
                            className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition duration-200">
                              <Play className="w-7 h-7 fill-white ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1.5">
                            <VideoIcon className="w-3.5 h-3.5 text-teal-400" />
                            <span>ভিডিও দেখতে ক্লিক করুন</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Post */}
                    {(post.mediaType === 'image' || (!post.videoUrl && post.imageUrl)) && post.imageUrl && (
                      <div
                        onClick={() => setViewingMediaPost(post)}
                        className="rounded-2xl overflow-hidden max-h-80 border border-slate-200 dark:border-slate-800 bg-slate-950 cursor-pointer group"
                      >
                        <img
                          src={post.imageUrl}
                          alt="সংযুক্ত চিত্র"
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 6 Actions Bar as required:
                    ❤️ Like, 💬 Comment, ↩ Reply, 🔗 Share, 🔖 Save, 🚩 Report */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* ❤️ Like */}
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1.5 transition ${
                        isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    {/* 💬 Comment */}
                    <button
                      onClick={() => navigate('post_detail', { postId: post.id })}
                      className="flex items-center gap-1.5 hover:text-emerald-600 transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentCount} মন্তব্য</span>
                    </button>

                    {/* ↩ Reply */}
                    <button
                      onClick={() => navigate('post_detail', { postId: post.id })}
                      className="hidden sm:flex items-center gap-1 hover:text-teal-600 transition"
                    >
                      <span>উত্তর দিন</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* 🔗 Share */}
                    <button
                      onClick={() => handleShare(post)}
                      title="শেয়ার করুন"
                      className="hover:text-emerald-600 transition flex items-center gap-1"
                    >
                      {copiedId === post.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* 🔖 Save */}
                    <button
                      onClick={() => toggleSaveItem('post', post.id)}
                      title={isSaved ? 'সংরক্ষণ বাতিল' : 'সংরক্ষণ করুন'}
                      className={`hover:text-emerald-600 transition ${
                        isSaved ? 'text-emerald-600' : ''
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-600' : ''}`} />
                    </button>

                    {/* 🚩 Report */}
                    <button
                      onClick={() => setReportingPost(post)}
                      title="রিপোর্ট করুন"
                      className="hover:text-rose-600 transition"
                    >
                      <Flag className="w-4 h-4" />
                    </button>

                    {/* Edit & Delete for Author */}
                    {isAuthor && (
                      <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                        <button
                          onClick={() => handleStartEdit(post)}
                          title="সম্পাদনা করুন"
                          className="hover:text-blue-600 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('আপনি কি নিশ্চিতভাবে এই পোস্টটি মুছে ফেলতে চান?')) {
                              deletePost(post.id);
                            }
                          }}
                          title="মুছে ফেলুন"
                          className="hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Report Modal */}
      {reportingPost && (
        <ReportModal
          isOpen={!!reportingPost}
          onClose={() => setReportingPost(null)}
          targetType="post"
          targetId={reportingPost.id}
          targetPreview={reportingPost.text.slice(0, 100)}
        />
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Media Viewer / Video Player Modal */}
      <MediaViewerModal
        isOpen={!!viewingMediaPost}
        onClose={() => setViewingMediaPost(null)}
        post={viewingMediaPost}
        onToggleLike={toggleLikePost}
        onToggleSave={toggleSaveItem}
        isSaved={viewingMediaPost ? isItemSaved('post', viewingMediaPost.id) : false}
      />
    </div>
  );
};
